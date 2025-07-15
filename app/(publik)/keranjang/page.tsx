// app/(publik)/keranjang/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { HiOutlineTrash } from 'react-icons/hi';

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

export default function KeranjangPage() {
  const { cartItems, updateQuantity, removeFromCart, totalAmount, cartCount } = useCart();

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-brand-text mb-8">Keranjang Belanja Anda</h1>

      {cartCount === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <p className="text-gray-500">Keranjang Anda masih kosong.</p>
          <Link href="/" className="inline-block mt-4 px-6 py-2 font-semibold text-white bg-brand-primary rounded-lg hover:bg-orange-500">
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Daftar Item Keranjang */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center gap-4 border-b pb-4">
                  <div className="relative h-20 w-20 flex-shrink-0">
                    <Image src={item.imageUrl || '/images/header.png'} alt={item.name} fill className="object-cover rounded-md" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold text-brand-text">{item.name}</p>
                    <p className="text-sm text-gray-600">{formatCurrency(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                      className="w-16 text-center border rounded-md"
                    />
                  </div>
                  <p className="font-semibold w-24 text-right">{formatCurrency(item.price * item.quantity)}</p>
                  <button onClick={() => removeFromCart(item.id)} className="text-gray-500 hover:text-red-600">
                    <HiOutlineTrash size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Ringkasan Pesanan */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold border-b pb-4">Ringkasan Pesanan</h2>
              <div className="flex justify-between mt-4">
                <p>Subtotal ({cartCount} item)</p>
                <p className="font-semibold">{formatCurrency(totalAmount)}</p>
              </div>
              <div className="mt-6">
                <Link href="/checkout" className="block w-full text-center py-3 font-semibold text-white bg-brand-primary rounded-lg hover:bg-orange-500">
                Lanjut ke Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}