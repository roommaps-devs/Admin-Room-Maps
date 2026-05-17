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
    pathname?.startsWith('/forgot-password');

  if (shouldHide) return null;

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[2001] px-4 pb-6 md:hidden block">
      <div 
        className="flex items-center justify-around h-16 bg-[var(--glass-bg)] backdrop-blur-[32px] border border-[var(--glass-border)] rounded-[32px] shadow-[0_12px_40px_rgba(0,0,0,0.15)] overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-500 ease-out"
      >
        <Link href="/" className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 active:scale-90 ${isActive('/') ? 'text-[var(--primary)]' : 'text-[var(--text-primary)]/40'}`}>
          <div className="relative flex flex-col items-center">
            <Home size={20} strokeWidth={isActive('/') ? 2.5 : 2.2} className={isActive('/') ? 'drop-shadow-[0_0_12px_rgba(255,82,17,0.4)] scale-110' : ''} />
            {isActive('/') && <div className="absolute -bottom-1 w-1 h-1 bg-[var(--primary)] rounded-full shadow-[0_0_8px_rgba(255,82,17,0.8)]" />}
          </div>
          <span className={`text-[9px] font-black uppercase tracking-widest ${isActive('/') ? 'opacity-100' : 'opacity-40'}`}>Home</span>
        </Link>
        
        <Link href="/map" className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 active:scale-90 ${isActive('/map') && !pathname.includes('post=true') ? 'text-[var(--primary)]' : 'text-[var(--text-primary)]/40'}`}>
          <div className="relative flex flex-col items-center">
            <Map size={20} strokeWidth={isActive('/map') && !pathname.includes('post=true') ? 2.5 : 2.2} className={isActive('/map') && !pathname.includes('post=true') ? 'drop-shadow-[0_0_12px_rgba(255,82,17,0.4)] scale-110' : ''} />
            {isActive('/map') && !pathname.includes('post=true') && <div className="absolute -bottom-1 w-1 h-1 bg-[var(--primary)] rounded-full shadow-[0_0_8px_rgba(255,82,17,0.8)]" />}
          </div>
          <span className={`text-[9px] font-black uppercase tracking-widest ${isActive('/map') && !pathname.includes('post=true') ? 'opacity-100' : 'opacity-40'}`}>Map</span>
        </Link>

        <Link href="/listing" className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 active:scale-90 ${isActive('/listing') ? 'text-[var(--primary)]' : 'text-[var(--text-primary)]/40'}`}>
          <div className="relative flex flex-col items-center">
            <LayoutGrid size={20} strokeWidth={isActive('/listing') ? 2.5 : 2.2} className={isActive('/listing') ? 'drop-shadow-[0_0_12px_rgba(255,82,17,0.4)] scale-110' : ''} />
            {isActive('/listing') && <div className="absolute -bottom-1 w-1 h-1 bg-[var(--primary)] rounded-full shadow-[0_0_8px_rgba(255,82,17,0.8)]" />}
          </div>
          <span className={`text-[9px] font-black uppercase tracking-widest ${isActive('/listing') ? 'opacity-100' : 'opacity-40'}`}>List</span>
        </Link>
        
        <Link 
          href={user ? "/map?post=true" : `/login?redirect=/map?post=true`} 
          className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 active:scale-90 ${pathname.includes('post=true') ? 'text-[var(--primary)]' : 'text-[var(--text-primary)]/40'}`}
        >
          <div className="relative flex flex-col items-center">
            <PlusCircle size={20} strokeWidth={pathname.includes('post=true') ? 2.5 : 2.2} className={pathname.includes('post=true') ? 'drop-shadow-[0_0_12px_rgba(255,82,17,0.4)] scale-110' : ''} />
            {pathname.includes('post=true') && <div className="absolute -bottom-1 w-1 h-1 bg-[var(--primary)] rounded-full shadow-[0_0_8px_rgba(255,82,17,0.8)]" />}
          </div>
          <span className={`text-[9px] font-black uppercase tracking-widest ${pathname.includes('post=true') ? 'opacity-100' : 'opacity-40'}`}>Post</span>
        </Link>
        
        <Link 
          href={user ? "/profile" : `/login?redirect=/profile`} 
          className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 active:scale-90 ${isActive('/profile') ? 'text-[var(--primary)]' : 'text-[var(--text-primary)]/40'}`}
        >
          <div className="relative flex flex-col items-center">
            <User size={20} strokeWidth={isActive('/profile') ? 2.5 : 2.2} className={isActive('/profile') ? 'drop-shadow-[0_0_12px_rgba(255,82,17,0.4)] scale-110' : ''} />
            {isActive('/profile') && <div className="absolute -bottom-1 w-1 h-1 bg-[var(--primary)] rounded-full shadow-[0_0_8px_rgba(255,82,17,0.8)]" />}
          </div>
          <span className={`text-[9px] font-black uppercase tracking-widest ${isActive('/profile') ? 'opacity-100' : 'opacity-40'}`}>Profile</span>
        </Link>
      </div>
    </nav>
  );
}
