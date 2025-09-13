export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  enabled: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ChatMessage {
  id?: number;
  content: string;
  role: 'user' | 'assistant';
  timestamp?: string;
  isLoading?: boolean;
}

export interface ChatSession {
  id: number;
  title: string;
  userId?: number;
  guestSessionId?: string;
  createdAt: string;
  updatedAt: string;
  messages?: ChatMessage[];
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}