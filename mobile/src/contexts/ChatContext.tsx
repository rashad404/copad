import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { guestService } from '../services/guestService';
import { STORAGE_KEYS } from '../constants/config';
import { testBackendConnection } from '../utils/testApi';

interface Chat {
  id: number;
  title: string;
  sessionId: string;
  createdAt: string;
  updatedAt: string;
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
  deleteChat: (chatId: number) => Promise<void>;
  updateChatTitle: (chatId: number, title: string) => Promise<void>;
  loadMessages: (chatId: number) => Promise<void>;
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
          setChats(sessionData.chats || []);
          
          if (sessionData.chats && sessionData.chats.length > 0) {
            setCurrentChat(sessionData.chats[0]);
          } else {
            // Create initial chat if none exist
            const newChat = await guestService.createGuestChat(sessionId, 'New Chat');
            setChats([newChat]);
            setCurrentChat(newChat);
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
        const newChat = await guestService.createGuestChat(sessionId, 'New Chat');
        setChats([newChat]);
        setCurrentChat(newChat);
      }
    } catch (error) {
      console.error('Failed to initialize guest session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (content: string) => {
    if (!currentChat || !guestSessionId) return;

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

      setMessages((prev) => {
        const filtered = prev.filter((msg) => !msg.isLoading);
        return [
          ...filtered,
          {
            content: response.response || response.message || response,
            role: 'assistant',
            timestamp: new Date().toISOString(),
          },
        ];
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages((prev) => prev.filter((msg) => !msg.isLoading));
    }
  };

  const createNewChat = async (title: string = 'New Chat') => {
    if (!guestSessionId) return;

    try {
      const newChat = await guestService.createGuestChat(guestSessionId, title);
      setChats((prev) => [newChat, ...prev]);
      setCurrentChat(newChat);
      setMessages([]);
    } catch (error) {
      console.error('Failed to create new chat:', error);
    }
  };

  const selectChat = (chat: Chat) => {
    setCurrentChat(chat);
    setMessages([]); // Clear messages, they'll be loaded separately
  };

  const deleteChat = async (chatId: number) => {
    if (!guestSessionId) return;

    try {
      await guestService.deleteChat(guestSessionId, chatId);
      setChats((prev) => prev.filter((chat) => chat.id !== chatId));
      
      if (currentChat?.id === chatId) {
        const remainingChats = chats.filter((chat) => chat.id !== chatId);
        if (remainingChats.length > 0) {
          setCurrentChat(remainingChats[0]);
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

  const loadMessages = async (chatId: number) => {
    // In a real app, you'd fetch messages from the backend
    // For now, we'll just clear them
    setMessages([]);
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
    loadMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};