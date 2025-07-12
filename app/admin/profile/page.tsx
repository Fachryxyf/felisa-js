// app/admin/profile/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Modal from '../../components/Modal';

export default function ProfilePage() {
  // State untuk data dari DB
  const [originalData, setOriginalData] = useState({ name: '', phone: '' });
  
  // State untuk form utama
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dbImage, setDbImage] = useState<string | null>(null);
  const email = 'admin@gmail.com';
  
  // Ref untuk file input
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State untuk pesan dan loading
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // State untuk modal password
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const router = useRouter();

  // Mengambil data profil saat halaman dimuat
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/user/profile');
        if (res.ok) {
          const data = await res.json();
          setFullName(data.name || '');
          setPhone(data.phone || '');
          setDbImage(data.image || null);
          setOriginalData({ name: data.name || '', phone: data.phone || '' });
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
        setError("Gagal memuat data profil.");
      }
    };
    fetchProfile();
  }, []);

  // Handler untuk perubahan gambar
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handler untuk submit form utama (update profil)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    let imageBase64: string | null = null;
    if (selectedFile) {
      imageBase64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onload = () => resolve(reader.result as string);
      });
    }

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: fullName, phone, image: imageBase64 }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(data.message);
        if (data.user.image) setDbImage(data.user.image);
        setOriginalData({ name: data.user.name, phone: data.user.phone });
        setImagePreview(null);
        setSelectedFile(null);
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
  
  // Handler untuk ubah password
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

  // Handler untuk tombol Cancel
  const handleCancel = () => {
    setFullName(originalData.name);
    setPhone(originalData.phone);
    setError('');
    setSuccess('');
  };
  
  // Handler untuk Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Failed to logout:', error);
    } finally {
      router.push('/login');
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
                src={imagePreview || dbImage || "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png"} 
                alt="Profile Picture"
                width={128}
                height={128}
                className="rounded-full object-cover w-32 h-32 border-4 border-orange-100"
              />
               <input 
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full mt-4 px-4 py-2 font-semibold text-brand-primary transition-colors duration-300 bg-orange-100 border border-orange-200 rounded-lg hover:bg-orange-200"
              >
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
                
                {/* BAGIAN UBAH PASSWORD YANG DIKEMBALIKAN */}
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
                  <button type="button" onClick={handleCancel} className="px-6 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">
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