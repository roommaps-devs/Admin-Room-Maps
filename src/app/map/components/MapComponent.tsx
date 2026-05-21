"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { clearUser } from '@/store/userSlice';
import { useRouter } from 'next/navigation';
import {
  LogOut, Crosshair
} from 'lucide-react';
import LocationOverlay from '../../../components/LocationOverlay';
import { formatRent, formatRentCompact, getDistanceKm } from '../../../lib/utils';
import RoomDetailModal from '@/components/map/RoomDetailModal';
import 'leaflet/dist/leaflet.css';

// Modular Components
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import MapHeader from './MapHeader';
import PriceFilter from './PriceFilter';
import PostListingForm from '@/components/map/PostListingForm';

// Sub-components
import SearchModal from './SearchModal';
import RoomsListModal from './RoomsListModal';
import MobileControls from './MobileControls';
import LightboxModal from './LightboxModal';
import LocationPicker from './LocationPicker';
import LocateMeButton from './LocateMeButton';
import MapView from './MapView';
import MapLoading from './MapLoading';

// TanStack Query hooks
import { useAddRoom, resolveImageUrl } from '@/lib/hooks/useRooms';
import { getRequest } from '@/lib/apiCall';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { setMode } from '@/store/uiSlice';
import { setSearchQuery } from '@/store/searchSlice';
import {
  setSearchCenter,
  setMapZoom,
  setLiveUserPos,
  setLocationState,
  setSelectedRoom,
  setBottomSheetOpen,
  setSearchRadius,
  setShowRadiusPopup,
  setPriceRange,
} from '@/store/mapSlice';

// Custom Hooks
import { useMapInitialization } from '../hooks/useMapInitialization';

const DEFAULT_LAT = 30.7046;
const DEFAULT_LNG = 76.7179;

import { Room } from '@/lib/types';

