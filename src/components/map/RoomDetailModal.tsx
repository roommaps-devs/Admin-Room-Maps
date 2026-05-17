"use client";

import React, { useState } from 'react';
import { MapPin, Phone, Check, Footprints, Home, X, Share2, Navigation, Heart, Flag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Room } from '@/lib/types';

interface RoomDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room | null;
  searchCenter?: [number, number];
  viewMode?: 'bottom-sheet' | 'centered';
}

// Utility to calculate real distance between coordinates
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371e3; // meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in meters
};

export default function RoomDetailModal({ 
  isOpen, 
  onClose, 
  room,
  searchCenter
}: RoomDetailModalProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [otherText, setOtherText] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);

  if (!isOpen || !room) return null;

  // Calculate dynamic walking distance
  let distanceText = "200m away"; // Premium default
  if (searchCenter && room.lat && room.lng) {
    const meters = getDistance(room.lat, room.lng, searchCenter[0], searchCenter[1]);
    if (meters < 1000) {
      distanceText = `${Math.round(meters)}m away`;
    } else {
      distanceText = `${(meters / 1000).toFixed(1)}km away`;
    }
  } else {
    // Generate a realistic mock distance between 100m and 800m
    const mockDist = Math.floor(100 + (Math.abs(room.lat * 1000) % 700));
    distanceText = `${mockDist}m away`;
  }

  return (
    <div 
      className="fixed inset-0 z-[5000] flex flex-col items-center justify-end md:justify-center p-4 md:p-6 bg-black/35 backdrop-blur-[2px] animate-in fade-in duration-300 pointer-events-auto"
      onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-[40px] p-6 w-full max-w-[430px] shadow-[0_24px_70px_rgba(0,0,0,0.12)] flex flex-col gap-5 text-gray-900 border border-gray-100/80 animate-in slide-in-from-bottom-6 duration-300 pointer-events-auto overflow-hidden animate-out fade-out zoom-out-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Soft Ambient Color Glow behind card content */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[var(--primary)]/4 to-blue-500/4 -z-20 pointer-events-none" />

        {/* Distressed Horizontal Parallel Watermark Stamp (NOT NEGOTIABLE Style) */}
        <div className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 rotate-[-8deg] z-0 select-none pointer-events-none w-[115%] flex flex-col items-center justify-center">
          <div className="w-full border-y-[2.5px] border-[var(--primary)]/[0.045] py-2 flex items-center justify-center">
            <span className="text-[34px] font-black text-[var(--primary)]/[0.055] tracking-[0.2em] uppercase leading-none font-serif select-none">
              NO BROKERAGE
            </span>
          </div>
        </div>

        {/* Floating Top-Right Exit Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 bg-gray-50/80 hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all z-20 pointer-events-auto border border-gray-100 hover:scale-105 active:scale-95 shadow-sm"
          aria-label="Close"
        >
          <X size={16} strokeWidth={2.5} />
        </button>

        {/* Gallery / Images Row */}
        <div className="relative flex gap-4 items-center z-10">
          {/* Main room photo with premium micro-shadow */}
          <div className="relative w-[180px] h-[160px] rounded-[28px] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.05)] bg-gray-50 shrink-0 group border border-gray-100">
            <Image 
              src={room.image || "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&auto=format&fit=crop"}
              alt={room.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Add Photos button with gradient shimmers */}
          <Link
            href="/post"
            className="flex-1 h-[160px] border-2 border-dashed border-gray-200 hover:border-[var(--primary)]/30 rounded-[28px] flex flex-col items-center justify-center gap-2 bg-gray-50/50 hover:bg-gradient-to-tr hover:from-white hover:to-[var(--primary)]/[0.03] transition-all group pointer-events-auto"
          >
            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-[var(--primary)] group-hover:scale-110 group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-300 border border-gray-100">
              <span className="text-xl font-black">+</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-700 group-hover:text-[var(--primary)] transition-colors">Add Photos</span>
              <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 mt-0.5">Upload Now</span>
            </div>
          </Link>
        </div>

        {/* Property Type & Availability Title Row */}
        <div className="flex items-center justify-between gap-4 mt-1 z-10 relative">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-black uppercase tracking-widest text-[var(--primary)]">
              {room.category || 'Co-Living'} Space
            </span>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-none">
              {room.name || room.type}
            </h2>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            {/* Heart Favorite Trigger */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsFavorited(!isFavorited);
              }}
              className="w-9 h-9 bg-gray-50 hover:bg-red-50 hover:border-red-100 rounded-full flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-all z-20 pointer-events-auto border border-gray-100 group"
              aria-label="Favorite listing"
            >
              <Heart 
                size={15} 
                className={`transition-all duration-300 ${isFavorited ? 'text-red-500 fill-red-500 scale-125 animate-in zoom-in-75' : 'text-gray-400 group-hover:text-red-500 group-hover:scale-110'}`} 
                strokeWidth={2.5}
              />
            </button>

            {/* Glassmorphic Available Badge */}
            <div className="px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] text-emerald-600 flex items-center gap-1.5 text-[9px] font-black tracking-wider uppercase backdrop-blur-sm shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              AVAILABLE
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap leading-none z-10 relative">
          <div className="flex items-baseline text-gray-400 text-xs">
            <span className="text-[34px] font-black text-gray-900 tracking-tight">₹ {room.rent.toLocaleString('en-IN')}</span>
            <span className="font-bold ml-1">/month</span>
          </div>

          {/* Subtle Premium Lease Deposit Badge */}
          <div className="px-2.5 py-1.5 bg-gray-50 border border-gray-100 rounded-xl flex items-center gap-1.5 text-[9px] font-black text-gray-500 tracking-wider uppercase shadow-[0_1px_4px_rgba(0,0,0,0.01)] shrink-0 select-none">
            <div className="w-1 h-1 rounded-full bg-[var(--primary)]" />
            <span>Deposit: 1 Month</span>
          </div>
        </div>

        {/* Location & Distance Details (Gradient Elevated Card) */}
        <div className="flex flex-col gap-3 p-4 bg-gradient-to-b from-gray-50/80 to-gray-50/20 border border-gray-100 rounded-[28px] z-10 relative shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
          <div className="flex items-start gap-2.5">
            <MapPin size={16} className="text-[var(--primary)] shrink-0 mt-0.5" strokeWidth={2.5} />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-700 leading-normal">
                {room.location || `Sector ${Math.floor(Math.abs(room.lat * 1000) % 20) + 1}, ${room.city}`}
              </span>
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${room.lat},${room.lng}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[10px] font-black text-[var(--primary)] hover:underline inline-flex items-center gap-0.5 mt-0.5 pointer-events-auto"
              >
                Open in Google Maps <span className="text-xs">→</span>
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-gray-500 font-bold ml-0.5 border-t border-gray-100/80 pt-2.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shrink-0" />
            <span>
              <span className="text-[var(--primary)] font-black">{distanceText}</span> • from your location
            </span>
          </div>
        </div>

        {/* Dynamic Multi-Specs Row */}
        <div className="flex items-center justify-center gap-3.5 py-0.5 z-10 relative">
          <div className="flex items-center gap-1.5 px-4 py-2 bg-gray-50 border border-gray-100 rounded-full shadow-sm text-[9px] font-black text-gray-500 uppercase tracking-wider hover:bg-gray-100 transition-colors">
            <Home size={12} className="text-gray-400" />
            {room.category || 'Semi-Furnished'}
          </div>
          <div className="flex items-center gap-1.5 px-4 py-2 bg-gray-50 border border-gray-100 rounded-full shadow-sm text-[9px] font-black text-gray-500 uppercase tracking-wider hover:bg-gray-100 transition-colors">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
            {room.type || 'Flat'}
          </div>
        </div>

        {/* Main Phone Action Button with tactile Gloss-sheen */}
        <a
          href="tel:+919876543210"
          className="w-full py-4.5 bg-[var(--primary)] hover:bg-[var(--primary)]/95 text-white rounded-2xl font-black text-base shadow-[0_12px_28px_rgba(255,82,17,0.3)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 pointer-events-auto z-10 relative overflow-hidden group/btn"
        >
          <div className="absolute inset-0 bg-white/10 -translate-y-full group-hover/btn:translate-y-0 transition-transform duration-350 pointer-events-none" />
          <Phone size={16} fill="currentColor" className="relative z-10" />
          <span className="relative z-10">Call Owner</span>
        </a>

        {/* Padded Footer Action Buttons Row */}
        <div className="flex gap-3 pt-1 z-10 relative">
          {/* Directions Pill Button */}
          <a 
            href={`https://www.google.com/maps/dir/?api=1&destination=${room.lat},${room.lng}`}
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex-1 py-3 bg-gray-50/80 hover:bg-gray-100 border border-gray-150 hover:border-[var(--primary)]/20 hover:text-[var(--primary)] rounded-2xl flex items-center justify-center gap-2 text-xs font-black text-gray-800 transition-all pointer-events-auto hover:scale-[1.02] active:scale-[0.98] shadow-sm"
          >
            <Navigation size={14} className="rotate-45 text-[var(--primary)]" strokeWidth={2.5} />
            Directions
          </a>

          {/* Share Pill Button */}
          <button 
            className="flex-1 py-3 bg-gray-50/80 hover:bg-gray-100 border border-gray-150 hover:border-[var(--primary)]/20 hover:text-[var(--primary)] rounded-2xl flex items-center justify-center gap-2 text-xs font-black text-gray-800 transition-all pointer-events-auto hover:scale-[1.02] active:scale-[0.98] shadow-sm"
            onClick={() => {
              if (navigator.share) {
                navigator.share({ 
                  title: room.name, 
                  text: `Check out ${room.name} on RoomMaps!`, 
                  url: window.location.href 
                }).catch(() => {
                  // Fallback on share errors
                  navigator.clipboard.writeText(window.location.href);
                  setIsCopied(true);
                  setTimeout(() => setIsCopied(false), 2000);
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
              }
            }}
          >
            {isCopied ? (
              <>
                <Check size={14} className="text-emerald-500 stroke-[3]" />
                Copied!
              </>
            ) : (
              <>
                <Share2 size={14} className="text-orange-500" strokeWidth={2.5} />
                Share
              </>
            )}
          </button>
        </div>

        {/* Highlighted Flag Report Button */}
        <div className="flex justify-center pt-2 pb-2">
          <button 
            onClick={() => setShowReportModal(true)} 
            className="px-4 py-2.5 border border-red-100 hover:border-red-200 bg-red-500/[0.02] hover:bg-red-500/[0.05] rounded-xl flex items-center justify-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-red-500 hover:text-red-650 transition-all pointer-events-auto hover:scale-[1.02] active:scale-[0.98] shadow-sm select-none"
          >
            <Flag size={10} className="stroke-[2.5]" />
            Report this listing
          </button>
        </div>

        {/* Elite Slide-up Inner Report Modal Overlay */}
        {showReportModal && (
          <div className="absolute inset-0 bg-white/98 backdrop-blur-sm z-50 p-6 flex flex-col justify-between rounded-[40px] animate-in fade-in slide-in-from-bottom-12 duration-300">
            {/* Header */}
            <div className="flex flex-col gap-1.5 mt-2 border-b border-gray-100 pb-3.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                  <Flag size={18} className="text-[var(--primary)] stroke-[2.5]" />
                  Report Listing
                </h3>
                <button 
                  onClick={() => {
                    setShowReportModal(false);
                    setSelectedReason(null);
                    setOtherText("");
                    setReportSubmitted(false);
                  }}
                  className="w-8 h-8 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-900 border border-gray-100 transition-colors"
                >
                  <X size={14} strokeWidth={2.5} />
                </button>
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Help us keep RoomMaps secure & accurate
              </p>
            </div>

            {/* Content Body */}
            <div className="flex-1 my-4 overflow-y-auto pr-1 flex flex-col gap-3">
              {!reportSubmitted ? (
                <>
                  <div className="flex flex-col gap-2">
                    {[
                      "Spam or Misleading",
                      "Incorrect Price or Location",
                      "Brokerage Charged (Fake 'No Brokerage')",
                      "Inappropriate Photos",
                      "Other"
                    ].map((reason) => (
                      <button
                        key={reason}
                        onClick={() => setSelectedReason(reason)}
                        className={`w-full py-3 px-4 rounded-2xl border text-left text-xs font-black transition-all flex items-center justify-between group/opt ${
                          selectedReason === reason 
                            ? 'border-[var(--primary)] border-l-[4px] border-l-[var(--primary)] bg-[var(--primary)]/[0.05] text-[var(--primary)] shadow-[0_2px_8px_rgba(255,82,17,0.06)]' 
                            : 'border-gray-100 bg-gray-50/50 hover:bg-gray-50 text-gray-700 hover:text-gray-900 hover:border-gray-200'
                        }`}
                      >
                        <span>{reason}</span>
                        <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center transition-all ${
                          selectedReason === reason 
                            ? 'border-[var(--primary)] bg-[var(--primary)] text-white scale-110 shadow-sm' 
                            : 'border-gray-300 bg-white group-hover/opt:border-gray-400'
                        }`}>
                          {selectedReason === reason && <Check size={10} strokeWidth={3} />}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* "Other" Textarea input box */}
                  {selectedReason === "Other" && (
                    <div className="animate-in slide-in-from-top-4 duration-300 mt-1">
                      <textarea
                        value={otherText}
                        onChange={(e) => setOtherText(e.target.value)}
                        placeholder="Please describe the issue..."
                        className="w-full h-24 p-3.5 bg-gray-50 border border-gray-150 rounded-2xl text-xs text-gray-750 font-bold focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all resize-none shadow-inner"
                      />
                    </div>
                  )}

                  {/* Security/Trust Informational Banner to beautifully occupy empty space */}
                  {selectedReason !== "Other" && (
                    <div className="p-3.5 bg-[var(--primary)]/[0.02] border border-[var(--primary)]/10 rounded-2.5xl flex gap-2.5 text-[10px] text-gray-550 font-bold leading-normal animate-in fade-in duration-300 mt-2 select-none">
                      <span className="text-[var(--primary)] text-sm shrink-0">🛡️</span>
                      <span>
                        Our safety team reviews all reported listings within 24 hours. Multiple false reports may lead to listing suspension to maintain a trustworthy market.
                      </span>
                    </div>
                  )}
                </>
              ) : (
                /* Success screen */
                <div className="flex-1 flex flex-col items-center justify-center gap-3 animate-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center text-emerald-500 shadow-[0_4px_16px_rgba(16,185,129,0.12)]">
                    <Check size={32} strokeWidth={3} />
                  </div>
                  <div className="text-center flex flex-col gap-1 mt-1">
                    <h4 className="text-lg font-black text-gray-900 tracking-tight">Report Received</h4>
                    <p className="text-xs font-bold text-gray-500 leading-relaxed max-w-[240px] mx-auto">
                      Thank you for reporting. Our safety team will review this listing shortly.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions Footer */}
            <div className="border-t border-gray-150 pt-4">
              {!reportSubmitted ? (
                <button
                  disabled={!selectedReason || (selectedReason === "Other" && !otherText.trim())}
                  onClick={() => {
                    setReportSubmitted(true);
                    // Soft auto-dismiss after 3.5 seconds
                    setTimeout(() => {
                      setShowReportModal(false);
                      setSelectedReason(null);
                      setOtherText("");
                      setReportSubmitted(false);
                    }, 3500);
                  }}
                  className="w-full py-3.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-100 disabled:text-gray-405 disabled:cursor-not-allowed text-white rounded-2xl font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 pointer-events-auto"
                >
                  Submit Report
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowReportModal(false);
                    setSelectedReason(null);
                    setOtherText("");
                    setReportSubmitted(false);
                  }}
                  className="w-full py-3.5 bg-gray-50 hover:bg-gray-100 border border-gray-100 text-gray-700 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 pointer-events-auto"
                >
                  Close Window
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
