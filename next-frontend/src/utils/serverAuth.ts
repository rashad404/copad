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