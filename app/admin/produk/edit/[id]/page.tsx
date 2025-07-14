'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useLoading } from '../../../../context/LoadingContext';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@prisma/client';

export default function EditProdukPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const router = useRouter();
  const params = useParams();
  const { showLoading, hideLoading } = useLoading();
  const id = params.id as string;

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        showLoading();
        try {
          const res = await fetch(`/api/produk/${id}`);
          if (res.ok) {
            const data: Product = await res.json();
            setName(data.name);
            setDescription(data.description || '');
            setPrice(data.price.toString());
            setStock(data.stock.toString());
            setExistingImageUrl(data.imageUrl || null);
          } else {
            setError('Gagal memuat data produk.');
          }
        } catch (error) {
          console.error("Failed to fetch product:", error);
          setError('Terjadi kesalahan saat memuat data.');
        } finally {
          hideLoading();
        }
      };
      fetchProduct();
    }
  }, [id, showLoading, hideLoading]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    showLoading();
    setError('');
    setSuccess('');
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('stock', stock);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const res = await fetch(`/api/produk/${id}`, {
        method: 'PATCH',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess('Produk berhasil diperbarui! Mengarahkan kembali...');
        setTimeout(() => {
          router.push('/admin/produk');
          router.refresh();
        }, 2000);
      } else {
        setError(data.message || 'Gagal memperbarui produk.');
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan.');
    } finally {
      hideLoading();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-brand-text">Edit Produk</h2>
          <p className="mt-2 text-gray-600">Ubah detail produk di bawah ini.</p>
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
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 mt-1 bg-gray-100 border rounded-lg" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full px-4 py-3 mt-1 bg-gray-100 border rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700">Harga</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-4 py-3 mt-1 bg-gray-100 border rounded-lg" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Stok</label>
                <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full px-4 py-3 mt-1 bg-gray-100 border rounded-lg" required />
            </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Ganti Gambar Produk</label>
          <input type="file" onChange={handleImageChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-brand-primary hover:file:bg-orange-100" accept="image/*" />
        </div>
        
        <div>
            <p className="text-sm font-medium text-gray-700">Gambar Saat Ini:</p>
            <div className="mt-2 border rounded-lg p-2 w-40 h-40 relative">
                <Image src={imagePreview || existingImageUrl || '/images/header.png'} alt="Product Preview" fill className="object-contain" />
            </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" className="px-6 py-2 font-semibold text-white bg-brand-primary rounded-lg hover:bg-orange-500">
            Update Produk
          </button>
        </div>
      </form>
    </div>
  );
}