// app/admin/penilaian/page.tsx
'use client'; // Jadikan Client Component

import { useState, useEffect } from 'react';
import Modal from '../../components/Modal';

// Tipe data untuk review
type ReviewWithDetails = {
  id: number;
  comment: string;
  rating: number;
  user: { name: string };
  product: { name: string };
}

// Komponen Ikon Bintang (tidak berubah)
const StarIcon = ({ filled }: { filled: boolean }) => ( <svg className={`w-6 h-6 ${filled ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>);
// Komponen Ikon Hapus (baru)
const TrashIcon = () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>);


export default function PenilaianPage() {
  const [reviews, setReviews] = useState<ReviewWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State untuk modal konfirmasi hapus
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<number | null>(null);

  // Fungsi untuk mengambil data dari API
  const fetchReviews = async () => {
    setIsLoading(true);
    const res = await fetch('/api/reviews');
    const data = await res.json();
    setReviews(data);
    setIsLoading(false);
  };

  // Ambil data saat komponen pertama kali dimuat
  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDeleteClick = (id: number) => {
    setReviewToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!reviewToDelete) return;
    
    await fetch(`/api/reviews/${reviewToDelete}`, { method: 'DELETE' });
    
    // Update UI dengan menghapus review dari state
    setReviews(reviews.filter(r => r.id !== reviewToDelete));
    
    // Tutup modal
    setIsModalOpen(false);
    setReviewToDelete(null);
  };

  if (isLoading) return <p className="text-gray-500">Memuat data ulasan...</p>;

  return (
    <>
      <div>
        <h2 className="text-3xl font-bold text-brand-text">Data Penilaian Pelanggan</h2>
        <p className="mt-2 text-gray-600">Berikut adalah ulasan yang diberikan oleh pelanggan Anda.</p>
        
        <div className="mt-8 space-y-6">
          {reviews.length === 0 ? (
            <p className="text-gray-500">Belum ada ulasan yang masuk.</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="p-6 bg-white rounded-xl shadow-md">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center"><span className="text-xl font-bold text-gray-500">{review.user.name.charAt(0)}</span></div>
                  <div className="flex-1">
                    <p className="font-bold text-brand-text">{review.user.name}</p>
                    <p className="text-sm text-gray-500">Memberi ulasan untuk: <span className="font-semibold">{review.product.name}</span></p>
                    <div className="flex items-center mt-1">{[...Array(5)].map((_, i) => ( <StarIcon key={i} filled={i < review.rating} />))}</div>
                    <p className="mt-3 text-gray-600">{review.comment}</p>
                  </div>
                  <button onClick={() => handleDeleteClick(review.id)} className="p-2 text-red-500 rounded-full hover:bg-red-100"><TrashIcon /></button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Konfirmasi Hapus">
        <p>Apakah Anda yakin ingin menghapus ulasan ini secara permanen?</p>
        <div className="flex justify-end mt-6 gap-4">
            <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">Batal</button>
            <button onClick={confirmDelete} className="px-6 py-2 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700">Hapus</button>
        </div>
      </Modal>
    </>
  );
}