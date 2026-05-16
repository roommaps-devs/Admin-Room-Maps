"use client";

import React from 'react';
import { X, MapPin, ShieldCheck, Share2, Heart, MessageCircle, Phone } from 'lucide-react';
import Image from 'next/image';
import { Room } from '@/lib/types';

interface RoomDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room | null;
  searchCenter?: [number, number];
  viewMode?: 'bottom-sheet' | 'centered';
}

export default function RoomDetailModal({ isOpen, onClose, room }: RoomDetailModalProps) {
  if (!isOpen || !room) return null;

  return (
    <div 
      className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className={`bg-white rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col md:flex-row max-h-[90dvh]`}
        onClick={e => e.stopPropagation()}
      >
        {/* Left: Image Section */}
        <div className="relative w-full md:w-1/2 h-64 md:h-auto bg-gray-100">
          <Image 
            src={room.image || "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop"}
            alt={room.name}
            fill
            className="object-cover"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <div className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl text-[10px] font-black text-[#0A0A0A] shadow-sm flex items-center gap-1">
              <ShieldCheck size={12} className="text-[#22c55e]" />
              VERIFIED
            </div>
          </div>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Right: Info Section */}
        <div className="flex-1 p-8 flex flex-col relative">
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-full hidden md:flex items-center justify-center text-gray-400 transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-2 text-[#6B6B6B] text-[10px] font-black uppercase tracking-[0.2em] mb-4">
            <MapPin size={12} className="text-[#FF5733]" />
            {room.city}
          </div>

          <h2 className="text-3xl font-black text-[#0A0A0A] mb-2 leading-tight pr-10">{room.name}</h2>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#6B6B6B] uppercase tracking-tighter">Rent</span>
              <span className="text-2xl font-black text-[#FF5733]">₹{room.rent.toLocaleString('en-IN')}<span className="text-sm text-gray-400 font-bold">/mo</span></span>
            </div>
            <div className="w-px h-10 bg-gray-100" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#6B6B6B] uppercase tracking-tighter">Type</span>
              <span className="text-sm font-black text-[#0A0A0A]">{room.type || 'Standard'}</span>
            </div>
          </div>

          <p className="text-gray-500 font-medium leading-relaxed mb-8 flex-1">
            Experience premium living in this verified property located in the heart of {room.city}. 
            This space is meticulously maintained and features all essential amenities for a comfortable stay.
          </p>

          <div className="flex flex-col gap-3 mt-auto">
            <button className="w-full py-5 bg-[#FF5733] text-white rounded-2xl font-black text-lg shadow-[0_15px_35px_rgba(255,87,51,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
              <Phone size={20} fill="currentColor" />
              Contact Owner
            </button>
            <div className="flex gap-3">
              <button className="flex-1 py-4 bg-gray-50 text-gray-900 rounded-2xl font-bold text-sm hover:bg-gray-100 transition-all flex items-center justify-center gap-2 border border-gray-100">
                <MessageCircle size={18} /> Chat
              </button>
              <button className="w-14 h-14 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center hover:text-[#FF5733] hover:bg-[#FF5733]/5 transition-all border border-gray-100">
                <Heart size={20} />
              </button>
              <button className="w-14 h-14 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center hover:text-blue-500 hover:bg-blue-50/50 transition-all border border-gray-100">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
