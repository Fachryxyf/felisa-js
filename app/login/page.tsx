// app/login/page.tsx

'use client'; 

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
// 1. Impor useRouter untuk redirect
import { useRouter } from 'next/navigation';
import Modal from '../../app/components/Modal';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // 2. Inisialisasi router
  const router = useRouter();

  const handleModalClose = () => {
    setIsModalOpen(false);
    // 3. Arahkan ke dasbor setelah modal ditutup
    router.push('/admin/dashboard');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        setModalMessage(data.message);
        setIsModalOpen(true);
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
    <>
      <main className="flex items-center justify-center min-h-screen bg-brand-background">
        <div className="relative flex w-full max-w-4xl m-4 bg-white shadow-lg rounded-2xl">
          
          <div className="w-full p-8 md:w-1/2">
            <h2 className="text-3xl font-bold text-brand-text">Masuk Sekarang</h2>
            <p className="mt-2 text-gray-600">Hi, Selamat Datang kembali 👋</p>
            
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              {error && <p className="p-3 text-center text-red-800 bg-red-100 rounded-lg">{error}</p>}

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukan Email"
                  className="w-full px-4 py-3 mt-1 text-gray-700 bg-gray-100 border rounded-lg focus:ring-brand-primary focus:border-brand-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Kata Sandi</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukan kata sandi"
                  className="w-full px-4 py-3 mt-1 text-gray-700 bg-gray-100 border rounded-lg focus:ring-brand-primary focus:border-brand-primary"
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input type="checkbox" id="remember-me" className="w-4 h-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary" />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Ingat saya</label>
                </div>
                <div className="text-sm">
                  <Link href="/lupa-sandi" className="font-medium text-brand-primary hover:text-orange-500">
                    Lupa kata sandi?
                  </Link>
                </div>
              </div>
              <div>
                <button type="submit" disabled={isLoading} className="w-full px-4 py-3 font-semibold text-white transition-colors duration-300 bg-brand-primary rounded-lg hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-orange-300">
                  {isLoading ? 'Memproses...' : 'Masuk'}
                </button>
              </div>
              <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="flex-shrink px-2 text-sm text-gray-500">Atau masuk menggunakan</span>
                  <div className="flex-grow border-t border-gray-300"></div>
              </div>
              <div>
                  <button type="button" className="flex items-center justify-center w-full px-4 py-3 font-semibold text-gray-700 transition-colors duration-300 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Image src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google Icon" width={20} height={20} className="mr-2" />
                      Masuk bersama Google
                  </button>
              </div>
            </form>

            <p className="mt-8 text-sm text-center">
              Belum memiliki akun?{' '}
              <Link href="/register" className="font-medium text-brand-primary hover:text-orange-500">
                Daftar akun
              </Link>
            </p>
          </div>

          <div className="relative items-center justify-center hidden w-1/2 p-8 md:flex bg-brand-secondary rounded-r-2xl">
            <Image 
              src="https://cdn.pixabay.com/photo/2023/10/31/23/52/generated-to-8356214_1280.png"
              alt="Login Illustration"
              width={500}
              height={500}
              className="object-contain rounded-lg"
            />
          </div>
        </div>
      </main>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
        title="Login Berhasil!"
      >
        <p className="text-gray-600">{modalMessage}</p>
        <p className="mt-2 text-sm text-gray-500">Anda akan diarahkan ke halaman dasbor.</p>
      </Modal>
    </>
  );
}