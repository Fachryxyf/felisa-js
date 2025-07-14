'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useLoading } from '../../../../context/LoadingContext';
import Link from 'next/link';
import type { User, Role } from '@prisma/client';

export default function EditUserPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<Role>('CUSTOMER');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const router = useRouter();
  const params = useParams();
  const { showLoading, hideLoading } = useLoading();
  const id = params.id as string;

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        showLoading();
        try {
          const res = await fetch(`/api/user/${id}`);
          if (res.ok) {
            const data: User = await res.json();
            setName(data.name);
            setPhone(data.phone || '');
            setRole(data.role);
          }
        } catch (error) {
            console.error(`debug`, error);
          setError('Gagal memuat data user.');
        } finally {
          hideLoading();
        }
      };
      fetchUser();
    }
  }, [id, showLoading, hideLoading]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    showLoading();
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`/api/user/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, role }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('User berhasil diperbarui! Mengarahkan kembali...');
        setTimeout(() => router.push('/admin/user'), 2000);
      } else {
        setError(data.message || 'Gagal memperbarui user.');
      }
    } catch (err) {
      // PERBAIKAN: Gunakan variabel 'err' di sini
      console.error("Failed to update user:", err);
      setError('Terjadi kesalahan.');
    } finally {
      hideLoading();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-brand-text">Edit User</h2>
        <Link href="/admin/user" className="text-sm font-semibold text-gray-600 hover:text-brand-primary">
            &larr; Kembali ke Daftar User
        </Link>
      </div>
      
      <form onSubmit={handleSubmit} className="p-8 mt-4 bg-white rounded-xl shadow-md space-y-6">
        {error && <p className="p-3 text-center text-red-800 bg-red-100 rounded-lg">{error}</p>}
        {success && <p className="p-3 text-center text-green-800 bg-green-100 rounded-lg">{success}</p>}

        <div>
          <label className="block text-sm font-medium text-gray-700">Nama</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 mt-1 bg-gray-100 border rounded-lg" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Nomor Telepon</label>
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 mt-1 bg-gray-100 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value as Role)} className="w-full px-4 py-3 mt-1 bg-gray-100 border rounded-lg">
            <option value="CUSTOMER">CUSTOMER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
        
        <div className="flex justify-end pt-4 gap-4">
            <Link href="/admin/user" className="px-6 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">Batal</Link>
            <button type="submit" className="px-6 py-2 font-semibold text-white bg-brand-primary rounded-lg hover:bg-orange-500">Update User</button>
        </div>
      </form>
    </div>
  );
}