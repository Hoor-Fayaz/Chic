import { NextResponse } from 'next/server';

function decodeJwtPayload(token) {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
    const jsonString = typeof atob === 'function'
      ? decodeURIComponent(
          atob(padded)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        )
      : Buffer.from(padded, 'base64').toString('utf-8');
    return JSON.parse(jsonString);
  } catch (e) {
    return null;
  }
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protect all /admin/* routes except /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const adminToken =
      request.cookies.get('chic_admin_token')?.value ||
      request.cookies.get('token')?.value ||
      request.cookies.get('accessToken')?.value;

    let isAuthorized = false;

    if (adminToken) {
      const payload = decodeJwtPayload(adminToken);
      if (payload && payload.role === 'admin') {
        const isNotExpired = !payload.exp || payload.exp * 1000 > Date.now();
        if (isNotExpired) {
          isAuthorized = true;
        }
      }
    }

    if (!isAuthorized) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
