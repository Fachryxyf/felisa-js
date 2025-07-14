// app/admin/produk/baru/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoading } from '../../../context/LoadingContext';
import Link from 'next/link';
import Image from 'next/image';

export default function TambahProdukPage() {
  const [name, setName] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const router = useRouter();
  const { showLoading, hideLoading } = useLoading();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !image) {
      setError('Nama produk dan gambar wajib diisi.');
      return;
    }

    showLoading();
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('image', image);

      const res = await fetch('/api/produk', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Produk berhasil ditambahkan! Mengarahkan kembali...');
        setTimeout(() => {
          router.push('/admin/produk');
          router.refresh(); // Refresh halaman daftar produk
        }, 2000);
      } else {
        setError(data.message || 'Gagal menambahkan produk.');
      }
    } catch (err) {
      console.error("Failed to add product:", err);
      setError('Terjadi kesalahan koneksi.');
    } finally {
      hideLoading();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-brand-text">Tambah Produk Baru</h2>
          <p className="mt-2 text-gray-600">Isi detail produk di bawah ini.</p>
        </div>
        <Link href="/admin/produk" className="text-sm font-semibold text-gray-600 hover:text-brand-primary">
          &larr; Kembali ke Daftar Produk
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="p-8 bg-white rounded-xl shadow-md space-y-6">
        {error && <p className="p-3 text-center text-red-800 bg-red-100 rounded-lg">{error}</p>}
        {success && <p className="p-3 text-center text-green-800 bg-green-100 rounded-lg">{success}</p>}

        <div>
          <label className="block text-sm font-medium text-gray-700">Nama Produk</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 mt-1 text-gray-700 bg-gray-100 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Gambar Produk</label>
          <input
            type="file"
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-brand-primary hover:file:bg-orange-100"
            accept="image/*"
            required
          />
        </div>
        
        {imagePreview && (
            <div>
                <p className="text-sm font-medium text-gray-700">Preview Gambar:</p>
                <div className="mt-2 border rounded-lg p-2 w-40 h-40 relative">
                    <Image src={imagePreview} alt="Preview" layout="fill" className="object-contain" />
                </div>
            </div>
        )}

        <div className="flex justify-end pt-4">
          <button type="submit" className="px-6 py-2 font-semibold text-white bg-brand-primary rounded-lg hover:bg-orange-500">
            Simpan Produk
          </button>
        </div>
      </form>
    </div>
  );
}