export default function MapComponent({
  rooms,
  initialSearch,
  initialMode = 'rent',
  initialId = '',
  autoPost = false,
  isNearby = false
}: {
  rooms: Room[],
  initialSearch?: string,
  initialMode?: string,
  initialId?: string,
  autoPost?: boolean,
  isNearby?: boolean
}) {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  const logout = () => dispatch(clearUser());
  const router = useRouter();

  // Redux state
  const { mode } = useSelector((state: RootState) => state.ui);
  const { searchQuery } = useSelector((state: RootState) => state.search);
  const {
    searchCenter,
    mapZoom,
    liveUserPos,
    locationState,
    selectedRoom,
    bottomSheetOpen,
    searchRadius,
    showRadiusPopup,
    priceRange,
  } = useSelector((state: RootState) => state.map);

  const isAreaView = mapZoom > 13;

  // For logout modal, I'll use a local state or check if there's a uiSlice for it
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const closeLogoutModal = () => setIsLogoutModalOpen(false);

  // Local UI state
  const [mapCenter, setMapCenter] = useState<[number, number]>([DEFAULT_LAT, DEFAULT_LNG]);
  const [useFlyTo, setUseFlyTo] = useState(false);
  const [dynamicRooms, setDynamicRooms] = useState<Room[]>(rooms);
  const [viewportCounts, setViewportCounts] = useState<{
    total: number;
    cityWise: Record<string, number>;
    areaWise: Record<string, number>;
    stateWise: Record<string, number>;
  } | null>(() => {
    if (!rooms || rooms.length === 0) return null;
    const cityWise: Record<string, number> = {};
    const areaWise: Record<string, number> = {};
    const stateWise: Record<string, number> = {};
    rooms.forEach((room) => {
      if (room.city) {
        const cityKey = room.city.trim();
        cityWise[cityKey] = (cityWise[cityKey] || 0) + 1;
      }
      if (room.state) {
        const stateKey = room.state.trim();
        stateWise[stateKey] = (stateWise[stateKey] || 0) + 1;
      }
      const areaKey = room.area || room.location?.split(',')[0]?.trim() || room.city || 'Unknown Area';
      areaWise[areaKey] = (areaWise[areaKey] || 0) + 1;
    });
    return {
      total: rooms.length,
      cityWise,
      areaWise,
      stateWise,
    };
  });

  // Sync with initial rooms if they change
  useEffect(() => {
    setDynamicRooms(rooms);
    if (rooms && rooms.length > 0) {
      const cityWise: Record<string, number> = {};
      const areaWise: Record<string, number> = {};
      const stateWise: Record<string, number> = {};
      rooms.forEach((room) => {
        if (room.city) {
          const cityKey = room.city.trim();
          cityWise[cityKey] = (cityWise[cityKey] || 0) + 1;
        }
        if (room.state) {
          const stateKey = room.state.trim();
          stateWise[stateKey] = (stateWise[stateKey] || 0) + 1;
        }
        const areaKey = room.area || room.location?.split(',')[0]?.trim() || room.city || 'Unknown Area';
        areaWise[areaKey] = (areaWise[areaKey] || 0) + 1;
      });
      setViewportCounts({
        total: rooms.length,
        cityWise,
        areaWise,
        stateWise,
      });
    }
  }, [rooms]);
  const [showRoomsList, setShowRoomsList] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [isSelectingLocation, setIsSelectingLocation] = useState(false);
  const [isPostingRoom, setIsPostingRoom] = useState(false);
  const [tempQuery, setTempQuery] = useState('');
  const [hoveredRoomId, setHoveredRoomId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [lightBoxImage, setLightBoxImage] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Initialization Hook
  const { mounted, reverseGeocode } = useMapInitialization({
    initialRooms: rooms,
    initialSearch,
    initialMode,
    initialId,
    isNearby,
    setMapCenter,
    setUseFlyTo,
  });

  // Audio Preloading
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);
  const bottomSheetSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    clickSoundRef.current = new Audio('https://res.cloudinary.com/dunvnehds/video/upload/v1774355859/mixkit-quick-win-video-game-notification-269_txyxzm.mp3');
    bottomSheetSoundRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');

    [clickSoundRef, bottomSheetSoundRef].forEach(ref => {
      if (ref.current) {
        ref.current.preload = 'auto';
        ref.current.volume = 0.5;
      }
    });
  }, []);

  const playClickSound = useCallback(() => {
    clickSoundRef.current?.play().catch(() => { });
  }, []);

  // Memoized callbacks
  const handleLocationStateChange = useCallback((s: 'pending' | 'denied' | 'granted' | 'skipped') => {
    dispatch(setLocationState(s));
  }, [dispatch]);

  // Auto-post logic
  useEffect(() => {
    if (autoPost) {
      setIsPostingRoom(true);
      setIsSelectingLocation(true);
    }
  }, [autoPost]);

  // Reset price range when mode changes
  useEffect(() => {
    dispatch(setPriceRange([0, 1000000]));
  }, [mode, dispatch]);

  // Search Logic
  useEffect(() => {
    if (!tempQuery || tempQuery.length < 3) {
      setSuggestions([]);
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(tempQuery)}`);
        const data = await res.json();
        if (data && data.features) {
          setSuggestions(data.features);
        }
      } catch (err) {
        if (process.env.NODE_ENV !== "production") console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [tempQuery]);

  const handleSearch = useCallback(async () => {
    if (!tempQuery.trim()) return;
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(tempQuery)}&provider=nominatim`);
      const data = await res.json();
      if (data && data.length > 0) {
        const coords: [number, number] = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        dispatch(setSearchCenter(coords));
        setMapCenter(coords);
        dispatch(setMapZoom(16));
        setUseFlyTo(true);
        dispatch(setSearchQuery(data[0].name || data[0].display_name.split(',')[0]));
        setSearchModalOpen(false);
        dispatch(setLocationState('granted'));
        setSuggestions([]);
        setTempQuery('');
      }
    } catch (e) {
      if (process.env.NODE_ENV !== "production") console.error(e);
    }
  }, [tempQuery, setSearchCenter, setMapZoom, setSearchQuery, setLocationState]);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationState('denied');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        dispatch(setSearchCenter(coords));
        dispatch(setLocationState('granted'));
        reverseGeocode(coords[0], coords[1]);
      },
      () => dispatch(setLocationState('denied')),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, [setLocationState, setSearchCenter, reverseGeocode]);

  const handlePostRoom = useCallback(() => {
    if (!user) {
      router.push('/login?redirect=/post');
      return;
    }
    setIsPostingRoom(true);
    setIsSelectingLocation(true);
  }, [user, router]);

  // Filtered Rooms logic
  const filteredRooms = useMemo(() => {
    return dynamicRooms.filter(room => {
      const roomCategory = room.category || 'rent';
      const withinPrice = room.rent >= priceRange[0] && room.rent <= priceRange[1];
      return roomCategory === mode && room.lat && room.lng && withinPrice;
    });
  }, [dynamicRooms, mode, priceRange]);

  // Spiral Jittering for Overlapping Coordinates (visual map markers only)
  const jitteredRooms = useMemo(() => {
    const coordCounts: Record<string, number> = {};
    return filteredRooms.map(room => {
      const lat = Number(room.lat);
      const lng = Number(room.lng);
      if (!lat || !lng) return room;

      const key = `${lat.toFixed(6)},${lng.toFixed(6)}`;
      const count = coordCounts[key] || 0;
      coordCounts[key] = count + 1;

      if (count === 0) {
        return room;
      }

      // Compute spiral offset: count * 0.9 rad step, radius scales with sqrt(count)
      const angle = count * 0.9;
      const radius = 0.00012 * Math.sqrt(count); // ~13 meters
      const newLat = lat + radius * Math.sin(angle);
      const newLng = lng + radius * Math.cos(angle);

      return {
        ...room,
        lat: newLat,
        lng: newLng
      };
    });
  }, [filteredRooms]);

  // Navigate Map to Location Viewport (Area or City)
  const handleLocationClick = useCallback(async (name: string, type: 'area' | 'city', cityContext?: string) => {
    let resolvedCity = cityContext;
    if (type === 'area' && !resolvedCity) {
      // Find a room with this area in dynamicRooms
      const matchingRoom = dynamicRooms.find(r => r.area === name || (r.location && r.location.split(',')[0].trim() === name));
      if (matchingRoom) {
        resolvedCity = matchingRoom.city;
      }
    }
    const query = type === 'area' ? `${name}, ${resolvedCity || 'Chandigarh'}` : name;
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}&provider=nominatim`);
      const data = await res.json();
      if (data && data.length > 0) {
        const coords: [number, number] = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        dispatch(setSearchCenter(coords));
        setMapCenter(coords);
        dispatch(setMapZoom(type === 'area' ? 16 : 14));
        setUseFlyTo(true);
        dispatch(setSearchQuery(name));
      }
    } catch (e) {
      if (process.env.NODE_ENV !== "production") console.error(e);
    }
  }, [dispatch, dynamicRooms]);

  const missingLocationCount = useMemo(() => {
    return dynamicRooms.filter(room => {
      const roomCategory = room.category || 'rent';
      return roomCategory === mode && (!room.lat || !room.lng);
    }).length;
  }, [dynamicRooms, mode]);

  const inRangeRooms = useMemo(() => {
    return filteredRooms.filter(room => {
      const dist = getDistanceKm(Number(searchCenter[0]), Number(searchCenter[1]), Number(room.lat), Number(room.lng)) * 1000;
      return dist <= searchRadius;
    });
  }, [filteredRooms, searchCenter, searchRadius]);

  const openBottomSheet = useCallback((room: any, centerMap: boolean = false) => {
    bottomSheetSoundRef.current?.play().catch(() => { });
    dispatch(setSelectedRoom(room));
    dispatch(setBottomSheetOpen(true));

    if (centerMap && room.lat && room.lng) {
      const coords: [number, number] = [Number(room.lat), Number(room.lng)];
      dispatch(setSearchCenter(coords));
      setMapCenter(coords);
      dispatch(setMapZoom(16));
      setUseFlyTo(true);
    }
  }, [dispatch]);

  const closeBottomSheet = useCallback(() => {
    dispatch(setBottomSheetOpen(false));
    setTimeout(() => dispatch(setSelectedRoom(null)), 300);
  }, [dispatch]);

  const handleSetMapCenter = useCallback((coords: [number, number]) => {
    setMapCenter(coords);
  }, []);

  const handleSetUseFlyTo = useCallback((use: boolean) => {
    setUseFlyTo(use);
  }, []);

  const lastBoundsRef = useRef<{ north: number; south: number; east: number; west: number } | null>(null);
  const lastFiltersRef = useRef<{ mode: string; priceRange: [number, number] } | null>(null);

  const handleBoundsChange = useCallback(async (bounds: { north: number; south: number; east: number; west: number }) => {
    const filtersChanged = !lastFiltersRef.current || 
                           lastFiltersRef.current.mode !== mode || 
                           lastFiltersRef.current.priceRange[0] !== priceRange[0] || 
                           lastFiltersRef.current.priceRange[1] !== priceRange[1];

    if (
      !filtersChanged &&
      lastBoundsRef.current &&
      lastBoundsRef.current.north === bounds.north &&
      lastBoundsRef.current.south === bounds.south &&
      lastBoundsRef.current.east === bounds.east &&
      lastBoundsRef.current.west === bounds.west
    ) {
      return;
    }
    lastBoundsRef.current = bounds;
    lastFiltersRef.current = { mode, priceRange };

    try {
      let url = `/post/getMapPosts?north=${bounds.north}&south=${bounds.south}&east=${bounds.east}&west=${bounds.west}`;
      if (mode) {
        url += `&category=${encodeURIComponent(mode)}`;
      }
      if (priceRange[0] > 0) {
        url += `&minPrice=${priceRange[0]}`;
      }
      if (priceRange[1] < 1000000) {
        url += `&maxPrice=${priceRange[1]}`;
      }

      const res = await getRequest<{ success: boolean; data: any }>(url);
      if (res?.success && res.data) {
        let postsData: any[] = [];
        let countsData: any = null;

        if (res.data.posts && Array.isArray(res.data.posts)) {
          postsData = res.data.posts;
          countsData = res.data.counts;
        } else if (Array.isArray(res.data)) {
          postsData = res.data;
          // Fallback client-side calculation
          const cityWise: Record<string, number> = {};
          const areaWise: Record<string, number> = {};
          const stateWise: Record<string, number> = {};
          res.data.forEach((item: any) => {
            if (item.city) {
              const cityKey = item.city.trim();
              cityWise[cityKey] = (cityWise[cityKey] || 0) + 1;
            }
            if (item.state) {
              const stateKey = item.state.trim();
              stateWise[stateKey] = (stateWise[stateKey] || 0) + 1;
            }
            const areaKey = item.area || item.address?.split(',')[0]?.trim() || item.city || 'Unknown Area';
            areaWise[areaKey] = (areaWise[areaKey] || 0) + 1;
          });
          countsData = {
            total: res.data.length,
            cityWise,
            areaWise,
            stateWise
          };
        }

        const mapped: Room[] = postsData.map((item: any) => {
          const rawImg = item.image || item.images?.[0]?.url || item.images?.[0]?.uploadUrl;
          return {
            id: item.id || item.postId || Math.random().toString(),
            name: item.name || item.title || `${item.bhk || ''} ${item.type || 'Room'}`.trim() || 'Room Listing',
            city: item.city || 'Chandigarh',
            rent: Number(item.rent) || 10000,
            lat: Number(item.lat) || 30.7333,
            lng: Number(item.lng) || 76.7794,
            category: String(item.category || mode || 'rent').toLowerCase(),
            type: item.type || item.propertyType || 'Room',
            image: resolveImageUrl(rawImg),
            images: item.images ? item.images.map((img: any) => typeof img === 'string' ? img : (img.uploadUrl || img.url)).filter(Boolean) : [],
            location: item.address || item.location || `${item.city || ''}, ${item.state || ''}`.trim() || 'Chandigarh',
            area: item.area || '',
            isTrending: !!item.isTrending,
            owner: item.owner || '',
            phone: item.phone || '',
            amenities: item.amenities || [],
            furnished: item.furnished || '',
            bhk: item.bhk || '',
            gender: item.gender || ''
          };
        });
        setDynamicRooms(mapped);
        setViewportCounts(countsData);
      }
    } catch (error) {
      console.error("Failed to fetch map posts:", error);
    }
  }, [mode, priceRange]);

  if (!mounted) {
    return <MapLoading message="Loading Interactive Map..." />;
  }

  return (
    <>
      {/* Location Access Overlay */}
      {(locationState === 'pending' || locationState === 'denied') && !initialSearch && !initialId && (
        <LocationOverlay
          initialSearch={initialSearch}
          onSuccess={(lat, lng) => {
            const coords: [number, number] = [lat, lng];
            dispatch(setSearchCenter(coords));
            reverseGeocode(lat, lng);
          }}
          onManualSearch={() => setSearchModalOpen(true)}
          onStateChangeInitial={handleLocationStateChange}
        />
      )}

      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        tempQuery={tempQuery}
        setTempQuery={setTempQuery}
        isSearching={isSearching}
        suggestions={suggestions}
        onSearch={handleSearch}
        onSelectSuggestion={(feature) => {
          const coords: [number, number] = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];
          dispatch(setSearchCenter(coords));
          setMapCenter(coords);
          dispatch(setMapZoom(16));
          setUseFlyTo(true);
          dispatch(setSearchQuery(feature.properties.name || feature.properties.city || 'Location'));
          setSearchModalOpen(false);
          dispatch(setLocationState('granted'));
          setSuggestions([]);
          setTempQuery('');
        }}
        locationState={locationState}
        requestLocation={requestLocation}
        setIsSelectingLocation={setIsSelectingLocation}
        playClickSound={playClickSound}
        searchInputRef={searchInputRef}
      />

      <LocationPicker
        isActive={isSelectingLocation}
        isPostingRoom={isPostingRoom}
        mapCenter={mapCenter}
        setIsSelectingLocation={setIsSelectingLocation}
        setIsPostingRoom={setIsPostingRoom}
        setSearchCenter={(coords: [number, number]) => dispatch(setSearchCenter(coords))}
        reverseGeocode={reverseGeocode}
        playClickSound={playClickSound}
      />

      {isPostingRoom && (
        <PostListingForm
          mode={mode}
          mapCenter={mapCenter}
          searchQuery={searchQuery}
          reverseGeocode={reverseGeocode}
          setLiveUserPos={() => {}} 
          setSearchCenter={(coords: [number, number]) => dispatch(setSearchCenter(coords))}
          setMapCenter={setMapCenter}
          onBack={() => {
            setIsPostingRoom(false);
            setIsSelectingLocation(false);
          }}
          onSuccess={() => {
            setIsPostingRoom(false);
            setIsSelectingLocation(false);
          }}
        />
      )}

      <MapHeader
        onOpenSearch={() => setSearchModalOpen(true)}
        onPickLocation={() => {
          dispatch(setLocationState('granted'));
          setIsSelectingLocation(true);
        }}
        onPostRoom={handlePostRoom}
        onShowList={() => setShowRoomsList(true)}
        isSelectingLocation={isSelectingLocation}
        isPostingRoom={isPostingRoom}
      />

      {!isSelectingLocation && !isPostingRoom && (
        <MobileControls
          showRadiusPopup={showRadiusPopup}
          setShowRadiusPopup={(show: boolean) => dispatch(setShowRadiusPopup(show))}
          searchRadius={searchRadius}
          setSearchRadius={(r: number) => dispatch(setSearchRadius(r))}
          setMapZoom={(z: number) => dispatch(setMapZoom(z))}
          setShowRoomsList={setShowRoomsList}
          playClickSound={playClickSound}
          reverseGeocode={reverseGeocode}
          setMapCenter={handleSetMapCenter}
          onPickLocation={() => {
            dispatch(setLocationState('granted'));
            setIsSelectingLocation(true);
          }}
        />
      )}

      <MapView
        searchCenter={searchCenter}
        mapZoom={mapZoom}
        liveUserPos={liveUserPos}
        useFlyTo={useFlyTo}
        setUseFlyTo={handleSetUseFlyTo}
        isSelectingLocation={isSelectingLocation}
        setMapCenter={handleSetMapCenter}
        bottomSheetOpen={bottomSheetOpen}
        closeBottomSheet={closeBottomSheet}
        filteredRooms={jitteredRooms}
        searchRadius={searchRadius}
        selectedRoom={selectedRoom}
        hoveredRoomId={hoveredRoomId}
        setHoveredRoomId={setHoveredRoomId}
        openBottomSheet={openBottomSheet}
        formatRentCompact={formatRentCompact}
        onBoundsChange={handleBoundsChange}
      />

      {/* Desktop Staying Insights Sidebar */}
      {/* {!isSelectingLocation && !isPostingRoom && viewportCounts && (isAreaView ? Object.keys(viewportCounts.areaWise).length > 0 : Object.keys(viewportCounts.cityWise).length > 0) && (
        <div 
          className="hidden md:flex flex-col gap-3 fixed top-20 left-4 w-72 max-h-[calc(100vh-120px)] rounded-3xl border border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)] p-4 overflow-hidden z-[999] transition-all duration-300"
          style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(24px)',
          }}
        >
          <div className="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
            <h3 className="text-xs font-black uppercase tracking-[0.15em] text-[var(--text-primary)]/85">
              {isAreaView ? 'Sector Insights' : 'Staying Insights'}
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full border border-[var(--primary)]/20 animate-pulse">
              {viewportCounts.total} Active
            </span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 py-1 custom-scrollbar scrollbar-none">
            {Object.entries(isAreaView ? viewportCounts.areaWise : viewportCounts.cityWise)
              .sort((a, b) => b[1] - a[1])
              .map(([name, count]) => {
                const cityName = isAreaView ? (() => {
                  const match = dynamicRooms.find(r => r.area === name || (r.location && r.location.split(',')[0].trim() === name));
                  return match ? ` (${match.city})` : '';
                })() : '';
                return (
                  <button
                    key={name}
                    onClick={() => handleLocationClick(name, isAreaView ? 'area' : 'city')}
                    className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-white/50 dark:bg-white/5 border border-white/10 hover:border-[var(--primary)]/30 hover:bg-white dark:hover:bg-white/10 text-left transition-all active:scale-[0.98] group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center text-xs font-black group-hover:scale-110 transition-transform">
                        📍
                      </div>
                      <span className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">
                        {name}{cityName}
                      </span>
                    </div>
                    <span className="text-[11px] font-black px-2 py-0.5 bg-black/5 dark:bg-white/10 rounded-lg text-[var(--text-primary)]/70 group-hover:bg-[var(--primary)] group-hover:text-white transition-all">
                      {count} {count === 1 ? 'stay' : 'stays'}
                    </span>
                  </button>
                );
              })}
          </div>
        </div>
      )} */}

      {/* Mobile Staying Insights Horizontal Pill Tray */}
      {!isSelectingLocation && !isPostingRoom && viewportCounts && (isAreaView ? Object.keys(viewportCounts.areaWise).length > 0 : Object.keys(viewportCounts.cityWise).length > 0) && (
        <div className="md:hidden fixed top-[138px] left-4 right-4 z-[999] pointer-events-none transition-all duration-300">
          <div 
            className="flex gap-2 overflow-x-auto py-2 px-3 rounded-2xl border border-white/20 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.08)] pointer-events-auto scrollbar-none"
            style={{
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {Object.entries(isAreaView ? viewportCounts.areaWise : viewportCounts.cityWise)
              .sort((a, b) => b[1] - a[1])
              .map(([name, count]) => {
                const cityName = isAreaView ? (() => {
                  const match = dynamicRooms.find(r => r.area === name || (r.location && r.location.split(',')[0].trim() === name));
                  return match ? ` (${match.city})` : '';
                })() : '';
                return (
                  <button
                    key={name}
                    onClick={() => handleLocationClick(name, isAreaView ? 'area' : 'city')}
                    className="flex items-center gap-1.5 shrink-0 px-3 py-1 rounded-full bg-white/50 dark:bg-white/5 border border-white/10 active:scale-95 transition-all text-xs font-bold text-[var(--text-primary)] hover:border-[var(--primary)]/30"
                  >
                    <span className="text-[10px]">📍</span>
                    <span>{name}{cityName}</span>
                    <span className="text-[10px] font-black px-1.5 py-0.5 bg-[var(--primary)] text-white rounded-full animate-in zoom-in duration-300">
                      {count}
                    </span>
                  </button>
                );
              })}
          </div>
        </div>
      )}

      <RoomsListModal
        isOpen={showRoomsList}
        onClose={() => setShowRoomsList(false)}
        mode={mode}
        inRangeRooms={inRangeRooms}
        filteredRooms={filteredRooms}
        searchCenter={searchCenter}
        searchRadius={searchRadius}
        missingLocationCount={missingLocationCount}
        setShowRadiusPopup={(show: boolean) => {
          if (show && typeof window !== 'undefined' && window.innerWidth >= 768) {
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
          } else {
            dispatch(setShowRadiusPopup(show));
          }
        }}
        openBottomSheet={openBottomSheet}
        onPostRoom={handlePostRoom}
        formatRent={formatRent}
      />

      <RoomDetailModal
        isOpen={bottomSheetOpen}
        onClose={closeBottomSheet}
        room={selectedRoom}
        searchCenter={searchCenter}
        viewMode={typeof window !== 'undefined' && window.innerWidth < 768 ? 'bottom-sheet' : 'centered'}
      />

      <ConfirmDialog
        open={isLogoutModalOpen}
        icon={<LogOut size={48} className="text-red-500" />}
        title="Confirm Log Out"
        message="Are you sure you want to log out? You'll need to sign in again to post or list rooms."
        confirmLabel="Log Out"
        danger
        onConfirm={() => { logout(); closeLogoutModal(); }}
        onCancel={closeLogoutModal}
      />

      <LightboxModal
        image={lightBoxImage}
        onClose={() => setLightBoxImage(null)}
      />
    </>
  );
}
