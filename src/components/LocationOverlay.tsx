"use client";

import React, { useState } from 'react';
import { MapPin, Search, Navigation, Compass } from 'lucide-react';

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
      },
      (err) => {
        console.error(err);
        setError("Location access denied. Please search manually.");
        onStateChangeInitial('denied');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-500">
      <div className="bg-white rounded-[40px] shadow-2xl max-w-lg w-full overflow-hidden p-8 md:p-12 relative border border-white/20">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#FF5733]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-[#FF5733]/10 rounded-3xl flex items-center justify-center mb-8 animate-bounce duration-[2000ms]">
            <MapPin size={40} className="text-[#FF5733]" strokeWidth={2.5} />
          </div>

          <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">
            Find Rooms Near You
          </h2>
          
          <p className="text-gray-500 text-lg mb-10 max-w-sm leading-relaxed">
            Allow location access to discover rooms, PGs and flats in your current area instantly.
          </p>

          <div className="w-full flex flex-col gap-4">
            <button
              onClick={requestLocation}
              disabled={loading}
              className="w-full py-5 bg-[#FF5733] text-white rounded-2xl font-black text-lg shadow-[0_10px_30px_rgba(255,87,51,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Navigation size={20} fill="currentColor" />
                  Use Current Location
                </>
              )}
            </button>

            <button
              onClick={onManualSearch}
              className="w-full py-5 bg-gray-50 text-gray-900 rounded-2xl font-black text-lg border border-gray-100 hover:bg-gray-100 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
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
            className="mt-8 text-gray-400 font-bold text-sm hover:text-gray-600 transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
