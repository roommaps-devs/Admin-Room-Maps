"use client";

import { Home } from 'lucide-react';

export default function MapLoading({ message = "Initializing Map & Searching Nearby..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-[var(--bg-color)] z-[10000] flex items-center justify-center overflow-hidden">
      <div className="absolute w-[300px] h-[300px] bg-[var(--primary)]/20 rounded-full blur-[100px] animate-pulse"></div>
      <div className="flex flex-col items-center gap-6 relative z-10 animate-in fade-in zoom-in duration-1000">
        <div className="relative w-20 h-20 bg-[var(--primary)] rounded-3xl flex items-center justify-center text-[var(--text-primary)] shadow-[0_10px_40px_rgba(255,82,17,0.3)] mb-2">
          <Home size={32} />
          <div className="absolute inset-0 bg-[var(--primary)]/50 rounded-3xl animate-ping opacity-75"></div>
        </div>
        <h2 className="text-2xl font-black text-[var(--text-primary)] tracking-tighter">RoomMaps</h2>
        <div className="w-48 h-1 bg-[var(--bg-surface)] rounded-full overflow-hidden">
          <div className="w-full h-full bg-[var(--primary)] origin-left animate-[loadingBar_2s_infinite_ease-in-out]"></div>
        </div>
        <p className="text-[var(--text-primary)]/40 text-sm font-medium tracking-wide">{message}</p>
      </div>
      <style jsx>{`
        @keyframes loadingBar {
          0% { transform: scaleX(0); transform-origin: left; }
          45% { transform: scaleX(1); transform-origin: left; }
          50% { transform: scaleX(1); transform-origin: right; }
          100% { transform: scaleX(0); transform-origin: right; }
        }
      `}</style>
    </div>
  );
}
