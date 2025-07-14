// app/admin/produk/page.tsx

import prisma from '../../../lib/prisma';
import Link from 'next/link';

export default async function ProdukListPage() {
  const products = await prisma.product.findMany({
    orderBy: { id: 'asc' },
  });

  return (
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
                  <a href="#" className="text-indigo-600 hover:text-indigo-900">Edit</a>
                  <a href="#" className="ml-4 text-red-600 hover:text-red-900">Hapus</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}