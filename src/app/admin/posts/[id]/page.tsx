"use client";

import React, { useState, useEffect, use } from "react";
import { 
  ArrowLeft, 
  MapPin, 
  Building2, 
  Tag, 
  Home, 
  Heart, 
  Share2, 
  Navigation, 
  Flag, 
  Loader2, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Phone, 
  ShieldAlert, 
  Star, 
  Trash2, 
  Edit3, 
  AlertTriangle, 
  Check, 
  CheckCircle, 
  User, 
  Mail,
  Calendar,
  Globe,
  Settings,
  Layers,
  Compass,
  X
} from "lucide-react";
import { getRequest, postRequest, deleteRequest } from "@/lib/apiCall";
import { resolveImageUrl, clearRoomsCache } from "@/lib/hooks/useRooms";
import { useRouter } from "next/navigation";
import { Room } from "@/lib/types";
import { toast } from "sonner";

export default function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  // States
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Carousel state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageList, setImageList] = useState<string[]>([]);
  
  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editRent, setEditRent] = useState(0);
  const [editCity, setEditCity] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editBhk, setEditBhk] = useState("");
  const [editFurnished, setEditFurnished] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editOwner, setEditOwner] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  
  // Delete Dialog state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Action toggles
  const [isTrending, setIsTrending] = useState(false);
  const [isTogglingTrending, setIsTogglingTrending] = useState(false);

  // Fetch full details
  const fetchPostDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Direct call to admin post detail endpoint or general getById endpoint
      console.log(`[Admin Detail] Fetching post details for ID ${id}...`);
      const res = await getRequest<{ success: boolean; data: any; message?: string }>(
        `/admin/posts/getById/${id}`
      );
      
      if (res?.success && res.data) {
        const item = res.data;
        setPost(item);
        setIsTrending(!!item.isTrending);
        
        // Resolve images list
        const rawImages = item.images || [];
        const mappedUrls = rawImages
          .map((img: any) => {
            if (typeof img === "string") return img;
            return img.url || img.uploadUrl;
          })
          .filter(Boolean);
          
        if (mappedUrls.length === 0 && item.image) {
          mappedUrls.push(item.image);
        }
        
        setImageList(mappedUrls);
        
        // Populate edit inputs
        setEditName(item.name || item.title || "");
        setEditRent(Number(item.rent) || 0);
        setEditCity(item.city || "");
        setEditCategory(item.category || "RENT");
        setEditBhk(item.bhk || "1 BHK");
        setEditFurnished(item.furnished || "Unfurnished");
        setEditPhone(item.phone || "");
        setEditOwner(item.owner || "");
        setEditAddress(item.address || item.location || "");
      } else {
        setError(res?.message || "Failed to fetch post details. Record not found.");
      }
    } catch (err: any) {
      console.error("Failed to fetch room details:", err);
      setError(err?.message || "Connection failed when fetching post metadata from backend.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPostDetails();
    }
  }, [id]);

  // Toggle Trending
  const handleToggleTrending = async () => {
    if (isTogglingTrending) return;
    setIsTogglingTrending(true);
    const updatedStatus = !isTrending;
    
    // Optimistic Update
    setIsTrending(updatedStatus);
    
    try {
      const res = await postRequest<any>(`/post/updateTrending/${id}`, { isTrending: updatedStatus });
      if (res?.success) {
        toast.success(`Post marked as ${updatedStatus ? "Trending" : "Standard"} Listing successfully!`);
        clearRoomsCache();
      } else {
        // Revert on failure
        setIsTrending(!updatedStatus);
        toast.error("Failed to update trending status on the server.");
      }
    } catch (err: any) {
      setIsTrending(!updatedStatus);
      toast.error(err?.message || "Network error. Failed to toggle trending status.");
    } finally {
      setIsTogglingTrending(false);
    }
  };

  // Submit Edit Save
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingEdit(true);
    
    const updatedPayload = {
      ...post,
      name: editName,
      rent: Number(editRent),
      city: editCity,
      category: editCategory,
      bhk: editBhk,
      furnished: editFurnished,
      phone: editPhone,
      owner: editOwner,
      location: editAddress,
      address: editAddress
    };

    try {
      const res = await postRequest<any>(`/post/update/${id}`, { data: updatedPayload });
      if (res?.success) {
        toast.success("Listing specifications updated inside database successfully!");
        setShowEditModal(false);
        clearRoomsCache();
        fetchPostDetails(); // Reload content
      } else {
        toast.error("Failed to save stay specifications on API.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Network failed when submitting update specifications.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Perform permanent post delete
  const handleDeletePost = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteRequest<any>(`/post/delete/${id}`);
      if (res?.success) {
        toast.success("Post removed permanently from database catalog.");
        setShowDeleteDialog(false);
        clearRoomsCache();
        router.push("/"); // Back to Admin Dashboard overview
      } else {
        toast.error(res?.message || "Failed to execute post removal on database API.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Internal database connection failed during post removal.");
    } finally {
      setIsDeleting(false);
    }
  };

  const nextImage = () => {
    if (imageList.length > 1) setCurrentImageIndex((prev) => (prev + 1) % imageList.length);
  };

  const prevImage = () => {
    if (imageList.length > 1) setCurrentImageIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFA] dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-[#F3F4F6] transition-colors duration-300 antialiased font-sans">
      
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-[100] bg-[#FBFBFA]/85 dark:bg-[#0A0A0A]/85 backdrop-blur-md border-b border-[#0A0A0A]/5 dark:border-white/10 px-4 md:px-8 py-4 transition-colors duration-300">
        <div className="max-w-6xl w-full mx-auto flex items-center justify-between gap-4">
          <button 
            onClick={() => router.push("/")}
            className="group flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-wider bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl hover:bg-neutral-100 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/10 transition-all duration-300 shrink-0 cursor-pointer shadow-sm"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            Admin Dashboard
          </button>
          
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-black tracking-[0.25em] text-[#FF5211] uppercase select-none">
              INSPECTION CONSOLE
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>
      </header>

      {/* Main Body Layout */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 md:px-8 py-8 flex flex-col gap-8">
        
        {/* Loding State */}
        {isLoading && (
          <div className="flex-1 flex flex-col items-center justify-center py-20 gap-4 animate-in fade-in duration-300">
            <div className="relative flex items-center justify-center">
              <Loader2 className="animate-spin text-[#FF5211]" size={36} />
              <ShieldAlert className="absolute text-[#FF5211]" size={14} />
            </div>
            <div className="flex flex-col gap-1 items-center">
              <span className="text-xs font-black uppercase tracking-widest text-[#FF5211]">SECURE METADATA AUDIT</span>
              <span className="text-[11px] font-bold opacity-50">Querying listing logs from backend database E2E...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="flex-1 bg-white dark:bg-[#121214] border border-red-500/10 dark:border-red-500/20 rounded-[36px] p-12 text-center shadow-lg shadow-red-500/5 max-w-md mx-auto my-12 flex flex-col items-center gap-6 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center shadow-inner">
              <AlertTriangle size={28} />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-black text-lg tracking-tight">Inspection Failed</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                {error}
              </p>
            </div>
            <button
              onClick={fetchPostDetails}
              className="px-6 py-3 bg-[#FF5211] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.01] transition-all cursor-pointer shadow-md shadow-orange-500/10"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Loaded Post Content Details */}
        {!isLoading && !error && post && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-500">
            
            {/* LEFT COLUMN: Media gallery & Moderation Widgets */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Media Gallery Carousel */}
              <div className="relative w-full h-[320px] md:h-[400px] bg-white dark:bg-[#121214] border border-[#0A0A0A]/5 dark:border-white/10 rounded-[36px] shadow-sm overflow-hidden group">
                {imageList.length > 0 ? (
                  <>
                    <img 
                      src={resolveImageUrl(imageList[currentImageIndex])} 
                      alt={post.name || "Stay Listing"} 
                      className="w-full h-full object-cover transition-all duration-500"
                    />
                    
                    {/* Shadow overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                    
                    {/* Gallery Navigation Controls */}
                    {imageList.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 dark:bg-[#0A0A0A]/90 hover:bg-white dark:hover:bg-[#0A0A0A] rounded-full flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                        >
                          <ChevronLeft size={18} className="text-slate-800 dark:text-white" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 dark:bg-[#0A0A0A]/90 hover:bg-white dark:hover:bg-[#0A0A0A] rounded-full flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                        >
                          <ChevronRight size={18} className="text-slate-800 dark:text-white" />
                        </button>
                        
                        {/* Slide indicators counter */}
                        <div className="absolute bottom-4 left-6 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full text-[10px] font-black tracking-widest text-white uppercase flex items-center gap-1.5 z-20">
                          {currentImageIndex + 1} / {imageList.length}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-white/[0.02] gap-2 text-slate-400">
                    <Building2 size={54} className="opacity-35" />
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">No Media Logs Found</span>
                  </div>
                )}

                {/* Status Badges Overlay */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
                  <div className={`px-3 py-1.5 rounded-full text-white text-[9px] font-black tracking-widest uppercase flex items-center gap-1.5 shadow-md ${
                    String(post.status || "ACTIVE").toUpperCase() === "ACTIVE" 
                      ? "bg-emerald-500 shadow-emerald-500/15"
                      : String(post.status || "ACTIVE").toUpperCase() === "UNDER_REVIEW"
                        ? "bg-amber-500 shadow-amber-500/15"
                        : String(post.status || "ACTIVE").toUpperCase() === "HIDDEN"
                          ? "bg-slate-500 shadow-slate-500/15"
                          : "bg-red-500 shadow-red-500/15"
                  }`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    {String(post.status || "ACTIVE").toUpperCase().replace("_", " ")}
                  </div>
                  {post.availabilityStatus && (
                    <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-[9px] font-black tracking-widest uppercase flex items-center gap-1.5">
                      {post.availabilityStatus}
                    </div>
                  )}
                </div>

                {/* APPROVED NO BROKERAGE stamp overlay (distressed grunge design like modal) */}
                <div className="absolute top-[50%] left-[80%] -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none opacity-[0.25] select-none scale-[1.3] hidden md:block">
                  <svg viewBox="0 0 200 200" className="w-[140px] h-[140px] rotate-[-12deg]">
                    <defs>
                      <filter id="grunge-ink-post" x="-20%" y="-20%" width="140%" height="140%">
                        <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="4" result="noise" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.2" xChannelSelector="R" yChannelSelector="G" />
                      </filter>
                      <path id="topStampPathPost" d="M 30 100 A 70 70 0 0 1 170 100" fill="none" />
                      <path id="bottomStampPathPost" d="M 170 100 A 70 70 0 0 1 30 100" fill="none" />
                    </defs>
                    <g filter="url(#grunge-ink-post)" stroke="#FF5211" fill="#FF5211">
                      <circle cx="100" cy="100" r="85" fill="none" strokeWidth="5.5" />
                      <circle cx="100" cy="100" r="77" fill="none" strokeWidth="1.5" />
                      <circle cx="100" cy="100" r="54" fill="none" strokeWidth="1" strokeDasharray="3 3" />
                      <circle cx="100" cy="100" r="50" fill="none" strokeWidth="1.5" />
                      <text className="font-sans font-black tracking-[0.2em] text-[11px]" dy="-3">
                        <textPath href="#topStampPathPost" startOffset="50%" textAnchor="middle">
                          ★ DIRECT DEAL ★
                        </textPath>
                      </text>
                      <text className="font-sans font-black tracking-[0.25em] text-[10.5px]" dy="11">
                        <textPath href="#bottomStampPathPost" startOffset="50%" textAnchor="middle">
                          ★ 100% VERIFIED ★
                        </textPath>
                      </text>
                      <g transform="rotate(-6, 100, 100)">
                        <rect x="15" y="80" width="170" height="40" fill="#FFFFFF" className="dark:fill-[#121214]" />
                        <line x1="12" y1="80" x2="188" y2="80" strokeWidth="3.5" />
                        <line x1="12" y1="120" x2="188" y2="120" strokeWidth="3.5" />
                        <text x="100" y="109" textAnchor="middle" className="font-sans font-black tracking-[0.05em] text-[20px]" stroke="none">
                          NO BROKERAGE
                        </text>
                      </g>
                      <polygon points="100,58 102,63 107,63 103,66 105,71 100,68 95,71 97,66 93,63 98,63" />
                      <polygon points="100,128 102,133 107,133 103,136 105,141 100,138 95,141 97,136 93,133 98,133" />
                    </g>
                  </svg>
                </div>
              </div>

              {/* Title & Core Details Panel */}
              <div className="bg-white dark:bg-[#121214] border border-[#0A0A0A]/5 dark:border-white/10 rounded-[36px] p-6 shadow-sm flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-black text-[#FF5211] bg-[#FF5211]/10 px-3 py-1 rounded-full uppercase tracking-wider leading-none">
                      {post.category || "RENT"}
                    </span>
                    <span className="text-xs text-neutral-400 font-semibold">•</span>
                    <span className="text-xs text-neutral-400 font-semibold flex items-center gap-1">
                      <Calendar size={12} />
                      Created: {formatDate(post.createdAt)}
                    </span>
                  </div>
                  <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                    {post.name || post.title || "Room Listing"}
                  </h1>
                </div>

                <div className="flex flex-wrap items-baseline gap-2 pb-5 border-b border-[#0A0A0A]/5 dark:border-white/10">
                  <span className="text-3xl font-black text-slate-900 dark:text-white leading-none">
                    ₹{post.rent?.toLocaleString("en-IN") || "—"}
                  </span>
                  <span className="text-xs text-slate-500 font-bold">/ month (Rent)</span>
                </div>

                {/* Amenities grid */}
                <div className="flex flex-col gap-3">
                  <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">
                    Property Features & Amenities
                  </span>
                  {post.amenities && post.amenities.length > 0 ? (
                    <div className="flex flex-wrap gap-2.5">
                      {post.amenities.map((item: string, idx: number) => (
                        <div 
                          key={idx} 
                          className="px-3.5 py-2 bg-slate-100 dark:bg-white/5 hover:bg-[#FF5211]/5 hover:text-[#FF5211] border border-transparent hover:border-[#FF5211]/20 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-300 transition-all duration-300 flex items-center gap-1.5"
                        >
                          <Check size={12} className="text-emerald-500 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs font-bold opacity-40">No specifically itemised amenities found. Standard PG rules apply.</span>
                  )}
                </div>
              </div>

              {/* Precise Location & Geometry */}
              <div className="bg-white dark:bg-[#121214] border border-[#0A0A0A]/5 dark:border-white/10 rounded-[36px] p-6 shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">
                    Property Location Specs
                  </span>
                  <div className="flex items-center gap-1">
                    <Globe size={11} className="opacity-40" />
                    <span className="text-[9px] font-mono opacity-40 font-bold uppercase">{post.country || "India"}</span>
                  </div>
                </div>
                
                <div className="p-4 rounded-3xl bg-slate-50 dark:bg-white/[0.02] border border-transparent dark:border-white/5 flex gap-3.5 items-start">
                  <MapPin className="text-[#FF5211] shrink-0 mt-0.5" size={18} />
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-black capitalize">
                      {post.city || "N/A"}{post.state ? `, ${post.state}` : ""}
                    </span>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                      {post.address || post.location || "Sector Area details not logged"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-neutral-100/50 dark:bg-white/[0.01] rounded-2xl text-center">
                    <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider leading-none">Latitude</span>
                    <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mt-1 block leading-none">{post.lat || "—"}</span>
                  </div>
                  <div className="p-3 bg-neutral-100/50 dark:bg-white/[0.01] rounded-2xl text-center">
                    <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider leading-none">Longitude</span>
                    <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mt-1 block leading-none">{post.lng || "—"}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${post.lat},${post.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-3.5 bg-white border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-[#64748b] hover:text-[#0A0A0A] dark:hover:text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-sm"
                  >
                    <Navigation size={13} className="rotate-45 text-[#FF5211]" />
                    Open Google Maps
                  </a>
                  
                  {post.lat && post.lng && (
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${post.lat},${post.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 py-3.5 bg-white border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-[#64748b] hover:text-[#0A0A0A] dark:hover:text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-sm"
                    >
                      <Compass size={13} className="text-[#FF5211]" />
                      Directions Path
                    </a>
                  )}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Metadata specs, Moderation details & Admin action panel */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* Quick Spec Tags Grid Card */}
              <div className="bg-white dark:bg-[#121214] border border-[#0A0A0A]/5 dark:border-white/10 rounded-[36px] p-6 shadow-sm flex flex-col gap-5">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">
                  Core Property Specs
                </span>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* BHK */}
                  <div className="p-4 bg-slate-50 dark:bg-white/[0.02] border border-transparent dark:border-white/5 rounded-3xl flex flex-col gap-1 hover:bg-neutral-100/50 transition-all duration-300">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider leading-none">Config</span>
                    <span className="text-sm font-black text-slate-800 dark:text-white mt-1 flex items-center gap-1.5">
                      <Home size={14} className="text-sky-500 shrink-0" />
                      {post.bhk || "N/A"}
                    </span>
                  </div>
                  {/* Furnished */}
                  <div className="p-4 bg-slate-50 dark:bg-white/[0.02] border border-transparent dark:border-white/5 rounded-3xl flex flex-col gap-1 hover:bg-neutral-100/50 transition-all duration-300">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider leading-none">Furnishing</span>
                    <span className="text-sm font-black text-slate-800 dark:text-white mt-1 flex items-center gap-1.5">
                      <Layers size={14} className="text-indigo-500 shrink-0" />
                      {post.furnished || "Unfurnished"}
                    </span>
                  </div>
                  {/* Property Type */}
                  <div className="p-4 bg-slate-50 dark:bg-white/[0.02] border border-transparent dark:border-white/5 rounded-3xl flex flex-col gap-1 hover:bg-neutral-100/50 transition-all duration-300">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider leading-none">Property Type</span>
                    <span className="text-sm font-black text-slate-800 dark:text-white mt-1 flex items-center gap-1.5">
                      <Building2 size={14} className="text-emerald-500 shrink-0" />
                      {post.type || "Flat"}
                    </span>
                  </div>
                  {/* Gender Guidelines */}
                  <div className="p-4 bg-slate-50 dark:bg-white/[0.02] border border-transparent dark:border-white/5 rounded-3xl flex flex-col gap-1 hover:bg-neutral-100/50 transition-all duration-300">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider leading-none">Gender Preference</span>
                    <span className="text-sm font-black text-slate-800 dark:text-white mt-1 flex items-center gap-1.5">
                      <User size={14} className="text-purple-500 shrink-0" />
                      {post.gender || "Any"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Owner / Poster Contact Details */}
              <div className="bg-white dark:bg-[#121214] border border-[#0A0A0A]/5 dark:border-white/10 rounded-[36px] p-6 shadow-sm flex flex-col gap-5">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">
                  Owner & Poster Specifications
                </span>

                <div className="flex flex-col gap-4">
                  {/* Owner name */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 flex items-center justify-center">
                      <User size={16} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider leading-none">Owner / Contact</span>
                      <span className="text-sm font-black text-slate-800 dark:text-white mt-0.5 truncate">{post.owner || "Anonymous"}</span>
                    </div>
                  </div>

                  {/* Phone */}
                  {post.phone && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 flex items-center justify-center">
                        <Phone size={15} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider leading-none">Phone Contact</span>
                        <a href={`tel:${post.phone}`} className="text-sm font-black text-[#FF5211] hover:underline mt-0.5">{post.phone}</a>
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  {post.createdByEmail && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 flex items-center justify-center">
                        <Mail size={15} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider leading-none">Created By (Email)</span>
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-0.5 truncate">{post.createdByEmail}</span>
                      </div>
                    </div>
                  )}

                  {/* User Account ID */}
                  {post.userId && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 flex items-center justify-center">
                        <Settings size={15} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider leading-none">Account User ID</span>
                        <span className="text-[10px] font-mono font-bold text-slate-400 mt-0.5 truncate">{post.userId}</span>
                      </div>
                    </div>
                  )}
                </div>

                {post.phone && (
                  <a
                    href={`tel:${post.phone}`}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-md transition-all active:scale-98 text-xs uppercase tracking-wider cursor-pointer shadow-emerald-500/10"
                  >
                    <Phone size={14} fill="currentColor" />
                    Call Owner Directly
                  </a>
                )}
              </div>

              {/* Policy & Community Flagged Reports */}
              <div className="bg-white dark:bg-[#121214] border border-[#0A0A0A]/5 dark:border-white/10 rounded-[36px] p-6 shadow-sm flex flex-col gap-4">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">
                  Moderation Flags & Reports
                </span>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-3xl bg-slate-100/50 dark:bg-white/[0.01] border border-[#0A0A0A]/5 dark:border-white/5 text-center">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider leading-none">Total Reports</span>
                    <span className="block text-2xl font-black text-slate-800 dark:text-white mt-1.5 leading-none">
                      {post.totalReports || 0}
                    </span>
                  </div>

                  <div className="p-4 rounded-3xl bg-slate-100/50 dark:bg-white/[0.01] border border-[#0A0A0A]/5 dark:border-white/5 text-center">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider leading-none">Report Score</span>
                    <span className="block text-2xl font-black text-red-500 mt-1.5 leading-none">
                      {post.totalReportScore || 0}
                    </span>
                  </div>
                </div>

                {post.totalReports > 0 ? (
                  <div className="p-4 bg-red-500/5 rounded-3xl border border-red-500/10 flex gap-2 items-start text-[11px] font-semibold text-red-500 leading-relaxed">
                    <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                    <span>This listing has been flagged by the user community. Please perform an in-depth phone audit or delete if it violates guidelines.</span>
                  </div>
                ) : (
                  <div className="p-4 bg-emerald-500/5 rounded-3xl border border-emerald-500/10 flex gap-2 items-start text-[11px] font-semibold text-emerald-600 dark:text-emerald-500/90 leading-relaxed">
                    <CheckCircle size={14} className="shrink-0 mt-0.5" />
                    <span>Excellent community trust score. Currently clean with 0 flagged violation reports.</span>
                  </div>
                )}
              </div>

              {/* Administrative Active Action Panel */}
              <div className="bg-white dark:bg-[#121214] border border-[#0A0A0A]/5 dark:border-white/10 rounded-[36px] p-6 shadow-sm flex flex-col gap-4">
                <span className="text-[10px] font-black text-[#FF5211] tracking-widest uppercase leading-none">
                  Active Administrative Moderation Panel
                </span>
                
                <div className="flex flex-col gap-3 pt-2">
                  {/* Mark Trending Button */}
                  <button
                    onClick={handleToggleTrending}
                    disabled={isTogglingTrending}
                    className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border shadow-sm ${
                      isTrending 
                        ? "bg-amber-500 hover:bg-amber-600 border-amber-600/10 text-white shadow-amber-500/15" 
                        : "bg-white hover:bg-neutral-50 dark:bg-white/5 dark:hover:bg-white/10 border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {isTogglingTrending ? (
                      <Loader2 className="animate-spin" size={14} />
                    ) : (
                      <Star size={14} fill={isTrending ? "currentColor" : "none"} />
                    )}
                    {isTrending ? "Trending Active (Mark Standard)" : "Mark Listing Trending"}
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Modify Details Button */}
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="py-4 bg-white dark:bg-white/5 hover:bg-neutral-50 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 rounded-2xl font-black text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Edit3 size={13} className="text-blue-500" />
                      Modify Specs
                    </button>

                    {/* Delete Permanently Button */}
                    <button
                      onClick={() => setShowDeleteDialog(true)}
                      className="py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-red-500/10"
                    >
                      <Trash2 size={13} />
                      Wipe Listing
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* ============================================================
          INSPECTION MODAL: EDIT LISTING DETAILS INLINE
      ============================================================ */}
      {showEditModal && post && (
        <div className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-[500px] bg-white dark:bg-[#121214] rounded-[36px] overflow-hidden shadow-2xl border border-transparent dark:border-white/10 animate-in zoom-in-95 duration-300">
            
            <form onSubmit={handleEditSubmit} className="flex flex-col max-h-[85vh]">
              
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-[#0A0A0A]/5 dark:border-white/10 flex items-center justify-between shrink-0">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black tracking-widest text-[#FF5211] uppercase">SPECIFICATION OVERRIDE</span>
                  <span className="font-bold text-sm truncate max-w-[280px]">Edit: {post.name || post.title}</span>
                </div>
                <button 
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="p-2 rounded-full hover:bg-[#F3F4F6] dark:hover:bg-white/5 transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Inputs Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black tracking-wider text-slate-400 uppercase px-1">Stay Title</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full h-12 px-4 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent focus:border-[#FF5211]/30 focus:outline-none text-xs font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black tracking-wider text-slate-400 uppercase px-1">Monthly Rent (₹)</label>
                    <input
                      type="number"
                      value={editRent}
                      onChange={(e) => setEditRent(Number(e.target.value))}
                      required
                      className="w-full h-12 px-4 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent focus:border-[#FF5211]/30 focus:outline-none text-xs font-bold"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black tracking-wider text-slate-400 uppercase px-1">City Hub</label>
                    <input
                      type="text"
                      value={editCity}
                      onChange={(e) => setEditCity(e.target.value)}
                      required
                      className="w-full h-12 px-4 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent focus:border-[#FF5211]/30 focus:outline-none text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black tracking-wider text-slate-400 uppercase px-1">Category Type</label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent focus:border-[#FF5211]/30 focus:outline-none text-xs font-bold cursor-pointer"
                    >
                      <option className="dark:bg-[#121214]" value="RENT">Rent / Flat</option>
                      <option className="dark:bg-[#121214]" value="PG">PG / Coliving</option>
                      <option className="dark:bg-[#121214]" value="STAY">Stays</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black tracking-wider text-slate-400 uppercase px-1">BHK Config</label>
                    <select
                      value={editBhk}
                      onChange={(e) => setEditBhk(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent focus:border-[#FF5211]/30 focus:outline-none text-xs font-bold cursor-pointer"
                    >
                      <option className="dark:bg-[#121214]" value="1 BHK">1 BHK</option>
                      <option className="dark:bg-[#121214]" value="2 BHK">2 BHK</option>
                      <option className="dark:bg-[#121214]" value="3 BHK">3 BHK</option>
                      <option className="dark:bg-[#121214]" value="4 BHK+">4 BHK+</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black tracking-wider text-slate-400 uppercase px-1">Furnishing Status</label>
                    <select
                      value={editFurnished}
                      onChange={(e) => setEditFurnished(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent focus:border-[#FF5211]/30 focus:outline-none text-xs font-bold cursor-pointer"
                    >
                      <option className="dark:bg-[#121214]" value="Unfurnished">Unfurnished</option>
                      <option className="dark:bg-[#121214]" value="Semi-Furnished">Semi-Furnished</option>
                      <option className="dark:bg-[#121214]" value="Fully-Furnished">Fully-Furnished</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black tracking-wider text-slate-400 uppercase px-1">Contact Phone</label>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent focus:border-[#FF5211]/30 focus:outline-none text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black tracking-wider text-slate-400 uppercase px-1">Owner Name</label>
                  <input
                    type="text"
                    value={editOwner}
                    onChange={(e) => setEditOwner(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent focus:border-[#FF5211]/30 focus:outline-none text-xs font-bold"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black tracking-wider text-slate-400 uppercase px-1">Property Address</label>
                  <textarea
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="w-full h-20 px-4 py-3 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent focus:border-[#FF5211]/30 focus:outline-none text-xs font-bold resize-none"
                  />
                </div>

              </div>

              {/* Modal Buttons Footer */}
              <div className="px-6 py-5 border-t border-[#0A0A0A]/5 dark:border-white/10 bg-[#FAFAF8] dark:bg-[#121214] flex gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-3 bg-neutral-200 dark:bg-white/5 hover:bg-neutral-300 dark:hover:bg-white/10 rounded-2xl font-black text-xs uppercase tracking-wider text-slate-600 dark:text-slate-300 transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="flex-1 py-3 bg-[#FF5211] text-white rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer text-center shadow-md shadow-orange-500/10 flex items-center justify-center gap-1.5"
                >
                  {isSavingEdit && <Loader2 size={12} className="animate-spin" />}
                  Save Override
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ============================================================
          CONFIRM DIALOG: DELETE LISTING PERMANENTLY
      ============================================================ */}
      {showDeleteDialog && post && (
        <div className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-[420px] bg-white dark:bg-[#121214] rounded-[36px] overflow-hidden shadow-2xl border border-transparent dark:border-white/10 p-6 flex flex-col gap-6 text-center animate-in zoom-in-95 duration-200">
            
            <div className="w-16 h-16 rounded-full bg-red-500/5 text-red-500 flex items-center justify-center mx-auto shadow-inner">
              <Trash2 size={28} />
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="font-black text-lg tracking-tight">Confirm Post Removal</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed px-2">
                Are you sure you want to permanently erase listing &ldquo;{post.name || post.title}&rdquo;? This database purge operation cannot be undone.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                disabled={isDeleting}
                onClick={() => setShowDeleteDialog(false)}
                className="flex-1 py-3.5 bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 rounded-2xl font-black text-xs uppercase tracking-wider text-[#64748b] dark:text-slate-300 transition-all cursor-pointer"
              >
                Keep Stay
              </button>
              <button
                disabled={isDeleting}
                onClick={handleDeletePost}
                className="flex-1 py-3.5 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-red-500/10 flex items-center justify-center gap-1.5"
              >
                {isDeleting && <Loader2 size={12} className="animate-spin" />}
                Purge E2E
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
