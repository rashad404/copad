'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function LogoutPage() {
  const { logout } = useAuth();

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Clear tokens first
        localStorage.removeItem('token');
        document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax';
        
        // Logout API call
        await logout();
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        // Always redirect to login
        window.location.replace('/login');
      }
    };

    // Execute logout immediately
    performLogout();
  }, [logout]);

  // Return a minimal loading state that is shown very briefly
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
        <p className="mt-4">Logging out...</p>
      </div>
    </div>
  );
}