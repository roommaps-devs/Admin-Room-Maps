"use client";

import React from 'react';
import Link from 'next/link';
import {
  AlertCircle, MapPin, ArrowLeft, List as ListIcon,
  PlusCircle, Search,
} from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';

import ModeToggle from '@/components/ui/ModeToggle';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { setSearchQuery } from '@/store/searchSlice';
import { setMode } from '@/store/uiSlice';
import {
  setSearchCenter,
  setMapZoom,
  setSearchRadius,
  setShowProfileMenu,
  setShowRadiusPopup,
} from '@/store/mapSlice';
import { useRooms, useUniqueCities } from '@/lib/hooks/useRooms';
// useAuth removed
import { getDistanceKm } from '@/lib/utils';
import { UI_STRINGS } from '@/lib/constants/strings';
import PriceFilter from './PriceFilter';

interface MapHeaderProps {
  onOpenSearch: () => void;
  onPickLocation: () => void;
  onPostRoom: () => void;
  onShowList: () => void;
  isSelectingLocation: boolean;
  isPostingRoom: boolean;
}

export default function MapHeader({
  onOpenSearch,
  onPickLocation,
  onPostRoom,
  onShowList,
  isSelectingLocation,
  isPostingRoom,
}: MapHeaderProps) {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);

  const {
    searchQuery,
  } = useSelector((state: RootState) => state.search);

  const {
    mode,
  } = useSelector((state: RootState) => state.ui);

  const {
    searchRadius,
    showProfileMenu,
    searchCenter,
    priceRange,
  } = useSelector((state: RootState) => state.map);

  const { data: roomsData, isLoading: loading } = useRooms();
  const rooms = roomsData || [];

  const visibleRoomsCount = React.useMemo(() => {
    return rooms.filter(room => {
      const roomCategory = room.category || 'rent';
      const withinPrice = room.rent >= priceRange[0] && room.rent <= priceRange[1];
      if (roomCategory !== mode || !room.lat || !room.lng || !withinPrice) return false;
      const dist =
        getDistanceKm(
          Number(searchCenter[0]), Number(searchCenter[1]),
          Number(room.lat), Number(room.lng)
        ) * 1000;
      return dist <= searchRadius;
    }).length;
  }, [rooms, mode, searchCenter, searchRadius, priceRange]);

  const { data: cities } = useUniqueCities();

  const handleCityClick = async (city: string) => {
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(city)}&provider=nominatim`);
      const data = await res.json();
      if (data && data.length > 0) {
        const coords: [number, number] = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        dispatch(setSearchCenter(coords));
        dispatch(setSearchQuery(city));
        dispatch(setMapZoom(13));
      }
    } catch (e) {
      if (process.env.NODE_ENV !== "production") console.error(e);
    }
  };

  const [isMobile, setIsMobile] = React.useState(false);
  
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[1001] pointer-events-none">
      {!isMobile && (
        /* DESKTOP HEADER */
        <div
          className="relative z-10 hidden md:flex items-center gap-3 px-5 h-16 pointer-events-auto border-b border-[var(--glass-border)]"
          style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(24px)',
          }}
        >
          {/* Back */}
          <Link
            href="/"
            className="shrink-0 w-9 h-9 rounded-xl bg-[var(--bg-surface)] border border-[var(--glass-border)] flex items-center justify-center text-[var(--text-primary)]/40 hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-all active:scale-90"
            title="Home"
          >
            <ArrowLeft size={16} />
          </Link>

          <div className="w-px h-6 bg-[var(--glass-border)] shrink-0" />

          {/* Rooms count pill */}
          <div className="flex items-center gap-1.5 shrink-0 px-2.5 py-1 bg-[var(--bg-surface)] rounded-full border border-[var(--glass-border)]">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse shadow-[0_0_8px_rgba(255,82,17,1)]" />
            <span className="text-[11px] font-bold tracking-tight text-[var(--text-primary)]/50 lowercase">
              <span className="text-[var(--text-primary)] font-black text-[12px]">
                {loading ? '—' : visibleRoomsCount}
              </span>{' '}
              {visibleRoomsCount === 1 ? UI_STRINGS.map.header.roomNearby : UI_STRINGS.map.header.roomsNearby}
            </span>
          </div>

          <div className="w-px h-6 bg-[var(--glass-border)] shrink-0" />

          {/* Search bar */}
          <div className="flex-1 flex items-center min-w-0">
            <Search size={15} className="text-[var(--text-primary)]/30 mr-2.5 shrink-0" />
            <input
              type="text"
              readOnly
              placeholder="Search area or city..."
              className="w-full bg-transparent border-none outline-none text-[var(--text-primary)]/90 font-semibold text-[13.5px] cursor-pointer truncate placeholder:text-[var(--text-primary)]/25"
              onClick={onOpenSearch}
              value={searchQuery}
            />
            <Tooltip.Provider delayDuration={300}>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 ml-2 rounded-lg text-[var(--text-primary)]/35 hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-all text-[11px] font-bold border border-[var(--glass-border)] hover:border-[var(--primary)]/20"
                    onClick={(e) => { e.stopPropagation(); onPickLocation(); }}
                  >
                    <MapPin size={13} />
                    <span>Pick</span>
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="z-[9999] px-3 py-2 rounded-xl text-[12px] font-semibold text-[var(--text-primary)]/90 shadow-xl animate-in fade-in zoom-in-95"
                    style={{
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--glass-border)',
                      backdropFilter: 'blur(12px)',
                    }}
                    sideOffset={8}
                    side="bottom"
                  >
                    Click to pick a spot on the map
                    <Tooltip.Arrow style={{ fill: 'var(--bg-surface-elevated)' }} />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          </div>

          <div className="w-px h-6 bg-[var(--glass-border)] shrink-0" />

          {/* Mode Toggle */}
          <ModeToggle
            variant="map"
            mode={mode}
            onChange={(m) => dispatch(setMode(m as 'rent' | 'travelers'))}
          />

          <div className="w-px h-6 bg-[var(--glass-border)] shrink-0" />

          {/* Radius selector */}
          <div className="flex items-center gap-1.5 shrink-0 ml-1">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-primary)]/10 pr-2 border-r border-[var(--glass-border)] mr-1">
              Radius
            </span>
            {[500, 1000, 5000, 10000 ].map((r) => (
              <button
                key={r}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-tight transition-all active:scale-90 ${
                  searchRadius === r
                    ? 'bg-[var(--primary)]/90 text-[var(--primary-foreground)] shadow-[0_2px_8px_rgba(255,82,17,0.4)]'
                    : 'text-[var(--text-primary)]/30 hover:text-[var(--text-primary)]/60 hover:bg-[var(--bg-surface)]'
                }`}
                onClick={() => {
                  dispatch(setSearchRadius(r));
                  if (r === 500) dispatch(setMapZoom(16));
                  else if (r === 1000) dispatch(setMapZoom(15));
                  else if (r === 5000) dispatch(setMapZoom(13));
                  else if (r === 10000) dispatch(setMapZoom(12));
                }}
              >
                {r >= 1000 ? `${r / 1000}km` : `${r}m`}
              </button>
            ))}
          </div>

          <div className="w-px h-6 bg-[var(--glass-border)] shrink-0" />

          {/* Price Filter (Desktop) */}
          <PriceFilter variant="desktop" />

          <div className="flex items-center gap-2.5 ml-auto">
            {/* List View */}
            <button
              className="shrink-0 h-9 flex items-center gap-1.5 px-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--glass-border)] text-[var(--text-primary)]/70 font-bold text-[12px] hover:bg-[var(--bg-surface-elevated)] hover:text-[var(--text-primary)] transition-all active:scale-95"
              onClick={onShowList}
            >
              <ListIcon size={13} />
              <span>{UI_STRINGS.map.header.list}</span>
            </button>

            {/* Post Room */}
            <button
              className="shrink-0 h-9 flex items-center gap-1.5 px-4 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] font-black text-[12px] transition-all hover:scale-[1.03] active:scale-95 shadow-[0_4px_12px_rgba(255,82,17,0.35)]"
              onClick={onPostRoom}
            >
              <PlusCircle size={14} />
              <span>{UI_STRINGS.map.header.postRoom}</span>
            </button>
          </div>

          {/* Avatar */}
          {user && (
            <button
              className="shrink-0 w-9 h-9 rounded-full overflow-hidden ring-2 ring-[var(--glass-border)] hover:ring-[var(--primary)]/50 transition-all active:scale-90"
              onClick={() => dispatch(setShowProfileMenu(!showProfileMenu))}
            >
              <img
                src={
                  user.photoURL ||
                  `https://ui-avatars.com/api/?name=${user.displayName || 'U'}&background=FF5211&color=fff&bold=true`
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>
          )}
        </div>
      )}

      {/* MOBILE HEADER - Floating Island */}
      <div
        className="md:hidden p-3 pointer-events-none flex flex-col gap-2 pt-[max(env(safe-area-inset-top),16px)]"
      >
        <div 
          className="flex flex-col gap-2 p-3 rounded-[32px] pointer-events-auto border border-black/10 shadow-[0_8px_32px_rgba(0,0,0,0.15)] overflow-hidden"
          style={{ 
            background: 'rgba(255, 255, 255, 0.96)', 
            backdropFilter: 'blur(32px) saturate(180%)',
          }}
        >
          {/* Row 1: Back + Search */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="shrink-0 w-10 h-10 rounded-2xl bg-black/[0.04] border border-black/[0.06] flex items-center justify-center text-black/40 active:scale-90 transition-transform"
            >
              <ArrowLeft size={18} />
            </Link>
            <div
              className="flex-1 flex items-center bg-black/[0.04] border border-black/[0.06] h-10 rounded-2xl px-4 gap-2 cursor-pointer active:scale-[0.98] transition-transform"
              onClick={onOpenSearch}
            >
              <Search size={15} className="text-black/30 shrink-0" />
              <span className={`text-[13px] font-semibold truncate flex-1 ${searchQuery ? 'text-black/80' : 'text-black/40'}`}>
                {searchQuery || 'Search area or city...'}
              </span>
            </div>
          </div>

          {/* Row 2: Mode Toggle */}
          <ModeToggle
            variant="map"
            mode={mode}
            onChange={(m) => dispatch(setMode(m as 'rent' | 'travelers'))}
            className="mx-auto w-full"
          />

          {/* Row 3: Price Filter */}
          {!isSelectingLocation && !isPostingRoom && (
            <PriceFilter variant="mobile" />
          )}
        </div>
      </div>

      {/* NO RESULTS BANNER — hidden while user is selecting location or posting */}
      {!loading && visibleRoomsCount === 0 && !isSelectingLocation && !isPostingRoom && (
        <div className="flex justify-center mt-2 px-4 pointer-events-auto">
          <div
            className="flex items-center gap-3 px-5 py-2.5 rounded-full animate-in fade-in slide-in-from-top-4 duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-black/10"
            style={{
              background: 'rgba(255, 255, 255, 0.96)',
              backdropFilter: 'blur(24px)',
            }}
          >
            <div className="w-6 h-6 rounded-full bg-[var(--primary)]/10 flex items-center justify-center shrink-0">
              <AlertCircle size={13} className="text-[var(--primary)]" strokeWidth={2.5} />
            </div>
            <p className="text-[12px] text-black/60 font-bold tracking-tight">
              No rooms in{' '}
              <span className="text-black font-black">
                {searchRadius >= 1000 ? `${searchRadius / 1000}km` : `${searchRadius}m`}
              </span>{' '}
              range
            </p>
            {searchRadius < 10000 && (
              <button
                className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)] hover:opacity-80 transition-all pl-3 border-l border-black/10 active:scale-95"
                onClick={() => {
                  if (isMobile) {
                    dispatch(setShowRadiusPopup(true));
                  } else {
                    // Programmatically expand the radius to the next level on desktop
                    let nextRadius = searchRadius;
                    if (searchRadius === 500) nextRadius = 1000;
                    else if (searchRadius === 1000) nextRadius = 5000;
                    else if (searchRadius === 5000) nextRadius = 10000;
                    else return; // already at max radius
                    
                    dispatch(setSearchRadius(nextRadius));
                    if (nextRadius === 500) dispatch(setMapZoom(16));
                    else if (nextRadius === 1000) dispatch(setMapZoom(15));
                    else if (nextRadius === 5000) dispatch(setMapZoom(13));
                    else if (nextRadius === 10000) dispatch(setMapZoom(12));
                  }
                }}
              >
                Expand
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
