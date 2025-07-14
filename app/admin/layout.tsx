// app/admin/layout.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HiHome, 
  HiOutlineCollection,
  HiOutlineDocumentText, 
  HiOutlineChartBar, 
  HiOutlineUserCircle,
  HiOutlineCube // Impor ikon baru
} from 'react-icons/hi';

export default function AdminLayout({ children }: { children: React.ReactNode; }) {
  const pathname = usePathname();

  const navLinks = [
    { href: '/admin/dashboard', text: 'Beranda', icon: <HiHome size={20} /> },
    { href: '/admin/pesanan', text: 'Daftar Pesanan', icon: <HiOutlineCollection size={20} /> },
    { href: '/admin/produk', text: 'Manajemen Produk', icon: <HiOutlineCube size={20} /> },
    { href: '/admin/penilaian', text: 'Data Penilaian', icon: <HiOutlineDocumentText size={20} /> },
    { href: '/admin/analisis-saw', text: 'Analisis SAW', icon: <HiOutlineChartBar size={20} /> },
    { href: '/admin/profile', text: 'Profile', icon: <HiOutlineUserCircle size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-brand-background">
      <aside className="w-64 p-4 bg-brand-secondary">
        <h1 className="px-2 text-2xl font-bold text-brand-text">AyudCraft</h1>
        <nav className="mt-8">
          <ul>
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <li key={link.href} className="mb-2">
                  <Link href={link.href} className={`flex items-center gap-3 p-3 rounded-lg font-semibold transition-colors ${isActive ? 'bg-brand-primary text-white' : 'text-gray-700 hover:bg-orange-100'}`}>
                    {link.icon}
                    <span>{link.text}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}