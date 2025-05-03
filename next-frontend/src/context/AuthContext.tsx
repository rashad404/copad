'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/api';
import { 
  getTokenFromLocalStorage, 
  setTokenInLocalStorage,
  removeTokenFromLocalStorage,
  setAuthCookie,
  clearAuthCookie,
  isAuthenticated as checkAuth
} from '@/utils/auth';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTokenChecked, setIsTokenChecked] = useState(false);

  // On initial load, check if we have a token and fetch user if we do
  useEffect(() => {
    console.log('AuthProvider: Initial load, checking token');
    
    // Create a flag to track if this effect has been completed
    // This helps prevent state updates after component unmounts
    let isMounted = true;
    
    const checkToken = async () => {
      if (typeof window === 'undefined') {
        if (isMounted) setIsLoading(false);
        return;
      }

      const token = getTokenFromLocalStorage();
      console.log('AuthProvider: Token exists:', !!token);

      if (!token) {
        // No token, not authenticated
        if (isMounted) {
          setUser(null);
          setIsLoading(false);
          setIsTokenChecked(true);
        }
        return;
      }

      // Make sure the cookie is also set for server-side auth
      setAuthCookie(token);

      // We have a token, try to get user data
      try {
        console.log('AuthProvider: Fetching user data with token');
        
        // Keep isLoading true during the API call
        if (isMounted) setIsLoading(true);
        
        const response = await api.get('/user/me');
        console.log('AuthProvider: User data received', response.data);
        
        // Only update state if component is still mounted
        if (isMounted) {
          setUser(response.data);
          // Special flag to indicate auth has been verified with server
          sessionStorage.setItem('auth_verified', 'true');
        }
      } catch (error) {
        console.error('AuthProvider: Error fetching user', error);
        // Invalid token or other error
        if (isMounted) {
          setUser(null);
          removeTokenFromLocalStorage();
          clearAuthCookie();
          // Clear the auth verified flag
          sessionStorage.removeItem('auth_verified');
        }
      } finally {
        // Only update state if component is still mounted
        if (isMounted) {
          setIsLoading(false);
          setIsTokenChecked(true);
        }
      }
    };

    // Call the function
    checkToken();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, []);

  // Add storage event listener to handle token changes in other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        if (!e.newValue) {
          // Token was removed
          console.log('AuthProvider: Token removed in another tab');
          setUser(null);
          clearAuthCookie();
        } else if (e.newValue !== e.oldValue) {
          // Token was changed
          console.log('AuthProvider: Token changed in another tab');
          setAuthCookie(e.newValue);
          // You could reload user data here if needed
        }
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('AuthProvider: Logging in');
      const response = await api.post('/auth/login', { email, password });
      
      // The backend returns the token directly as a string
      const token = response.data;
      console.log('AuthProvider: Login successful, token received');
      
      // Store token in both localStorage and cookie
      setTokenInLocalStorage(token);
      setAuthCookie(token);
      
      // Get user data
      try {
        console.log('AuthProvider: Fetching user after login');
        const userResponse = await api.get('/user/me');
        console.log('AuthProvider: User data received after login', userResponse.data);
        setUser(userResponse.data);
      } catch (userError) {
        console.error('AuthProvider: Failed to fetch user after login', userError);
        // Still considered logged in even if we can't get user data
      }
    } catch (error) {
      console.error('AuthProvider: Login failed', error);
      throw error;
    }
  };

  const logout = async () => {
    console.log('AuthProvider: Logging out');
    try {
      // Try to call logout API
      await api.post('/auth/logout');
      console.log('AuthProvider: Logout API call successful');
    } catch (error) {
      console.error('AuthProvider: Logout API call failed', error);
      // Continue with client-side logout even if API fails
    } finally {
      // Clear token and user data
      removeTokenFromLocalStorage();
      clearAuthCookie();
      setUser(null);
      console.log('AuthProvider: Logged out');
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      console.log('AuthProvider: Registering');
      const response = await api.post('/auth/register', { email, password, name });
      
      // The backend returns the token directly as a string
      const token = response.data;
      console.log('AuthProvider: Registration successful, token received');
      
      // Store token in both localStorage and cookie
      setTokenInLocalStorage(token);
      setAuthCookie(token);
      
      // Get user data
      try {
        console.log('AuthProvider: Fetching user after registration');
        const userResponse = await api.get('/user/me');
        console.log('AuthProvider: User data received after registration', userResponse.data);
        setUser(userResponse.data);
      } catch (userError) {
        console.error('AuthProvider: Failed to fetch user after registration', userError);
        // Still considered registered even if we can't get user data
      }
    } catch (error) {
      console.error('AuthProvider: Registration failed', error);
      throw error;
    }
  };

  // The actual auth state - prioritize user object over just token existence
  // Only consider authenticated if we have a user object OR 
  // we're still loading (to prevent flicker) OR 
  // we have a token but haven't fetched user yet
  const hasToken = typeof window !== 'undefined' ? !!localStorage.getItem('token') : false;
  const isAuthenticated = !!user || (isLoading && hasToken);

  console.log('AuthProvider rendering with isAuthenticated:', isAuthenticated);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 