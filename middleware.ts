// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('auth_session');
  const { pathname } = request.nextUrl;

  // 1. Jika pengguna sudah login (ada cookie)
  if (sessionCookie) {
    // dan mencoba mengakses halaman login atau register,
    if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
      // arahkan mereka ke dasbor admin.
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  // 2. Jika pengguna belum login (tidak ada cookie)
  if (!sessionCookie) {
    // dan mencoba mengakses halaman admin,
    if (pathname.startsWith('/admin')) {
      // arahkan mereka ke halaman login.
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 3. Jika tidak ada kondisi di atas yang terpenuhi, lanjutkan seperti biasa.
  return NextResponse.next();
}

// 4. Konfigurasi matcher sekarang mencakup semua rute yang ingin kita periksa.
export const config = {
  matcher: [
    '/admin/:path*', // Lindungi semua rute admin
    '/login',         // Periksa halaman login
    '/register',      // Periksa halaman register (jika ada nanti)
  ],
};