"use client";

import React from 'react';

interface CustomSelectProps {
  label: string;
  name: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  showRequired?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export const CustomSelect = ({
  label,
  name,
  options,
  value,
  onChange,
  placeholder = "Select option",
  error,
  showRequired = false,
  disabled = false,
  className = "",
  icon
}: CustomSelectProps) => {
  return (
    <div className={`w-full ${className}`}>
      <label htmlFor={name} className="text-[10px] font-black tracking-[0.2em] text-[var(--text-primary)]/40 uppercase py-2 block">
        {label}
        {showRequired && <span className="text-red-500"> *</span>}
      </label>
      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full bg-[var(--bg-surface)] border rounded-2xl px-5 py-4 text-base md:text-sm text-[var(--text-primary)] appearance-none focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all ${
            error ? "border-red-500/50" : "border-[var(--glass-border)]"
          } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-primary)]/20">
          {icon || (
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
      </div>
      {error && <p className="text-red-500 text-[11px] font-bold mt-2 px-1">{error}</p>}
    </div>
  );
};
