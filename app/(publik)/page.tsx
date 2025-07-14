// app/(publik)/page.tsx

import Image from 'next/image';
import Link from 'next/link';
import prisma from '../../lib/prisma';

// Pemetaan gambar produk (tidak berubah)
const productImageMap: { [key: string]: string } = {
  'Bucket Bunga': '/images/bucket bunga pict.png',
  'Bucket Uang': '/images/bucket uang 2.jpg',
  'Bucket Barang': '/images/bucket snack pict.png',
  'Custom': '/images/bucket custom pict.png'
};

// Fungsi untuk memformat mata uang
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export default async function HomePage() {
  const products = await prisma.product.findMany();

  return (
    <div className="container mx-auto">
      <div className="p-8 text-center bg-orange-50 rounded-lg">
        <h2 className="text-4xl font-bold text-brand-text">Pilih Bucket Impianmu</h2>
        <p className="mt-2 text-gray-600">Beri ulasan untuk membantu kami menjadi lebih baik!</p>
      </div>

      <div className="grid grid-cols-1 gap-8 mt-12 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <Link 
            href={`/produk/${product.id}`} 
            key={product.id} 
            className="block overflow-hidden bg-white border rounded-lg shadow-md group hover:shadow-xl transition-shadow"
          >
            <div className="relative w-full h-64 bg-gray-200">
              <Image
                src={product.imageUrl || productImageMap[product.name] || "/images/header.png"}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {/* Tampilkan label diskon atau stok habis */}
              {product.discountPrice && (
                <div className="absolute top-2 right-2 px-3 py-1 text-xs font-bold text-white bg-red-500 rounded-full">
                  DISKON
                </div>
              )}
              {product.stock === 0 && (
                <div className="absolute top-2 left-2 px-3 py-1 text-xs font-bold text-gray-800 bg-gray-200 rounded-full">
                  STOK HABIS
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold text-brand-text group-hover:text-brand-primary">
                {product.name}
              </h3>
              {/* Tampilkan harga */}
              <div className="mt-2">
                {product.discountPrice ? (
                  <div className="flex items-baseline gap-2">
                    <p className="text-xl font-bold text-red-600">{formatCurrency(product.discountPrice)}</p>
                    <p className="text-sm text-gray-500 line-through">{formatCurrency(product.price)}</p>
                  </div>
                ) : (
                  <p className="text-xl font-bold text-brand-text">{formatCurrency(product.price)}</p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}