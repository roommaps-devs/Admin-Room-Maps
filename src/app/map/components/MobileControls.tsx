"use client";

import React from 'react';
import { Compass, Crosshair, MapPin } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setLiveUserPos, setSearchCenter, setMapZoom } from '@/store/mapSlice';
import { ResponseMessage } from '@/components/ResponseMessage';

interface MobileControlsProps {
  showRadiusPopup: boolean;
  setShowRadiusPopup: (show: boolean) => void;
  searchRadius: number;
  setSearchRadius: (radius: number) => void;
  setMapZoom: (zoom: number) => void;
  setShowRoomsList: (show: boolean) => void;
  playClickSound: () => void;
  // Locate Me Props
  reverseGeocode: (lat: number, lon: number) => Promise<string>;
  setMapCenter: (coords: [number, number]) => void;
  onPickLocation: () => void;
}

const MobileControls: React.FC<MobileControlsProps> = ({
  showRadiusPopup,
  setShowRadiusPopup,
  searchRadius,
  setSearchRadius,
  setMapZoom,
  playClickSound,
  reverseGeocode,
  setMapCenter,
  onPickLocation,
}) => {
  const dispatch = useDispatch();

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          dispatch(setLiveUserPos(coords));
          dispatch(setSearchCenter(coords));
          setMapCenter(coords);
          setMapZoom(16);
          reverseGeocode(coords[0], coords[1]);
          playClickSound();
        },
        (err) => {
          ResponseMessage({
            success: false,
            message: "Enable location to see rooms near you.",
            type: "error",
            data: null
          });
        },
        { timeout: 10000, maximumAge: 0 }
      );
    }
  };

  return (
    <div className="fixed bottom-[22px] left-0 right-0 z-[1001] px-4 pointer-events-none md:hidden flex flex-col items-center gap-3">

      {/* RANGE POPUP */}
      {showRadiusPopup && (
        <div
          className="flex items-center gap-1 p-1 rounded-2xl pointer-events-auto animate-in slide-in-from-bottom-3 duration-300 mb-1 shadow-2xl"
          style={{ background: 'var(--bg-surface-elevated)', backdropFilter: 'blur(24px)', border: '1px solid var(--glass-border)' }}
        >
          {[500, 1000, 5000, 10000].map((r) => (
            <button
              key={r}
              className={`px-4 py-2 rounded-xl text-[11px] font-black tracking-wide transition-all active:scale-95 ${searchRadius === r
                ? 'bg-[var(--primary)] text-white shadow-[0_4px_15px_rgba(255,82,17,0.4)]'
                : 'text-[var(--text-primary)]/40 hover:text-[var(--text-primary)]'
                }`}
              onClick={() => {
                setSearchRadius(r);
                if (r === 500) setMapZoom(16);
                else if (r === 1000) setMapZoom(15);
                else if (r === 5000) setMapZoom(13);
                else if (r === 10000) setMapZoom(12);
                setShowRadiusPopup(false);
              }}
            >
              {r >= 1000 ? `${r / 1000}km` : `${r}m`}
            </button>
          ))}
        </div>
      )}

      {/* COMPACT UNIFIED COMMAND BAR */}
      <div
        className="flex items-center h-12 rounded-[28px] pointer-events-auto shadow-2xl px-1 overflow-hidden w-full max-w-[300px]"
        style={{
          background: 'var(--bg-surface-elevated)',
          backdropFilter: 'blur(32px)',
          border: '1px solid var(--glass-border)',
        }}
      >
        {/* LOCATE */}
        <button
          className="flex-1 flex flex-col items-center justify-center gap-0.5 h-full text-[var(--text-primary)]/60 active:scale-95 transition-all cursor-pointer"
          onClick={handleLocateMe}
        >
          <Crosshair size={12} className="opacity-70" />
          <span className="text-[9px] font-black uppercase tracking-widest">Locate</span>
        </button>

        <div className="w-px h-6 bg-[var(--glass-border)] opacity-30" />

        {/* RADIUS - Central prominent button */}
        <button
          className={`flex-[1.5] flex flex-col items-center justify-center gap-0.5 h-full transition-all active:scale-95 cursor-pointer ${showRadiusPopup ? 'text-[var(--primary)]' : 'text-[var(--text-primary)]'}`}
          onClick={() => { setShowRadiusPopup(!showRadiusPopup); playClickSound(); }}
        >
          <div className="flex items-center gap-1.5">
            <Compass size={16} className={showRadiusPopup ? 'animate-spin-slow text-[var(--primary)]' : 'text-[var(--primary)]'} />
            <span className="text-[13px] font-black">
              {searchRadius >= 1000 ? `${searchRadius / 1000}km` : `${searchRadius}m`}
            </span>
          </div>
          <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-35">Range</span>
        </button>

        <div className="w-px h-6 bg-[var(--glass-border)] opacity-30" />

        {/* PICK SPOT */}
        <button
          className="flex-1 flex flex-col items-center justify-center gap-0.5 h-full text-[var(--text-primary)]/60 active:scale-95 transition-all cursor-pointer"
          onClick={() => { onPickLocation(); playClickSound(); }}
        >
          <MapPin size={12} className="opacity-70" />
          <span className="text-[9px] font-black uppercase tracking-widest">Pick</span>
        </button>
      </div>
    </div>
  );
};

export default MobileControls;
