"use client";

import React from 'react';
import { Crosshair } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setLiveUserPos, setSearchCenter, setMapZoom } from '@/store/mapSlice';
import { ResponseMessage } from '@/components/ResponseMessage';

interface LocateMeButtonProps {
  reverseGeocode: (lat: number, lon: number) => Promise<string>;
  playClickSound: () => void;
  setMapCenter: (coords: [number, number]) => void;
}

const LocateMeButton: React.FC<LocateMeButtonProps> = ({
  reverseGeocode,
  playClickSound,
  setMapCenter,
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
          dispatch(setMapZoom(16));
          reverseGeocode(coords[0], coords[1]);
          playClickSound();
        },
        (err) => {
          if (process.env.NODE_ENV !== "production") console.error(`Location access error (${err.code}): ${err.message}`);
          ResponseMessage({
            success: false,
            message: "Failed to access location. Please enable location services.",
            type: "error",
            data: null
          });
        },
        { timeout: 10000, maximumAge: 0 }
      );
    } else {
      ResponseMessage({
        success: false,
        message: "Location is not supported by your browser.",
        type: "error",
        data: null
      });
    }
  };

  return (
    <button
      className="fixed bottom-[190px] right-4 z-[1001] w-12 h-12 bg-[var(--bg-surface-elevated)]/80 backdrop-blur-xl border border-[var(--glass-border)] rounded-2xl flex items-center justify-center text-[var(--text-primary)] shadow-lg transition-all hover:bg-[var(--bg-surface-elevated)] active:scale-90"
      onClick={handleLocateMe}
      title="Locate Me"
    >
      <Crosshair size={20} />
    </button>
  );
};

export default LocateMeButton;
