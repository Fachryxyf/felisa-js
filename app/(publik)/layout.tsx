// app/(publik)/layout.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cookies } from 'next/headers';
import * as jose from 'jose';

type UserPayload = {
  readonly role: 'ADMIN' | 'CUSTOMER';
}

export default async function PublikLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // PERBAIKAN: Menggunakan 'await' untuk mengambil cookie
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('auth_session');
  let loggedInUser: UserPayload | null = null;
  
  if (sessionCookie?.value) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      const { payload } = await jose.jwtVerify(sessionCookie.value, secret);
      loggedInUser = payload as UserPayload;
    } catch (err) {
      console.error("Header token verification failed:", err);
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <header className="p-4 bg-white border-b sticky top-0 z-10 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-brand-text">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/images/Ayud Craft Lettermark Primary Logo.png" alt="Ayud Craft Logo" width={32} height={32} className="object-contain"/>
            <span>Ayud Craft</span>
          </Link>
        </h1>
        
        <nav className="flex items-center gap-6">
          <Link href="/" className="font-semibold text-gray-600 hover:text-brand-primary transition-colors">
            Beranda
          </Link>
          
          {loggedInUser?.role === 'CUSTOMER' ? (
            <Link href="/akun-saya" className="px-4 py-2 text-sm font-semibold text-white bg-brand-primary rounded-lg hover:bg-orange-500">
                Akun Saya
            </Link>
          ) : (
            <Link href="/login" className="px-4 py-2 text-sm font-semibold text-brand-primary border border-brand-primary rounded-lg hover:bg-orange-50 transition-colors">
                Login
            </Link>
          )}
        </nav>
      </header>
      
      <main className="flex-grow p-4 md:p-8">
        {children}
      </main>

      <footer className="p-8 mt-8 text-center text-gray-500 bg-white border-t">
        <p className="text-sm">&copy; 2025 Ayud Craft. All rights reserved.</p>
      </footer>
    </div>
  );
}