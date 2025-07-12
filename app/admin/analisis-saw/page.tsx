// app/admin/analisis-saw/page.tsx
'use client';

import React from 'react';

// --- DATA DARI SKRIPSI BAB IV ---

// Alternatif Produk [cite: 40]
const alternatives = [
  { name: 'Bucket Bunga' },
  { name: 'Bucket Uang' },
  { name: 'Bucket Barang' },
  { name: 'Custom' },
];

// Kriteria dan Bobot [cite: 53]
const criteria = [
  { name: 'Waktu (B1)', weight: 0.10, attribute: 'benefit' },
  { name: 'Harga (B2)', weight: 0.30, attribute: 'benefit' },
  { name: 'Bahan (B3)', weight: 0.15, attribute: 'benefit' },
  { name: 'Desain (B4)', weight: 0.40, attribute: 'benefit' },
  { name: 'Packaging (B5)', weight: 0.05, attribute: 'benefit' },
];

// Matrix Penilaian Awal (X) [cite: 59]
const ratingsMatrix = [
  // B1, B2, B3, B4, B5
  [4, 4, 2, 5, 4], // Bucket Bunga
  [4, 3, 5, 4, 2], // Bucket Uang
  [2, 4, 3, 5, 5], // Bucket Barang
  [4, 3, 4, 5, 2], // Custom
];

// --- FUNGSI PERHITUNGAN SAW ---

// 1. Normalisasi Matriks
const normalizeMatrix = (matrix: number[][]) => {
  const numAlternatives = matrix.length;
  const numCriteria = matrix[0].length;
  const normalized = Array.from({ length: numAlternatives }, () => Array(numCriteria).fill(0));
  
  for (let j = 0; j < numCriteria; j++) {
    // Cari nilai max untuk setiap kolom (karena semua kriteria adalah benefit) [cite: 75]
    let maxVal = -Infinity;
    for (let i = 0; i < numAlternatives; i++) {
      if (matrix[i][j] > maxVal) {
        maxVal = matrix[i][j];
      }
    }
    
    for (let i = 0; i < numAlternatives; i++) {
      normalized[i][j] = matrix[i][j] / maxVal;
    }
  }
  return normalized;
};

// 2. Kalkulasi Nilai Akhir
const calculateScores = (normalizedMatrix: number[][]) => {
  return normalizedMatrix.map(row => {
    let score = 0;
    for (let j = 0; j < row.length; j++) {
      score += row[j] * criteria[j].weight; // Rumus: V = Σ(Wj * Rij) [cite: 147]
    }
    return score;
  });
};


// --- KOMPONEN UTAMA ---

export default function SawAnalysisPage() {
  const normalized = normalizeMatrix(ratingsMatrix);
  const finalScores = calculateScores(normalized);

  // Gabungkan alternatif dengan skornya untuk diurutkan
  const rankedAlternatives = alternatives.map((alt, index) => ({
    ...alt,
    score: finalScores[index],
  })).sort((a, b) => b.score - a.score); // Urutkan dari skor tertinggi

  return (
    <div>
      <h2 className="text-3xl font-bold text-brand-text">Hasil Analisis SAW</h2>
      <p className="mt-2 text-gray-600">
        Perankingan jenis bucket berdasarkan preferensi pelanggan.
      </p>

      {/* Tabel Hasil Akhir */}
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
            {rankedAlternatives.map((alt, index) => (
              <tr key={alt.name} className={index === 0 ? 'bg-orange-100' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 text-lg font-bold ${index === 0 ? 'text-orange-800' : 'text-gray-700'}`}>
                    {index + 1}
                  </span>
                </td>
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
          Berdasarkan hasil perhitungan, **{rankedAlternatives[0].name}** adalah jenis bucket yang paling diminati dan direkomendasikan untuk menjadi prioritas.
        </p>
      </div>
    </div>
  );
}