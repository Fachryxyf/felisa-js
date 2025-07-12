// app/admin/dashboard/page.tsx
import Image from 'next/image';

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-3xl font-bold text-brand-text">Selamat Datang di Dasbor Admin!</h2>
      <p className="mt-2 text-gray-600">
        Kelola data ulasan dan lihat hasil analisis preferensi pelanggan di sini.
      </p>

      {/* Kontainer untuk Ilustrasi dan Teks Sambutan */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 mt-8 bg-white rounded-xl shadow-md">
        <Image
          src="/images/header.png"
          alt="Dashboard Illustration"
          width={2000}
          height={200}
          className="object-contain"
        />
        <p className="mt-6 text-lg font-semibold text-center text-brand-text">
          ==========================
        </p>
        <p className="text-gray-500 text-center">Ayud Craft</p>
      </div>
    </div>
  );
}