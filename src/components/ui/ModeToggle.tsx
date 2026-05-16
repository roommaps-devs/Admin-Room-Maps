"use client";

import { Home as HomeIcon, Plane } from 'lucide-react';
import { cn } from '@/lib/utils';

export type AppMode = 'rent' | 'travelers';

interface ModeToggleProps {
  mode: AppMode;
  onChange: (mode: AppMode) => void;
}

export default function ModeToggle({ mode, onChange }: ModeToggleProps) {
  const rentActive = mode === 'rent';
  const travelActive = mode === 'travelers';

  return (
    <div className="relative flex items-center p-1 rounded-full h-[42px] bg-[var(--bg-surface)] border border-[var(--glass-border)] w-full max-w-[280px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]">
      {/* Selection Slider with Glow */}
      <div
        className={cn(
          "absolute h-[calc(100%-8px)] rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-[1]",
          "bg-gradient-to-br from-[#FF6B35] via-[#FF5211] to-[#E84300]",
          "shadow-[0_4px_12px_rgba(255,82,17,0.35)]",
          travelActive ? 'translate-x-full' : 'translate-x-0'
        )}
        style={{ width: 'calc(50% - 4px)', left: '4px' }}
      />

      <button
        onClick={() => onChange('rent')}
        className={cn(
          "group/rent relative z-[2] w-1/2 h-full flex items-center justify-center gap-2.5 font-bold text-[13px] transition-all duration-300 outline-none",
          rentActive ? "text-white" : "text-[var(--text-primary)]/40 hover:text-[var(--text-primary)]/70"
        )}
      >
        <HomeIcon
          size={16}
          className={cn(
            "transition-all duration-500",
            rentActive ? "scale-110" : "group-hover/rent:-translate-y-0.5"
          )}
        />
        <span className="tracking-tight">For Rent</span>
      </button>

      <button
        onClick={() => onChange('travelers')}
        className={cn(
          "group/stays relative z-[2] w-1/2 h-full flex items-center justify-center gap-2.5 font-bold text-[13px] transition-all duration-300 outline-none",
          travelActive ? "text-white" : "text-[var(--text-primary)]/40 hover:text-[var(--text-primary)]/70"
        )}
      >
        {/* Info Popover */}
        <div className="absolute top-[120%] left-1/2 -translate-x-1/2 w-[240px] opacity-0 translate-y-2 group-hover/stays:opacity-100 group-hover/stays:translate-y-0 transition-all duration-500 pointer-events-none z-[50]">
          <div className="relative bg-white dark:bg-[#1A1A1E] p-5 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-[var(--glass-border)] text-left">
            {/* Arrow */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-[#1A1A1E] border-t border-l border-[var(--glass-border)] rotate-45" />

            <div className="relative space-y-1.5">
              <h4 className="text-[11px] font-black text-[#FF5211] tracking-[0.1em] uppercase">Short-term Stays</h4>
              <p className="text-[13px] font-medium text-[var(--text-primary)]/70 leading-relaxed">
                Daily rentals and short-term visits under 30 days.
              </p>
            </div>
          </div>
        </div>

        <Plane
          size={16}
          className={cn(
            "transition-all duration-500",
            travelActive ? "scale-110 rotate-[15deg]" : "group-hover/stays:-translate-y-0.5 rotate-[-5deg]"
          )}
        />
        <span className="tracking-tight">Stays</span>
      </button>

      {/* HOTEL Badge - Always Visible at the end */}
      <div className={cn(
        "absolute -top-1 right-2 px-1.5 py-0.5 rounded-full border bg-white dark:bg-[#1A1A1E] shadow-[0_2px_10px_rgba(0,0,0,0.06)] transition-all duration-500 pointer-events-none z-[60]",
        "border-[#FF5211]",
        travelActive ? "scale-100 -translate-y-0.5" : "scale-90"
      )}>
        <span className="text-[10px] font-black text-[#FF0000] tracking-[0.1em] leading-none block uppercase">Hotels</span>
      </div>
    </div>
  );
}
