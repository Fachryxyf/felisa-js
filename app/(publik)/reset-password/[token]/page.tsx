// app/(publik)/reset-password/[id]/page.tsx
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const params = useParams();
  const router = useRouter();
  // Kita asumsikan params.id adalah string, karena datang dari URL
  const userId = params.id as string;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok.');
      return;
    }
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Kirim userId bukan lagi token
        body: JSON.stringify({ userId: parseInt(userId), password }),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message + ' Anda akan diarahkan ke halaman login.');
        setTimeout(() => router.push('/login'), 3000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error("Reset password failed:", err);
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="text-3xl font-bold text-center text-brand-text">Reset Password</h2>
          <p className="mt-2 text-center text-gray-600">Masukkan password baru Anda.</p>
        </div>
        
        {!success ? (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password Baru</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 mt-1 text-gray-700 bg-gray-100 border rounded-lg"/>
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">Konfirmasi Password Baru</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full px-4 py-3 mt-1 text-gray-700 bg-gray-100 border rounded-lg"/>
            </div>
            
            {error && <p className="text-center text-red-600">{error}</p>}

            <div>
              <button type="submit" disabled={isLoading} className="w-full px-4 py-3 font-semibold text-white bg-brand-primary rounded-lg">
                {isLoading ? 'Menyimpan...' : 'Reset Password'}
              </button>
            </div>
          </form>
        ) : (
          <p className="p-3 text-center text-green-800 bg-green-100 rounded-lg">{success}</p>
        )}
        
        {/* Navigasi Kembali ke Login ditambahkan di sini */}
        <div className="text-sm text-center">
            <Link href="/login" className="font-medium text-brand-primary hover:underline">
                Kembali ke Login
            </Link>
        </div>
      </div>
    </div>
  );
}