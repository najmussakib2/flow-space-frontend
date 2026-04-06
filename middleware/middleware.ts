import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login', '/register', '/auth/callback'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  const token = request.cookies.get('accessToken')?.value;

  // Note: localStorage is not accessible in middleware
  // We'll rely on the client-side auth check in layout
  // This middleware just handles basic cookie-based redirect
  if (!isPublic && !token) {
    // Allow through — client layout will redirect if no localStorage token
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};