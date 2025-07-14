// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('auth_session');
  const { pathname } = request.nextUrl;

  if (!sessionCookie) {
    if (pathname.startsWith('/admin') || pathname.startsWith('/akun-saya')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jose.jwtVerify(sessionCookie.value, secret);
    
    const userRole = (payload as { role: string }).role;

    if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
      const url = userRole === 'ADMIN' ? '/admin/dashboard' : '/akun-saya';
      return NextResponse.redirect(new URL(url, request.url));
    }

    if (userRole === 'CUSTOMER' && pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/akun-saya', request.url));
    }

    return NextResponse.next();

  } catch (err) {
    // Tambahkan console.error untuk menggunakan variabel 'err'
    console.error('Token tidak valid atau kedaluwarsa:', err);
    
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('auth_session');
    return response;
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/akun-saya/:path*',
    '/login',
    '/register',
  ],
};