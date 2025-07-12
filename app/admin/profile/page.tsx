// app/admin/profile/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Modal from '../../components/Modal';

export default function ProfilePage() {
  // State untuk form update profil
  const [fullName, setFullName] = useState('Admin Ayud Craft');
  const email = 'admin@gmail.com';
  const [phone, setPhone] = useState('089777777777');
  
  // State untuk pesan dan loading
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // State untuk modal ubah password
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const router = useRouter();

  // Fungsi untuk Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Failed to logout:', error);
    } finally {
      router.push('/login');
    }
  };

  // Fungsi untuk Update Profil (Nama & HP)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: fullName, phone }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message);
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error(err);
      setError('Gagal terhubung ke server.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk Ubah Password
  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError('');
    setPasswordSuccess('');

    try {
        const res = await fetch('/api/user/password', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ oldPassword, newPassword }),
        });
        const data = await res.json();

        if (res.ok) {
            setPasswordSuccess(data.message);
            setOldPassword('');
            setNewPassword('');
            // Tutup modal setelah 2 detik
            setTimeout(() => {
                setIsPasswordModalOpen(false);
                setPasswordSuccess('');
            }, 2000);
        } else {
            setPasswordError(data.message);
        }
    } catch (err) {
        console.error(err);
        setPasswordError('Gagal terhubung ke server.');
    } finally {
        setPasswordLoading(false);
    }
  };


  return (
    <>
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
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && <p className="p-3 text-center text-red-800 bg-red-100 rounded-lg">{error}</p>}
                {success && <p className="p-3 text-center text-green-800 bg-green-100 rounded-lg">{success}</p>}

                <div><label className="block text-sm font-medium text-gray-700">Nama Panjang</label><input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-3 mt-1 text-gray-700 bg-gray-100 border rounded-lg focus:ring-brand-primary focus:border-brand-primary"/></div>
                <div><label className="block text-sm font-medium text-gray-700">Email</label><input type="email" value={email} readOnly className="w-full px-4 py-3 mt-1 text-gray-500 bg-gray-200 border rounded-lg cursor-not-allowed"/></div>
                <div><label className="block text-sm font-medium text-gray-700">Nomor Handphone</label><input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 mt-1 text-gray-700 bg-gray-100 border rounded-lg focus:ring-brand-primary focus:border-brand-primary"/></div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <div className="flex items-center gap-4">
                      <input type="password" value="N********" readOnly className="w-full px-4 py-3 mt-1 text-gray-500 bg-gray-200 border rounded-lg cursor-not-allowed"/>
                      <button 
                        type="button" 
                        onClick={() => setIsPasswordModalOpen(true)}
                        className="px-4 py-3 mt-1 font-semibold text-brand-primary whitespace-nowrap bg-orange-100 rounded-lg hover:bg-orange-200"
                      >
                          Ubah password
                      </button>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4 space-x-4">
                  <button type="button" className="px-6 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">
                    Cancel
                  </button>
                  <button type="submit" disabled={isLoading} className="px-6 py-2 font-semibold text-white bg-brand-primary rounded-lg hover:bg-orange-500 disabled:bg-orange-300">
                    {isLoading ? 'Menyimpan...' : 'Update'}
                  </button>
                </div>
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

      {/* Modal untuk Ubah Password */}
      <Modal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
        title="Ubah Password"
      >
        <form onSubmit={handlePasswordChange} className="space-y-4">
            {passwordError && <p className="text-sm text-center text-red-600">{passwordError}</p>}
            {passwordSuccess && <p className="text-sm text-center text-green-600">{passwordSuccess}</p>}
            
            <div>
                <label className="block text-sm font-medium text-gray-700">Password Lama</label>
                <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="w-full px-4 py-3 mt-1 bg-gray-100 border rounded-lg" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Password Baru</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-3 mt-1 bg-gray-100 border rounded-lg" required />
            </div>
            <div className="flex justify-end pt-4 gap-4">
                <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="px-6 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">Batal</button>
                <button type="submit" disabled={passwordLoading} className="px-6 py-2 font-semibold text-white bg-brand-primary rounded-lg hover:bg-orange-500 disabled:bg-orange-300">
                  {passwordLoading ? 'Memeriksa...' : 'Simpan Password'}
                </button>
            </div>
        </form>
      </Modal>
    </>
  );
}