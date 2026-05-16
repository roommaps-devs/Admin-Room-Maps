"use client";

import React from 'react';
import { MapPin } from 'lucide-react';

interface LocationPickerProps {
  isActive: boolean;
  isPostingRoom: boolean;
  mapCenter: [number, number];
  setIsSelectingLocation: (isSelecting: boolean) => void;
  setIsPostingRoom: (isPosting: boolean) => void;
  setSearchCenter: (center: [number, number]) => void;
  reverseGeocode: (lat: number, lon: number) => void;
  playClickSound: () => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  isActive,
  isPostingRoom,
  mapCenter,
  setIsSelectingLocation,
  setIsPostingRoom,
  setSearchCenter,
  reverseGeocode,
  playClickSound
}) => {
  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-[5000] pointer-events-none flex flex-col items-center justify-center">
      {/* Crosshair */}
      <div className="relative flex items-center justify-center">
        {/* Outer pulsing ring */}
        <div className="absolute w-16 h-16 rounded-full border border-[var(--primary)]/30 animate-ping" />
        {/* Middle ring */}
        <div className="absolute w-10 h-10 rounded-full border border-[var(--primary)]/50" />
        {/* Center dot + cross */}
        <div className="relative w-8 h-8 flex items-center justify-center">
          <div className="absolute w-[1.5px] h-7 bg-[var(--primary)] shadow-[0_0_8px_rgba(255,82,17,0.8)]" />
          <div className="absolute w-7 h-[1.5px] bg-[var(--primary)] shadow-[0_0_8px_rgba(255,82,17,0.8)]" />
          <div className="w-2 h-2 rounded-full bg-[var(--primary)] shadow-[0_0_10px_rgba(255,82,17,1)]" />
        </div>
      </div>

      {/* Bottom sheet */}
      <div className="fixed bottom-[max(env(safe-area-inset-bottom),110px)] left-0 right-0 flex justify-center px-4 pointer-events-auto">
        <div
          className="w-full max-w-[380px] rounded-3xl p-5 animate-in slide-in-from-bottom-6 duration-400"
          style={{
            background: 'var(--bg-surface-elevated)',
            backdropFilter: 'blur(24px)',
            border: '1px solid var(--glass-border)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.1)',
          }}
        >
          {/* Handle */}
          <div className="w-8 h-1 rounded-full bg-[var(--text-primary)]/10 mx-auto mb-4" />

          {/* Title row */}
          <div className="flex items-start gap-3 mb-5">
            <div className="w-9 h-9 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center shrink-0 mt-0.5">
              <MapPin size={16} className="text-[var(--primary)]" />
            </div>
            <div>
              <h3 className="text-[var(--text-primary)] font-black text-[15px] tracking-tight leading-snug">
                {isPostingRoom ? 'Set Your Location' : 'Choose Search Area'}
              </h3>
              <p className="text-[12.5px] text-[var(--text-primary)]/40 mt-0.5 leading-snug">
                {isPostingRoom
                  ? 'Drag the map to pin your room exactly'
                  : 'Move the map so the crosshair lands on your area'}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            <button
              className="h-11 flex-1 rounded-2xl text-[var(--text-primary)]/40 font-semibold text-[13px] transition-all hover:text-[var(--text-primary)]/70 active:scale-95 bg-[var(--bg-surface)] border border-[var(--glass-border)]"
              onClick={() => { setIsSelectingLocation(false); setIsPostingRoom(false); }}
            >
              Cancel
            </button>
            <button
              className="h-11 flex-[2] rounded-2xl text-[var(--text-primary)] font-black text-[13.5px] transition-all hover:opacity-90 active:scale-90"
              style={{
                background: 'linear-gradient(135deg, #FF6B35, var(--primary))',
                boxShadow: '0 4px 20px rgba(255,82,17,0.45)',
              }}
              onClick={() => {
                if (!isPostingRoom) {
                  setSearchCenter(mapCenter);
                  setIsSelectingLocation(false);
                  reverseGeocode(mapCenter[0], mapCenter[1]);
                  playClickSound();
                }
              }}
            >
              {isPostingRoom ? 'Confirm Location' : 'Set This Spot'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPicker;
