'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

/**
 * Component to protect admin routes by verifying user has admin role
 * Used in client-side admin components as a fallback for the middleware
 */
export default function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  // Check for admin role - support both role property and roles array
  const isAdmin = 
    user?.role === 'ADMIN' || 
    (user?.roles && user?.roles.includes('ADMIN'));
  
  useEffect(() => {
    // Only redirect after loading completes
    if (!isLoading) {
      // Redirect if not authenticated
      if (!isAuthenticated) {
        router.replace('/login?redirect=/admin');
        return;
      }
      
      // Redirect if authenticated but not admin
      if (isAuthenticated && !isAdmin) {
        router.replace('/dashboard');
      }
    }
  }, [isAuthenticated, isAdmin, isLoading, router]);
  
  // Show loading while checking
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  // Show nothing briefly during redirect
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-400">Redirecting...</div>
      </div>
    );
  }
  
  // If all checks pass, render children
  return <>{children}</>;
}