"use client";

import dynamic from 'next/dynamic';
import MapLoading from './MapLoading';

const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => <MapLoading message="Loading Interactive Map..." />
});

import { Room } from '@/lib/types';

export default function MapWrapper({ 
  initialRooms, 
  initialSearch, 
  initialMode, 
  initialId,
  autoPost,
  isNearby
}: { 
  initialRooms: Room[], 
  initialSearch?: string, 
  initialMode?: string, 
  initialId?: string,
  autoPost?: boolean,
  isNearby?: boolean
}) {
  return <MapComponent rooms={initialRooms} initialSearch={initialSearch} initialMode={initialMode} initialId={initialId} autoPost={autoPost} isNearby={isNearby} />;
}
