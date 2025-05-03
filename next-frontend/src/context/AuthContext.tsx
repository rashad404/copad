'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/api';
import { usePathname } from 'next/navigation';

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

// Pages that require authentication - only check auth on these pages
const authProtectedPaths = [
  '/dashboard',
  '/profile',
  '/appointments',
  '/messages',
  '/security',
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const isAuthRequired = () => {
    if (!pathname) return false;
    return authProtectedPaths.some(path => pathname.startsWith(path));
  };

  useEffect(() => {
    // Only check auth if we're on a protected path and haven't checked yet
    if (typeof window !== 'undefined' && isAuthRequired() && !authChecked) {
      const token = localStorage.getItem('token');
      if (token) {
        setIsLoading(true);
        checkAuth();
      } else {
        setIsLoading(false);
        setUser(null);
        setAuthChecked(true);
      }
    } else if (!isAuthRequired() && !authChecked) {
      // Mark as checked for public routes
      setIsLoading(false);
      setAuthChecked(true);
    }
  }, [pathname, authChecked]);

  const checkAuth = async () => {
    try {
      const response = await api.get('/user/me');
      setUser(response.data);
    } catch (error) {
      setUser(null);
      localStorage.removeItem('token'); // Clear invalid token
    } finally {
      setIsLoading(false);
      setAuthChecked(true);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', response.data.token);
    setUser(response.data.user);
    setAuthChecked(true);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setAuthChecked(true);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    const response = await api.post('/auth/register', { email, password, name });
    localStorage.setItem('token', response.data.token);
    setUser(response.data.user);
    setAuthChecked(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
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