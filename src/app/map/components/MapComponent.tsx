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
import { useAddRoom } from '@/lib/hooks/useRooms';

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

  // For logout modal, I'll use a local state or check if there's a uiSlice for it
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const closeLogoutModal = () => setIsLogoutModalOpen(false);

  // Local UI state
  const [mapCenter, setMapCenter] = useState<[number, number]>([DEFAULT_LAT, DEFAULT_LNG]);
  const [useFlyTo, setUseFlyTo] = useState(false);
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
        const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(tempQuery + ', India')}&limit=5`);
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
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(tempQuery + ', India')}`);
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
    return rooms.filter(room => {
      const roomCategory = room.category || 'rent';
      const withinPrice = room.rent >= priceRange[0] && room.rent <= priceRange[1];
      return roomCategory === mode && room.lat && room.lng && withinPrice;
    });
  }, [rooms, mode, priceRange]);

  const missingLocationCount = useMemo(() => {
    return rooms.filter(room => {
      const roomCategory = room.category || 'rent';
      return roomCategory === mode && (!room.lat || !room.lng);
    }).length;
  }, [rooms, mode]);

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
        filteredRooms={filteredRooms}
        searchRadius={searchRadius}
        selectedRoom={selectedRoom}
        hoveredRoomId={hoveredRoomId}
        setHoveredRoomId={setHoveredRoomId}
        openBottomSheet={openBottomSheet}
        formatRentCompact={formatRentCompact}
      />

      <RoomsListModal
        isOpen={showRoomsList}
        onClose={() => setShowRoomsList(false)}
        mode={mode}
        inRangeRooms={inRangeRooms}
        filteredRooms={filteredRooms}
        searchCenter={searchCenter}
        searchRadius={searchRadius}
        missingLocationCount={missingLocationCount}
        setShowRadiusPopup={(show: boolean) => dispatch(setShowRadiusPopup(show))}
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
