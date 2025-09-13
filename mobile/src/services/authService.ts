import api from './api';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse, User } from '../types';
import { STORAGE_KEYS } from '../constants/config';

export const authService = {
  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/login', {
      username,
      password,
    });
    
    if (response.data.token) {
      await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
      await SecureStore.setItemAsync(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  async register(userData: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/register', userData);
    
    if (response.data.token) {
      await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
      await SecureStore.setItemAsync(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  async logout(): Promise<void> {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
    await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA);
    await AsyncStorage.removeItem(STORAGE_KEYS.GUEST_SESSION_ID);
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await SecureStore.getItemAsync(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  async createGuestSession(): Promise<string> {
    let guestSessionId = await AsyncStorage.getItem(STORAGE_KEYS.GUEST_SESSION_ID);
    
    if (!guestSessionId) {
      guestSessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await AsyncStorage.setItem(STORAGE_KEYS.GUEST_SESSION_ID, guestSessionId);
    }
    
    return guestSessionId;
  },

  async getGuestSessionId(): Promise<string | null> {
    return await AsyncStorage.getItem(STORAGE_KEYS.GUEST_SESSION_ID);
  },
};