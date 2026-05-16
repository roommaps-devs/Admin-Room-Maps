"use client";

import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import L from 'leaflet';
import { useMap, useMapEvents } from 'react-leaflet';
import MapMarkers from './MapMarkers';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const LayersControl = dynamic(() => import('react-leaflet').then(mod => mod.LayersControl), { ssr: false });
const BaseLayer = dynamic(() => import('react-leaflet').then(mod => mod.LayersControl.BaseLayer), { ssr: false });
const ZoomControl = dynamic(() => import('react-leaflet').then(mod => mod.ZoomControl), { ssr: false });

interface MapViewProps {
  searchCenter: [number, number];
  mapZoom: number;
  liveUserPos: [number, number] | null;
  useFlyTo: boolean;
  setUseFlyTo: (use: boolean) => void;
  isSelectingLocation: boolean;
  setMapCenter: (coords: [number, number]) => void;
  bottomSheetOpen: boolean;
  closeBottomSheet: () => void;
  filteredRooms: any[];
  searchRadius: number;
  selectedRoom: any;
  hoveredRoomId: string | null;
  setHoveredRoomId: (id: string | null) => void;
  openBottomSheet: (room: any) => void;
  formatRentCompact: (amount: number) => string;
}

function ChangeView({ center, liveUserPos, zoom, useFlyTo, onFlyToComplete }: { center: [number, number], liveUserPos: [number, number] | null, zoom: number, useFlyTo: boolean, onFlyToComplete: () => void }) {
  const map = useMap();
  const onFlyToCompleteRef = useRef(onFlyToComplete);
  
  useEffect(() => {
    onFlyToCompleteRef.current = onFlyToComplete;
  }, [onFlyToComplete]);
  
  useEffect(() => {
    if (useFlyTo) {
      map.flyTo(center, zoom, { animate: true, duration: 1.5 });
      const timer = setTimeout(() => onFlyToCompleteRef.current(), 1600);
      return () => clearTimeout(timer);
    } else {
      map.setView(center, zoom, { animate: true, duration: 1.2 });
    }
  }, [center[0], center[1], zoom, useFlyTo, map]);

  useEffect(() => {
    if (liveUserPos && !useFlyTo) {
      const bounds = L.latLngBounds([center, liveUserPos]);
      map.fitBounds(bounds, { padding: [70, 70], animate: true, duration: 1.5 });
    }
  }, [liveUserPos ? `${liveUserPos[0]},${liveUserPos[1]}` : null, center[0], center[1], map, useFlyTo]);

  return null;
}

function MapEvents({ onLocationSelect, onMapMove, onMapClick }: { onLocationSelect?: (lat: number, lng: number) => void, onMapMove?: (lat: number, lng: number) => void, onMapClick?: () => void }) {
  const map = useMapEvents({
    click(e) {
      if (onLocationSelect) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      } else if (onMapClick) {
        onMapClick();
      }
    },
    moveend() {
      if (onMapMove) {
        const center = map.getCenter();
        onMapMove(center.lat, center.lng);
      }
    }
  });
  return null;
}

