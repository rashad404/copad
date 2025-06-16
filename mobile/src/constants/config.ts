export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';
export const API_TIMEOUT = 30000;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  LANGUAGE: 'language',
  GUEST_SESSION_ID: 'guest_session_id',
};