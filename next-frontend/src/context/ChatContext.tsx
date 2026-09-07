'use client';

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { track } from '@/utils/analytics';
import { isAxiosError } from 'axios';
import { readableError } from '@/components/health/model';
import { resolveGuestSession } from '@/utils/resolveGuestSession';
import { getGuestSessionId, setGuestSessionId } from '@/utils/guestSession';
import api from '@/api';
import { postChatMessage } from '@/api/chatMessage';
import { urgencyFromHeaders, saveUrgency, readUrgency, type ChatUrgency } from '@/api/chatUrgency';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';

interface FileAttachment {
  fileId: string;
  url: string;
  filename: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string | Date;
  thumbnailUrl?: string;
  isImage: boolean;
}

/** Raw guest-session payload as returned by GET /guest/session/{id}. */
interface ApiChatMessage {
  sender: 'USER' | 'AI';
  message: string;
  timestamp: string;
  attachments?: FileAttachment[];
}

interface ApiChat {
  id: string;
  title?: string;
  messages?: ApiChatMessage[];
  timestamp: string;
  lastMessage?: string;
}

interface GuestSessionResponse {
  data: { chats?: ApiChat[] };
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string | Date;
  attachments?: FileAttachment[];
  /** Ids of files sent alongside the message, used to render attachments. */
  fileIds?: string[];
}

