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
  onConfirmLocation?: (coords: [number, number]) => void;
  isDragging?: boolean;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  isActive,
  isPostingRoom,
  mapCenter,
  setIsSelectingLocation,
  setIsPostingRoom,
  setSearchCenter,
  reverseGeocode,
  playClickSound,
  onConfirmLocation,
  isDragging = false
}) => {
  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-[5000] pointer-events-none flex flex-col items-center justify-center">
      {/* Google Maps Pinpoint */}
      <div className="relative flex items-center justify-center w-0 h-0">
        {/* Ground Target Dot */}
        <div className="absolute w-2 h-2 rounded-full bg-[var(--primary)] border border-white shadow-[0_0_6px_rgba(255,82,17,0.6)] z-0" />

        {/* Pulsing ring on ground */}
        <div 
          className={`absolute w-12 h-12 rounded-full border-2 border-[var(--primary)]/30 transition-all duration-300 ${
            isDragging ? 'scale-75 opacity-0' : 'animate-ping opacity-100'
          }`} 
        />

        {/* Ground Shadow */}
        <div 
          className="absolute w-7 h-1.5 bg-black/25 dark:bg-black/50 rounded-full blur-[1px] transition-all duration-300 ease-out z-0"
          style={{ 
            transform: `translateY(1px) scale(${isDragging ? 0.4 : 1})`,
            opacity: isDragging ? 0.35 : 1
          }}
        />

        {/* Floating Pin */}
        <div 
          className="absolute z-10"
          style={{
            bottom: 0,
            left: '50%',
            transform: `translateX(-50%) translateY(${isDragging ? '-28px' : '0px'}) scale(${isDragging ? 1.06 : 1})`,
            transformOrigin: 'bottom center',
            transition: 'transform 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275), filter 300ms ease-out',
            filter: isDragging ? 'drop-shadow(0 16px 8px rgba(0,0,0,0.18))' : 'drop-shadow(0 6px 3px rgba(0,0,0,0.22))'
          }}
        >
          <svg width="38" height="46" viewBox="0 0 24 29" fill="none" xmlns="http://www.w3.org/2000/svg" className="block">
            <path d="M12 0C5.37 0 0 5.37 0 12C0 21 12 29 12 29C12 29 24 21 24 12C24 5.37 18.63 0 12 0Z" fill="url(#pinGradientPicker)"/>
            <circle cx="12" cy="12" r="5" fill="white" />
            <circle cx="12" cy="12" r="2.2" fill="var(--primary)" />
            <defs>
              <linearGradient id="pinGradientPicker" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF8C61" />
                <stop offset="50%" stopColor="var(--primary)" />
                <stop offset="100%" stopColor="#D93800" />
              </linearGradient>
            </defs>
          </svg>
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
                } else {
                  if (onConfirmLocation) {
                    onConfirmLocation(mapCenter);
                  } else {
                    setIsSelectingLocation(false);
                  }
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
