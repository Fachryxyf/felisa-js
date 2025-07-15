// app/context/CartContext.tsx
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import type { Product } from '@prisma/client';

// Tipe data untuk item di dalam keranjang
export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
};

// Tipe untuk nilai yang akan disediakan oleh context
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  totalAmount: number;
}

// Buat context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Buat Provider komponen
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Efek untuk memuat data keranjang dari localStorage saat komponen pertama kali dimuat
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('ayudcraft_cart');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage", error);
    }
  }, []);

  // Efek untuk menyimpan data keranjang ke localStorage setiap kali ada perubahan
  useEffect(() => {
    try {
      localStorage.setItem('ayudcraft_cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error("Failed to save cart to localStorage", error);
    }
  }, [cartItems]);

  const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        // Jika produk sudah ada, tambah jumlahnya
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Jika produk baru, tambahkan ke keranjang
        return [...prevItems, { 
          id: product.id, 
          name: product.name, 
          price: product.discountPrice || product.price,
          quantity: 1,
          imageUrl: product.imageUrl
        }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    setCartItems(prevItems => {
      if (quantity <= 0) {
        // Jika jumlah 0 atau kurang, hapus item
        return prevItems.filter(item => item.id !== productId);
      }
      return prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, totalAmount }}>
      {children}
    </CartContext.Provider>
  );
};

// Buat custom hook untuk mempermudah penggunaan context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};