import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Server-side functions for authentication
 * These should only be used in server components
 */

/**
 * Get the auth token from cookies (server-side)
 */
export function getAuthTokenFromCookies() {
  const cookieStore = cookies();
  return cookieStore.get('auth_token')?.value;
}

/**
 * Check if the user is authenticated (server-side)
 */
export function isAuthenticatedServerSide() {
  return !!getAuthTokenFromCookies();
}

/**
 * Handles redirects for protected routes based on authentication status
 * Call this from server components to redirect if not authenticated
 */
export function handleProtectedRoute(redirectTo = '/login') {
  if (!isAuthenticatedServerSide()) {
    // Return a redirect response
    return Response.redirect(new URL(redirectTo, process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
  }
  
  return null;
}

/**
 * Create authentication headers for server-side API requests
 */
export function createAuthHeaders() {
  const token = getAuthTokenFromCookies();
  if (!token) {
    return {};
  }
  
  return {
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Middleware helper to check authentication
 */
export function isAuthenticatedFromRequest(request: NextRequest) {
  // Check the auth_token cookie
  const token = request.cookies.get('auth_token')?.value;
  
  // If we're checking the login or register page, always return false
  // This is critical to ensure the middleware doesn't redirect incorrectly
  if (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register') {
    return false;
  }
  
  return !!token;
}

/**
 * Middleware helper to check if user has admin role
 * This performs a basic check if the user is authenticated
 * The actual detailed role check will happen in the AdminLayout component
 */
export function hasAdminRole(request: NextRequest) {
  // We can only check if the user is authenticated at the middleware level
  // since we can't easily decode the JWT token here
  return isAuthenticatedFromRequest(request);
}

/**
 * Middleware helper to redirect based on authentication status
 */
export function redirectIfUnauthenticated(request: NextRequest, path: string) {
  if (!isAuthenticatedFromRequest(request)) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }
  
  return null;
}

/**
 * Middleware helper to redirect if not admin
 */
export function redirectIfNotAdmin(request: NextRequest) {
  // First check if authenticated - don't redirect for RSC requests
  const isRscRequest = request.nextUrl.searchParams.has('_rsc');
  
  if (!isAuthenticatedFromRequest(request)) {
    if (isRscRequest) {
      // Don't redirect RSC requests - let the client component handle auth
      console.log('Middleware: RSC request to admin without auth - allowing through');
      return null;
    }
    
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // We can't verify admin role in middleware, 
  // so we'll let the client component handle this
  return null;
}