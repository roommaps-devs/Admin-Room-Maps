"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRooms } from '@/lib/hooks/useRooms';
import MapWrapper from './components/MapWrapper';
import MapLoading from './components/MapLoading';
import dynamic from 'next/dynamic';

function MapContentRaw() {
  const { user } = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('q') || searchParams.get('search') || '';
  const initialMode = searchParams.get('mode') || 'rent';
  const initialId = searchParams.get('id') || '';
  const autoPost = searchParams.get('post') === 'true';
  
  const { data: rooms, isLoading } = useRooms();
  const isNearby = searchParams.get('nearby') === 'true';

  useEffect(() => {
    document.title = 'Find Rooms on Map — RoomMaps';
    // Update meta description for this page
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Search for rooms, PGs, and flats near you using an interactive map. Zero brokerage — connect directly with property owners across India.');
    }
  }, []);

  if (isLoading) {
    return <MapLoading message="Loading Stay Locations..." />;
  }

  return <MapWrapper initialRooms={rooms} initialSearch={initialSearch} initialMode={initialMode} initialId={initialId} autoPost={autoPost} isNearby={isNearby} />;
}

// Dynamically import MapContent with SSR disabled to completely eliminate server-side hydration mismatches.
const MapContent = dynamic(() => Promise.resolve(MapContentRaw), {
  ssr: false,
  loading: () => <MapLoading message="Preparing Map..." />
});

export default function MapPage() {
  return <MapContent />;
}
