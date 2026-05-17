"use client";

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Plane, Home, X, Star, Clock, MapPin } from 'lucide-react';

interface StaysModeSheetProps {
  isOpen: boolean;
  currentMode: 'rent' | 'travelers';
  onConfirm: () => void;
  onCancel: () => void;
}

export default function StaysModeSheet({ isOpen, currentMode, onConfirm, onCancel }: StaysModeSheetProps) {
  const [visible, setVisible] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ensure we only portal on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimateIn(true)));
    } else {
      setAnimateIn(false);
      const timer = setTimeout(() => setVisible(false), 400);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!mounted || !visible) return null;

  const switchingToStays = currentMode === 'rent';

  const sheet = (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col justify-end items-center transition-colors duration-300 ${animateIn ? 'bg-black/50 backdrop-blur-sm' : 'bg-transparent pointer-events-none'}`}
      onClick={onCancel}
    >
      <div
        className={`w-full max-w-[420px] px-3 pb-4 pointer-events-auto transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${animateIn ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
        onClick={e => e.stopPropagation()}
      >
        <div
          className="relative rounded-[32px] overflow-hidden flex flex-col"
          style={{
            maxHeight: 'min(85vh, 560px)',
            background: 'var(--bg-surface)',
            boxShadow: '0 -8px 60px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.06)',
          }}
        >
          {/* Drag handle */}
          <div className="flex-shrink-0 flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-[var(--text-primary)]/10" />
          </div>

          {/* Close button */}
          <button
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[var(--text-primary)]/5 flex items-center justify-center text-[var(--text-primary)]/30 hover:text-[var(--text-primary)]/70 transition-all z-10"
            onClick={onCancel}
          >
            <X size={16} />
          </button>

          {/* Scrollable body */}
          <div className="overflow-y-auto flex-1">
            <div className="px-6 pb-6 pt-2">
              {/* Icon */}
              <div className="flex justify-center mb-5">
                <div
                  className="w-20 h-20 rounded-[28px] flex items-center justify-center"
                  style={{
                    background: switchingToStays
                      ? 'linear-gradient(135deg, rgba(255,82,17,0.15) 0%, rgba(255,107,53,0.08) 100%)'
                      : 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(16,185,129,0.08) 100%)',
                  }}
                >
                  {switchingToStays
                    ? <Plane size={36} className="text-[#FF5211] rotate-[15deg]" />
                    : <Home size={36} className="text-[#10B981]" />
                  }
                </div>
              </div>

              {/* Title & description */}
              <div className="text-center mb-6">
                <h2 className="text-[22px] font-black text-[var(--text-primary)] tracking-tight mb-2">
                  {switchingToStays ? 'For Travelers' : 'For Long-term Rent'}
                </h2>
                <p className="text-[14px] text-[var(--text-primary)]/50 leading-relaxed max-w-[280px] mx-auto">
                  {switchingToStays
                    ? 'Daily stays & short-term rent — perfect for work trips or exploring.'
                    : 'Monthly rentals for long-term stays — perfect for students & working professionals.'}
                </p>
              </div>

              {/* Feature chips */}
              <div className="flex flex-wrap justify-center gap-2 mb-7">
                {switchingToStays ? (
                  <>
                    <Chip icon={<Clock size={12} />} label="Daily & weekly" />
                    <Chip icon={<Star size={12} />} label="Traveler-friendly" />
                    <Chip icon={<MapPin size={12} />} label="Near hotspots" />
                  </>
                ) : (
                  <>
                    <Chip icon={<Clock size={12} />} label="Monthly rentals" />
                    <Chip icon={<Star size={12} />} label="Verified listings" />
                    <Chip icon={<MapPin size={12} />} label="Near your city" />
                  </>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={onConfirm}
                  className="w-full py-4 rounded-2xl font-black text-[15px] text-white tracking-tight transition-all active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, #FF6B35 0%, #FF5211 50%, #E84300 100%)',
                    boxShadow: '0 8px 24px rgba(255,82,17,0.4)',
                  }}
                >
                  {switchingToStays ? 'Switch to Traveler Stays' : 'Switch to Monthly Rent'}
                </button>

                <button
                  onClick={onCancel}
                  className="w-full py-3 text-[13px] font-semibold text-[var(--text-primary)]/40 hover:text-[var(--text-primary)]/70 transition-all"
                >
                  {switchingToStays ? 'Keep Browsing Monthly Rent' : 'Keep Browsing Stays'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Portal to document.body to escape any backdrop-filter/transform stacking contexts
  return createPortal(sheet, document.body);
}

function Chip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--text-primary)]/5 border border-[var(--glass-border)]">
      <span className="text-[#FF5211]">{icon}</span>
      <span className="text-[12px] font-semibold text-[var(--text-primary)]/60">{label}</span>
    </div>
  );
}
