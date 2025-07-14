// components/LoadingSpinner.tsx
'use client';

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75 backdrop-blur-sm">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-t-brand-primary border-gray-200 rounded-full animate-spin"></div>
        <p className="mt-4 font-semibold text-brand-text">Memuat...</p>
      </div>
    </div>
  );
}