// app/admin/layout.tsx

import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-brand-background">
      {/* Sidebar */}
      <aside className="w-64 p-6 bg-brand-secondary">
        <h1 className="text-2xl font-bold text-brand-text">AyudCraft</h1>
            <nav className="mt-8">
            <ul>
                <li className="mb-4">
                <Link href="/admin/dashboard" className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-orange-100 font-semibold">
                    Beranda
                </Link>
                </li>
                <li className="mb-4">
                <Link href="/admin/penilaian" className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-orange-100 font-semibold">
                    Data Penilaian
                </Link>
                </li>
                {/* TAMBAHKAN INI */}
                <li className="mb-4">
                <Link href="/admin/analisis-saw" className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-orange-100 font-semibold">
                    Analisis SAW
                </Link>
                </li>
                <li>
                <Link href="/admin/profile" className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-orange-100 font-semibold">
                    Profile
                </Link>
                </li>
            </ul>
            </nav>
      </aside>

      {/* Konten Halaman (children) */}
      <main className="flex-1 p-10">
        {children}
      </main>
    </div>
  );
}