"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  Phone,
  Check,
  Home,
  X,
  Share2,
  Navigation,
  Heart,
  Flag,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Building2,
} from "lucide-react";
import Image from "next/image";
import { Room } from "@/lib/types";
import { getRequest, postRequest, deleteRequest } from "@/lib/apiCall";
import { resolveImageUrl } from "@/lib/hooks/useRooms";

interface RoomDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room | null;
  searchCenter?: [number, number];
  similarRooms?: Room[];
  viewMode?: "bottom-sheet" | "centered";
}

interface ReportType {
  id: string;
  name: string;
}

const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function RoomDetailModal({
  isOpen,
  onClose,
  room: initialRoom,
  searchCenter,
  similarRooms: externalSimilarRooms = [],
  viewMode,
}: RoomDetailModalProps) {
  const [currentRoom, setCurrentRoom] = useState<Room | null>(initialRoom);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isFavoriteSubmitting, setIsFavoriteSubmitting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReasonId, setSelectedReasonId] = useState<string | null>(null);
  const [otherText, setOtherText] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [reportTypes, setReportTypes] = useState<ReportType[]>([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [imageList, setImageList] = useState<string[]>([]);
  const url = process.env.NEXT_PUBLIC_IMAGE_URL!;

  useEffect(() => {
    setCurrentRoom(initialRoom);
    if (initialRoom) {
      setIsFavorited(!!initialRoom.isFavorite);
    }
    if (initialRoom?.id) {
      const fetchFullDetails = async () => {
        setIsLoadingDetails(true);
        try {
          const res = await getRequest<{ success: boolean; data: any }>(
            `/post/getById/${initialRoom.id}`
          );
          if (res?.success && res.data) {
            const item = res.data;
            const rawImg =
              item.images?.[0]?.uploadUrl ||
              item.images?.[0]?.url ||
              (typeof item.images?.[0] === "string" ? item.images[0] : null) ||
              item.image;
            const fullRoom: Room = {
              id: item.id || item.postId,
              name: item.name || item.title || "Room Listing",
              city: item.city || "Chandigarh",
              rent: Number(item.rent) || 10000,
              lat: Number(item.lat) || 30.7333,
              lng: Number(item.lng) || 76.7794,
              category: String(item.category || "rent").toLowerCase(),
              type: item.type || item.propertyType || "Room",
              images: item.images
                ? item.images
                    .map((img: any) =>
                      typeof img === "string" ? img : img.uploadUrl || img.url
                    )
                    .filter(Boolean)
                : [],
              location: item.address || item.location,
              isTrending: !!item.isTrending,
              owner: item.owner,
              phone: item.phone,
              amenities: item.amenities || [],
              furnished: item.furnished,
              bhk: item.bhk,
              gender: item.gender,
              isFavorite: !!item.isFavorite,
            };
            setCurrentRoom(fullRoom);
            setIsFavorited(!!item.isFavorite);
          }
        } catch (error) {
          console.error("Failed to fetch full room details:", error);
        } finally {
          setIsLoadingDetails(false);
        }
      };
      fetchFullDetails();
    }
  }, [initialRoom]);

  console.log(initialRoom , "initialRoom")

  useEffect(() => {
    if (currentRoom) {
      const images = currentRoom.images?.filter(Boolean) || (currentRoom.image ? [currentRoom.image] : []);
     console.log(currentRoom , "currentRoomcurrentRoom") 
      const resolved = images.map((img) =>  img);
      setImageList(resolved);
      setCurrentImageIndex(0);
    }
  }, [currentRoom]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const fetchReportTypes = async () => {
    setIsLoadingTypes(true);
    try {
      const res = await getRequest<{ success: boolean; data: ReportType[] }>(
        "/report/getAllReportTpyes"
      );
      if (res?.success && Array.isArray(res.data)) setReportTypes(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingTypes(false);
    }
  };

  useEffect(() => {
    if (showReportModal) fetchReportTypes();
  }, [showReportModal]);

  const handleToggleFavorite = async () => {
    if (!currentRoom || isFavoriteSubmitting) return;

    setIsFavoriteSubmitting(true);
    try {
      if (isFavorited) {
        const res = await deleteRequest<{ success: boolean }>(`/post/removeFavorite/${currentRoom.id}`);
        if (res?.success) setIsFavorited(false);
      } else {
        const res = await postRequest<{ success: boolean }>(`/post/addFavorite/${currentRoom.id}`);
        if (res?.success) setIsFavorited(true);
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    } finally {
      setIsFavoriteSubmitting(false);
    }
  };

  const handleSubmitReport = async () => {
    if (!selectedReasonId || !currentRoom) return;
    setIsSubmitting(true);
    try {
      const isOther = selectedReasonId === "other";
      const reasonName = isOther
        ? otherText
        : reportTypes.find((t) => t.id === selectedReasonId)?.name || "";
      await postRequest("/report/postReport/create", {
        reportListId: isOther ? undefined : selectedReasonId,
        postId: currentRoom.id,
        reason: reasonName,
      });
    } catch (error) {
      console.warn(error);
    } finally {
      setIsSubmitting(false);
      setReportSubmitted(true);
      setTimeout(() => {
        setShowReportModal(false);
        setSelectedReasonId(null);
        setOtherText("");
        setReportSubmitted(false);
      }, 3500);
    }
  };

  const nextImage = () => {
    if (imageList.length > 1) setCurrentImageIndex((prev) => (prev + 1) % imageList.length);
  };

  const prevImage = () => {
    if (imageList.length > 1)
      setCurrentImageIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  let distanceText = "31 min away";
  if (searchCenter && currentRoom?.lat && currentRoom?.lng) {
    const meters = getDistance(currentRoom.lat, currentRoom.lng, searchCenter[0], searchCenter[1]);
    const minutes = Math.max(1, Math.round((meters / 80) * 1.2));
    distanceText = minutes < 60 ? `${minutes} min away` : `${(meters / 1000).toFixed(1)} km away`;
  }

  const recommendedList =
    externalSimilarRooms.filter((r) => r.id !== currentRoom?.id) || [];

  if (!isOpen || !currentRoom) return null;


  console.log(`${url}${imageList[currentImageIndex]}`, "imageListimageList")

  return (
    <div
      className="fixed inset-0 z-[5000] flex items-end justify-center md:items-center p-3 bg-black/60 backdrop-blur-sm transition-all duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[480px] max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6 duration-300 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Approval‑style "NO BROKERAGE" stamp (like "APPROVED" seal in 2nd image) */}
        <div className="absolute top-[48%] left-[74%] -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none opacity-[0.12] select-none">
          <svg viewBox="0 0 200 200" className="w-[140px] h-[140px] rotate-[-12deg]">
            <defs>
              {/* High-fidelity grunge ink distress filter */}
              <filter id="grunge-ink" x="-20%" y="-20%" width="140%" height="140%">
                <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="4" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.2" xChannelSelector="R" yChannelSelector="G" />
              </filter>
              {/* Precise circular text paths */}
              <path id="topStampPath" d="M 30 100 A 70 70 0 0 1 170 100" fill="none" />
              <path id="bottomStampPath" d="M 170 100 A 70 70 0 0 1 30 100" fill="none" />
            </defs>
            <g filter="url(#grunge-ink)" stroke="#FF5211" fill="#FF5211">
              {/* Outer thick distressed ring */}
              <circle cx="100" cy="100" r="85" fill="none" strokeWidth="5.5" />
              {/* Outer thin concentric ring */}
              <circle cx="100" cy="100" r="77" fill="none" strokeWidth="1.5" />
              
              {/* Inner details */}
              <circle cx="100" cy="100" r="54" fill="none" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="100" cy="100" r="50" fill="none" strokeWidth="1.5" />

              {/* Top curved rim text */}
              <text className="font-sans font-black tracking-[0.2em] text-[11px]" dy="-3">
                <textPath href="#topStampPath" startOffset="50%" textAnchor="middle">
                  ★ DIRECT DEAL ★
                </textPath>
              </text>

              {/* Bottom curved rim text */}
              <text className="font-sans font-black tracking-[0.25em] text-[10.5px]" dy="11">
                <textPath href="#bottomStampPath" startOffset="50%" textAnchor="middle">
                  ★ 100% VERIFIED ★
                </textPath>
              </text>

              {/* Central Slanted Banner Box */}
              <g transform="rotate(-6, 100, 100)">
                {/* Solid white band backing to prevent lower contents bleeding through text */}
                <rect x="15" y="80" width="170" height="40" fill="#FFFFFF" />
                {/* Thick banner borders */}
                <line x1="12" y1="80" x2="188" y2="80" strokeWidth="3.5" />
                <line x1="12" y1="120" x2="188" y2="120" strokeWidth="3.5" />
                
                {/* Heavy Bold Central Text */}
                <text x="100" y="109" textAnchor="middle" className="font-sans font-black tracking-[0.05em] text-[20px]" stroke="none">
                  NO BROKERAGE
                </text>
              </g>

              {/* Stars above and below slanted banner */}
              <polygon points="100,58 102,63 107,63 103,66 105,71 100,68 95,71 97,66 93,63 98,63" />
              <polygon points="100,128 102,133 107,133 103,136 105,141 100,138 95,141 97,136 93,133 98,133" />
            </g>
          </svg>
        </div>

        {/* Image Carousel - compact height */}
        <div className="relative w-full h-[180px] sm:h-[200px] overflow-hidden bg-gray-100 group">
          {imageList.length > 0 ? (
            <>
              <Image
                src={`${url}${imageList[currentImageIndex]}`}
                alt={currentRoom.name}
                fill
                className="object-cover"

                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              {imageList.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight size={16} />
                  </button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {imageList.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`transition-all ${
                          idx === currentImageIndex
                            ? "w-5 h-1 bg-white rounded-full"
                            : "w-1 h-1 bg-white/60 rounded-full"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
              <Building2 size={42} className="text-gray-300" />
              <p className="text-[10px] font-semibold text-gray-400 mt-2">No images</p>
            </div>
          )}

          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md z-20"
          >
            <X size={16} />
          </button>
          <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold uppercase flex items-center gap-1 z-20">
            <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
            Available
          </div>
        </div>

        {/* Scrollable Content - reduced spacing */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 [&::-webkit-scrollbar]:w-1">
          {/* Title & Favorite */}
          <div className="flex justify-between items-start gap-2">
            <div>
              <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">
                {currentRoom.category?.toUpperCase() || "RENT"}
              </span>
              <h2 className="text-xl font-bold text-gray-900 leading-tight">
                {currentRoom.name || currentRoom.type}
              </h2>
            </div>
            <button
              onClick={handleToggleFavorite}
              disabled={isFavoriteSubmitting}
              className="p-1.5 rounded-full border border-gray-200 bg-white shadow-sm disabled:opacity-50"
            >
              <Heart size={18} className={isFavorited ? "fill-red-500 text-red-500" : "text-gray-400"} />
            </button>
          </div>

          {/* Price & Deposit */}
          <div className="flex flex-wrap items-baseline gap-2">
            <div className="flex items-baseline gap-0.5">
              <span className="text-2xl font-black text-gray-900">₹{currentRoom.rent.toLocaleString("en-IN")}</span>
              <span className="text-xs text-gray-500">/month</span>
            </div>
            <div className="px-2 py-0.5 bg-orange-50 rounded-full text-[10px] font-bold text-orange-600 border border-orange-100">
              {currentRoom.furnished || "1 Month Deposit"}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-full text-[10px] font-semibold text-gray-700">
              <Home size={10} />
              {currentRoom.category === "travelers" ? "Looking" : "Rent"}
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-full text-[10px] font-semibold text-gray-700">
              <Sparkles size={10} />
              {currentRoom.type || "Room"}
            </div>
          </div>

          {/* Location + Distance - compact */}
          <div className="bg-gray-50 rounded-xl p-3 space-y-2 border border-gray-100">
            <div className="flex gap-2">
              <MapPin size={14} className="text-orange-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-gray-800">
                  {currentRoom.location ||
                    `Sector ${Math.floor(Math.abs(currentRoom.lat * 1000) % 20) + 1}, ${currentRoom.city}`}
                </p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${currentRoom.lat},${currentRoom.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[9px] font-bold text-orange-500 inline-flex items-center gap-0.5"
                >
                  Open in Maps ↗
                </a>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-semibold border-t border-gray-200/70 pt-1.5">
              <div className="w-1 h-1 rounded-full bg-orange-500" />
              <span>
                <span className="text-orange-600">{distanceText}</span> from your location
              </span>
            </div>
          </div>

          {/* Recommended Listings - compact */}
          {recommendedList.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-gray-700">✨ More like this</h3>
                <span className="text-[8px] text-gray-400 uppercase">swipe →</span>
              </div>
              <div className="overflow-x-auto pb-1 -mx-1 px-1 [&::-webkit-scrollbar]:h-1">
                <div className="flex gap-2">
                  {recommendedList.map((rec) => (
                    <button
                      key={rec.id}
                      onClick={() => {
                        setCurrentRoom(rec);
                        setCurrentImageIndex(0);
                        setIsFavorited(false);
                      }}
                      className="flex-shrink-0 w-32 bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all text-left"
                    >
                      <div className="relative h-20 w-full bg-gray-100">
                        {rec.image ? (
                          <Image src={rec.image} alt={rec.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Home size={16} className="text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="p-1.5">
                        <p className="text-[10px] font-bold text-gray-800 truncate">{rec.name}</p>
                        <p className="text-[9px] font-black text-orange-500">₹{rec.rent.toLocaleString("en-IN")}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Fixed Footer - compact */}
        <div className="p-3 pt-2 pb-3 border-t border-gray-100 bg-white space-y-2">
          {isLoadingDetails && !currentRoom.phone ? (
            <div className="w-full flex items-center justify-center gap-2 bg-orange-400 text-white font-black py-2.5 rounded-xl shadow-md text-sm animate-pulse">
              <Loader2 className="animate-spin" size={14} />
              Loading Contact Info...
            </div>
          ) : (
            <a
              href={currentRoom.phone ? `tel:${currentRoom.phone}` : "tel:+919876543210"}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-black py-2.5 rounded-xl shadow-md transition-all active:scale-98 text-sm"
            >
              <Phone size={14} fill="currentColor" />
              Call Owner
            </a>
          )}
          <div className="flex gap-2">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${currentRoom.lat},${currentRoom.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1 py-2 bg-white border border-gray-200 rounded-xl text-[11px] font-bold text-gray-700 hover:border-orange-300 hover:text-orange-600 transition-all"
            >
              <Navigation size={12} className="rotate-45" />
              Directions
            </a>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: currentRoom.name, url: window.location.href }).catch(() => {
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
              className="flex-1 flex items-center justify-center gap-1 py-2 bg-white border border-gray-200 rounded-xl text-[11px] font-bold text-gray-700 hover:border-orange-300 hover:text-orange-600 transition-all"
            >
              {isCopied ? <Check size={12} /> : <Share2 size={12} />}
              {isCopied ? "Copied!" : "Share"}
            </button>
          </div>
          <button
            onClick={() => setShowReportModal(true)}
            className="w-full flex items-center justify-center gap-1 py-1.5 text-[9px] font-bold uppercase tracking-wider text-red-500 hover:bg-red-50 rounded-lg transition-all"
          >
            <Flag size={10} />
            Report
          </button>
        </div>

        {/* Report Modal (compact) */}
        {showReportModal && (
          <div className="absolute inset-0 z-50 bg-white rounded-2xl flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-300">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Flag size={16} className="text-red-500" />
                Report Listing
              </h3>
              <button onClick={() => setShowReportModal(false)} className="p-1.5 rounded-full bg-gray-50">
                <X size={14} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {!reportSubmitted ? (
                <>
                  {isLoadingTypes ? (
                    <div className="flex flex-col items-center py-6">
                      <Loader2 className="animate-spin text-orange-500" size={20} />
                      <span className="text-[10px] mt-1">Loading...</span>
                    </div>
                  ) : (
                    reportTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setSelectedReasonId(type.id)}
                        className={`w-full p-2.5 rounded-lg border text-left flex justify-between items-center text-sm ${
                          selectedReasonId === type.id
                            ? "border-orange-400 bg-orange-50"
                            : "border-gray-100 bg-gray-50"
                        }`}
                      >
                        <span className="text-xs font-medium">{type.name}</span>
                        {selectedReasonId === type.id && <Check size={14} className="text-orange-500" />}
                      </button>
                    ))
                  )}
                  {selectedReasonId === "other" && (
                    <textarea
                      value={otherText}
                      onChange={(e) => setOtherText(e.target.value)}
                      placeholder="Describe the issue..."
                      className="w-full p-2 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-orange-300"
                      rows={2}
                    />
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center py-8 text-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-2">
                    <Check size={20} />
                  </div>
                  <h4 className="font-bold text-sm">Report received</h4>
                  <p className="text-xs text-gray-500">We'll review shortly.</p>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-100">
              {!reportSubmitted ? (
                <button
                  disabled={!selectedReasonId || (selectedReasonId === "other" && !otherText.trim()) || isSubmitting}
                  onClick={handleSubmitReport}
                  className="w-full py-2.5 bg-gray-800 text-white rounded-lg font-bold text-sm disabled:bg-gray-200"
                >
                  {isSubmitting ? <Loader2 className="animate-spin mx-auto" size={14} /> : "Submit"}
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowReportModal(false);
                    setSelectedReasonId(null);
                    setOtherText("");
                    setReportSubmitted(false);
                  }}
                  className="w-full py-2.5 bg-gray-100 text-gray-700 rounded-lg font-bold text-sm"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}