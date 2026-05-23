"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Home, Map, PlusCircle, User, LayoutGrid } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useSelector((state: RootState) => state.user);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Hide BottomNav on specific pages to keep UI clean and focused
  const shouldHide = 
    pathname?.startsWith('/admin') || 
    pathname?.startsWith('/login') || 
    pathname?.startsWith('/register') || 
    pathname?.startsWith('/forgot-password') ||
    pathname === '/map' ||
    (pathname === '/' && !user);

  if (shouldHide) return null;

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[2001] px-4 pb-6 md:hidden block transform-gpu">
      <div 
        className="flex items-center justify-around h-[70px] bg-[var(--glass-bg)] backdrop-blur-2xl border border-[var(--glass-border)] rounded-[36px] shadow-[0_10px_30px_rgba(0,0,0,0.1)] overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-500 ease-out"
      >
        <Link href="/" className={`flex flex-col items-center justify-center gap-1 transition-colors duration-200 active:scale-95 ${isActive('/') ? 'text-[var(--primary)]' : 'text-[var(--text-primary)]/40'}`}>
          <div className="relative flex flex-col items-center">
            <Home size={22} strokeWidth={isActive('/') ? 2.5 : 2} />
            {isActive('/') && <div className="absolute -bottom-2 w-1.5 h-1.5 bg-[var(--primary)] rounded-full" />}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">Home</span>
        </Link>
        
        <Link href="/map" className={`flex flex-col items-center justify-center gap-1 transition-colors duration-200 active:scale-95 ${isActive('/map') && !pathname.includes('post=true') ? 'text-[var(--primary)]' : 'text-[var(--text-primary)]/40'}`}>
          <div className="relative flex flex-col items-center">
            <Map size={22} strokeWidth={isActive('/map') && !pathname.includes('post=true') ? 2.5 : 2} />
            {isActive('/map') && !pathname.includes('post=true') && <div className="absolute -bottom-2 w-1.5 h-1.5 bg-[var(--primary)] rounded-full" />}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">Map</span>
        </Link>

        <Link href="/listing" className={`flex flex-col items-center justify-center gap-1 transition-colors duration-200 active:scale-95 ${isActive('/listing') ? 'text-[var(--primary)]' : 'text-[var(--text-primary)]/40'}`}>
          <div className="relative flex flex-col items-center">
            <LayoutGrid size={22} strokeWidth={isActive('/listing') ? 2.5 : 2} />
            {isActive('/listing') && <div className="absolute -bottom-2 w-1.5 h-1.5 bg-[var(--primary)] rounded-full" />}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">List</span>
        </Link>
        
        <Link 
          href={user ? "/post" : `/login?redirect=/post`} 
          className={`flex flex-col items-center justify-center gap-1 transition-colors duration-200 active:scale-95 ${isActive('/post') ? 'text-[var(--primary)]' : 'text-[var(--text-primary)]/40'}`}
        >
          <div className="relative flex flex-col items-center">
            <PlusCircle size={22} strokeWidth={isActive('/post') ? 2.5 : 2} />
            {isActive('/post') && <div className="absolute -bottom-2 w-1.5 h-1.5 bg-[var(--primary)] rounded-full" />}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">Post</span>
        </Link>
        
        <Link 
          href={user ? "/profile" : `/login?redirect=/profile`} 
          className={`flex flex-col items-center justify-center gap-1 transition-colors duration-200 active:scale-95 ${isActive('/profile') ? 'text-[var(--primary)]' : 'text-[var(--text-primary)]/40'}`}
        >
          <div className="relative flex flex-col items-center">
            <User size={22} strokeWidth={isActive('/profile') ? 2.5 : 2} />
            {isActive('/profile') && <div className="absolute -bottom-2 w-1.5 h-1.5 bg-[var(--primary)] rounded-full" />}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">Profile</span>
        </Link>
      </div>
    </nav>
  );
}
