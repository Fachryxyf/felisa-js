// app/admin/layout.tsx
'use client'; // Kita ubah jadi client component untuk bisa mendeteksi path

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Hook untuk mendapatkan path saat ini

// 1. Impor ikon yang dibutuhkan dari react-icons
import { 
  HiHome, 
  HiOutlineDocumentText, 
  HiOutlineChartBar, 
  HiOutlineUserCircle 
} from 'react-icons/hi';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 2. Dapatkan path URL saat ini
  const pathname = usePathname();

  // 3. Buat daftar link untuk navigasi
  const navLinks = [
    { href: '/admin/dashboard', text: 'Beranda', icon: <HiHome size={20} /> },
    { href: '/admin/penilaian', text: 'Data Penilaian', icon: <HiOutlineDocumentText size={20} /> },
    { href: '/admin/analisis-saw', text: 'Analisis SAW', icon: <HiOutlineChartBar size={20} /> },
    { href: '/admin/profile', text: 'Profile', icon: <HiOutlineUserCircle size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-brand-background">
      {/* Sidebar */}
      <aside className="w-64 p-4 bg-brand-secondary">
        <h1 className="px-2 text-2xl font-bold text-brand-text">AyudCraft</h1>
        <nav className="mt-8">
          <ul>
            {navLinks.map((link) => {
              // 4. Cek apakah link ini sedang aktif
              const isActive = pathname === link.href;
              return (
                <li key={link.href} className="mb-2">
                  <Link 
                    href={link.href} 
                    // 5. Terapkan style berbeda jika link aktif
                    className={`flex items-center gap-3 p-3 rounded-lg font-semibold transition-colors
                      ${isActive 
                        ? 'bg-brand-primary text-white' 
                        : 'text-gray-700 hover:bg-orange-100'
                      }`
                    }
                  >
                    {link.icon} {/* Tampilkan ikon */}
                    <span>{link.text}</span> {/* Tampilkan teks */}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Konten Halaman */}
      <main className="flex-1 p-10">
        {children}
      </main>
    </div>
  );
}