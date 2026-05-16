"use client";

import React from 'react';

interface ConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  icon?: React.ReactNode;
  danger?: boolean;
  confirmLabel?: string;
}

export default function ConfirmDialog({ open, onConfirm, onCancel, title, message, danger = false, confirmLabel = 'Confirm' }: ConfirmDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[6000] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white p-8 rounded-[32px] max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300">
        <h2 className="text-2xl font-black mb-4 tracking-tight">{title}</h2>
        <p className="text-gray-600 font-medium leading-relaxed mb-8">{message}</p>
        <div className="flex gap-4">
          <button 
            onClick={onCancel} 
            className="flex-1 py-4 font-bold text-gray-500 hover:bg-gray-100 rounded-2xl transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            className={`flex-1 py-4 font-black text-white rounded-2xl transition-all shadow-lg active:scale-95 ${
              danger ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 'bg-[#FF5733] hover:opacity-90 shadow-[#FF5733]/20'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