const MapView: React.FC<MapViewProps> = (props) => {
  const {
    searchCenter,
    mapZoom,
    liveUserPos,
    useFlyTo,
    setUseFlyTo,
    isSelectingLocation,
    setMapCenter,
    bottomSheetOpen,
    closeBottomSheet,
    filteredRooms,
    searchRadius,
    selectedRoom,
    hoveredRoomId,
    setHoveredRoomId,
    openBottomSheet,
    formatRentCompact
  } = props;

  const userIcon = L.divIcon({
    html: `
      <div class="relative flex items-center justify-center" style="width: 56px; height: 56px;">
        <!-- Broad ambient pulse -->
        <div class="absolute bg-[var(--primary)]/10 rounded-full animate-pulse-slow" style="width: 50px; height: 50px;"></div>
        <div class="absolute bg-[var(--primary)]/20 rounded-full animate-ping" style="width: 32px; height: 32px; animation-duration: 3s;"></div>
        
        <!-- White outer ring (Sharp & Precise) -->
        <div class="relative bg-white rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.15)] flex items-center justify-center z-10" style="width: 22px; height: 22px;">
          <!-- Main core themed dot -->
          <div class="bg-gradient-to-tr from-[var(--primary)] to-[#FF8C61] rounded-full shadow-sm" style="width: 14px; height: 14px; border: 2px solid white;"></div>
        </div>
      </div>
    `,
    className: '',
    iconSize: [56, 56],
    iconAnchor: [28, 28],
  });

  const searchIcon = L.divIcon({
    html: `
      <div class="relative flex flex-col items-center">
        <div class="relative group animate-bounce-subtle">
          <!-- Solid Premium Pin Body (Dropped Pin Style) -->
          <svg width="36" height="44" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg" class="filter drop-shadow-[0_4px_10px_rgba(255,82,17,0.35)] transition-all duration-300 group-hover:scale-110">
            <defs>
              <linearGradient id="searchPinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#FF8C61;stop-opacity:1" />
                <stop offset="100%" style="stop-color:var(--primary);stop-opacity:1" />
              </linearGradient>
            </defs>
            <path d="M12 0C5.37 0 0 5.37 0 12C0 21 12 30 12 30C12 30 24 21 24 12C24 5.37 18.63 0 12 0Z" fill="url(#searchPinGradient)"/>
            <path d="M12 8C9.79 8 8 9.79 8 12C8 14.21 9.79 16 12 16C14.21 16 16 14.21 16 12C16 9.79 14.21 8 12 8Z" fill="white"/>
          </svg>
        </div>
        <!-- Ground Shadow -->
        <div class="w-4 h-1.5 bg-black/15 rounded-[100%] blur-[1.5px] -mt-1 animate-shadow-pulse"></div>
      </div>
    `,
    className: '',
    iconSize: [36, 50],
    iconAnchor: [18, 50],
  });

  const createClusterCustomIcon = (cluster: any) => {
    return L.divIcon({
      html: `
        <div class="relative flex items-center justify-center w-11 h-11 bg-[var(--primary)]/20 rounded-full border border-[var(--primary)]/40 backdrop-blur-md shadow-xl group">
          <div class="bg-[var(--primary)] text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shadow-inner ring-2 ring-white/20">${cluster.getChildCount()}</div>
        </div>
      `,
      className: '',
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });
  };

  return (
    <div id="map" className="fixed inset-0 w-full h-full z-0 overflow-hidden bg-[var(--bg-color)]">
      <MapContainer center={searchCenter as L.LatLngExpression} zoom={mapZoom} maxZoom={18} zoomControl={false} attributionControl={false} style={{ width: '100%', height: '100%' }}>
        <MapEvents
          onLocationSelect={isSelectingLocation ? (lat, lng) => setMapCenter([lat, lng]) : undefined}
          onMapMove={(lat, lng) => {
            if (isSelectingLocation) setMapCenter([lat, lng]);
          }}
          onMapClick={() => bottomSheetOpen && closeBottomSheet()}
        />
        <ChangeView center={searchCenter} liveUserPos={liveUserPos} zoom={mapZoom} useFlyTo={useFlyTo} onFlyToComplete={() => setUseFlyTo(false)} />
        <LayersControl position="bottomleft">
          <BaseLayer checked name="Street (Voyager)">
            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" subdomains="abcd" />
          </BaseLayer>
          <BaseLayer name="Light (Positron)">
            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" subdomains="abcd" />
          </BaseLayer>
          <BaseLayer name="Dark (Night)">
            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" subdomains="abcd" />
          </BaseLayer>
          <BaseLayer name="Satellite (Imagery)">
            <TileLayer 
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='Tiles &copy; Esri'
            />
          </BaseLayer>
        </LayersControl>
        <ZoomControl position="bottomright" />

        <MapMarkers
          filteredRooms={filteredRooms}
          searchCenter={searchCenter}
          searchRadius={searchRadius}
          liveUserPos={liveUserPos}
          selectedRoom={selectedRoom}
          hoveredRoomId={hoveredRoomId}
          setHoveredRoomId={setHoveredRoomId}
          openBottomSheet={openBottomSheet}
          createClusterCustomIcon={createClusterCustomIcon}
          userIcon={userIcon}
          searchIcon={searchIcon}
          formatRentCompact={formatRentCompact}
        />
      </MapContainer>
    </div>
  );
};

export default MapView;
