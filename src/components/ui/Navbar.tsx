"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LogOut, Settings, User } from 'lucide-react';
import LogoWordmark from './LogoWordmark';
import ModeToggle, { AppMode } from './ModeToggle';

export default function Navbar({ mode, setMode, user, logout, isProfileMenuOpen, openProfileMenu, closeProfileMenu, menuRef }: {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  user: any;
  logout: () => void;
  isProfileMenuOpen: boolean;
  openProfileMenu: () => void;
  closeProfileMenu: () => void;
  menuRef: React.RefObject<HTMLDivElement | null>;
}) {
  
  // Handle outside clicks to close profile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeProfileMenu();
      }
    };
    if (isProfileMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileMenuOpen, menuRef, closeProfileMenu]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[2000] flex justify-center items-center px-[5%] py-3 bg-[var(--glass-bg)] backdrop-blur-[24px] backdrop-saturate-[180%] border-b border-[var(--glass-border)] w-full transition-all duration-300 shadow-[0_1px_1px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.03)]">
      <div className="flex justify-between items-center w-full max-w-[1200px]">
        <div className="flex items-center gap-16 flex-1">
          <LogoWordmark variant="nav" />
          <Link href="/listing" className="hidden md:block text-[14px] font-bold text-[#64748b] hover:text-[#ff5211] transition-colors uppercase tracking-[0.2em]">
            Browse
          </Link>
        </div>

        <div className="hidden md:flex items-center justify-center flex-[2]">
          <ModeToggle 
            mode={mode}
            onChange={setMode}
          />
        </div>

        <div className="flex justify-end items-center flex-1">
          <div className="flex items-center gap-4">
            {user ? (
              <div ref={menuRef} className="relative flex items-center">
                <div
                  className={`
                    flex items-center gap-3 p-1 sm:pl-5 sm:pr-1.5
                    bg-[var(--bg-surface)]/60 backdrop-blur-2xl rounded-full 
                    border border-[var(--glass-border)] 
                    transition-all duration-500 cursor-pointer 
                    shadow-[0_4px_16px_rgba(0,0,0,0.02)] 
                    hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] 
                    hover:border-[var(--primary)]/20 hover:-translate-y-0.5 active:scale-95
                    ${isProfileMenuOpen ? 'ring-2 ring-[var(--primary)]/20 border-[var(--primary)]/30 bg-[var(--bg-surface-elevated)]' : ''}
                  `}
                  onClick={() => isProfileMenuOpen ? closeProfileMenu() : openProfileMenu()}
                >
                  <span className="hidden sm:inline text-[14px] font-bold text-[var(--text-primary)] tracking-tight whitespace-nowrap">{user.name || user.displayName}</span>
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-md">
                    <Image
                      src={user.image || user.photoURL || `https://ui-avatars.com/api/?name=${user.name || user.displayName}`}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {isProfileMenuOpen && (
                  <div className="absolute top-[135%] right-0 sm:right-0 bg-[var(--bg-surface-elevated)]/98 backdrop-blur-[32px] border border-[var(--glass-border)] shadow-[0_40px_80px_rgba(0,0,0,0.18)] rounded-[32px] p-2.5 min-w-[260px] z-50 animate-in fade-in zoom-in-95 duration-300 origin-top-right">
                    <div className="flex items-center gap-3.5 p-4 mb-2.5 bg-[var(--bg-surface)]/80 rounded-[24px] text-left border border-[var(--glass-border)]">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md shrink-0">
                        <Image
                          src={user.image || user.photoURL || `https://ui-avatars.com/api/?name=${user.name || user.displayName}`}
                          alt="Profile"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <strong className="text-[var(--text-primary)] text-[16px] font-sans font-bold tracking-tight truncate">{user.name || user.displayName}</strong>
                        <span className="text-[11px] font-black text-[var(--text-primary)]/30 tracking-widest uppercase truncate">{user.email?.split('@')[0]}</span>
                      </div>
                    </div>
                    
                    <div className="px-1.5 space-y-1">
                      <Link 
                        href="/profile" 
                        className="flex items-center gap-3.5 w-full px-4 py-3 rounded-2xl text-[14px] font-bold transition-all duration-300 text-[var(--text-primary)]/60 hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] group"
                        onClick={closeProfileMenu}
                      >
                        <div className="w-9 h-9 rounded-xl bg-[var(--bg-surface)] flex items-center justify-center group-hover:bg-[var(--primary)]/10 group-hover:text-[var(--primary)] transition-all duration-300 group-hover:scale-105">
                          <User size={18} strokeWidth={2.5} />
                        </div>
                        View Profile
                      </Link>
                      <Link 
                        href="/profile/settings" 
                        className="flex items-center gap-3.5 w-full px-4 py-3 rounded-2xl text-[14px] font-bold transition-all duration-300 text-[var(--text-primary)]/60 hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] group"
                        onClick={closeProfileMenu}
                      >
                        <div className="w-9 h-9 rounded-xl bg-[var(--bg-surface)] flex items-center justify-center group-hover:bg-[var(--primary)]/10 group-hover:text-[var(--primary)] transition-all duration-300 group-hover:scale-105">
                          <Settings size={18} strokeWidth={2.5} />
                        </div>
                        Account Settings
                      </Link>
                      
                      <div className="h-px bg-[var(--glass-border)] mx-4 my-2" />

                      <button 
                        className="flex items-center gap-3.5 w-full px-4 py-3 rounded-2xl text-[14px] font-bold transition-all duration-300 text-red-500/70 hover:text-red-600 hover:bg-red-500/5 group" 
                        onClick={logout}
                      >
                        <div className="w-9 h-9 rounded-xl bg-red-500/5 flex items-center justify-center group-hover:bg-red-500/10 transition-all duration-300">
                          <LogOut size={18} strokeWidth={2.5} />
                        </div>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="inline-flex items-center px-6 h-[40px] rounded-full text-sm font-black text-[var(--text-primary)]/90 no-underline border border-[var(--glass-border)] bg-white/70 backdrop-blur-md transition-all duration-500 whitespace-nowrap shadow-sm hover:shadow-md hover:bg-white hover:text-[var(--primary)] hover:-translate-y-0.5 active:scale-95">Sign In</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
