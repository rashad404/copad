import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { guestService } from '../services/guestService';
import { STORAGE_KEYS } from '../constants/config';
import { testBackendConnection } from '../utils/testApi';
import { debugApiResponses } from '../utils/debugApi';
import { normalizeChat, normalizeMessage, extractChatId, isValidChatId, extractMessagesFromHistory } from '../utils/chatHelpers';

interface Chat {
  id: string | number;
  title: string;
  messages: Message[];
  timestamp: string;
  lastMessage?: string;
  sessionId?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Message {
  id?: number;
  content: string;
  role: 'user' | 'assistant';
  timestamp?: string;
  isLoading?: boolean;
}

interface ChatContextType {
  guestSessionId: string | null;
  chats: Chat[];
  currentChat: Chat | null;
  messages: Message[];
  isLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
  createNewChat: (title?: string) => Promise<void>;
  selectChat: (chat: Chat) => void;
  deleteChat: (chatId: string | number) => Promise<void>;
  updateChatTitle: (chatId: string | number, title: string) => Promise<void>;
  refreshChats: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [guestSessionId, setGuestSessionId] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeGuestSession();
  }, []);

  const initializeGuestSession = async () => {
    try {
      setIsLoading(true);
      
      // Test backend connection first
      try {
        const workingUrl = await testBackendConnection();
        console.log('Backend connected successfully with:', workingUrl);
      } catch (connError) {
        console.error('Backend connection test failed:', connError);
      }
      
      // Check for existing session
      let sessionId = await AsyncStorage.getItem(STORAGE_KEYS.GUEST_SESSION_ID);
      
      if (sessionId) {
        // Verify the session still exists
        try {
          setGuestSessionId(sessionId);
          const sessionData = await guestService.getSession(sessionId);
          console.log('Session data received:', JSON.stringify(sessionData, null, 2));
          
          // Process chats from session data
          if (sessionData.chats && Array.isArray(sessionData.chats)) {
            console.log(`Found ${sessionData.chats.length} chats in session`);
            
            // Map chats with messages included from session data
            const processedChats = sessionData.chats
              .map((chat: any) => {
                const normalizedChat = normalizeChat(chat, sessionId);
                if (!normalizedChat) return null;
                
                // Include messages from the chat object if available
                if (chat.messages && Array.isArray(chat.messages)) {
                  normalizedChat.messages = chat.messages.map((msg: any) => ({
                    content: msg.message || msg.content || '',
                    role: msg.sender === 'USER' ? 'user' : msg.isUser ? 'user' : 'assistant',
                    timestamp: msg.timestamp || msg.createdAt || new Date().toISOString(),
                  }));
                } else {
                  normalizedChat.messages = [];
                }
                
                return normalizedChat;
              })
              .filter((chat: any): chat is Chat => chat !== null && isValidChatId(chat?.id))
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            
            setChats(processedChats);
            
            if (processedChats.length > 0) {
              console.log('Setting current chat to:', processedChats[0]);
              setCurrentChat(processedChats[0]);
              // Set messages from the first chat
              setMessages(processedChats[0].messages || []);
            }
          } else {
            console.log('No chats found, creating new one');
            // Create initial chat if none exist
            const newChatResponse = await guestService.createGuestChat(sessionId, 'New Chat');
            console.log('New chat created:', JSON.stringify(newChatResponse, null, 2));
            
            // Normalize the new chat response
            const newChat = normalizeChat(newChatResponse, sessionId);
            if (!newChat) {
              throw new Error('Failed to create valid chat object');
            }
            // Initialize with empty messages array
            newChat.messages = [];
            setChats([newChat]);
            setCurrentChat(newChat);
            setMessages([]);
          }
          return; // Session is valid, we're done
        } catch (error: any) {
          if (error.response?.status === 404) {
            // Session not found, clear it and create new one
            console.log('Session not found on server, creating new one');
            await AsyncStorage.removeItem(STORAGE_KEYS.GUEST_SESSION_ID);
            sessionId = null;
          } else {
            throw error; // Re-throw other errors
          }
        }
      }
      
      // Create new session if needed
      if (!sessionId) {
        const session = await guestService.startGuestSession();
        sessionId = session.sessionId;
        setGuestSessionId(sessionId);
        
        // Create initial chat
        const response = await guestService.createGuestChat(sessionId, 'New Chat');
        console.log('Created new chat for new session:', JSON.stringify(response, null, 2));
        
        // Normalize the new chat response
        const newChat = normalizeChat(response, sessionId);
        if (!newChat) {
          throw new Error('Failed to create valid chat object');
        }
        // Initialize with empty messages array
        newChat.messages = [];
        setChats([newChat]);
        setCurrentChat(newChat);
        setMessages([]);
      }
    } catch (error) {
      console.error('Failed to initialize guest session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (content: string) => {
    if (!currentChat || !guestSessionId) {
      console.error('Cannot send message: currentChat =', currentChat, 'guestSessionId =', guestSessionId);
      return;
    }

    // Validate chat ID
    if (!isValidChatId(currentChat.id)) {
      console.error('Invalid chat ID:', currentChat.id);
      // Try to create a new chat if the current one has no valid ID
      await createNewChat('New Chat');
      return;
    }

    console.log('Sending message to chat:', currentChat.id, 'session:', guestSessionId);

    const userMessage: Message = {
      content,
      role: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);

    const loadingMessage: Message = {
      content: '',
      role: 'assistant',
      isLoading: true,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, loadingMessage]);

    try {
      const response = await guestService.sendGuestMessage(
        guestSessionId,
        currentChat.id,
        content
      );
      
      console.log('Message response:', JSON.stringify(response, null, 2));

      const assistantMessage: Message = {
        content: response.response || response.message || response.content || response,
        role: 'assistant',
        timestamp: new Date().toISOString(),
      };
      
      setMessages((prev) => {
        const filtered = prev.filter((msg) => !msg.isLoading);
        return [...filtered, assistantMessage];
      });
      
      // Update the chat's messages array and metadata
      setChats((prev) => 
        prev.map((chat) => {
          if (chat.id === currentChat.id) {
            const updatedMessages = [
              ...(chat.messages || []),
              userMessage,
              assistantMessage
            ];
            return { 
              ...chat, 
              messages: updatedMessages,
              lastMessage: content, 
              updatedAt: new Date().toISOString() 
            };
          }
          return chat;
        })
      );
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages((prev) => prev.filter((msg) => !msg.isLoading));
    }
  };

  const createNewChat = async (title: string = 'New Chat') => {
    if (!guestSessionId) {
      console.error('Cannot create new chat: no guest session');
      return;
    }

    try {
      const response = await guestService.createGuestChat(guestSessionId, title);
      console.log('Created new chat in createNewChat:', JSON.stringify(response, null, 2));
      
      // Normalize the new chat response
      const newChat = normalizeChat(response, guestSessionId);
      if (!newChat) {
        throw new Error('Failed to create valid chat object from response');
      }
      
      // Initialize with empty messages array
      newChat.messages = [];
      
      // Override title if different from response
      if (newChat.title !== title && response.title !== title) {
        newChat.title = title;
      }
      
      console.log('New chat object:', newChat);
      
      setChats((prev) => [newChat, ...prev]);
      setCurrentChat(newChat);
      setMessages([]);
    } catch (error) {
      console.error('Failed to create new chat:', error);
    }
  };

  const selectChat = async (chat: Chat) => {
    console.log('Selecting chat:', JSON.stringify(chat, null, 2));
    
    // Validate chat before selecting
    if (!chat || !isValidChatId(chat.id)) {
      console.error('Invalid chat selected:', chat);
      return;
    }
    
    setCurrentChat(chat);
    // Use messages from the chat object (already loaded with session)
    setMessages(chat.messages || []);
  };

  const deleteChat = async (chatId: string | number) => {
    if (!guestSessionId || !isValidChatId(chatId)) {
      console.error('Cannot delete chat: invalid parameters');
      return;
    }

    try {
      await guestService.deleteChat(guestSessionId, chatId);
      setChats((prev) => prev.filter((chat) => chat.id !== chatId));
      
      if (currentChat?.id === chatId) {
        const remainingChats = chats.filter((chat) => chat.id !== chatId);
        if (remainingChats.length > 0) {
          await selectChat(remainingChats[0]);
        } else {
          // Create new chat if all deleted
          await createNewChat();
        }
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
  };

  const updateChatTitle = async (chatId: number, title: string) => {
    if (!guestSessionId) return;

    try {
      await guestService.updateChatTitle(guestSessionId, chatId, title);
      setChats((prev) =>
        prev.map((chat) => (chat.id === chatId ? { ...chat, title } : chat))
      );
      if (currentChat?.id === chatId) {
        setCurrentChat({ ...currentChat, title });
      }
    } catch (error) {
      console.error('Failed to update chat title:', error);
    }
  };


  const refreshChats = async () => {
    if (!guestSessionId) return;
    
    try {
      const sessionData = await guestService.getSession(guestSessionId);
      console.log('Refreshing chats:', JSON.stringify(sessionData, null, 2));
      
      if (sessionData.chats && Array.isArray(sessionData.chats)) {
        const processedChats = sessionData.chats
          .map((chat: any) => {
            const normalizedChat = normalizeChat(chat, guestSessionId);
            if (!normalizedChat) return null;
            
            // Include messages from the chat object if available
            if (chat.messages && Array.isArray(chat.messages)) {
              normalizedChat.messages = chat.messages.map((msg: any) => ({
                content: msg.message || msg.content || '',
                role: msg.sender === 'USER' ? 'user' : msg.isUser ? 'user' : 'assistant',
                timestamp: msg.timestamp || msg.createdAt || new Date().toISOString(),
              }));
            } else {
              normalizedChat.messages = [];
            }
            
            return normalizedChat;
          })
          .filter((chat: any): chat is Chat => chat !== null && isValidChatId(chat?.id))
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        
        setChats(processedChats);
        
        // Update current chat if it's in the list
        if (currentChat) {
          const updatedCurrentChat = processedChats.find((c: Chat) => c.id === currentChat.id);
          if (updatedCurrentChat) {
            setCurrentChat(updatedCurrentChat);
            setMessages(updatedCurrentChat.messages || []);
          } else {
            // Current chat no longer exists, select the first one
            if (processedChats.length > 0) {
              selectChat(processedChats[0]);
            } else {
              setCurrentChat(null);
              setMessages([]);
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to refresh chats:', error);
    }
  };

  const value = {
    guestSessionId,
    chats,
    currentChat,
    messages,
    isLoading,
    sendMessage,
    createNewChat,
    selectChat,
    deleteChat,
    updateChatTitle,
    refreshChats,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};