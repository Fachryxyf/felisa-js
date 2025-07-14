'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useLoading } from '../../context/LoadingContext';
import Modal from '../../components/Modal';
import type { Product } from '@prisma/client';

export default function ProdukListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const { showLoading, hideLoading } = useLoading();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const fetchProducts = useCallback(async () => {
    showLoading();
    try {
      const res = await fetch('/api/produk');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    showLoading();
    try {
      await fetch(`/api/produk/${productToDelete.id}`, { method: 'DELETE' });
      // Refresh data setelah hapus
      fetchProducts();
    } catch (error) {
        console.error("Failed to delete product:", error);
    } finally {
      hideLoading();
      setIsModalOpen(false);
      setProductToDelete(null);
    }
  };

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-brand-text">Manajemen Produk</h2>
            <p className="mt-2 text-gray-600">Tambah, ubah, atau hapus produk Anda.</p>
          </div>
          <Link href="/admin/produk/baru" className="px-5 py-2 font-semibold text-white bg-brand-primary rounded-lg hover:bg-orange-500 transition-colors">
            + Tambah Produk
          </Link>
        </div>
        
        <div className="overflow-hidden bg-white rounded-xl shadow-md">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-brand-text uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-brand-text uppercase tracking-wider">Nama Produk</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-brand-text uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map(product => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-500">{product.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-800">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link href={`/admin/produk/edit/${product.id}`} className="text-indigo-600 hover:text-indigo-900">
                      Edit
                    </Link>
                    <button onClick={() => handleDeleteClick(product)} className="ml-4 text-red-600 hover:text-red-900">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Konfirmasi Hapus">
        <p>Apakah Anda yakin ingin menghapus produk **{productToDelete?.name}**? Tindakan ini tidak dapat diurungkan.</p>
        <div className="flex justify-end mt-6 gap-4">
            <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">Batal</button>
            <button onClick={confirmDelete} className="px-6 py-2 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700">Hapus</button>
        </div>
      </Modal>
    </>
  );
}