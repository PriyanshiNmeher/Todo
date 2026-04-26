import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('jwt')?.value;
  const userId = request.cookies.get('userId')?.value;
  const { pathname } = request.nextUrl;

  const publicRoutes = ['/signin', '/signup'];
  const isPublicRoute = publicRoutes.includes(pathname);

  // If user is trying to access protected route without token/userId, redirect to signin
  if (!isPublicRoute && (!token || !userId) && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // If user is logged in, restrict access to auth pages
  if (isPublicRoute && token && userId) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect root to dashboard
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
