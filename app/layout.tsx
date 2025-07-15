// app/layout.tsx

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

// Impor provider yang sudah ada
import { LoadingProvider } from "./context/LoadingContext";
import GlobalLoadingIndicator from "./components/GlobalLoadingIndicator";

// 1. Impor CartProvider yang baru kita buat
import { CartProvider } from "./context/CartContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Ayud Craft",
  description: "Decision Support System for Ayud Craft",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        {/* Urutan provider penting. LoadingProvider membungkus semuanya. */}
        <LoadingProvider>
          {/* 2. Bungkus aplikasi dengan CartProvider di dalam LoadingProvider */}
          <CartProvider>
            <GlobalLoadingIndicator />
            {children}
          </CartProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}