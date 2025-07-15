// app/(publik)/layout.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '../context/AppContext'; // Ganti ke useApp
import { HiOutlineShoppingCart } from 'react-icons/hi';

export default function PublikLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { cartCount, loggedInUser } = useApp(); // Ambil loggedInUser dari context

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
          
          <Link href="/keranjang" className="relative p-2 rounded-full hover:bg-gray-100">
            <HiOutlineShoppingCart size={24} className="text-gray-700" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Navigasi dinamis dari context */}
          {loggedInUser ? (
            <Link 
              href={loggedInUser.role === 'ADMIN' ? '/admin/dashboard' : '/akun-saya'} 
              className="px-4 py-2 text-sm font-semibold text-white bg-brand-primary rounded-lg hover:bg-orange-500"
            >
              {loggedInUser.role === 'ADMIN' ? 'Dasbor' : 'Akun Saya'}
            </Link>
          ) : (
            <Link 
              href="/login" 
              className="px-4 py-2 text-sm font-semibold text-brand-primary border border-brand-primary rounded-lg hover:bg-orange-50 transition-colors"
            >
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