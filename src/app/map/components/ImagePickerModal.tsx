"use client";

import React from 'react';
import { Camera, ImageIcon } from 'lucide-react';

interface ImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  cameraInputRef: React.RefObject<HTMLInputElement>;
  galleryInputRef: React.RefObject<HTMLInputElement>;
}

const ImagePickerModal: React.FC<ImagePickerModalProps> = ({
  isOpen,
  onClose,
  cameraInputRef,
  galleryInputRef
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[3000] bg-[var(--bg-color)]/40 backdrop-blur-md pointer-events-auto flex items-end justify-center md:items-center px-0 md:px-6" onClick={onClose}>
      <div className="w-full max-w-[440px] bg-[var(--bg-surface-elevated)] border-t md:border border-[var(--glass-border)] rounded-t-[32px] md:rounded-[32px] p-8 shadow-2xl animate-in slide-in-from-bottom duration-500" onClick={e => e.stopPropagation()}>
        <div className="text-center mb-8">
          <div className="w-12 h-1 bg-[var(--text-primary)]/10 rounded-full mx-auto mb-4 md:hidden"></div>
          <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tight">Upload Photos</h3>
          <p className="text-[12px] text-[var(--text-primary)]/40 mt-1">Select a source for your room photos</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <button className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--glass-border)] transition-all hover:border-blue-500/50 hover:bg-[var(--bg-surface-elevated)] group" onClick={() => {
            cameraInputRef.current?.click();
            onClose();
          }}>
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-500 flex items-center justify-center transition-transform group-hover:scale-110">
              <Camera size={24} />
            </div>
            <div className="text-sm font-bold text-[var(--text-primary)]">Take Photo</div>
          </button>

          <button className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--glass-border)] transition-all hover:border-[var(--primary)]/50 hover:bg-[var(--bg-surface-elevated)] group" onClick={() => {
            galleryInputRef.current?.click();
            onClose();
          }}>
            <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/20 text-[var(--primary)] flex items-center justify-center transition-transform group-hover:scale-110">
              <ImageIcon size={24} />
            </div>
            <div className="text-sm font-bold text-[var(--text-primary)]">Gallery</div>
          </button>
        </div>

        <button className="w-full py-4 text-[var(--text-primary)]/30 text-sm font-bold hover:text-[var(--text-primary)] transition-all" onClick={onClose}>
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default ImagePickerModal;
