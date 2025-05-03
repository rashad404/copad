import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { 
  isAuthenticatedFromRequest, 
  redirectIfUnauthenticated,
  redirectIfNotAdmin 
} from '@/utils/serverAuth';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  let { pathname } = url;
  
  // Extract the base path without any query parameters or fragments
  const basePath = pathname.split(/[?#]/)[0];

  // Remove trailing slash if present (unless it's the root path)
  const normalizedPath = basePath === '/' ? basePath : basePath.replace(/\/$/, '');

  // Protected routes
  const protectedRoutes = [
    '/dashboard',
    '/appointments',
    '/profile',
    '/chat',
  ];
  
  // Admin routes need special handling
  const adminRoutes = [
    '/admin'
  ];

  // Public routes that should bypass auth checks
  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/about',
    '/contact',
    '/blog', 
    '/faq',
    '/privacy-policy',
    '/terms-of-service',
    '/security',
  ];

  // Check if it's an RSC (React Server Component) request
  const isRscRequest = url.searchParams.has('_rsc');
  
  // The normalized path for route matching
  const requestPath = normalizedPath;

  // Check route types
  const isProtectedRoute = protectedRoutes.some((route) =>
    requestPath.startsWith(route)
  );
  
  const isAdminRoute = adminRoutes.some((route) =>
    requestPath.startsWith(route)
  );

  // Check if the route is explicitly public
  const isPublicRoute = publicRoutes.some((route) => 
    requestPath === route || requestPath.startsWith(`${route}/`)
  );

  // Skip middleware for non-HTML and non-RSC requests (assets, api, etc.)
  const isHtmlRequest = request.headers.get('accept')?.includes('text/html');
  if (!isProtectedRoute && !isAdminRoute && !isPublicRoute && !isHtmlRequest && !isRscRequest) {
    return NextResponse.next();
  }

  // Get the token from cookies
  const isAuthenticated = isAuthenticatedFromRequest(request);
  
  // Log the request for debugging
  console.log(`Middleware: Path=${requestPath}, Protected=${isProtectedRoute}, Admin=${isAdminRoute}, RSC=${isRscRequest}, Authenticated=${isAuthenticated}`);

  // Handle admin routes - need both authentication and admin role
  if (isAdminRoute) {
    const adminRedirect = redirectIfNotAdmin(request);
    if (adminRedirect && !isRscRequest) {
      return adminRedirect;
    }
    
    // For RSC requests, let them through
    if (isRscRequest) {
      return NextResponse.next();
    }
  }

  // Handle regular protected routes
  if (isProtectedRoute) {
    if (!isAuthenticated) {
      // IMPORTANT: For RSC requests, we should NEVER redirect
      // Redirecting RSC requests causes issues with Next.js hydration
      if (isRscRequest) {
        console.log(`Middleware: RSC request to protected route without auth - allowing through: ${requestPath}`);
        
        // Let all RSC requests through - the page component will handle auth client-side
        // This prevents hydration errors and redirect loops with RSC requests
        return NextResponse.next();
      } else {
        console.log(`Middleware: Non-RSC request to protected route without auth: ${requestPath}`);
        
        // For regular non-RSC requests, we can redirect to login
        // But first, check if the URL includes a special query param indicating redirect prevention
        if (url.searchParams.has('__prevent_redirect')) {
          console.log(`Middleware: Redirect prevention param detected, skipping redirect`);
          return NextResponse.next();
        }
        
        console.log(`Middleware: Redirecting to login from ${requestPath}`);
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', requestPath);
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  // Special handling for login/register pages
  if (requestPath === '/login' || requestPath === '/register') {
    // For RSC requests on login/register, never redirect
    if (isRscRequest) {
      console.log('Middleware: Allowing RSC request to login/register page');
      return NextResponse.next();
    }
    
    // Only redirect if authenticated and it's not an RSC request
    if (isAuthenticated && !url.searchParams.has('skip_redirect')) {
      console.log('Middleware: Redirecting authenticated user from login/register to dashboard');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    // Always allow access to login/register page regardless of auth status
    console.log('Middleware: Allowing normal access to login/register page');
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 