// app/admin/dashboard/DashboardClient.tsx
'use client';

import { HiOutlineUsers, HiOutlineCollection, HiOutlineCube, HiOutlineSparkles } from 'react-icons/hi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Product } from '@prisma/client';
import Link from 'next/link';

type OrderData = {
    date: string;
    count: number;
}

// Tipe baru untuk data peringkat SAW
type SawRank = {
    name: string;
    score: number;
}

type DashboardProps = {
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    sawRank: SawRank[]; // Menerima array peringkat
    orderTrend: OrderData[];
    lowStockProducts: Product[];
}

export default function DashboardClient({
    totalUsers,
    totalProducts,
    totalOrders,
    sawRank,
    orderTrend,
    lowStockProducts
}: DashboardProps) {

    const stats = [
        { name: 'Total Pengguna', value: totalUsers, icon: <HiOutlineUsers size={28} className="text-blue-500" /> },
        { name: 'Total Produk', value: totalProducts, icon: <HiOutlineCube size={28} className="text-green-500" /> },
        { name: 'Total Pesanan', value: totalOrders, icon: <HiOutlineCollection size={28} className="text-yellow-500" /> },
    ];

    return (
        <div>
            <h2 className="text-3xl font-bold text-brand-text">Selamat Datang di Dasbor Admin!</h2>
            <p className="mt-2 text-gray-600">
                Lihat ringkasan aktivitas toko dan analisis preferensi pelanggan di sini.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {stats.map(stat => (
                    <div key={stat.name} className="p-6 bg-white rounded-xl shadow-md flex items-start gap-4">
                        <div className="p-3 bg-gray-100 rounded-lg">{stat.icon}</div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                            <p className="text-2xl font-bold text-brand-text">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                <div className="lg:col-span-2 p-6 bg-white rounded-xl shadow-md">
                    <h3 className="font-bold text-lg text-brand-text mb-4">Tren Pesanan (7 Hari Terakhir)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={orderTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis allowDecimals={false} /><Tooltip /><Legend /><Line type="monotone" dataKey="count" name="Jumlah Pesanan" stroke="#F97316" strokeWidth={2} activeDot={{ r: 8 }} /></LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Blok Peringkat SAW */}
                <div className="p-6 bg-white rounded-xl shadow-md">
                    <div className="flex justify-between items-center mb-4">
                         <h3 className="font-bold text-lg text-brand-text">Peringkat Teratas (SAW)</h3>
                         <Link href="/admin/analisis-saw" className="text-sm font-semibold text-brand-primary hover:underline">Lihat Semua</Link>
                    </div>
                    <ul className="space-y-4">
                        {sawRank.length > 0 ? sawRank.slice(0, 3).map((product, index) => (
                            <li key={product.name} className="flex items-center gap-4 text-sm">
                                <span className={`flex items-center justify-center w-8 h-8 font-bold rounded-full ${index === 0 ? 'bg-amber-400 text-white' : 'bg-gray-200 text-gray-700'}`}>{index + 1}</span>
                                <span className="flex-grow font-semibold text-gray-800">{product.name}</span>
                                <span className="font-bold text-green-600">{product.score.toFixed(3)}</span>
                            </li>
                        )) : <p className="text-sm text-gray-500">Belum ada data untuk dianalisis.</p>}
                    </ul>
                </div>
            </div>

            {/* Peringatan Stok Rendah */}
            <div className="mt-8 p-6 bg-white rounded-xl shadow-md">
                <h3 className="font-bold text-lg text-brand-text mb-4">Peringatan Stok Rendah (&lt; 5)</h3>
                <ul className="space-y-3">
                    {lowStockProducts.length > 0 ? lowStockProducts.map(product => (
                        <li key={product.id} className="flex justify-between items-center text-sm">
                            <span className="text-gray-700">{product.name}</span>
                            <span className="font-bold text-red-600">Sisa {product.stock}</span>
                        </li>
                    )) : (<p className="text-sm text-gray-500">Tidak ada produk dengan stok rendah.</p>)}
                </ul>
            </div>
        </div>
    );
}