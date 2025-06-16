import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { API_BASE_URL, API_TIMEOUT, STORAGE_KEYS } from '../constants/config';

class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    // Use the URL from environment
    const baseURL = API_BASE_URL;

    this.instance = axios.create({
      baseURL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.instance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        try {
          const token = await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('Error getting auth token:', error);
        }
        console.log('Making request to:', config.baseURL + config.url);
        console.log('Full config:', { baseURL: config.baseURL, url: config.url, method: config.method });
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        console.error('API Error:', error.message, error.config?.url);
        if (error.response?.status === 401) {
          // Handle unauthorized - clear token and redirect to login
          await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
          await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA);
          // Navigation will be handled by auth context
        }
        return Promise.reject(error);
      }
    );
  }

  get api() {
    return this.instance;
  }
}

export default new ApiClient().api;