
"use client";

import { useEffect, Suspense } from 'react';
import { Home } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { getRooms } from '@/lib/data';
import MapWrapper from './components/MapWrapper';

import MapLoading from './components/MapLoading';

function MapContent() {
  const { user } = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('q') || searchParams.get('search') || '';
  const initialMode = searchParams.get('mode') || 'rent';
  const initialId = searchParams.get('id') || '';
  const autoPost = searchParams.get('post') === 'true';
  const rooms = getRooms();

  const isNearby = searchParams.get('nearby') === 'true';

  useEffect(() => {
    document.title = 'Find Rooms on Map — RoomMaps';
    // Update meta description for this page
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Search for rooms, PGs, and flats near you using an interactive map. Zero brokerage — connect directly with property owners across India.');
    }
  }, []);

  // No longer checking auth loading here as it's managed by Redux
  return <MapWrapper initialRooms={rooms} initialSearch={initialSearch} initialMode={initialMode} initialId={initialId} autoPost={autoPost} isNearby={isNearby} />;
}

export default function MapPage() {
  return (
    <Suspense fallback={<MapLoading message="Preparing Map..." />}>
      <MapContent />
    </Suspense>
  );
}
