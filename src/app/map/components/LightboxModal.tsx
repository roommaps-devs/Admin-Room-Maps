"use client";

import React from 'react';
import { X } from 'lucide-react';

interface LightboxModalProps {
  image: string | null;
  onClose: () => void;
}

const LightboxModal: React.FC<LightboxModalProps> = ({
  image,
  onClose
}) => {
  if (!image) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] bg-[var(--bg-color)]/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <button
        className="absolute top-6 right-6 w-12 h-12 rounded-full bg-[var(--bg-surface-elevated)] flex items-center justify-center text-[var(--text-primary)]/50 hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-all z-10 border border-[var(--glass-border)] shadow-xl"
        onClick={onClose}
      >
        <X size={24} />
      </button>

      <div className="relative w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
        <img
          src={image}
          alt="Room View"
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-500"
        />
      </div>
    </div>
  );
};

export default LightboxModal;
