// app/context/AppContext.tsx
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import type { Product } from '@prisma/client';
import Cookies from 'js-cookie';
import { decodeJwt } from 'jose';

// Tipe data untuk item di dalam keranjang
export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
};

// Tipe data untuk user dari token
export type UserPayload = {
  name: string;
  role: 'ADMIN' | 'CUSTOMER';
}

// Tipe untuk nilai yang akan disediakan oleh context
interface AppContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  totalAmount: number;
  loggedInUser: UserPayload | null;
  setLoggedInUser: (user: UserPayload | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loggedInUser, setLoggedInUser] = useState<UserPayload | null>(null);

  // Efek untuk memuat data dari localStorage (keranjang & user)
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('ayudcraft_cart');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
        console.error("Failed to load cart from localStorage", error);
    }

    const token = Cookies.get('auth_session');
    if (token) {
      try {
        const payload = decodeJwt(token);
        setLoggedInUser(payload as UserPayload);
      } catch (e) {
        setLoggedInUser(null);
      }
    }
  }, []);

  // Efek untuk menyimpan keranjang ke localStorage
  useEffect(() => {
    try {
        localStorage.setItem('ayudcraft_cart', JSON.stringify(cartItems));
    } catch (error) {
        console.error("Failed to save cart to localStorage", error);
    }
  }, [cartItems]);
  
  const addToCart = useCallback((product: Product) => {
    setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.id === product.id);
        if (existingItem) {
            return prevItems.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
        }
        return [...prevItems, { id: product.id, name: product.name, price: product.discountPrice || product.price, quantity: 1, imageUrl: product.imageUrl }];
    });
  }, []);
  
  const removeFromCart = useCallback((productId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    setCartItems(prevItems => {
        if (quantity <= 0) {
            return prevItems.filter(item => item.id !== productId);
        }
        return prevItems.map(item => item.id === productId ? { ...item, quantity } : item);
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <AppContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, totalAmount, loggedInUser, setLoggedInUser }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};