// app/(publik)/lupa-sandi/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Impor useRouter

export default function LupaSandiPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(''); // Ganti nama state agar lebih jelas
  
  const router = useRouter(); // Inisialisasi router

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.success) {
        // Jika email valid, langsung arahkan ke halaman reset dengan ID user
        router.push(`/reset-password/${data.userId}`);
      } else {
        // Jika email tidak ditemukan, tampilkan error
        setError(data.message);
      }
    } catch (err) {
      console.error("Forgot password request failed:", err);
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="text-3xl font-bold text-center text-brand-text">Lupa Password</h2>
          <p className="mt-2 text-center text-gray-600">
            Masukkan alamat email Anda untuk melanjutkan.
          </p>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Alamat Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 mt-1 text-gray-700 bg-gray-100 border rounded-lg focus:ring-brand-primary focus:border-brand-primary"
              placeholder="anda@email.com"
            />
          </div>
          
          {error && <p className="p-3 text-center text-red-800 bg-red-100 rounded-lg">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 font-semibold text-white transition-colors duration-300 bg-brand-primary rounded-lg hover:bg-orange-500 disabled:bg-orange-300"
            >
              {isLoading ? 'Memeriksa...' : 'Lanjutkan'}
            </button>
          </div>
        </form>
        
        <div className="text-sm text-center">
          <Link href="/login" className="font-medium text-brand-primary hover:underline">
            Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  );
}