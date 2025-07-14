// app/(publik)/produk/[id]/ReviewForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// ... (Komponen StarIcon dan RatingRow tidak berubah) ...
const StarIcon = ({ filled, onHover, onClick }: { filled: boolean, onHover: () => void, onClick: () => void }) => ( <svg onMouseEnter={onHover} onClick={onClick} className={`w-7 h-7 cursor-pointer ${filled ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>);
const RatingRow = ({ label, rating, setRating }: { label: string, rating: number, setRating: (r: number) => void }) => { const [hoverRating, setHoverRating] = useState(0); return (<div className="flex items-center justify-between py-2"><p className="text-gray-700">{label}</p><div className="flex" onMouseLeave={() => setHoverRating(0)}>{[1, 2, 3, 4, 5].map(star => (<StarIcon key={star} filled={(hoverRating || rating) >= star} onHover={() => setHoverRating(star)} onClick={() => setRating(star)}/>))}</div></div>);};

export default function ReviewForm({ productId }: { productId: number }) {
  const [ratings, setRatings] = useState({ ratingWaktu: 0, ratingHarga: 0, ratingBahan: 0, ratingDesain: 0, ratingPackaging: 0 });
  const [comment, setComment] = useState('');
  // Hapus state untuk reviewerName
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (Object.values(ratings).some(r => r === 0)) { setError('Mohon isi semua rating bintang (minimal 1 bintang).'); return; }
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Hapus reviewerName dari body
        body: JSON.stringify({ ...ratings, comment, productId }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Terima kasih! Ulasan Anda berhasil dikirim.');
        setRatings({ ratingWaktu: 0, ratingHarga: 0, ratingBahan: 0, ratingDesain: 0, ratingPackaging: 0 });
        setComment('');
        router.refresh();
      } else { 
        setError(data.message || 'Gagal mengirim ulasan. Silakan coba lagi.'); 
      }
    } catch (err) { 
      console.error('Failed to submit review:', err);
      setError('Terjadi kesalahan koneksi.'); 
    } finally { setIsLoading(false); }
  };

  return (
    <div className="p-6 mt-8 bg-white border rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-brand-text">Tulis Ulasan Anda</h3>
      <form onSubmit={handleSubmit} className="mt-4 space-y-2 divide-y">
        <RatingRow label="Waktu Pengerjaan" rating={ratings.ratingWaktu} setRating={(r) => setRatings({...ratings, ratingWaktu: r})} />
        <RatingRow label="Harga" rating={ratings.ratingHarga} setRating={(r) => setRatings({...ratings, ratingHarga: r})} />
        <RatingRow label="Bahan" rating={ratings.ratingBahan} setRating={(r) => setRatings({...ratings, ratingBahan: r})} />
        <RatingRow label="Desain" rating={ratings.ratingDesain} setRating={(r) => setRatings({...ratings, ratingDesain: r})} />
        <RatingRow label="Packaging & Pengiriman" rating={ratings.ratingPackaging} setRating={(r) => setRatings({...ratings, ratingPackaging: r})} />
        
        {/* Hapus input untuk nama dari sini */}

        <div className="pt-4">
          <label className="block text-sm font-medium text-gray-700">Komentar</label>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={4} className="w-full px-4 py-2 mt-1 border rounded-lg" placeholder="Bagikan pengalaman Anda..." required />
        </div>
        {success && <p className="font-semibold text-green-600">{success}</p>}
        {error && <p className="font-semibold text-red-600">{error}</p>}
        <div className="pt-4 text-right">
          <button type="submit" disabled={isLoading} className="px-6 py-2 font-semibold text-white bg-brand-primary rounded-lg hover:bg-orange-500 disabled:bg-orange-300">{isLoading ? 'Mengirim...' : 'Kirim Ulasan'}</button>
        </div>
      </form>
    </div>
  );
}