import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  guestSessionId: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  initializeGuestSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [guestSessionId, setGuestSessionId] = useState<string | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const token = await authService.getToken();
      
      if (token) {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } else {
        // Initialize guest session if no authenticated user
        const guestId = await authService.getGuestSessionId();
        if (!guestId) {
          await initializeGuestSession();
        } else {
          setGuestSessionId(guestId);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeGuestSession = async () => {
    try {
      const guestId = await authService.createGuestSession();
      setGuestSessionId(guestId);
    } catch (error) {
      console.error('Failed to create guest session:', error);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await authService.login(username, password);
      setUser(response.user);
      setGuestSessionId(null); // Clear guest session on login
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await authService.register(userData);
      setUser(response.user);
      setGuestSessionId(null); // Clear guest session on register
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      await initializeGuestSession(); // Create new guest session after logout
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    guestSessionId,
    login,
    register,
    logout,
    initializeGuestSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};