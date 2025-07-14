// app/(publik)/akun-saya/LogoutButton.tsx
'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Failed to logout:', error);
    } finally {
      // Arahkan ke halaman utama setelah logout
      router.push('/');
      router.refresh(); // Refresh untuk memastikan cookie terhapus
    }
  };

  return (
    <button 
      onClick={handleLogout}
      className="px-6 py-2 font-semibold text-red-600 bg-red-100 rounded-lg hover:bg-red-200"
    >
      Keluar
    </button>
  );
}