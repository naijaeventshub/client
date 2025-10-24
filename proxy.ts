import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  hasRequiredPermissions,
  getUserPermissions,
  getPermissionsForPath,
} from '@/lib/route-permissions';

// Helper functions to check route types
const isAuthRoute = (pathname: string) =>
  pathname === '/auth' ||
  pathname.startsWith('/auth/') ||
  pathname === '/admin/auth' ||
  pathname.startsWith('/admin/auth/');
const isDashboardRoute = (pathname: string) =>
  pathname === '/dashboard' ||
  pathname.startsWith('/dashboard/') ||
  pathname === '/admin/dashboard' ||
  pathname.startsWith('/admin/dashboard/');
const isAdminPath = (pathname: string) => pathname.startsWith('/admin');

// Middleware config
export const config = {
  matcher: [
    '/auth/:path*',
    '/admin/auth/:path*',
    '/dashboard/:path*',
    '/admin/dashboard/:path*',
  ],
};

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Redirect authenticated users away from auth routes
  if (token && isAuthRoute(pathname)) {
    const redirectUrl = isAdminPath(pathname)
      ? '/admin/dashboard'
      : '/dashboard';
    return NextResponse.redirect(new URL(redirectUrl, req.url));
  }

  // Redirect unauthenticated users away from dashboard routes
  if (!token && isDashboardRoute(pathname)) {
    const loginUrl = isAdminPath(pathname)
      ? '/admin/auth/login'
      : '/auth/login';
    return NextResponse.redirect(new URL(loginUrl, req.url));
  }

  // Skip permission checks for no-permissions pages to avoid redirect loops
  if (
    pathname === '/dashboard/no-permissions' ||
    pathname === '/admin/dashboard/no-permissions'
  ) {
    return NextResponse.next();
  }

  // Only check permissions for dashboard routes
  if (isDashboardRoute(pathname)) {
    const userPermissions = token?.user ? getUserPermissions(token.user) : [];
    const isAdmin = isAdminPath(pathname);

    // If user has no permissions at all, redirect to appropriate no-permissions page
    if (userPermissions.length === 0) {
      const noPermissionsUrl = isAdmin
        ? '/admin/dashboard/no-permissions'
        : '/dashboard/no-permissions';
      return NextResponse.redirect(new URL(noPermissionsUrl, req.url));
    }

    // For users with permissions, check if they have required permissions
    const requiredPermissions = getPermissionsForPath(pathname);
    if (!hasRequiredPermissions(userPermissions, requiredPermissions)) {
      const noPermissionsUrl = isAdmin
        ? '/admin/dashboard/no-permissions'
        : '/dashboard/no-permissions';
      return NextResponse.redirect(new URL(noPermissionsUrl, req.url));
    }
  }

  return NextResponse.next();
}
