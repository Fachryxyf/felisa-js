// app/admin/analisis-saw/page.tsx

import React from 'react';
import prisma from '../../../lib/prisma';
// 1. Impor tipe model dari Prisma Client
import { Product, Review } from '@prisma/client';

// Kriteria dan Bobot
const criteria = [
  { name: 'Waktu (B1)', weight: 0.10, key: 'ratingWaktu' as const },
  { name: 'Harga (B2)', weight: 0.30, key: 'ratingHarga' as const },
  { name: 'Bahan (B3)', weight: 0.15, key: 'ratingBahan' as const },
  { name: 'Desain (B4)', weight: 0.40, key: 'ratingDesain' as const },
  { name: 'Packaging (B5)', weight: 0.05, key: 'ratingPackaging' as const },
];

// 2. Definisikan tipe untuk hasil peringkat
type RankedAlternative = {
  name: string;
  score: number;
};

// --- FUNGSI PERHITUNGAN SAW ---
const normalizeMatrix = (matrix: number[][]) => {
  const numAlternatives = matrix.length;
  if (numAlternatives === 0) return [];
  const numCriteria = matrix[0].length;
  const normalized = Array.from({ length: numAlternatives }, () => Array(numCriteria).fill(0));
  
  for (let j = 0; j < numCriteria; j++) {
    let maxVal = Math.max(...matrix.map(row => row[j]));
    if (maxVal === 0) maxVal = 1;
    for (let i = 0; i < numAlternatives; i++) {
      normalized[i][j] = matrix[i][j] / maxVal;
    }
  }
  return normalized;
};

const calculateScores = (normalizedMatrix: number[][]) => {
  return normalizedMatrix.map(row => 
    row.reduce((score, val, j) => score + val * criteria[j].weight, 0)
  );
};


// --- KOMPONEN UTAMA ---
export default async function SawAnalysisPage() {

  const products: Product[] = await prisma.product.findMany();
  const reviews: Review[] = await prisma.review.findMany();

  // 3. Definisikan tipe untuk objek agregasi
  type AggregatedRating = { sum: number; count: number };
  const productRatings: { [key: number]: { name: string; [key: string]: AggregatedRating | string } } = {};

  for (const product of products) {
    productRatings[product.id] = {
      name: product.name,
      ...Object.fromEntries(criteria.map(c => [c.key, { sum: 0, count: 0 }]))
    };
  }

  for (const review of reviews) {
    const productRating = productRatings[review.productId];
    if (productRating) {
      for (const c of criteria) {
        const key = c.key;
        const rating = productRating[key] as AggregatedRating;
        rating.sum += review[key];
        rating.count++;
      }
    }
  }

  const ratingsMatrix = products.map((p: Product) => {
    const ratings = productRatings[p.id];
    return criteria.map(c => {
      const { sum, count } = ratings[c.key] as AggregatedRating;
      return count > 0 ? sum / count : 0;
    });
  });

  const normalized = normalizeMatrix(ratingsMatrix);
  const finalScores = calculateScores(normalized);

  // 4. Tambahkan tipe pada parameter sort
  const rankedAlternatives = products.map((alt: Product, index: number) => ({
    name: alt.name,
    score: finalScores[index],
  })).sort((a: RankedAlternative, b: RankedAlternative) => b.score - a.score);


  return (
    <div>
      <h2 className="text-3xl font-bold text-brand-text">Hasil Analisis SAW</h2>
      <p className="mt-2 text-gray-600">
        Perankingan jenis bucket berdasarkan data ulasan aktual dari database.
      </p>

      {rankedAlternatives.length === 0 ? (
        <p className="mt-8 text-gray-500">Belum ada data yang cukup untuk dianalisis.</p>
      ) : (
        <>
          <div className="mt-8 overflow-hidden bg-white rounded-xl shadow-md">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-bold text-brand-text uppercase tracking-wider">Peringkat</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-brand-text uppercase tracking-wider">Jenis Bucket</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-brand-text uppercase tracking-wider">Skor Akhir (V)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* 5. Tambahkan tipe di sini */}
                {rankedAlternatives.map((alt: RankedAlternative, index: number) => (
                  <tr key={alt.name} className={index === 0 ? 'bg-orange-100' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap"><span className={`px-3 py-1 text-lg font-bold ${index === 0 ? 'text-orange-800' : 'text-gray-700'}`}>{index + 1}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-semibold">{alt.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-bold">{alt.score.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 mt-6 bg-green-100 border-l-4 border-green-500 rounded-r-lg">
            <h3 className="text-lg font-bold text-green-800">Rekomendasi Utama</h3>
            <p className="mt-1 text-green-700">
              Berdasarkan hasil perhitungan, **{rankedAlternatives[0].name}** adalah jenis bucket yang paling diminati.
            </p>
          </div>
        </>
      )}
    </div>
  );
}