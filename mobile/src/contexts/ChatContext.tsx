import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { guestService } from '../services/guestService';
import { STORAGE_KEYS } from '../constants/config';
import { testBackendConnection } from '../utils/testApi';
import { debugApiResponses } from '../utils/debugApi';
import { normalizeChat as normalizeChatHelper, normalizeMessage, extractChatId, isValidChatId, extractMessagesFromHistory, NormalizedChat } from '../utils/chatHelpers';

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
  files?: Array<{
    fileId: string;
    filename: string;
    url: string;
    type: string;
  }>;
}

interface ChatContextType {
  guestSessionId: string | null;
  chats: Chat[];
  currentChat: Chat | null;
  messages: Message[];
  isLoading: boolean;
  sendMessage: (content: string, fileIds?: string[]) => Promise<void>;
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
                const normalizedChat = normalizeChatHelper(chat, sessionId!);
                if (!normalizedChat) return null;
                
                // Convert NormalizedChat to Chat interface
                const convertedChat: Chat = {
                  id: normalizedChat.id,
                  title: normalizedChat.title,
                  messages: [],
                  timestamp: normalizedChat.timestamp,
                  lastMessage: normalizedChat.lastMessage,
                  sessionId: normalizedChat.sessionId,
                  createdAt: normalizedChat.createdAt,
                  updatedAt: normalizedChat.updatedAt,
                };
                
                // Include messages from the chat object if available
                if (chat.messages && Array.isArray(chat.messages)) {
                  convertedChat.messages = chat.messages.map((msg: any) => ({
                    content: msg.message || msg.content || '',
                    role: msg.sender === 'USER' ? 'user' : msg.isUser ? 'user' : 'assistant',
                    timestamp: msg.timestamp || msg.createdAt || new Date().toISOString(),
                  }));
                } else {
                  convertedChat.messages = [];
                }
                
                return convertedChat;
              })
              .filter((chat: any): chat is Chat => chat !== null && isValidChatId(chat?.id))
              .sort((a: Chat, b: Chat) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            
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
            const normalizedNewChat = normalizeChatHelper(newChatResponse, sessionId!);
            if (!normalizedNewChat) {
              throw new Error('Failed to create valid chat object');
            }
            // Convert to Chat interface
            const newChat: Chat = {
              id: normalizedNewChat.id,
              title: normalizedNewChat.title,
              messages: [],
              timestamp: normalizedNewChat.timestamp,
              lastMessage: normalizedNewChat.lastMessage,
              sessionId: normalizedNewChat.sessionId,
              createdAt: normalizedNewChat.createdAt,
              updatedAt: normalizedNewChat.updatedAt,
            };
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
        const normalizedNewChat = normalizeChatHelper(response, sessionId!);
        if (!normalizedNewChat) {
          throw new Error('Failed to create valid chat object');
        }
        // Convert to Chat interface
        const newChat: Chat = {
          id: normalizedNewChat.id,
          title: normalizedNewChat.title,
          messages: [],
          timestamp: normalizedNewChat.timestamp,
          lastMessage: normalizedNewChat.lastMessage,
          sessionId: normalizedNewChat.sessionId,
          createdAt: normalizedNewChat.createdAt,
          updatedAt: normalizedNewChat.updatedAt,
        };
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

  const sendMessage = async (content: string, fileIds?: string[]) => {
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
      files: fileIds ? [] : undefined, // Will be populated after upload
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
        content,
        fileIds || []
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
            
            // Auto-generate title from first message if chat has no title
            let updatedTitle = chat.title;
            if ((!chat.title || chat.title === 'New Chat') && chat.messages.length === 0) {
              updatedTitle = content.split(' ').slice(0, 5).join(' ') + '...';
              
              // Update title on backend
              guestService.updateChatTitle(guestSessionId, chat.id, updatedTitle)
                .catch(err => console.error('Failed to update chat title:', err));
            }
            
            const updatedChat = { 
              ...chat, 
              title: updatedTitle,
              messages: updatedMessages,
              lastMessage: content, 
              updatedAt: new Date().toISOString() 
            };
            
            // Update currentChat if title changed
            if (updatedTitle !== chat.title) {
              setCurrentChat(updatedChat);
            }
            
            return updatedChat;
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
      const normalizedNewChat = normalizeChatHelper(response, guestSessionId);
      if (!normalizedNewChat) {
        throw new Error('Failed to create valid chat object from response');
      }
      
      // Convert to Chat interface
      const newChat: Chat = {
        id: normalizedNewChat.id,
        title: normalizedNewChat.title,
        messages: [],
        timestamp: normalizedNewChat.timestamp,
        lastMessage: normalizedNewChat.lastMessage,
        sessionId: normalizedNewChat.sessionId,
        createdAt: normalizedNewChat.createdAt,
        updatedAt: normalizedNewChat.updatedAt,
      };
      
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

  const updateChatTitle = async (chatId: string | number, title: string) => {
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
            const normalizedChat = normalizeChatHelper(chat, guestSessionId);
            if (!normalizedChat) return null;
            
            // Convert NormalizedChat to Chat interface
            const convertedChat: Chat = {
              id: normalizedChat.id,
              title: normalizedChat.title,
              messages: [],
              timestamp: normalizedChat.timestamp,
              lastMessage: normalizedChat.lastMessage,
              sessionId: normalizedChat.sessionId,
              createdAt: normalizedChat.createdAt,
              updatedAt: normalizedChat.updatedAt,
            };
            
            // Include messages from the chat object if available
            if (chat.messages && Array.isArray(chat.messages)) {
              convertedChat.messages = chat.messages.map((msg: any) => ({
                content: msg.message || msg.content || '',
                role: msg.sender === 'USER' ? 'user' : msg.isUser ? 'user' : 'assistant',
                timestamp: msg.timestamp || msg.createdAt || new Date().toISOString(),
              }));
            } else {
              convertedChat.messages = [];
            }
            
            return convertedChat;
          })
          .filter((chat: any): chat is Chat => chat !== null && isValidChatId(chat?.id))
          .sort((a: Chat, b: Chat) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        
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