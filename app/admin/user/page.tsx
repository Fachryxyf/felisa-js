'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useLoading } from '../../context/LoadingContext';
import Modal from '../../components/Modal';
import type { User, Role } from '@prisma/client';

const getRoleChip = (status: Role) => {
  switch (status) {
    case 'ADMIN': return 'bg-red-100 text-red-800';
    case 'CUSTOMER': return 'bg-sky-100 text-sky-800';
  }
};

export default function UserListPage() {
  const [users, setUsers] = useState<User[]>([]);
  const { showLoading, hideLoading } = useLoading();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const fetchUsers = useCallback(async () => {
    showLoading();
    try {
      const res = await fetch('/api/user');
      // Pengecekan penting untuk memastikan respons sukses
      if (!res.ok) {
        throw new Error('Gagal mengambil data dari server');
      }
      const data = await res.json();
      // Pastikan data adalah array sebelum di-set
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setUsers([]); // Jika data bukan array, set ke array kosong
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]); // Set ke array kosong jika terjadi error
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    showLoading();
    try {
      await fetch(`/api/user/${userToDelete.id}`, { method: 'DELETE' });
      fetchUsers(); // Ambil data terbaru setelah hapus
    } catch (error) {
      console.error("Failed to delete user:", error);
    } finally {
      hideLoading();
      setIsModalOpen(false);
      setUserToDelete(null);
    }
  };

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-brand-text">Manajemen User</h2>
          <p className="mt-2 text-gray-600">Kelola semua pengguna terdaftar.</p>
        </div>
        <div className="overflow-hidden bg-white rounded-xl shadow-md">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-brand-text uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-brand-text uppercase tracking-wider">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-brand-text uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-brand-text uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-brand-text uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-500">{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-800">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${getRoleChip(user.role)}`}>{user.role}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link href={`/admin/user/edit/${user.id}`} className="text-indigo-600 hover:text-indigo-900">Edit</Link>
                    <button onClick={() => handleDeleteClick(user)} className="ml-4 text-red-600 hover:text-red-900">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Konfirmasi Hapus">
        <p>Apakah Anda yakin ingin menghapus pengguna **{userToDelete?.name}**?</p>
        <div className="flex justify-end mt-6 gap-4">
            <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg">Batal</button>
            <button onClick={confirmDelete} className="px-6 py-2 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700">Hapus</button>
        </div>
      </Modal>
    </>
  );
}