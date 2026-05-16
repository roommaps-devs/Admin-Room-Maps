"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { ArrowLeft, Home, MapPin, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function PostRedirectPage() {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.user);

  // Instead of a separate complex form, we redirect to the map with the post action active
  // This ensures consistent location picking logic.
  
  const handleStartPosting = () => {
    if (!user) {
      router.push('/login?redirect=/map?action=post');
    } else {
      router.push('/map?action=post');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-32 pb-20 px-6 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full text-center">
        <div className="w-20 h-20 bg-[#FF5733]/10 rounded-[32px] flex items-center justify-center text-[#FF5733] mx-auto mb-8 shadow-xl shadow-[#FF5733]/10">
          <Sparkles size={32} fill="currentColor" className="opacity-20" />
          <Home size={32} className="absolute" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-sans font-black text-[#0A0A0A] mb-6 tracking-tight">
          Post Your Room for <span className="text-[#FF5733]">Free.</span>
        </h1>
        
        <p className="text-lg text-[#6B6B6B] font-medium mb-12 leading-relaxed">
          Reach thousands of verified tenants across India. <br />
          Zero brokerage. Zero hidden fees. Direct contact.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white p-8 rounded-[32px] border border-[#0A0A0A]/5 text-left shadow-sm">
            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600 mb-4">
              <MapPin size={20} />
            </div>
            <h3 className="font-bold text-[#0A0A0A] mb-2">Smart Location</h3>
            <p className="text-xs text-[#6B6B6B] font-medium leading-relaxed">Pin your exact location on our interactive map for better tenant matching.</p>
          </div>
          <div className="bg-white p-8 rounded-[32px] border border-[#0A0A0A]/5 text-left shadow-sm">
            <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-600 mb-4">
              <Sparkles size={20} />
            </div>
            <h3 className="font-bold text-[#0A0A0A] mb-2">Instant Visibility</h3>
            <p className="text-xs text-[#6B6B6B] font-medium leading-relaxed">Your listing goes live instantly after a quick verification check.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={handleStartPosting}
            className="w-full sm:w-auto px-12 py-5 bg-[#FF5733] text-white rounded-full font-black text-lg shadow-[0_20px_40px_rgba(255,87,51,0.3)] hover:scale-105 hover:shadow-[0_25px_50px_rgba(255,87,51,0.4)] transition-all active:scale-95"
          >
            Start Posting Now
          </button>
          <Link 
            href="/"
            className="w-full sm:w-auto px-12 py-5 bg-white text-[#0A0A0A] border border-[#0A0A0A]/5 rounded-full font-bold text-lg hover:bg-[#0A0A0A]/5 transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
