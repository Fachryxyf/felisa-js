// app/context/LoadingContext.tsx
'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

// Tipe untuk nilai yang akan disediakan oleh context
interface LoadingContextType {
  isLoading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
}

// Buat context dengan nilai awal undefined
const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

// Buat Provider komponen
export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);

  const showLoading = () => setIsLoading(true);
  const hideLoading = () => setIsLoading(false);

  return (
    <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

// Buat custom hook untuk mempermudah penggunaan context
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};