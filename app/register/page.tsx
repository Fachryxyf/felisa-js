// app/register/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');

  // State untuk loading dan pesan
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message + ' Anda akan diarahkan ke halaman login.');
        // Redirect ke halaman login setelah 2 detik
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan. Gagal mendaftar.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-brand-background">
      <div className="relative flex w-full max-w-4xl m-4 bg-white shadow-lg rounded-2xl">
        
        <div className="relative items-center justify-center hidden w-1/2 p-8 md:flex bg-cyan-50 rounded-l-2xl">
          <Image 
            src="https://cdn.pixabay.com/photo/2025/06/09/11/10/ai-generated-9649730_1280.jpg"
            alt="Register Illustration"
            width={400}
            height={400}
            className="object-contain"
          />
        </div>

        <div className="w-full p-8 md:w-1/2">
          <h2 className="text-3xl font-bold text-brand-text">Create New Account</h2>
          
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {/* Tampilkan pesan error atau sukses */}
            {error && <p className="p-3 text-center text-red-800 bg-red-100 rounded-lg">{error}</p>}
            {success && <p className="p-3 text-center text-green-800 bg-green-100 rounded-lg">{success}</p>}

            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700">First Name</label><input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-4 py-3 mt-1 text-gray-700 bg-gray-100 border rounded-lg focus:ring-brand-primary focus:border-brand-primary" required /></div>
              <div><label className="block text-sm font-medium text-gray-700">Last Name</label><input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-4 py-3 mt-1 text-gray-700 bg-gray-100 border rounded-lg focus:ring-brand-primary focus:border-brand-primary" required /></div>
            </div>
            <div><label className="block text-sm font-medium text-gray-700">Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 mt-1 text-gray-700 bg-gray-100 border rounded-lg focus:ring-brand-primary focus:border-brand-primary" required /></div>
            <div><label className="block text-sm font-medium text-gray-700">Mobile Number</label><input type="tel" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} className="w-full px-4 py-3 mt-1 text-gray-700 bg-gray-100 border rounded-lg focus:ring-brand-primary focus:border-brand-primary" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 mt-1 text-gray-700 bg-gray-100 border rounded-lg focus:ring-brand-primary focus:border-brand-primary" required /></div>
            
            <div className="pt-4">
              <button type="submit" disabled={isLoading} className="w-full px-4 py-3 font-semibold text-white transition-colors duration-300 bg-brand-primary rounded-lg hover:bg-orange-500 disabled:bg-orange-300">
                {isLoading ? 'Mendaftarkan...' : 'Create Account'}
              </button>
            </div>
          </form>

          <p className="mt-6 text-sm text-center">
            Do you have an account?{' '}
            <Link href="/login" className="font-medium text-brand-primary hover:text-orange-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}