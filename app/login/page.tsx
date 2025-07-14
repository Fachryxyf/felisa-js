// app/login/page.tsx
'use client'; 

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HiEye, HiEyeOff, HiArrowLeft } from 'react-icons/hi'; // Impor ikon panah

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success) {
        if (data.user.role === 'ADMIN') {
          router.push('/admin/dashboard');
        } else {
          router.push('/akun-saya');
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error('Login form submission error:', err);
      setError('Tidak dapat terhubung ke server. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Tambahkan 'relative' di sini untuk menjadi acuan posisi tombol
    <main className="relative flex items-center justify-center min-h-screen bg-brand-background">
      
      {/* Tombol Kembali di Pojok Kiri Atas */}
      <Link href="/" className="absolute top-8 left-8 p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
        <HiArrowLeft size={24} className="text-gray-700" />
      </Link>

      <div className="relative flex w-full max-w-4xl m-4 bg-white shadow-lg rounded-2xl">
        <div className="w-full p-8 md:w-1/2">
          <h2 className="text-3xl font-bold text-brand-text">Masuk Sekarang</h2>
          <p className="mt-2 text-gray-600">Hi, Selamat Datang kembali 👋</p>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && <p className="p-3 text-center text-red-800 bg-red-100 rounded-lg">{error}</p>}

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Masukan Email" className="w-full px-4 py-3 mt-1 text-gray-700 bg-gray-100 border rounded-lg focus:ring-brand-primary focus:border-brand-primary" required/>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Kata Sandi</label>
              <div className="relative mt-1">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Masukan kata sandi" className="w-full px-4 py-3 pr-10 text-gray-700 bg-gray-100 border rounded-lg focus:ring-brand-primary focus:border-brand-primary" required/>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-brand-primary">{showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}</button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input type="checkbox" id="remember-me" className="w-4 h-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary" /><label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Ingat saya</label>
              </div>
              <div className="text-sm">
                <Link href="/lupa-sandi" className="font-medium text-brand-primary hover:text-orange-500">Lupa kata sandi?</Link>
              </div>
            </div>

            <div>
              <button type="submit" disabled={isLoading} className="w-full px-4 py-3 font-semibold text-white transition-colors duration-300 bg-brand-primary rounded-lg hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-orange-300">{isLoading ? 'Mengalihkan...' : 'Masuk'}</button>
            </div>

            <div className="text-sm text-center pt-2">
                <Link href="/" className="font-medium text-gray-500 hover:text-brand-primary hover:underline">
                    Kembali ke Beranda
                </Link>
            </div>
          </form>

          <p className="mt-6 text-sm text-center">
            Belum memiliki akun?{' '}
            <Link href="/register" className="font-medium text-brand-primary hover:text-orange-500">
              Daftar akun
            </Link>
          </p>
        </div>
        <div className="relative items-center justify-center hidden w-1/2 p-8 md:flex bg-brand-secondary rounded-r-2xl">
          <Image src="https://cdn.pixabay.com/photo/2023/10/31/23/52/generated-to-8356214_1280.png" alt="Login Illustration" width={500} height={500} className="object-contain rounded-lg"/>
        </div>
      </div>
    </main>
  );
}