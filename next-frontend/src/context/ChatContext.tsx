'use client';

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import api from '@/api';
import { useTranslation } from 'react-i18next';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string | Date;
}

interface Chat {
  id: string;
  title?: string;
  messages: Message[];
  timestamp: string | Date;
  lastMessage?: string;
}

interface ChatContextType {
  sessionId: string | null;
  chats: Chat[];
  selectedChatId: string | null;
  isInitializing: boolean;
  error: string | null;
  createNewChat: () => Promise<string | null>;
  updateChatTitle: (chatId: string, title: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  sendMessage: (chatId: string | null, message: string) => Promise<string>;
  setSelectedChatId: (chatId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isInitializingRef = useRef(false);
  const sessionIdRef = useRef<string | null>(null);

  // Helper to process session data
  const processSessionData = (sessionResponse: any) => {
    const responseChats = sessionResponse.data.chats;
    if (responseChats && Array.isArray(responseChats) && responseChats.length > 0) {
      const formattedChats = responseChats.map((chat: any) => {
        const formattedMessages = Array.isArray(chat.messages)
          ? chat.messages.map((msg: any) => ({
              role: msg.sender === 'USER' ? 'user' : 'assistant',
              content: msg.message,
              timestamp: msg.timestamp
            }))
          : [];
        return {
          id: chat.id,
          title: chat.title || t('chat.untitledChat'),
          messages: formattedMessages,
          timestamp: chat.timestamp,
          lastMessage: chat.lastMessage
        };
      });
      return formattedChats.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
    return [];
  };

  // API helpers (replace with your actual endpoints as needed)
  const startGuestSession = async () => api.post('/guest/start');
  const getGuestSession = async (sid: string) => api.get(`/guest/session/${sid}`);
  const createGuestChat = async (sid: string, title: string | null) => api.post(`/guest/chats/${sid}`, { title });
  const updateGuestChat = async (sid: string, chatId: string, title: string) => api.put(`/guest/chats/${sid}/${chatId}`, { title });
  const deleteGuestChat = async (sid: string, chatId: string) => api.delete(`/guest/chats/${sid}/${chatId}`);
  const sendGuestMessage = async (sid: string, message: string, chatId: string | null) => {
    const { i18n } = await import('i18next');
    const res = await api.post(`/guest/chat/${sid}/${chatId}`, { message, language: i18n.language });
    return res.data.response || t('chat.error.message');
  };
  const getChatHistory = async (sid: string, chatId: string) => api.get(`/guest/chat/${sid}/${chatId}/history`);

  // Create initial chat
  const createInitialChat = async (sid: string) => {
    if (!sid) return null;
    try {
      const response = await createGuestChat(sid, null);
      const newChatId = response?.data?.chatId || `temp-${Date.now()}`;
      const newChat: Chat = {
        id: newChatId,
        title: null,
        messages: [],
        timestamp: new Date().toISOString()
      };
      setChats(prev => [newChat, ...prev]);
      setSelectedChatId(newChatId);
      return newChatId;
    } catch (err) {
      setError('Failed to create initial chat');
      return null;
    }
  };

  // Create new chat
  const createNewChat = async () => {
    if (!sessionIdRef.current) return null;
    try {
      const response = await createGuestChat(sessionIdRef.current, null);
      const newChatId = response?.data?.chatId || `temp-${Date.now()}`;
      const newChat: Chat = {
        id: newChatId,
        title: null,
        messages: [],
        timestamp: new Date().toISOString()
      };
      setChats(prev => [newChat, ...prev]);
      setSelectedChatId(newChatId);
      return newChatId;
    } catch (err) {
      setError('Failed to create chat');
      return null;
    }
  };

  // Update chat title
  const updateChatTitle = async (chatId: string, title: string) => {
    if (!sessionIdRef.current) return;
    setChats(prev => prev.map(chat => chat.id === chatId ? { ...chat, title } : chat));
    try {
      await updateGuestChat(sessionIdRef.current, chatId, title);
    } catch (err) {
      setError('Failed to update chat title');
    }
  };

  // Delete chat
  const deleteChat = async (chatId: string) => {
    if (!sessionIdRef.current) return;
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    if (selectedChatId === chatId) {
      const remainingChats = chats.filter(chat => chat.id !== chatId);
      setSelectedChatId(remainingChats.length > 0 ? remainingChats[0].id : null);
    }
    try {
      await deleteGuestChat(sessionIdRef.current, chatId);
    } catch (err) {
      setError('Failed to delete chat');
    }
  };

  // Send message
  const sendMessage = async (chatId: string | null, message: string) => {
    if (!sessionIdRef.current || !chatId) throw new Error('Session or chat missing');
    try {
      const response = await sendGuestMessage(sessionIdRef.current, message, chatId);
      setChats(prev => prev.map(chat => {
        if (chat.id === chatId) {
          const newMessages = [
            ...chat.messages,
            { role: 'user', content: message, timestamp: new Date().toISOString() },
            { role: 'assistant', content: response, timestamp: new Date().toISOString() }
          ];
          const title = chat.messages.length === 0 ? message.split(' ').slice(0, 3).join(' ') + '...' : chat.title;
          return { ...chat, messages: newMessages, title };
        }
        return chat;
      }));
      return response;
    } catch (err) {
      setError('Failed to send message');
      return t('chat.error.message');
    }
  };

  // Initialize session and chats
  useEffect(() => {
    const initSession = async () => {
      setIsInitializing(true);
      isInitializingRef.current = true;
      try {
        let sid = localStorage.getItem('guestSessionId');
        let isNewSession = false;
        if (!sid) {
          const response = await startGuestSession();
          sid = response.data.sessionId;
          localStorage.setItem('guestSessionId', sid);
          isNewSession = true;
        }
        setSessionId(sid);
        sessionIdRef.current = sid;

        if (isNewSession) {
          // No need to fetch session, just create initial chat
          const newChatId = await createInitialChat(sid);
          setSelectedChatId(newChatId);
        } else {
          // Existing session, fetch session details
          const sessionResponse = await getGuestSession(sid);
          const loadedChats = processSessionData(sessionResponse);
          setChats(loadedChats);
          if (loadedChats.length > 0) {
            setSelectedChatId(loadedChats[0].id);
          } else {
            const newChatId = await createInitialChat(sid);
            setSelectedChatId(newChatId);
          }
        }
      } catch (err) {
        setError('Failed to initialize chat session');
      } finally {
        setIsInitializing(false);
        isInitializingRef.current = false;
      }
    };
    initSession();
  }, []);

  return (
    <ChatContext.Provider
      value={{
        sessionId,
        chats,
        selectedChatId,
        isInitializing,
        error,
        createNewChat,
        updateChatTitle,
        deleteChat,
        sendMessage,
        setSelectedChatId
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
} 