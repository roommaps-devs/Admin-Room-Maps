import Link from 'next/link';
import { MapPin, Home, Search, Map } from 'lucide-react';
import type { Metadata } from 'next';
import GoBackButton from '@/components/ui/GoBackButton';

export const metadata: Metadata = {
  title: '404 — Page Not Found | RoomMaps',
  description: 'The page you are looking for does not exist. Find verified rooms and stays across India on RoomMaps.',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center px-6 overflow-hidden">

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse,rgba(255,87,51,0.06)_0%,transparent_70%)]" />
      </div>

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF5733]/40 to-transparent" />

      {/* Floating decorative elements */}
      <div className="absolute top-[15%] left-[8%] w-10 h-10 rounded-2xl bg-white border border-[#0A0A0A]/5 shadow-sm flex items-center justify-center text-[#FF5733]/30 animate-bounce" style={{ animationDuration: '3s' }}>
        <Home size={18} />
      </div>
      <div className="absolute top-[20%] right-[10%] w-10 h-10 rounded-full bg-[#FF5733]/5 border border-[#FF5733]/10 flex items-center justify-center text-[#FF5733]/40 animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }}>
        <MapPin size={16} />
      </div>
      <div className="absolute bottom-[25%] left-[12%] w-8 h-8 rounded-xl bg-white border border-[#0A0A0A]/5 shadow-sm flex items-center justify-center text-[#0A0A0A]/20 animate-bounce" style={{ animationDuration: '5s', animationDelay: '1s' }}>
        <Search size={14} />
      </div>
      <div className="absolute bottom-[20%] right-[8%] w-9 h-9 rounded-2xl bg-white border border-[#0A0A0A]/5 shadow-sm flex items-center justify-center text-[#0A0A0A]/20 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.8s' }}>
        <Map size={15} />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-lg w-full">

        {/* 404 Number */}
        <div className="relative mb-6 select-none">
          <span className="text-[120px] md:text-[160px] font-black leading-none tracking-tighter text-[#0A0A0A]/[0.04]">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-1">
              <span className="text-[72px] md:text-[96px] font-black leading-none tracking-tighter text-[#0A0A0A]">4</span>
              <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-[#FF5733] flex items-center justify-center shadow-[0_15px_35px_rgba(255,87,51,0.3)] mx-1">
                <MapPin size={28} className="text-white fill-white/20" />
              </div>
              <span className="text-[72px] md:text-[96px] font-black leading-none tracking-tighter text-[#0A0A0A]">4</span>
            </div>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-2xl md:text-3xl font-black text-[#0A0A0A] mb-3 tracking-tight">
          This room doesn't exist
        </h1>
        <p className="text-[#6B6B6B] font-medium text-base md:text-lg mb-10 leading-relaxed">
          The page you're looking for has moved, or never existed.<br />
          Let's get you back to finding your perfect room.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-7 py-3.5 bg-[#FF5733] text-white rounded-full font-black text-sm shadow-[0_12px_30px_rgba(255,87,51,0.25)] hover:scale-105 hover:shadow-[0_18px_40px_rgba(255,87,51,0.35)] transition-all duration-300 active:scale-95 no-underline"
          >
            <Home size={16} />
            Back to Home
          </Link>
          <Link
            href="/map"
            className="flex items-center gap-2.5 px-7 py-3.5 bg-white text-[#0A0A0A] rounded-full font-black text-sm border border-[#0A0A0A]/8 hover:border-[#0A0A0A]/15 hover:scale-105 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition-all duration-300 active:scale-95 no-underline"
          >
            <Map size={16} />
            Explore Map
          </Link>
        </div>

        {/* Quick links */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="text-[11px] font-black text-[#0A0A0A]/25 uppercase tracking-widest">Quick:</span>
          {[
            { label: 'Browse Listings', href: '/listing' },
            { label: 'Post a Room', href: '/post' },
            { label: 'Sign In', href: '/login' },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="px-4 py-1.5 rounded-full text-[12px] font-bold text-[#6B6B6B] bg-white border border-[#0A0A0A]/8 hover:bg-[#0A0A0A] hover:text-white hover:border-transparent transition-all duration-200 no-underline"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom back link */}
      <GoBackButton />
    </div>
  );
}
