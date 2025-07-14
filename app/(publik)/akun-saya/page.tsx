// app/(publik)/akun-saya/page.tsx

import { cookies } from 'next/headers';
import * as jose from 'jose';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import LogoutButton from './LogoutButton';

type UserPayload = {
  readonly name: string;
}

export default async function AkunSayaPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('auth_session');

  if (!sessionCookie) {
    redirect('/login');
  }

  let user: UserPayload = { name: 'Pelanggan' };
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jose.jwtVerify(sessionCookie.value, secret);
    user = payload as UserPayload;
  } catch (error) {
    console.error("Token verification failed:", error);
    redirect('/login');
  }

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="container mx-auto max-w-2xl text-center">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-4xl font-bold text-brand-text">Selamat Datang, {user.name}!</h2>
        <p className="mt-4 text-gray-600">
          Ini adalah halaman akun Anda. Dari sini Anda bisa melihat riwayat pesanan dan mengelola profil Anda.
        </p>
        <div className="flex justify-center items-center gap-4 mt-8">
            <Link href="/" className="px-6 py-2 font-semibold text-brand-primary bg-orange-100 rounded-lg hover:bg-orange-200">
                Lihat Katalog
            </Link>
            <LogoutButton />
        </div>
      </div>
    </div>
  );
}