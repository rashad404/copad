import api from './api';
import { ChatSession, ChatMessage } from '../types';

export const chatService = {
  async getChatSessions(guestSessionId?: string): Promise<ChatSession[]> {
    const params = guestSessionId ? { guestSessionId } : {};
    const response = await api.get<ChatSession[]>('/api/chat/sessions', { params });
    return response.data;
  },

  async getChatSession(sessionId: number): Promise<ChatSession> {
    const response = await api.get<ChatSession>(`/api/chat/sessions/${sessionId}`);
    return response.data;
  },

  async createChatSession(title: string, guestSessionId?: string): Promise<ChatSession> {
    const data = guestSessionId ? { title, guestSessionId } : { title };
    const response = await api.post<ChatSession>('/api/chat/sessions', data);
    return response.data;
  },

  async deleteChatSession(sessionId: number): Promise<void> {
    await api.delete(`/api/chat/sessions/${sessionId}`);
  },

  async sendMessage(
    sessionId: number,
    content: string,
    onChunk?: (chunk: string) => void
  ): Promise<ChatMessage> {
    const response = await api.post(`/api/chat/sessions/${sessionId}/messages`, 
      { content },
      {
        responseType: 'stream',
        onDownloadProgress: (progressEvent) => {
          // Handle streaming response for real-time updates
          if (onChunk && progressEvent.event?.target?.response) {
            const chunk = progressEvent.event.target.response;
            onChunk(chunk);
          }
        },
      }
    );
    
    return response.data;
  },

  async updateSessionTitle(sessionId: number, title: string): Promise<void> {
    await api.put(`/api/chat/sessions/${sessionId}`, { title });
  },
};