export interface Chat {
  urgency?: ChatUrgency;
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
  uploadedFiles: FileAttachment[];
  createNewChat: () => Promise<string | null>;
  updateChatTitle: (chatId: string, title: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  sendMessage: (
    chatId: string | null,
    message: string,
    additionalFileIds?: string[],
    additionalFiles?: FileAttachment[],
    memberId?: number
  ) => Promise<string>;
  setSelectedChatId: (chatId: string) => void;
  uploadFile: (file: File) => Promise<FileAttachment>;
  clearUploadedFiles: () => void;
  removeUploadedFile: (fileId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<FileAttachment[]>([]);
  const isInitializingRef = useRef(false);
  const sessionIdRef = useRef<string | null>(null);

  // Helper to process session data
  const processSessionData = (sessionResponse: GuestSessionResponse): Chat[] => {
    const responseChats = sessionResponse.data.chats;
    if (responseChats && Array.isArray(responseChats) && responseChats.length > 0) {
      const formattedChats: Chat[] = responseChats.map((chat: ApiChat) => {
        const formattedMessages = Array.isArray(chat.messages)
          ? chat.messages.map((msg: ApiChatMessage): Message => ({
              role: msg.sender === 'USER' ? 'user' : 'assistant',
              content: msg.message,
              timestamp: msg.timestamp,
              attachments: msg.attachments || []
            }))
          : [];
        return {
          id: chat.id,
          title: chat.title || t('chat.untitledChat'),
          messages: formattedMessages,
          timestamp: chat.timestamp,
          lastMessage: chat.lastMessage,
          urgency: readUrgency(sessionIdRef.current, chat.id)
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
  const uploadGuestFile = async (sid: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/guest/upload/${sid}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  };
  const sendGuestMessage = async (sid: string, message: string, chatId: string, fileIds: string[] = [], memberId?: number) => {
    const res = await postChatMessage(sid, chatId, message, i18n.language, fileIds,
      !authLoading && isAuthenticated && user ? memberId : undefined);
    const urgency = urgencyFromHeaders(res.headers);
    if (urgency) {
      saveUrgency(sid, chatId, urgency);
      setChats(previous => previous.map(chat => chat.id === chatId ? { ...chat, urgency } : chat));
    }
    return typeof res.data === 'string'
      ? res.data
      : res.data.response || res.data.message || t('chat.error.message');
  };

  // Create initial chat
  const createInitialChat = async (sid: string) => {
    if (!sid) return null;
    try {
      const response = await createGuestChat(sid, 'New Chat');
      const newChatId = response?.data?.chatId || `temp-${Date.now()}`;
      const newChat: Chat = {
        id: newChatId,
        title: 'New Chat',
        messages: [],
        timestamp: new Date().toISOString()
      };
      setChats(prev => [newChat, ...prev]);
      setSelectedChatId(newChatId);
      return newChatId;
    } catch {
      setError('Failed to create initial chat');
      return null;
    }
  };

  // Create new chat
  const createNewChat = async () => {
    if (!sessionIdRef.current) return null;
    setError(null);
    try {
      const response = await createGuestChat(sessionIdRef.current, 'New Chat');
      const newChatId = response?.data?.chatId || `temp-${Date.now()}`;
      const newChat: Chat = {
        id: newChatId,
        title: 'New Chat',
        messages: [],
        timestamp: new Date().toISOString()
      };
      setChats(prev => [newChat, ...prev]);
      setSelectedChatId(newChatId);
      return newChatId;
    } catch {
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
    } catch {
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
    } catch {
      setError('Failed to delete chat');
    }
  };

  // Upload file
  const uploadFile = async (file: File) => {
    if (!sessionIdRef.current) throw new Error('Session missing');
    try {
      const response = await uploadGuestFile(sessionIdRef.current, file);
      const fileData = response.data as FileAttachment;
      setUploadedFiles(prev => [...prev, fileData]);
      return fileData;
    } catch (err) {
      console.error('uploadFile error:', err);
      setError('Failed to upload file');
      throw err;
    }
  };
  
  // Clear uploaded files
  const clearUploadedFiles = () => {
    setUploadedFiles([]);
  };
  
  // Remove uploaded file
  const removeUploadedFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.fileId !== fileId));
  };

  // Send message
  const sendMessage = async (chatId: string | null, message: string, additionalFileIds?: string[], additionalFiles?: FileAttachment[], memberId?: number) => {
    if (!sessionIdRef.current || !chatId) throw new Error('Session or chat missing');
    setError(null);
    try {
      // Get file IDs from uploaded files and additional file IDs
      const uploadedFileIds = uploadedFiles.map(file => file.fileId);
      const fileIds = [...uploadedFileIds, ...(additionalFileIds || [])];
      
      // Send message with file IDs
      const response = await sendGuestMessage(sessionIdRef.current, message, chatId, fileIds, memberId);
      
      // Update chats state
      setChats(prev => prev.map(chat => {
        if (chat.id === chatId) {
          const newMessages: Message[] = [
            ...chat.messages,
            {
              role: 'user',
              content: message,
              timestamp: new Date().toISOString(),
              attachments: [...uploadedFiles, ...(additionalFiles || [])]
            },
            {
              role: 'assistant',
              content: response,
              timestamp: new Date().toISOString()
            }
          ];
          const title =
            chat.messages.length === 0
              ? message.split(' ').slice(0, 5).join(' ') + '...'
              : chat.title ?? '';
          
          // Update title on backend if this is the first message
          if (chat.messages.length === 0 && sessionIdRef.current) {
            updateGuestChat(sessionIdRef.current, chatId, title).catch(err => 
              console.error('Failed to update chat title:', err)
            );
          }
          
          return { ...chat, messages: newMessages, title };
        }
        return chat;
      }));
      
      // Clear uploaded files after sending
      clearUploadedFiles();
      
      return response;
    } catch (err) {
      console.error('sendMessage error:', err);
      const message = readableError(err, t('chat.error.message'));
      setError(message);
      return message;
    }
  };

  // Initialize session and chats
  useEffect(() => {
    // Avoid duplicate initialization
    if (isInitializingRef.current || sessionIdRef.current) return;

    const initSession = async () => {
      setIsInitializing(true);
      isInitializingRef.current = true;
      try {
        setError(null);
        const resolved = await resolveGuestSession(sessionId || getGuestSessionId(), {
          load: getGuestSession,
          start: async () => {
            const response = await startGuestSession();
            return response.data?.sessionId;
          },
          persist: setGuestSessionId,
          isMissing: error => isAxiosError(error) && error.response?.status === 404,
        });
        const sid = resolved.sessionId;
        setSessionId(sid);
        sessionIdRef.current = sid;
        if (resolved.isNew) track('guest_session_started');

        const loadedChats = resolved.data ? processSessionData(resolved.data) : [];
        setChats(loadedChats);
        if (loadedChats.length > 0) {
          setSelectedChatId(loadedChats[0].id);
        } else {
          const newChatId = await createInitialChat(sid);
          setSelectedChatId(newChatId);
        }
      } catch (err) {
        console.error('Chat initialization error:', err);
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
        uploadedFiles,
        createNewChat,
        updateChatTitle,
        deleteChat,
        sendMessage,
        setSelectedChatId,
        uploadFile,
        clearUploadedFiles,
        removeUploadedFile
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