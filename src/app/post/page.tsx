"use client";

import React, { useState, useEffect } from 'react';
import PostListingForm from '@/components/map/PostListingForm';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import LogoWordmark from '@/components/ui/LogoWordmark';
import { ArrowLeft, Lock, Loader2 } from 'lucide-react';

export default function PostPage() {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.user);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[var(--bg-color)] flex items-center justify-center">
        <Loader2 className="animate-spin text-[var(--primary)]" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)]">
      {/* Navbar for this specific page */}
      <nav className="sticky top-0 z-[100] bg-[var(--bg-color)]/80 backdrop-blur-xl border-b border-[var(--glass-border)] px-6 py-4">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <LogoWordmark variant="nav" />
          
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-bold text-[var(--text-primary)]/50 hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft size={18} />
            Back
          </button>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-4 md:px-6 py-6 md:py-12">
        <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-16 items-start">
          {/* Info & Guidelines (Below form on mobile, Left on desktop) */}
          <div className="w-full lg:w-[40%] lg:sticky lg:top-32 space-y-8 lg:space-y-10">
            <div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-4">List Your <span className="text-[var(--primary)]">Property</span></h1>
              <p className="text-[var(--text-primary)]/50 text-lg leading-relaxed">
                Connect with thousands of seekers looking for their next home. Zero brokerage, 100% direct contact.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-[var(--bg-surface)] rounded-2xl flex items-center justify-center text-[var(--primary)] flex-shrink-0">
                  <span className="font-black">1</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Enter Details</h3>
                  <p className="text-sm text-[var(--text-primary)]/40">Provide basic info, location, and amenities of your property.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-[var(--bg-surface)] rounded-2xl flex items-center justify-center text-[var(--primary)] flex-shrink-0">
                  <span className="font-black">2</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Upload Photos</h3>
                  <p className="text-sm text-[var(--text-primary)]/40">Add high-quality photos to make your listing stand out.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-[var(--bg-surface)] rounded-2xl flex items-center justify-center text-[var(--primary)] flex-shrink-0">
                  <span className="font-black">3</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Go Live</h3>
                  <p className="text-sm text-[var(--text-primary)]/40">Your listing will be instantly visible to seekers on our map.</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-[var(--primary)]/5 border border-[var(--primary)]/20 rounded-3xl">
              <p className="text-sm text-[var(--primary)] font-medium leading-relaxed">
                <strong>Pro Tip:</strong> Listings with more than 3 clear photos get 5x more inquiries.
              </p>
            </div>
          </div>

          {/* Right Side: The Form (Now top on mobile) */}
          <div className="w-full lg:w-[60%] bg-[var(--bg-surface-elevated)] md:border md:border-[var(--glass-border)] md:rounded-[40px] overflow-hidden md:shadow-2xl">
            {user ? (
              <PostListingForm isInline onSuccess={() => router.push('/map')} />
            ) : (
              <div className="p-8 md:p-24 text-center flex flex-col items-center gap-8 bg-[var(--bg-surface-elevated)]/50 backdrop-blur-xl h-full justify-center min-h-[400px]">
                <div className="w-24 h-24 bg-[var(--primary)]/10 rounded-[32px] flex items-center justify-center text-[var(--primary)] shadow-inner">
                  <Lock size={48} strokeWidth={2.5} />
                </div>
                <div className="space-y-3">
                  <h2 className="text-3xl font-black tracking-tight">Login Required</h2>
                  <p className="text-[var(--text-primary)]/40 font-medium max-w-[300px] mx-auto leading-relaxed">
                    Join RoomMaps today to list your property and reach thousands of seekers.
                  </p>
                </div>
                <button 
                  onClick={() => router.push('/login?redirect=/post')}
                  className="w-full max-w-[280px] py-5 bg-[var(--primary)] text-white font-black rounded-2xl shadow-[0_20px_40px_rgba(255,82,17,0.3)] hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-xs"
                >
                  Sign In to Continue
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-[var(--glass-border)] py-12 mt-12">
        <div className="max-w-[1200px] mx-auto px-6 text-center text-[var(--text-primary)]/20 text-xs font-bold tracking-widest uppercase">
          &copy; 2026 RoomMaps &bull; India's Premium Direct-Rental Platform
        </div>
      </footer>
    </div>
  );
}
