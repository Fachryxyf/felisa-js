// components/Modal.tsx

import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose} 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
    >
      {/* Konten Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-xl"
      >
        {/* Header Modal dengan Tombol Close */}
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-semibold text-brand-text">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>

        {/* Body Modal */}
        <div className="mt-4">
          {children}
        </div>

        {/* Footer Modal dengan Tombol "Oke" */}
        <div className="flex justify-end mt-6">
            <button 
                onClick={onClose}
                className="px-6 py-2 font-semibold text-white transition-colors duration-300 bg-brand-primary rounded-lg hover:bg-orange-500"
            >
                Oke
            </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;