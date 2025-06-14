/**
 * Authentication utility functions
 * Provides consistent auth token handling for both client and server
 */

/**
 * Get token from localStorage (client-side only)
 */
export const getTokenFromLocalStorage = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('token');
};

/**
 * Set token in localStorage (client-side only)
 */
export const setTokenInLocalStorage = (token: string): void => {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem('token', token);
};

/**
 * Remove token from localStorage (client-side only)
 */
export const removeTokenFromLocalStorage = (): void => {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.removeItem('token');
};

/**
 * Set the auth token cookie for server-side access
 * Call this after successful login to allow middleware to access the token
 */
export const setAuthCookie = (token: string): void => {
  document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
};

/**
 * Clear the auth token cookie
 * Call this during logout to remove server-side access to the token
 */
export const clearAuthCookie = (): void => {
  document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax';
};

/**
 * Handle login by storing token in both localStorage and cookies
 */
export const handleLogin = (token: string): void => {
  setTokenInLocalStorage(token);
  setAuthCookie(token);
};

/**
 * Handle logout by removing token from both localStorage and cookies
 */
export const handleLogout = (): void => {
  removeTokenFromLocalStorage();
  clearAuthCookie();
};

/**
 * Check if user is authenticated (client-side only)
 */
export const isAuthenticated = (): boolean => {
  return !!getTokenFromLocalStorage();
};