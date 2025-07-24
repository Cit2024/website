import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { publicRoutes, authRoutes, DEFAULT_LOGIN_REDIRECT } from './routes';

const intlMiddleware = createIntlMiddleware(routing);
const ADMIN_ROLES = ['GENERAL_MANAGER', 'NEWS_EDITOR', 'REQUEST_REVIEWER'];

// Add this helper function to detect if a route is localized
const isLocalizedRoute = (pathname: string) => 
  /^\/(ar|en)(\/|$)/.test(pathname);


export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;
  const isLocalized = isLocalizedRoute(pathname);

  // Combine public and auth routes
  const nonProtectedRoutes = [...publicRoutes, ...authRoutes];
  const isNonProtectedRoute = nonProtectedRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  const isAuthRoute = authRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // Handle non-protected routes
  if (isNonProtectedRoute) {
    // Redirect logged-in users away from auth routes
    if (isAuthRoute) {
      const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
      if (token) {
        return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.url));
      }
    }
    // Skip intlMiddleware for non-localized routes
    if (!isLocalized) {
      return NextResponse.next();
    }

    return intlMiddleware(req);
  }

  // Handle admin routes
  if (pathname.startsWith('/admin')) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      // Use non-localized auth route
      const loginUrl = new URL('/auth/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check admin roles
    if (!token.role || !ADMIN_ROLES.includes(token.role as string)) {
      return new NextResponse('Forbidden', { status: 403 });
    }
  }
  // Handle other routes with i18n only if they're localized
  if (isLocalized) {
    return intlMiddleware(req);
  }

  // Handle all other routes with i18n
  return intlMiddleware(req);
}

export const config = {
  matcher: [
    '/',
    '/(ar|en)/:path*',
    '/admin/:path*',
    '/auth/:path*'
  ]
};