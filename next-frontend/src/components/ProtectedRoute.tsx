'use client';

import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { Loader } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * ProtectedRoute component
 * 
 * Ensures that the user is authenticated before accessing the wrapped content
 * Redirects to login if not authenticated
 * Special handling for RSC requests to prevent hydration issues
 */
const ProtectedRoute = ({ children, fallback }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [redirected, setRedirected] = useState(false);
  const [isClientSide, setIsClientSide] = useState(false);
  
  // Check if this is an RSC request (has _rsc parameter)
  const isRscRequest = searchParams?.has('_rsc');

  // Set isClientSide to true after component mounts
  useEffect(() => {
    setIsClientSide(true);
  }, []);

  // Debug session storage to persist redirect state across page loads
  const getSessionRedirectFlag = () => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(`redirect_${pathname}`) === 'true';
  };

  const setSessionRedirectFlag = () => {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(`redirect_${pathname}`, 'true');
  };

  const clearSessionRedirectFlag = () => {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(`redirect_${pathname}`);
  };

  // When component mounts, check if we've redirected before
  useEffect(() => {
    const sessionRedirected = getSessionRedirectFlag();
    if (sessionRedirected) {
      setRedirected(true);
    }
  }, [pathname]);

  useEffect(() => {
    // Only run this effect on client side
    if (!isClientSide) return;

    // Log auth state for debugging
    console.log('ProtectedRoute: Auth state -', { 
      isAuthenticated, 
      isLoading, 
      isRscRequest: searchParams?.has('_rsc'),
      path: pathname,
      redirected,
      sessionRedirected: getSessionRedirectFlag()
    });
    
    // Skip redirection if:
    // 1. Already redirected (prevent loops)
    // 2. Still loading (wait for auth check)
    // 3. Is authenticated (access allowed)
    // 4. Is an RSC request (special handling for server components)
    if (redirected || isLoading || isAuthenticated || isRscRequest) {
      // If authenticated, clear any redirect flags
      if (isAuthenticated) {
        clearSessionRedirectFlag();
      }
      return;
    }
    
    console.log('ProtectedRoute: Not authenticated, checking localStorage token...');
    
    // Last-ditch direct token check to handle race conditions
    const hasToken = typeof window !== 'undefined' ? !!localStorage.getItem('token') : false;
    
    // If we still don't have a token, redirect to login
    if (!hasToken) {
      // Prevent redirect loops by checking if we've already tried to redirect
      if (getSessionRedirectFlag()) {
        console.log('ProtectedRoute: Already tried redirecting, preventing loop');
        return;
      }

      console.log('ProtectedRoute: No token found, redirecting to login');
      const returnUrl = encodeURIComponent(pathname || '/');
      
      // Set both local and session storage flags to prevent loops
      setRedirected(true);
      setSessionRedirectFlag();
      
      // Use window.location for a full page navigation to avoid
      // hydration and React state issues with router.push
      window.location.href = `/login?redirect=${returnUrl}`;
    } else {
      console.log('ProtectedRoute: Token exists but auth state not ready, showing loading...');
      // We have a token but auth context hasn't updated yet
      // This is likely a race condition - show loading state
    }
  }, [isAuthenticated, isLoading, pathname, redirected, searchParams, isRscRequest, isClientSide]);

  // Custom loading component
  const LoadingState = () => (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center">
        <Loader className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    </div>
  );

  // For RSC requests, always render children to prevent hydration mismatch
  // This relies on the middleware to handle auth for initial page load
  if (isRscRequest) {
    console.log('ProtectedRoute: RSC request detected, rendering children');
    return <>{children}</>;
  }

  // For manual debug/override - check if we have a token in localStorage
  // even if the auth context doesn't think we're authenticated yet
  const hasLocalToken = isClientSide && !!localStorage.getItem('token');
  
  // Check for direct query param that we can use to override auth for debugging
  const hasSkipRedirectParam = searchParams?.has('skip_redirect');
  
  // Additional check - if URL has ?skip_redirect, always show component
  // This helps break redirect loops
  if (hasSkipRedirectParam) {
    console.log('ProtectedRoute: Skip redirect param detected, rendering children anyway');
    return <>{children}</>; 
  }
  
  // If we have a token but auth state is not synced, show loading state
  // This gives AuthContext time to load user data from API
  if (isLoading || (!isAuthenticated && hasLocalToken)) {
    console.log('ProtectedRoute: Showing loading state', {
      isLoading,
      isAuthenticated,
      hasLocalToken,
      pathname
    });
    return fallback ? <>{fallback}</> : <LoadingState />;
  }

  // If authenticated, render children
  if (isAuthenticated) {
    console.log('ProtectedRoute: User is authenticated, rendering children');
    return <>{children}</>;
  }
  
  // If we get here, user is not authenticated and we've already started redirect process
  console.log('ProtectedRoute: Not authenticated, returning loading state while redirect happens');
  // Return loading state rather than null to prevent blank page
  return <LoadingState />;
};

export default ProtectedRoute;