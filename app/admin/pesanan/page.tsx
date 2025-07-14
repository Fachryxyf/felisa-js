// app/admin/pesanan/page.tsx

import prisma from '../../../lib/prisma';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

// Fungsi untuk memformat mata uang
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Fungsi untuk memberi warna pada status pesanan
const getStatusChip = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'processing':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default async function PesananPage() {
  // Ambil semua data pesanan dari database
  const orders = await prisma.order.findMany({
    orderBy: { orderDate: 'desc' },
    include: {
      items: {
        include: {
          product: true, // Ambil juga data produk di setiap item pesanan
        },
      },
    },
  });

  return (
    <div>
      <h2 className="text-3xl font-bold text-brand-text">Daftar Pesanan</h2>
      <p className="mt-2 text-gray-600">Berikut adalah daftar semua pesanan yang masuk.</p>
      
      <div className="mt-8 overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-brand-text uppercase tracking-wider">ID Pesanan</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-brand-text uppercase tracking-wider">Nama Pelanggan</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-brand-text uppercase tracking-wider">Tanggal</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-brand-text uppercase tracking-wider">Produk</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-brand-text uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-brand-text uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.length === 0 ? (
                <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-500">Belum ada data pesanan.</td>
                </tr>
            ) : (
                orders.map(order => (
                    <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-500">#{order.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-800">{order.customerName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{format(new Date(order.orderDate), "d MMMM yyyy", { locale: id })}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{order.items.map(item => `${item.product.name} (x${item.quantity})`).join(', ')}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-800">{formatCurrency(order.totalAmount)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusChip(order.status)}`}>
                            {order.status}
                        </span>
                        </td>
                    </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}