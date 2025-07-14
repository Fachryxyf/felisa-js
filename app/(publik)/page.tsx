// app/(publik)/page.tsx

import Image from 'next/image';
import Link from 'next/link';
import prisma from '../../lib/prisma'; // Impor prisma client

// Membuat pemetaan nama produk ke path gambar
const productImageMap: { [key: string]: string } = {
  'Bucket Bunga': '/images/bucket bunga pict.png',
  'Bucket Uang': '/images/bucket bunga uang.png',
  'Bucket Barang': '/images/bucket snack pict.png',
  'Custom': '/images/bucket custom pict.png'
};

export default async function HomePage() {
  const products = await prisma.product.findMany();

  return (
    <div className="container mx-auto">
      <div className="p-8 text-center bg-brand-background rounded-lg">
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
            <div className="relative w-full h-64">
              <Image
                src={productImageMap[product.name] || "/images/header.png"}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold text-brand-text group-hover:text-brand-primary">
                {product.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}