"use client";

import React, { useMemo } from 'react';
import { useRooms, resolveImageUrl } from '@/lib/hooks/useRooms';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, IndianRupee, Star, ShieldCheck, Search, Home } from 'lucide-react';

export default function ListingPage() {
  const { data: rooms, isLoading } = useRooms();
  const { mode } = useSelector((state: RootState) => state.ui);
  
  const filteredRooms = useMemo(() => {
    return rooms.filter(room => (room.category || 'rent') === mode);
  }, [rooms, mode]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--primary)]/20 border-t-[var(--primary)] rounded-full animate-spin" />
          <p className="text-[var(--text-primary)]/40 font-bold tracking-widest uppercase text-xs">Finding Stays...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-sans font-black text-[#0A0A0A] mb-4 tracking-tight">
              {mode === 'travelers' ? 'Daily Stays' : 'Available Rooms'}
            </h1>
            <p className="text-[#6B6B6B] font-medium">
              Showing {filteredRooms.length} verified listings across India
            </p>
          </div>
          <Link 
            href="/map" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A0A0A] text-white rounded-2xl font-bold text-sm hover:scale-105 transition-all active:scale-95 shadow-xl"
          >
            <Search size={16} />
            View on Map
          </Link>
        </div>

        {/* Grid */}
        {filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredRooms.map((room) => (
              <Link 
                key={room.id} 
                href={`/map?id=${room.id}`}
                className="group flex flex-col bg-white rounded-[32px] overflow-hidden border border-[#0A0A0A]/5 hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500"
              >
                <div className="relative h-64 overflow-hidden">
                  {resolveImageUrl(room.image) ? (
                    <Image
                      src={resolveImageUrl(room.image)}
                      alt={room.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 border-b border-gray-150 gap-2 relative select-none">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100/50" />
                      <Home size={34} className="text-gray-300 relative z-10 group-hover:scale-110 transition-transform duration-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 relative z-10">No Image Available</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4 px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl text-xs font-black text-[#0A0A0A] shadow-sm flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-[#22c55e]" />
                    VERIFIED
                  </div>
                  {room.isTrending && (
                    <div className="absolute top-4 right-4 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-[#0A0A0A] shadow-lg animate-bounce">
                      <Star size={18} fill="currentColor" />
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 px-4 py-2 bg-[#FF5733] text-white rounded-xl text-sm font-black shadow-lg">
                    ₹{room.rent.toLocaleString('en-IN')}/{mode === 'travelers' ? 'day' : 'mo'}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-[#6B6B6B] text-[10px] font-black uppercase tracking-widest mb-2">
                    <MapPin size={12} />
                    {room.city}
                  </div>
                  <h3 className="text-xl font-bold text-[#0A0A0A] mb-4 line-clamp-1 group-hover:text-[#FF5733] transition-colors">{room.name}</h3>
                  <div className="flex items-center justify-between pt-4 border-t border-[#0A0A0A]/5">
                    <span className="text-xs font-bold text-[#6B6B6B] uppercase tracking-tighter">{room.type || 'Standard'} Room</span>
                    <span className="text-[10px] font-black text-[#FF5733] uppercase tracking-[0.2em]">View Details</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-[#0A0A0A]/5 rounded-full flex items-center justify-center mx-auto mb-6 text-[#0A0A0A]/20">
              <Search size={32} />
            </div>
            <h3 className="text-2xl font-bold text-[#0A0A0A] mb-2">No listings found</h3>
            <p className="text-[#6B6B6B] mb-8">We couldn't find any rooms matching your current criteria.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-[#0A0A0A] text-white rounded-full font-bold text-sm"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
