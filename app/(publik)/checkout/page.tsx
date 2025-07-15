// app/(publik)/checkout/page.tsx
'use client';

import { useState } from 'react';
import { useApp } from '../../context/AppContext'; // PERBAIKAN: Ganti useCart menjadi useApp
import { useLoading } from '../../context/LoadingContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

export default function CheckoutPage() {
  const { cartItems, totalAmount, clearCart, cartCount } = useApp(); // PERBAIKAN: Gunakan useApp()
  const { showLoading, hideLoading } = useLoading();
  const router = useRouter();
  
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePlaceOrder = async () => {
    if (!customerName || !phoneNumber) {
      setError('Nama dan nomor WhatsApp wajib diisi.');
      return;
    }
    
    showLoading();
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          phoneNumber,
          cartItems,
          totalAmount,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Pesanan berhasil dibuat! Anda akan diarahkan ke halaman utama.');
        clearCart();
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else {
        setError(data.message || 'Gagal membuat pesanan.');
      }
    } catch (err) {
      console.error('Failed to place order:', err);
      setError('Terjadi kesalahan koneksi.');
    } finally {
      hideLoading();
    }
  };

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-brand-text">Checkout</h1>
        <Link href="/keranjang" className="text-sm font-semibold text-gray-600 hover:text-brand-primary">
          &larr; Kembali ke Keranjang
        </Link>
      </div>
      
      {success ? (
        <div className="p-8 text-center bg-green-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-green-800">Terima Kasih!</h2>
            <p className="mt-2 text-green-700">{success}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Kolom Detail Pesanan */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold border-b pb-4 mb-4">Pesanan Anda</h2>
            <div className="space-y-3">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between">
                  <p>{item.name} <span className="text-gray-500">x{item.quantity}</span></p>
                  <p>{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-4 mt-4">
              <p>Total</p>
              <p>{formatCurrency(totalAmount)}</p>
            </div>
          </div>

          {/* Kolom Form Pelanggan */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold border-b pb-4 mb-4">Detail Pengiriman</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full px-4 py-2 mt-1 bg-gray-100 border rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nomor WhatsApp</label>
                <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full px-4 py-2 mt-1 bg-gray-100 border rounded-lg" required />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="pt-2">
                  <button 
                      onClick={handlePlaceOrder}
                      disabled={!customerName || !phoneNumber || cartItems.length === 0}
                      className="w-full py-3 font-semibold text-white bg-brand-primary rounded-lg hover:bg-orange-500 disabled:bg-gray-300"
                  >
                      Buat Pesanan Sekarang
                  </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}