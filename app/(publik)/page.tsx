// app/(publik)/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@prisma/client';
import { useLoading } from '../context/LoadingContext';
import { useApp } from '../context/AppContext'; // PERBAIKAN: Gunakan useApp, bukan useCart
import { HiOutlineShoppingCart } from 'react-icons/hi';
import { motion, type Variants } from 'framer-motion';

// Fungsi format mata uang
const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

// Varian animasi untuk kontainer
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Varian animasi untuk item
const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  },
};


export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const { showLoading, hideLoading } = useLoading();
  const { addToCart } = useApp(); // PERBAIKAN: Ambil addToCart dari useApp

  useEffect(() => {
    const fetchProducts = async () => {
      showLoading();
      try {
        const res = await fetch('/api/produk');
        if (!res.ok) throw new Error('Gagal memuat produk');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        hideLoading();
      }
    };
    fetchProducts();
  }, [showLoading, hideLoading]);

  const handleAddToCartClick = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <motion.div
      className="container mx-auto space-y-16"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Bagian 1: Halaman Penyambut */}
      <motion.section
        className="h-[60vh] md:h-[70vh] rounded-2xl bg-[#FFF7ED] bg-feminine-flowers flex items-center p-8 relative overflow-hidden"
        variants={itemVariants}
      >
        <div className="z-10 text-green-900">
          <motion.h2 className="text-5xl md:text-7xl font-serif font-bold" variants={itemVariants}>WELCOME</motion.h2>
          <motion.h1 className="text-5xl md:text-7xl font-serif font-bold" variants={itemVariants}>AYUD CRAFT</motion.h1>
          <motion.p className="mt-4 text-lg" variants={itemVariants}>Real talk only, Semua cerita tentang bucket-bucket Ayud Craft ada di sini!</motion.p>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/2 md:w-1/3">
            <Image 
              src="https://res.cloudinary.com/daemnvfpi/image/upload/v1752575184/Pngtree_aesthetic_washi_tape_png_collage_20968575_f7pxlk.png" // Menggunakan gambar yang Anda upload
              alt="Ilustrasi Bunga"
              layout="fill"
              objectFit="contain"
              className="object-right"
            />
        </div>
      </motion.section>

      {/* Bagian 2: Katalog Produk */}
      <motion.section variants={itemVariants}>
        <div className="p-8 text-center">
          <h2 className="text-4xl font-bold text-brand-text">Pilih Bucket Impianmu</h2>
          <p className="mt-2 text-gray-600">Beri ulasan untuk membantu kami menjadi lebih baik!</p>
        </div>
        <motion.div 
          className="grid grid-cols-1 gap-8 mt-12 sm:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
        >
          {products.map((product) => (
            <motion.div key={product.id} className="block" variants={itemVariants}>
              <Link href={`/produk/${product.id}`} className="flex flex-col h-full overflow-hidden bg-white border rounded-2xl shadow-lg group hover:shadow-2xl transition-shadow">
                <div className="relative w-full h-64 bg-gray-200">
                  <Image src={product.imageUrl || "/images/header.png"} alt={product.name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
                  {product.discountPrice && (<div className="absolute top-3 right-3 px-3 py-1 text-xs font-bold text-white bg-red-500 rounded-full">DISKON</div>)}
                  {product.stock === 0 && (<div className="absolute top-3 left-3 px-3 py-1 text-xs font-bold text-gray-800 bg-gray-200 rounded-full">STOK HABIS</div>)}
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-brand-text group-hover:text-brand-primary">{product.name}</h3>
                  <div className="mt-2">
                    {product.discountPrice ? (
                      <div className="flex items-baseline gap-2"><p className="text-xl font-bold text-red-600">{formatCurrency(product.discountPrice)}</p><p className="text-sm text-gray-500 line-through">{formatCurrency(product.price)}</p></div>
                    ) : (<p className="text-xl font-bold text-brand-text">{formatCurrency(product.price)}</p>)}
                  </div>
                  <div className="mt-4 pt-4 border-t flex-grow flex items-end">
                    {product.stock > 0 ? (
                      <button 
                        onClick={(e) => handleAddToCartClick(e, product)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand-primary rounded-lg hover:bg-orange-500"
                      >
                        <HiOutlineShoppingCart size={18} />
                        Tambah
                      </button>
                    ) : (
                      <button className="w-full px-4 py-2 text-sm font-semibold text-gray-500 bg-gray-200 rounded-lg cursor-not-allowed">
                        Stok Habis
                      </button>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
    </motion.div>
  );
}