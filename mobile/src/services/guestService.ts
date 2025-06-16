import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/config';

interface GuestSession {
  sessionId: string;
  createdAt: string;
  ipAddress: string;
  userAgent: string;
}

interface GuestChat {
  id: number;
  title: string;
  sessionId: string;
  createdAt: string;
  updatedAt: string;
}

export const guestService = {
  async startGuestSession(): Promise<GuestSession> {
    const response = await api.post<GuestSession>('/api/guest/start');
    const { sessionId } = response.data;
    
    await AsyncStorage.setItem(STORAGE_KEYS.GUEST_SESSION_ID, sessionId);
    return response.data;
  },

  async getSession(sessionId: string): Promise<GuestSession & { chats: GuestChat[] }> {
    const response = await api.get(`/api/guest/session/${sessionId}`);
    return response.data;
  },

  async createGuestChat(sessionId: string, title: string = 'New Chat'): Promise<GuestChat> {
    const response = await api.post(`/api/guest/chats/${sessionId}`, { title });
    return response.data;
  },

  async updateChatTitle(sessionId: string, chatId: number, title: string): Promise<void> {
    await api.put(`/api/guest/chats/${sessionId}/${chatId}`, { title });
  },

  async deleteChat(sessionId: string, chatId: number): Promise<void> {
    await api.delete(`/api/guest/chats/${sessionId}/${chatId}`);
  },

  async sendGuestMessage(sessionId: string, chatId: number, content: string): Promise<any> {
    const response = await api.post(
      `/api/guest/chat/${sessionId}/${chatId}`,
      { 
        message: content,
        language: 'en',
        fileIds: []
      }
    );
    return response.data;
  },

  async uploadFile(sessionId: string, file: any): Promise<{ fileUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(`/api/guest/upload/${sessionId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};