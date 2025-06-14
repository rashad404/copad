'use client';

import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

interface PublicRouteProps {
  children: ReactNode;
}

/**
 * PublicRoute component
 * 
 * Wraps public pages to prevent unnecessary auth checks and API calls
 * Also redirects authenticated users away from login/register pages
 * Special handling for RSC requests to prevent hydration mismatches
 */
const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [redirected, setRedirected] = useState(false);
  
  // Check if this is an RSC request
  const isRscRequest = searchParams?.has('_rsc');

  // List of routes that should redirect to dashboard if already authenticated
  const authRedirectRoutes = ['/login', '/register'];
  
  useEffect(() => {
    // Skip redirection if:
    // 1. Already redirected (prevent loops)
    // 2. Still loading (wait for auth check)
    // 3. Is not authenticated (no need to redirect)
    // 4. Is an RSC request (special handling for server components)
    // 5. Current path is not in the redirect list
    if (
      redirected || 
      isLoading || 
      !isAuthenticated || 
      isRscRequest || 
      !authRedirectRoutes.includes(pathname || '')
    ) {
      return;
    }
    
    // Temporarily disable client-side redirects to fix issues
    // We'll let the middleware handle redirects for now
    
    /*
    // Add redirected flag to prevent loops
    setRedirected(true);
    
    // Add skip_redirect query param to prevent middleware redirect loops
    const url = '/dashboard?skip_redirect=true';
    
    // Use window.location for a full page navigation to avoid
    // hydration and React state issues with router.push
    window.location.href = url;
    */
  }, [isAuthenticated, isLoading, pathname, redirected, searchParams, isRscRequest]);

  // Always render children - redirection happens via useEffect
  return <>{children}</>;
};

export default PublicRoute;