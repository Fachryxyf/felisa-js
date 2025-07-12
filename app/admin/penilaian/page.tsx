// app/admin/penilaian/page.tsx

import prisma from '../../../lib/prisma';

// Komponen untuk ikon bintang (SVG)
const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg className={`w-6 h-6 ${filled ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
);

// 1. Definisikan tipe untuk data review kita
type ReviewWithDetails = {
  id: number;
  comment: string;
  rating: number;
  user: { name: string };
  product: { name: string };
}

export default async function PenilaianPage() {
  
  const reviews = await prisma.review.findMany({
    include: {
      user: true,
      product: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div>
      <h2 className="text-3xl font-bold text-brand-text">Data Penilaian Pelanggan</h2>
      <p className="mt-2 text-gray-600">Berikut adalah ulasan yang diberikan oleh pelanggan Anda.</p>
      
      <div className="mt-8 space-y-6">
        {reviews.length === 0 ? (
          <p className="text-gray-500">Belum ada ulasan yang masuk.</p>
        ) : (
          // 2. Gunakan tipe yang sudah didefinisikan di sini
          reviews.map((review: ReviewWithDetails) => (
            <div key={review.id} className="p-6 bg-white rounded-xl shadow-md">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full">
                    <span className="text-xl font-bold text-gray-500">{review.user.name.charAt(0)}</span>
                  </div>
                </div>
                <div className="ml-6 flex-1">
                  <p className="font-bold text-brand-text">{review.user.name}</p>
                  <p className="text-sm text-gray-500">Memberi ulasan untuk: <span className="font-semibold">{review.product.name}</span></p>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} filled={i < review.rating} />
                    ))}
                  </div>
                  <p className="mt-3 text-gray-600">{review.comment}</p>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}