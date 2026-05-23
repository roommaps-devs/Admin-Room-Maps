"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { Article } from "@/lib/articles";

interface DeleteArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: Article | null;
  onConfirm: () => void;
}

export default function DeleteArticleModal({
  isOpen,
  onClose,
  article,
  onConfirm
}: DeleteArticleModalProps) {
  if (!isOpen || !article) return null;

  return (
    <div className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-[420px] bg-white dark:bg-[#121214] rounded-[36px] overflow-hidden shadow-2xl border border-transparent dark:border-white/10 p-6 flex flex-col gap-6 text-center animate-in zoom-in-95 duration-200">
        
        <div className="w-16 h-16 rounded-full bg-red-500/5 text-red-500 flex items-center justify-center mx-auto">
          <Trash2 size={28} />
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-black text-lg tracking-tight">Confirm Deletion</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
            Are you sure you want to delete the article &ldquo;{article?.title}&rdquo;? This process cannot be undone.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 rounded-2xl font-black text-xs uppercase tracking-wider text-[#64748b] dark:text-slate-300 transition-all cursor-pointer"
          >
            Keep Article
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-red-500/10"
          >
            Delete
          </button>
        </div>

      </div>
    </div>
  );
}
