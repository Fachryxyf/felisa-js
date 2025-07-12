// app/admin/profile/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
// 1. Impor useRouter
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [fullName, setFullName] = useState('Admin Ayud Craft');
  const email = 'admin@gmail.com';
  const [phone, setPhone] = useState('089777777777');

  // 2. Inisialisasi router
  const router = useRouter();

  // 3. Buat fungsi untuk handle logout
  const handleLogout = async () => {
    try {
      // Panggil API logout
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Failed to logout:', error);
    } finally {
      // Arahkan ke halaman login setelah selesai
      router.push('/login');
    }
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-brand-text">Pengaturan Akun</h2>
      <p className="mt-2 text-gray-600">Kelola informasi profil dan keamanan akun Anda.</p>

      <div className="p-8 mt-8 bg-white rounded-xl shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          <div className="flex flex-col items-center col-span-1">
            <Image
              src="https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png" 
              alt="Profile Picture"
              width={128}
              height={128}
              className="rounded-full object-cover border-4 border-orange-100"
            />
            <button className="w-full mt-4 px-4 py-2 font-semibold text-brand-primary transition-colors duration-300 bg-orange-100 border border-orange-200 rounded-lg hover:bg-orange-200">
              Ubah Foto
            </button>
          </div>

          <div className="col-span-2">
            <form className="space-y-6">
              <div><label className="block text-sm font-medium text-gray-700">Nama Panjang</label><input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-3 mt-1 text-gray-700 bg-gray-100 border rounded-lg focus:ring-brand-primary focus:border-brand-primary"/></div><div><label className="block text-sm font-medium text-gray-700">Email</label><input type="email" value={email} readOnly className="w-full px-4 py-3 mt-1 text-gray-500 bg-gray-200 border rounded-lg cursor-not-allowed"/></div><div><label className="block text-sm font-medium text-gray-700">Nomor Handphone</label><input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 mt-1 text-gray-700 bg-gray-100 border rounded-lg focus:ring-brand-primary focus:border-brand-primary"/></div><div><label className="block text-sm font-medium text-gray-700">Password</label><div className="flex items-center gap-4"><input type="password" value="N********" readOnly className="w-full px-4 py-3 mt-1 text-gray-500 bg-gray-200 border rounded-lg cursor-not-allowed"/><button type="button" className="px-4 py-3 mt-1 font-semibold text-brand-primary whitespace-nowrap bg-orange-100 rounded-lg hover:bg-orange-200">Ubah password</button></div></div><div className="flex justify-end pt-4 space-x-4"><button type="button" className="px-6 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button><button type="submit" className="px-6 py-2 font-semibold text-white bg-brand-primary rounded-lg hover:bg-orange-500">Update</button></div>
            </form>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-6">
        <button 
          onClick={handleLogout}
          className="px-6 py-2 font-semibold text-red-600 bg-red-100 rounded-lg hover:bg-red-200"
        >
          Keluar
        </button>
      </div>
    </div>
  )
}