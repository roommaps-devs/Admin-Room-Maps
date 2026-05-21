"use client";

import { useEffect, useRef, useState } from 'react';
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
} from '@/store/mapSlice';
import { ResponseMessage } from '@/components/ResponseMessage';
import { getRequest } from '@/lib/apiCall';
import { resolveImageUrl } from '@/lib/hooks/useRooms';

interface UseMapInitializationProps {
  initialRooms: any[];
  initialSearch?: string;
  initialMode?: string;
  initialId?: string;
  isNearby?: boolean;
  setMapCenter: (coords: [number, number]) => void;
  setUseFlyTo: (use: boolean) => void;
}

export function useMapInitialization({
  initialRooms,
  initialSearch,
  initialMode,
  initialId,
  isNearby,
  setMapCenter,
  setUseFlyTo,
}: UseMapInitializationProps) {
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);
  
  const { mode } = useSelector((state: RootState) => state.ui);

  useEffect(() => {
    setMounted(true);
  }, []);

  const initializedRef = useRef(false);
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    if (initialMode) {
      dispatch(setMode(initialMode as 'rent' | 'travelers'));
    }

    if (initialSearch) {
      dispatch(setSearchQuery(initialSearch));
      dispatch(setLocationState('granted'));

      // Geocode the initial search to move the map
      const geocodeInitial = async () => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(initialSearch + ', India')}`);
          const data = await res.json();
          if (data && data.length > 0) {
            const coords: [number, number] = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
            dispatch(setSearchCenter(coords));
            setMapCenter(coords);
            dispatch(setMapZoom(13));
            setUseFlyTo(true);
          }
        } catch (e) {
          if (process.env.NODE_ENV !== "production") console.error(e);
        }
      };
      geocodeInitial();
    }
  }, [initialSearch, initialMode, dispatch, setMapCenter, setUseFlyTo]);

  // Reverse geocode helper
  const reverseGeocode = async (lat: number, lon: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      const data = await res.json();
      if (data && data.address) {
        const areaName = data.address.suburb || data.address.neighbourhood || data.address.village ||
          data.address.town || data.address.city || data.address.state || 'Your Location';
        dispatch(setSearchQuery(areaName));
        return areaName;
      }
      dispatch(setSearchQuery('Your Location'));
      return 'Your Location';
    } catch (e) {
      dispatch(setSearchQuery('Your Location'));
      return 'Your Location';
    }
  };

  // Handle initial room ID from URL
  useEffect(() => {
    if (!initialId) return;

    const roomIdStr = String(initialId);
    
    const selectAndCenterRoom = (targetRoom: any) => {
      if (targetRoom && targetRoom.lat && targetRoom.lng) {
        const coords: [number, number] = [Number(targetRoom.lat), Number(targetRoom.lng)];
        if (targetRoom.category && targetRoom.category !== mode) {
          dispatch(setMode(targetRoom.category as 'rent' | 'travelers'));
        }
        dispatch(setSearchCenter(coords));
        setMapCenter(coords);
        dispatch(setMapZoom(16));
        setUseFlyTo(true);
        dispatch(setLocationState('granted'));
        dispatch(setSearchQuery(targetRoom.name || targetRoom.city || 'Room Location'));
        dispatch(setSelectedRoom(targetRoom));
        dispatch(setBottomSheetOpen(true));
      }
    };

    // First, try to find in initialRooms if available
    const room = initialRooms && initialRooms.length > 0
      ? initialRooms.find(r => String(r.id) === roomIdStr)
      : null;

    if (room) {
      selectAndCenterRoom(room);
    } else {
      // Fetch dynamically from server if not found in initialRooms
      const fetchAndOpenRoom = async () => {
        try {
          const res = await getRequest<{ success: boolean; data: any }>(`/post/getById/${roomIdStr}`);
          if (res?.success && res.data) {
            const item = res.data;
            const rawImg = item.images?.[0]?.uploadUrl || item.images?.[0]?.url || (typeof item.images?.[0] === 'string' ? item.images[0] : null) || item.image;
            
            const targetRoom = {
              id: item.id || item.postId || roomIdStr,
              name: item.name || item.title || 'Room Listing',
              city: item.city || 'Chandigarh',
              rent: Number(item.rent) || 10000,
              lat: Number(item.lat) || 30.7333,
              lng: Number(item.lng) || 76.7794,
              category: String(item.category || 'rent').toLowerCase(),
              type: item.type || item.propertyType || 'Room',
              image: resolveImageUrl(rawImg),
              images: item.images ? item.images.map((img: any) => typeof img === 'string' ? img : (img.uploadUrl || img.url)).filter(Boolean) : [],
              location: item.address || item.location,
              isTrending: !!item.isTrending,
              owner: item.owner,
              phone: item.phone,
              amenities: item.amenities || [],
              furnished: item.furnished,
              bhk: item.bhk,
              gender: item.gender,
              isFavorite: !!item.isFavorite
            };
            selectAndCenterRoom(targetRoom);
          }
        } catch (error) {
          console.error("Failed to fetch initialId room from API:", error);
        }
      };
      fetchAndOpenRoom();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialId, initialRooms, dispatch]);

  const nearbyInitializedRef = useRef(false);

  // Handle Automatic Geolocation for "Nearby" rooms
  useEffect(() => {
    if (isNearby && navigator.geolocation && !nearbyInitializedRef.current) {
      nearbyInitializedRef.current = true;
      ResponseMessage({ success: true, message: "Locating nearby rooms...", type: "info", data: null });
      navigator.geolocation.getCurrentPosition((pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        dispatch(setLiveUserPos(coords));
        dispatch(setSearchCenter(coords));
        setMapCenter(coords);
        dispatch(setSearchQuery('My Location'));
        dispatch(setLocationState('granted'));
        ResponseMessage({ success: true, message: "Showing rooms near you!", type: "success", data: null });
      }, (err) => {
        ResponseMessage({ success: false, message: "Could not find your location. Please search manually.", type: "error", data: null });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNearby]);

  return { mounted, reverseGeocode };
}
