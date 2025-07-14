// app/(publik)/produk/[id]/page.tsx

import Image from 'next/image';
import Link from 'next/link';
import prisma from '../../../../lib/prisma';
import { notFound } from 'next/navigation';
import ReviewForm from './ReviewForm';
import { cookies } from 'next/headers';
import * as jose from 'jose';
import { HiArrowLeft } from 'react-icons/hi';
import type { Prisma } from '@prisma/client';

// Tipe data untuk payload JWT
type UserPayload = {
  readonly userId: number;
  readonly name: string;
  readonly role: 'ADMIN' | 'CUSTOMER';
};

// Komponen ikon bintang
const StarIcon = ({ filled }: { filled: boolean }) => (
    <svg className={`w-5 h-5 ${filled ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

// Fungsi untuk mengambil data produk dan ulasannya
async function getProductData(productId: number) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        reviews: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    return product;
}

// Mendapatkan tipe data spesifik dari hasil query Prisma
type ProductWithReviews = Prisma.PromiseReturnType<typeof getProductData>;
type ReviewFromQuery = NonNullable<ProductWithReviews>['reviews'][number];

// Fungsi untuk menghitung rata-rata rating
const calculateAverageRating = (review: ReviewFromQuery) => {
  const total = review.ratingWaktu + review.ratingHarga + review.ratingBahan + review.ratingDesain + review.ratingPackaging;
  return Math.round(total / 5);
};

// Pemetaan gambar produk
const productImageMap: { [key: string]: string } = {
  'Bucket Bunga': '/images/bucket bunga pict.png',
  'Bucket Uang': '/images/bucket uang 2.jpg',
  'Bucket Barang': '/images/bucket snack pict.png',
  'Custom': '/images/bucket custom pict.png'
};

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  if (!params.id || isNaN(parseInt(params.id))) notFound();
  const productId = parseInt(params.id);

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('auth_session');
  
  let loggedInUser: UserPayload | null = null;
  if (sessionCookie?.value) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      const { payload } = await jose.jwtVerify(sessionCookie.value, secret);
      loggedInUser = payload as UserPayload;
    } catch (err) {
      console.error("Token verification failed:", err);
    }
  }

  const product = await getProductData(productId);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-primary font-semibold transition-colors">
            <HiArrowLeft />
            Kembali ke Katalog
        </Link>
      </div>
      <div className="p-8 bg-white rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="relative w-full h-96"><Image src={product.imageUrl || productImageMap[product.name] || "/images/header.png"} alt={product.name} fill className="object-cover rounded-lg" sizes="(max-width: 768px) 100vw, 50vw"/></div>
          <div className="pt-4"><h1 className="text-4xl font-bold text-brand-text">{product.name}</h1><p className="mt-4 text-gray-600">Deskripsi singkat tentang {product.name}.</p></div>
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-brand-text">Ulasan Pelanggan</h2>
        <div className="mt-6 space-y-6">
          {product.reviews.length > 0 ? (
            product.reviews.map((review) => (
              <div key={review.id} className="p-4 border rounded-lg bg-white shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">{review.reviewerName?.charAt(0) || '?'}</div>
                  <div>
                    <p className="font-semibold text-brand-text">{review.reviewerName}</p>
                    <div className="flex items-center">{[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < calculateAverageRating(review)} />)}</div>
                  </div>
                </div>
                <p className="mt-3 text-gray-700">{review.comment}</p>
              </div>
            ))
          ) : (
            <div className="p-8 text-center bg-white border rounded-lg"><p className="text-gray-500">Belum ada ulasan untuk produk ini.</p></div>
          )}
        </div>
      </div>
      <div className="my-12">
        {loggedInUser?.role === 'CUSTOMER' ? (<ReviewForm productId={product.id} />) : (<div className="p-6 text-center bg-white border rounded-lg shadow-md"><h3 className="text-xl font-semibold text-brand-text">Ingin Memberi Ulasan?</h3><p className="mt-2 text-gray-600">Silakan masuk atau daftar untuk memberikan ulasan Anda.</p>{!loggedInUser && <Link href="/login" className="inline-block px-6 py-2 mt-4 font-semibold text-white bg-brand-primary rounded-lg hover:bg-orange-500">Login atau Daftar</Link>}</div>)}
      </div>
    </div>
  );
}