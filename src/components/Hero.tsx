"use client";

import { useCallback, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { Search, MapPin, PlusCircle, Home as HomeIcon, Loader2, Plane, Star, Key, Home, Shield } from 'lucide-react';
import ModeToggle from '@/components/ui/ModeToggle';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import { setMode, setTravelersSheet } from '@/store/uiSlice';
import { setSearchQuery, setShowSuggestions, setIsSearching, setSuggestions } from '@/store/searchSlice';
import { SearchSuggestion } from '@/lib/types';

export default function Hero() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.user);
  const { mode, showTravelersSheet } = useSelector((state: RootState) => state.ui);
  const { searchQuery, suggestions, isSearching, showSuggestions } = useSelector((state: RootState) => state.search);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);
  const [headlineVisible, setHeadlineVisible] = useState(false);
  const locations = ['Delhi NCR', 'Mumbai', 'Bangalore', 'Hyderabad', 'Pune', 'Chandigarh', 'all states in India'];

  // Trigger headline animation after mount
  useEffect(() => { const t = setTimeout(() => setHeadlineVisible(true), 100); return () => clearTimeout(t); }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: (e.clientX / window.innerWidth - 0.5) * 40, y: (e.clientY / window.innerHeight - 0.5) * 40 });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentLocationIndex((prev) => (prev + 1) % locations.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [locations.length]);

  // Suggestion fetching logic
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 3) {
      dispatch(setSuggestions([]));
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      dispatch(setIsSearching(true));
      try {
        const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(searchQuery + ', India')}&limit=5`);
        const data = await res.json();
        if (data && data.features) {
          dispatch(setSuggestions(data.features));
          dispatch(setShowSuggestions(true));
        }
      } catch (err) {
        if (process.env.NODE_ENV !== "production") console.error(err);
      } finally {
        dispatch(setIsSearching(false));
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, dispatch]);

  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) return;
    dispatch(setIsSearching(true));
    // Simulate API call or redirect
    router.push(`/map?q=${encodeURIComponent(searchQuery)}&mode=${mode}`);
    setTimeout(() => dispatch(setIsSearching(false)), 500);
  }, [searchQuery, mode, router, dispatch]);

  // On mobile: first tap shows explanation sheet, subsequent taps switch directly
  const handleTravelersTap = useCallback(() => {
    if (mode === 'travelers') return; // already on travelers, do nothing
    const alreadyExplained = typeof window !== 'undefined'
      ? localStorage.getItem('travelers_explained')
      : null;
    if (!alreadyExplained) {
      dispatch(setTravelersSheet(true));
    } else {
      dispatch(setMode('travelers'));
    }
  }, [mode, dispatch]);

  const confirmTravelersSwitch = useCallback(() => {
    dispatch(setMode('travelers'));
    dispatch(setTravelersSheet(false));
    localStorage.setItem('travelers_explained', 'true');
  }, [dispatch]);

  const dismissSheet = useCallback(() => {
    dispatch(setTravelersSheet(false));
  }, [dispatch]);

  return (
    <div className="relative min-h-[700px] md:min-h-screen flex flex-col items-center justify-center pt-20 pb-10 md:pt-24 md:pb-10 overflow-x-hidden bg-[#FAFAF8]">
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Atmospheric Orbs - subtle */}
        <div 
          className="absolute top-[5%] left-[-5%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(255,87,51,0.04)_0%,transparent_65%)] blur-[40px] transition-transform duration-1000 ease-out"
          style={{ transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)` }}
        />
        <div 
          className="absolute bottom-0 right-[-5%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(37,99,235,0.03)_0%,transparent_65%)] blur-[30px] transition-transform duration-1000 ease-out"
          style={{ transform: `translate(${mousePos.x * -0.3}px, ${mousePos.y * -0.3}px)` }}
        />
      </div>

      {/* --- FLOATING ELEMENTS --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 hidden lg:block">
        {/* Floating Room Preview */}
        <div 
          className="absolute top-[18%] left-[8%] w-[260px] p-3 bg-white/80 backdrop-blur-xl border border-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.08)] animate-float-slow rotate-[-6deg] group transition-all duration-700 ease-out animate-in fade-in zoom-in slide-in-from-left-20 duration-1000"
          style={{ transform: `translate(${mousePos.x * 0.8}px, ${mousePos.y * 0.8}px) rotate(-6deg)` }}
        >
          <div className="relative h-40 rounded-[24px] overflow-hidden mb-3">
            <Image
              src="https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=500&auto=format&fit=crop"
              fill
              alt="Premium Room"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl text-[12px] font-black text-[#0A0A0A] shadow-sm">₹15,000/mo</div>
          </div>
          <div className="px-2 pb-2">
            <div className="h-2.5 w-2/3 bg-[#0A0A0A]/10 rounded-full mb-2" />
            <div className="h-2 w-1/2 bg-[#0A0A0A]/5 rounded-full" />
          </div>
        </div>

        {/* Floating Zero Brokerage Pill */}
        <div 
          className="absolute top-[25%] right-[10%] px-6 py-3.5 bg-[#FF5733] rounded-full text-white font-black text-sm shadow-[0_15px_35px_rgba(255,87,51,0.25)] animate-float-medium rotate-[8deg] flex items-center gap-2.5 border border-[#FF5733]/20 transition-all duration-700 ease-out animate-in fade-in zoom-in slide-in-from-right-20 duration-1000 delay-200"
          style={{ transform: `translate(${mousePos.x * -1}px, ${mousePos.y * -1}px) rotate(8deg)` }}
        >
          <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_8px_white]" />
          <span className="tracking-widest uppercase">Zero Brokerage</span>
        </div>

        {/* Floating Star Rating */}
        <div 
          className="absolute bottom-[28%] left-[11%] p-5 bg-white/80 backdrop-blur-xl border border-white rounded-[28px] animate-float-fast shadow-[0_15px_40px_rgba(0,0,0,0.06)] flex items-center gap-4 transition-all duration-700 ease-out animate-in fade-in zoom-in slide-in-from-bottom-20 duration-1000 delay-400"
          style={{ transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)` }}
        >
          <div className="w-12 h-12 rounded-2xl bg-[#FF5733]/5 flex items-center justify-center text-[#FF5733]">
            <Star size={24} fill="currentColor" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="text-[#0A0A0A] font-black text-lg">4.9/5</span>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="#FF5733" className="text-[#FF5733]" />)}
              </div>
            </div>
            <span className="text-[#6B6B6B] text-[10px] font-bold tracking-widest uppercase">Community Choice</span>
          </div>
        </div>

        {/* Floating Location Pin */}
        <div 
          className="absolute top-[45%] right-[12%] flex items-center gap-3 animate-float-slow transition-all duration-1000 ease-out animate-in fade-in zoom-in slide-in-from-right-20 duration-1000 delay-500" 
          style={{ transform: `translate(${mousePos.x * -0.6}px, ${mousePos.y * -0.6}px)` }}
        >
          <div className="w-12 h-12 rounded-full bg-white border border-[#0A0A0A]/5 flex items-center justify-center text-[#FF5733] shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
            <MapPin size={22} fill="currentColor" className="opacity-20" />
            <MapPin size={22} className="absolute" />
          </div>
          <div key={locations[currentLocationIndex]} className="px-5 py-2.5 bg-white/80 backdrop-blur-md border border-white rounded-full text-sm font-bold text-[#0A0A0A] shadow-[0_10px_25px_rgba(0,0,0,0.04)] animate-in fade-in zoom-in-95 duration-500">{locations[currentLocationIndex] === 'all states in India' ? 'All India' : locations[currentLocationIndex]}</div>
        </div>

        {/* Floating Verified Badge */}
        <div 
          className="absolute top-[65%] right-[22%] px-5 py-3 bg-white/90 backdrop-blur-xl border border-[#22c55e]/20 rounded-2xl flex items-center gap-3 shadow-[0_15px_35px_rgba(34,197,94,0.08)] animate-float-medium transition-all duration-1000 ease-out animate-in fade-in zoom-in slide-in-from-right-20 duration-1000 delay-700"
          style={{ transform: `translate(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px) rotate(-4deg)` }}
        >
          <div className="w-8 h-8 rounded-full bg-[#22c55e]/10 flex items-center justify-center text-[#22c55e]">
            <Shield size={18} fill="currentColor" className="opacity-20" />
            <Shield size={18} className="absolute" />
          </div>
          <div className="flex flex-col">
            <span className="text-[#0A0A0A] font-black text-[12px] leading-tight">Verified</span>
            <span className="text-[#6B6B6B] font-bold text-[9px] uppercase tracking-wider">Properties</span>
          </div>
        </div>

        {/* Drifting Micro-Icons */}
        <div className="absolute top-[15%] right-[25%] opacity-15 animate-float-medium scale-110 text-[#0A0A0A] animate-in fade-in duration-1000 delay-800"><Home size={28} /></div>
        <div className="absolute bottom-[20%] right-[30%] opacity-20 animate-float-fast text-[#FF5733] rotate-[35deg] animate-in fade-in duration-1000 delay-900"><Key size={24} /></div>
        <div className="absolute top-[45%] left-[20%] opacity-10 animate-float-slow text-[#0A0A0A] animate-in fade-in duration-1000 delay-1000"><PlusCircle size={20} /></div>
      </div>

      {/* --- CENTRAL HERO CONTENT --- */}
      <section className="relative z-20 w-full max-w-[1200px] mx-auto text-center px-6">

        {/* Status Badge */}
        <div className="inline-flex items-center gap-3 bg-white border border-[#0A0A0A]/5 px-5 py-2.5 rounded-full text-[13px] font-bold text-[#0A0A0A]/60 mb-10 shadow-[0_8px_20px_rgba(0,0,0,0.04)] animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22c55e]"></span>
          </div>
          <span>Now live in <span key={locations[currentLocationIndex]} className="text-[#0A0A0A] animate-in fade-in duration-500">{locations[currentLocationIndex]}</span></span>
        </div>

        {/* Mode Switcher */}
        <div className="flex lg:hidden justify-center mb-12 animate-in fade-in slide-in-from-top-6 duration-1000 delay-200">
          <ModeToggle 
            mode={mode} 
            onChange={(m) => dispatch(setMode(m))} 
          />
        </div>

        {/* Headline - SEO h1 with word-reveal animation */}
        <h1
          aria-label={mode === 'travelers' ? 'Find Your Perfect Stay in India' : 'Find Your Perfect Room in India'}
          className="text-[clamp(40px,9vw,88px)] font-sans font-black leading-[0.94] tracking-tighter mb-5 text-[#0A0A0A]"
        >
          <span
            className={`inline-block transition-all duration-700 ease-out ${
              headlineVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Find Your
          </span>
          <br />
          <span
            className={`text-[#FF5733] inline-block transition-all duration-700 ease-out delay-200 ${
              headlineVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {mode === 'travelers' ? 'Perfect Stay.' : 'Perfect Room.'}
          </span>
        </h1>

        <p className="text-[clamp(18px,2vw,21px)] text-[#6B6B6B] max-w-[700px] mx-auto mb-10 leading-relaxed font-medium animate-in fade-in duration-1200 delay-300">
          {mode === 'travelers' 
            ? "Discover premium daily stays and short-term rentals on India's first"
            : "Experience zero brokerage and direct owner contact on India's first"
          }
          <span className="relative inline-block text-[#0A0A0A] font-bold px-1 group">
            Weightless Search
            <svg 
              className="absolute -bottom-2 left-0 w-full h-[10px] pointer-events-none overflow-visible" 
              viewBox="0 0 78 6" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <path 
                d="M0 1.44h55.796c21.468 0 20.21 1.999-3.827 3.56" 
                stroke="#F15700" 
                strokeWidth="2" 
                strokeLinecap="round" 
                className="animate-draw-squiggle"
                style={{ strokeDasharray: 100, strokeDashoffset: 100 }}
              />
            </svg>
          </span> platform.
        </p>

        {/* CENTRAL SEARCH BAR - Pill style with Deep Shadow */}
        <div className="relative w-full max-w-[750px] mx-auto mb-9 group animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="relative flex w-full bg-white border border-[#0A0A0A]/5 rounded-full p-1.5 md:p-2.5 gap-2 md:gap-3 items-center shadow-[0_25px_60px_rgba(0,0,0,0.08)] group-focus-within:shadow-[0_25px_70px_rgba(255,87,51,0.15)] group-focus-within:border-[#FF5733]/20 group-hover:shadow-[0_30px_80px_rgba(0,0,0,0.12)] transition-all duration-700">
            <Search className="text-[#0A0A0A]/20 ml-3 md:ml-6 group-focus-within:text-[#FF5733] transition-colors shrink-0" size={20} />
            <input
              type="text"
              className="flex-1 min-w-0 text-ellipsis bg-transparent border-none text-[#0A0A0A] text-base md:text-xl placeholder:text-[#0A0A0A]/20 outline-none font-medium h-12 md:h-14"
              placeholder={mode === 'travelers' ? 'Where are you traveling to?' : 'Search by area, city or locality...'}
              value={searchQuery}
              autoComplete="off"
              onChange={(e) => {
                dispatch(setSearchQuery(e.target.value));
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              onBlur={() => setTimeout(() => dispatch(setShowSuggestions(false)), 200)}
              onFocus={() => { if (suggestions.length > 0) dispatch(setShowSuggestions(true)); }}
            />
            {isSearching && <Loader2 size={18} className="animate-spin text-[#FF5733] mr-2.5" />}
            <button
              className="relative overflow-hidden bg-[#FF5733] text-white px-4 md:px-12 h-12 md:h-14 rounded-full font-black text-sm md:text-lg cursor-pointer transition-all duration-300 shadow-[0_10px_25px_rgba(255,87,51,0.3)] hover:scale-[1.03] hover:shadow-[0_15px_35px_rgba(255,87,51,0.5)] active:scale-95 group/btn"
              onClick={handleSearch}
            >
              <span className="relative z-10">Search</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shine" />
            </button>
          </div>

          {/* Autocomplete - Floating style */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-[calc(100%+20px)] left-0 w-full bg-white border border-[#0A0A0A]/5 rounded-[32px] overflow-hidden z-[100] shadow-[0_40px_100px_rgba(0,0,0,0.1)] animate-in fade-in slide-in-from-top-4 duration-300">
              {suggestions.map((feature: SearchSuggestion, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center gap-5 px-8 py-5 cursor-pointer transition-all hover:bg-[#FAFAF8] group/item"
                  onClick={() => { dispatch(setSearchQuery(feature.properties.name || '')); dispatch(setShowSuggestions(false)); handleSearch(); }}
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#0A0A0A]/3 border border-[#0A0A0A]/5 flex items-center justify-center text-[#0A0A0A]/20 group-hover/item:text-[#FF5733] group-hover/item:scale-110 transition-all">
                    <MapPin size={20} />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[17px] font-bold text-[#0A0A0A] group-hover/item:text-[#FF5733] transition-colors">{feature.properties.name}</span>
                    <span className="text-[12px] font-medium text-[#6B6B6B]">{feature.properties.city || feature.properties.country}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* POPULAR CITIES - Light Gray Pills */}
        <div className="flex flex-wrap justify-center items-center gap-2.5 mb-15 animate-in fade-in duration-1000">
          <span className="text-[11px] font-black text-[#0A0A0A]/30 uppercase tracking-[0.25em] mr-2">Popular:</span>
          {['Delhi NCR', 'Mumbai', 'Bangalore', 'Hyderabad', 'Pune', 'Chandigarh'].map((city) => (
            <button
              key={city}
              onClick={() => { dispatch(setSearchQuery(city)); handleSearch(); }}
              className="group/city relative overflow-hidden px-5 py-2.5 rounded-full bg-white border border-[#0A0A0A]/10 text-[13px] font-bold text-[#6B6B6B] hover:bg-[#0A0A0A] hover:text-white hover:border-[#0A0A0A] hover:scale-105 transition-all active:scale-95 shadow-sm"
            >
              <span className="relative z-10">{city}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/city:animate-shine" />
            </button>
          ))}
        </div>

        {/* CTA BUTTONS - Large & High Impact */}
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center mb-12 md:mb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <Link href={`/map?mode=${mode}&nearby=true`} className="relative overflow-hidden h-14 md:h-18 px-8 md:px-14 rounded-full font-black text-base md:text-lg no-underline inline-flex items-center justify-center gap-3 md:gap-4 transition-all duration-500 bg-[#FF5733] text-white shadow-[0_20px_45px_rgba(255,87,51,0.25)] hover:scale-[1.04] hover:translate-y-[-6px] hover:shadow-[0_30_60px_rgba(255,87,51,0.4)] active:scale-95 group/main">
            <MapPin size={20} className="group-hover/main:rotate-12 transition-transform" />
            {mode === 'travelers' ? 'Nearby Stays' : 'Nearby Rooms'}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/main:animate-shine" />
          </Link>
          <Link href="/listing" className="relative overflow-hidden h-14 md:h-18 px-8 md:px-14 rounded-full font-black text-base md:text-lg no-underline inline-flex items-center justify-center gap-3 md:gap-4 transition-all duration-500 bg-white text-[#0A0A0A] border-2 border-[#0A0A0A]/5 hover:bg-white hover:border-[#0A0A0A]/10 hover:translate-y-[-6px] hover:shadow-[0_20px_45px_rgba(0,0,0,0.06)] active:scale-95 group/browse">
            <HomeIcon size={20} className="group-hover/browse:rotate-12 transition-transform" />
            Browse All
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover/browse:animate-shine" />
          </Link>
          <Link href="/post" className="h-14 md:h-18 px-8 md:px-14 rounded-full font-black text-base md:text-lg no-underline inline-flex items-center justify-center gap-3 md:gap-4 transition-all duration-500 bg-[#0A0A0A]/5 text-[#0A0A0A]/60 border border-transparent hover:bg-[#0A0A0A]/10 hover:translate-y-[-6px] active:scale-95 group/post">
            <PlusCircle size={20} className="group-hover/post:rotate-90 transition-transform" />
            {mode === 'travelers' ? 'List' : 'Post'}
          </Link>
        </div>

        {/* STATS BAR — trust signals & SEO keyword signals */}
        <div
          aria-label="Platform statistics"
          className={`flex flex-wrap justify-center gap-x-10 gap-y-3 mt-4 transition-all duration-1000 delay-700 ${
            headlineVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {[
            { value: '10,000+', label: 'Verified Rooms' },
            { value: '₹0', label: 'Brokerage' },
            { value: '50+', label: 'Cities' },
            { value: '4.9★', label: 'Rated' },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center">
              <span className="text-xl font-black text-[#0A0A0A]">{value}</span>
              <span className="text-[11px] font-bold text-[#0A0A0A]/40 uppercase tracking-widest">{label}</span>
            </div>
          ))}
        </div>

      </section>

      {/* MOBILE: Explanation Sheet (Updated for Light Mode) */}
      {showTravelersSheet && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-md z-[10000] flex items-end animate-in fade-in duration-300" onClick={dismissSheet}>
          <div className="bg-white border-t border-[#0A0A0A]/5 rounded-t-[40px] p-8 pb-14 w-full text-center animate-in slide-in-from-bottom duration-500 shadow-[0_-30px_60px_rgba(0,0,0,0.1)]" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-1.5 bg-[#0A0A0A]/10 rounded-full mx-auto mb-10" />
            <div className="w-18 h-18 bg-[#FF5733]/5 rounded-3xl flex items-center justify-center mx-auto mb-6 text-[#FF5733]">
              <Plane size={36} />
            </div>
            <h3 className="text-3xl font-sans font-black text-[#0A0A0A] mb-3">For Travelers</h3>
            <p className="text-[17px] text-[#6B6B6B] leading-relaxed mb-10 max-w-[320px] mx-auto font-medium">
              Daily stays & short-term rent — perfect for work trips or exploring.
            </p>
            <button className="w-full h-15 bg-[#FF5733] text-white border-none rounded-2xl text-lg font-black cursor-pointer mb-5 shadow-[0_15px_35px_rgba(255,87,51,0.25)] transition-all active:scale-95" onClick={confirmTravelersSwitch}>
              Switch to Traveler Stays
            </button>
            <button className="bg-none border-none text-[#0A0A0A]/40 text-[14px] font-bold cursor-pointer py-2 hover:text-[#0A0A0A] transition-colors" onClick={dismissSheet}>
              Keep Browsing Monthly Rent
            </button>
          </div>
        </div>
      )}
    </div>

  );
}
