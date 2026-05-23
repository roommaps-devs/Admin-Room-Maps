"use client";

import React, { useState, useEffect } from 'react';
import { Beaker, Sparkles, X } from 'lucide-react';

export default function TesterWelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check localStorage to see if the popup has been shown before
    const hasBeenShown = localStorage.getItem('tester_popup_shown');
    if (!hasBeenShown) {
      // Small delay to make it feel premium and less jarring
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('tester_popup_shown', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md overflow-hidden rounded-[32px] bg-white dark:bg-[#1A1A1E] border border-[var(--glass-border)] shadow-[0_20px_50px_rgba(0,0,0,0.3)] animate-in zoom-in-95 duration-300 ease-out">
        {/* Background glow effects */}
        <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-[#FF5211]/10 blur-[80px]" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-[#FF5211]/5 blur-[80px]" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 p-2 rounded-full text-[var(--text-primary)]/40 hover:text-[var(--text-primary)]/80 hover:bg-slate-100 dark:hover:bg-zinc-800/50 transition-all cursor-pointer z-10 border-none bg-transparent outline-none"
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        {/* Content */}
        <div className="p-8 flex flex-col items-center text-center">
          {/* Animated Beaker Icon container */}
          <div className="relative mb-6 flex items-center justify-center w-16 h-16 rounded-[22px] bg-gradient-to-br from-[#FF6B35] to-[#E84300] shadow-[0_8px_20px_rgba(255,82,17,0.3)]">
            <Beaker className="text-white animate-pulse" size={28} />
            {/* Sparkle badge */}
            <div className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-slate-900 p-1 rounded-full shadow-[0_2px_8px_rgba(250,204,21,0.4)] animate-bounce-subtle">
              <Sparkles size={12} fill="currentColor" className="text-yellow-700" />
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-[26px] font-sans font-black tracking-tight leading-tight mb-3 text-[var(--text-primary)]">
            Testing Environment
          </h2>

          {/* Body Messages */}
          <div className="space-y-4 text-[15px] font-medium text-[var(--text-primary)]/70 leading-relaxed mb-8">
            <p>
              Thanks dear tester, this website is only for testing.
            </p>
            <p className="font-bold text-[#FF5211] dark:text-[#FF6B35]">
              Thanks for your support!
            </p>
            <div className="inline-block py-1.5 px-3.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-[12px] font-bold text-[var(--text-primary)]/50 tracking-wide uppercase border border-[var(--glass-border)]">
              🚀 One-time notice &bull; Won&apos;t show again
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleClose}
            className="w-full py-4 px-6 font-black text-white text-base rounded-2xl bg-gradient-to-r from-[#FF6B35] to-[#E84300] hover:shadow-[0_8px_24px_rgba(255,82,17,0.4)] active:scale-[0.98] transition-all duration-300 cursor-pointer border-none outline-none"
          >
            I Understand, Let&apos;s Test!
          </button>
        </div>
      </div>
    </div>
  );
}
