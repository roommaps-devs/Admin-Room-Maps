"use client";

import React, { useState, useEffect } from 'react';
import { MapPin, Search, Navigation, AlertCircle, X } from 'lucide-react';

interface LocationOverlayProps {
  onSuccess: (lat: number, lng: number) => void;
  onManualSearch: () => void;
  onStateChangeInitial: (state: 'pending' | 'denied' | 'granted' | 'skipped') => void;
  initialSearch?: string;
}

export default function LocationOverlay({ 
  onSuccess, 
  onManualSearch, 
  onStateChangeInitial,
  initialSearch 
}: LocationOverlayProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    // Automatically detect permission block state on mount
    if (typeof window !== 'undefined' && navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' as PermissionName })
        .then((result) => {
          if (result.state === 'denied') {
            setIsBlocked(true);
          }
          result.onchange = () => {
            if (result.state === 'denied') {
              setIsBlocked(true);
            } else if (result.state === 'granted') {
              setIsBlocked(false);
            }
          };
        })
        .catch((err) => console.log("Permissions check skipped/failed", err));
    }
  }, []);

  const requestLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onSuccess(latitude, longitude);
        onStateChangeInitial('granted');
        setLoading(false);
        setIsBlocked(false);
      },
      (err) => {
        console.error(err);
        setError("Location access denied. Please unblock and try again.");
        onStateChangeInitial('denied');
        setLoading(false);
        setIsBlocked(true);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-500">
      
      {isBlocked ? (
        /* LOCATION BLOCKED CARD VIEW */
        <div 
          className="rounded-[40px] shadow-[0_24px_64px_rgba(0,0,0,0.15)] max-w-[420px] w-full overflow-hidden p-8 flex flex-col items-center text-center relative animate-in zoom-in-95 duration-300 pointer-events-auto"
          style={{ 
            background: 'var(--bg-surface-elevated)', 
            border: '1px solid var(--glass-border)' 
          }}
        >
          {/* Elegant top-right exit button */}
          <button 
            onClick={() => onStateChangeInitial('skipped')}
            className="absolute top-5 right-5 w-9 h-9 bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 rounded-full flex items-center justify-center text-[var(--text-primary)]/40 hover:text-[var(--text-primary)] transition-colors pointer-events-auto"
            aria-label="Close"
          >
            <X size={16} strokeWidth={2.5} />
          </button>

          {/* Premium Glowing Alert Header */}
          <div className="relative w-16 h-16 mb-6 flex items-center justify-center">
            <div className="absolute inset-0 bg-red-500/10 rounded-full animate-ping opacity-75" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-2 bg-red-500/20 rounded-full animate-pulse" />
            <div className="relative w-12 h-12 bg-red-50 rounded-full flex items-center justify-center shadow-inner">
              <AlertCircle size={22} className="text-red-500" strokeWidth={2.5} />
            </div>
          </div>

          <h2 className="text-2xl font-black text-[var(--text-primary)] mb-6 tracking-tight">
            Location Blocked
          </h2>

          {/* Glass instructions list container */}
          <div className="flex flex-col gap-4 text-left w-full max-w-[300px] mx-auto mb-8 bg-black/5 dark:bg-white/5 p-5 rounded-3xl border border-black/5 dark:border-white/5 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 shadow-[0_2px_8px_rgba(255,82,17,0.3)]">1</span>
              <p className="text-xs text-[var(--text-primary)]/70 font-semibold leading-normal">
                Click the lock icon (🔒) beside the URL
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 shadow-[0_2px_8px_rgba(255,82,17,0.3)]">2</span>
              <p className="text-xs text-[var(--text-primary)]/70 font-semibold leading-normal">
                Toggle Location to ON
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 shadow-[0_2px_8px_rgba(255,82,17,0.3)]">3</span>
              <p className="text-xs text-[var(--text-primary)]/70 font-semibold leading-normal">
                Refresh the page
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 shadow-[0_2px_8px_rgba(255,82,17,0.3)]">4</span>
              <p className="text-xs text-[var(--text-primary)]/70 font-semibold leading-normal">
                Tap Try Again
              </p>
            </div>
          </div>

          <button
            onClick={requestLocation}
            disabled={loading}
            className="relative w-full py-4 bg-[var(--primary)] hover:bg-[var(--primary)]/95 text-white rounded-2xl font-black text-base shadow-[0_10px_30px_rgba(255,82,17,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 overflow-hidden group pointer-events-auto"
          >
            {/* Shimmer gloss effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            {loading ? (
              <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Try Again"
            )}
          </button>

          <div className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-[0.2em] my-6">
            — OR —
          </div>

          <button
            onClick={onManualSearch}
            className="text-[var(--text-primary)] hover:text-[var(--primary)] font-black text-sm hover:underline flex items-center justify-center gap-2 hover:translate-x-0.5 transition-all pointer-events-auto"
          >
            <Navigation size={14} className="rotate-45 text-[var(--primary)]" strokeWidth={2.5} />
            Enter Location Manually
          </button>

        </div>
      ) : (
        /* STANDARD REQUEST LOCATION CARD VIEW */
        <div 
          className="rounded-[40px] shadow-2xl max-w-lg w-full overflow-hidden p-8 md:p-12 relative animate-in zoom-in-95 duration-300 pointer-events-auto"
          style={{ 
            background: 'var(--bg-surface-elevated)', 
            border: '1px solid var(--glass-border)' 
          }}
        >
          {/* Elegant top-right exit button */}
          <button 
            onClick={() => onStateChangeInitial('skipped')}
            className="absolute top-5 right-5 w-9 h-9 bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 rounded-full flex items-center justify-center text-[var(--text-primary)]/40 hover:text-[var(--text-primary)] transition-colors pointer-events-auto"
            aria-label="Close"
          >
            <X size={16} strokeWidth={2.5} />
          </button>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[var(--primary)]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Glowing MapPin Header */}
            <div className="relative w-20 h-20 mb-8 flex items-center justify-center">
              <div className="absolute inset-0 bg-[var(--primary)]/10 rounded-full animate-pulse-slow scale-110" />
              <div className="absolute inset-2 bg-[var(--primary)]/20 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
              <div className="relative w-16 h-16 bg-[var(--primary)]/10 rounded-2xl flex items-center justify-center shadow-inner">
                <MapPin size={32} className="text-[var(--primary)]" strokeWidth={2.5} />
              </div>
            </div>

            <h2 className="text-3xl font-black text-[var(--text-primary)] mb-4 tracking-tight">
              Find Rooms Near You
            </h2>
            
            <p className="text-[var(--text-primary)]/60 text-lg mb-10 max-w-sm leading-relaxed font-semibold">
              Allow location access to discover rooms, PGs and flats in your current area instantly.
            </p>

            <div className="w-full flex flex-col gap-4">
              <button
                onClick={requestLocation}
                disabled={loading}
                className="relative w-full py-5 bg-[var(--primary)] hover:bg-[var(--primary)]/95 text-white rounded-2xl font-black text-lg shadow-[0_10px_30px_rgba(255,82,17,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 overflow-hidden group pointer-events-auto"
              >
                {/* Shimmer gloss effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                {loading ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Navigation size={20} className="rotate-45" fill="currentColor" />
                    Use Current Location
                  </>
                )}
              </button>

              <button
                onClick={onManualSearch}
                className="w-full py-5 bg-black/5 dark:bg-white/5 text-[var(--text-primary)] hover:bg-black/10 dark:hover:bg-white/10 rounded-2xl font-black text-lg border border-black/5 dark:border-white/5 active:scale-[0.98] transition-all flex items-center justify-center gap-3 pointer-events-auto"
              >
                <Search size={20} strokeWidth={3} />
                Search Manually
              </button>
            </div>

            {error && (
              <p className="mt-6 text-red-500 font-bold text-sm animate-shake">
                {error}
              </p>
            )}

            <button 
              onClick={() => onStateChangeInitial('skipped')}
              className="mt-8 text-[var(--text-primary)]/40 font-bold text-sm hover:text-[var(--text-primary)]/80 transition-colors pointer-events-auto"
            >
              Skip for now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
