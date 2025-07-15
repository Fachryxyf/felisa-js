'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  HiHome, 
  HiOutlineCollection,
  HiOutlineDocumentText, 
  HiOutlineChartBar, 
  HiOutlineUserCircle,
  HiOutlineCube,
  HiOutlineUsers,
  HiOutlineLogout 
} from 'react-icons/hi';
import { useLoading } from '../context/LoadingContext';
import Image from 'next/image';

export default function AdminLayout({ children }: { children: React.ReactNode; }) {
  const pathname = usePathname();
  const router = useRouter();
  const { showLoading, hideLoading } = useLoading();

  const navLinks = [
    { href: '/admin/dashboard', text: 'Beranda', icon: <HiHome size={20} /> },
    { href: '/admin/pesanan', text: 'Daftar Pesanan', icon: <HiOutlineCollection size={20} /> },
    { href: '/admin/produk', text: 'Manajemen Produk', icon: <HiOutlineCube size={20} /> },
    { href: '/admin/user', text: 'Manajemen User', icon: <HiOutlineUsers size={20} /> },
    { href: '/admin/penilaian', text: 'Data Penilaian', icon: <HiOutlineDocumentText size={20} /> },
    { href: '/admin/analisis-saw', text: 'Analisis SAW', icon: <HiOutlineChartBar size={20} /> },
    { href: '/admin/profile', text: 'Profile', icon: <HiOutlineUserCircle size={20} /> },
  ];

  const handleLogout = async () => {
    showLoading();
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Failed to logout:', error);
    } finally {
      router.push('/login');
      hideLoading();
    }
  };

  return (
    <div className="flex min-h-screen bg-brand-background">
      {/* Sidebar */}
      <aside className="w-64 p-4 bg-brand-secondary flex flex-col">
        <div>
                    <div className="px-2 mb-8">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
                <Image
                    src="/images/Ayud Craft Lettermark Primary Logo.png"
                    alt="Ayud Craft Logo"
                    width={32}
                    height={32}
                    className="object-contain"
                />
                <h1 className="text-2xl font-bold text-brand-text">AyudCraft</h1>
            </Link>
          </div>
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
        </div>
        
        {/* Tombol Logout di bagian bawah sidebar */}
        <div className="mt-auto">
           <button 
              onClick={handleLogout}
              className="flex items-center gap-3 w-full p-3 rounded-lg font-semibold text-red-600 bg-red-100 hover:bg-red-200 transition-colors"
            >
              <HiOutlineLogout size={20} />
              <span>Keluar</span>
            </button>
        </div>
      </aside>

      {/* Konten Halaman */}
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}