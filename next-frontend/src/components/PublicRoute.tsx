'use client';

import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface PublicRouteProps {
  children: ReactNode;
}

/**
 * PublicRoute component
 * 
 * Wraps public pages to prevent unnecessary auth checks and API calls
 * Also redirects authenticated users away from login/register pages
 */
const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // List of routes that should redirect to dashboard if already authenticated
  const authRedirectRoutes = ['/login', '/register'];
  
  useEffect(() => {
    // If user is authenticated and trying to access login/register pages,
    // redirect them to dashboard
    if (isAuthenticated && authRedirectRoutes.includes(pathname || '')) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, pathname, router]);

  return <>{children}</>;
};

export default PublicRoute;