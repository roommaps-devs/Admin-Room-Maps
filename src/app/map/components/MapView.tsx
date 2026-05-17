"use client";

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import L from 'leaflet';
import { useMap, useMapEvents } from 'react-leaflet';
import MapMarkers from './MapMarkers';
import { Layers, Plus, Minus } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { setActiveTile } from '@/store/mapSlice';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });

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

const TILE_LAYERS = [
  { id: 'voyager', label: 'Street', url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', subdomains: 'abcd' },
  { id: 'positron', label: 'Light', url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', subdomains: 'abcd' },
  { id: 'dark', label: 'Dark', url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', subdomains: 'abcd' },
  { id: 'satellite', label: 'Satellite', url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', subdomains: '' },
];

function ChangeView({ center, liveUserPos, zoom, useFlyTo, onFlyToComplete }: { center: [number, number], liveUserPos: [number, number] | null, zoom: number, useFlyTo: boolean, onFlyToComplete: () => void }) {
  const map = useMap();
  const onFlyToCompleteRef = useRef(onFlyToComplete);
  const isInitialMount = useRef(true);

  useEffect(() => {
    onFlyToCompleteRef.current = onFlyToComplete;
  }, [onFlyToComplete]);

  useEffect(() => {
    // If it's the initial mount, the MapContainer already sets the correct center and zoom.
    // Skip this to prevent Leaflet from trying to call setView/flyTo before it has fully initialized container size/positions.
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (!map) return;

    // Check if map is ready and has size (Leaflet's way of knowing if container exists and is laid out)
    const container = map.getContainer();
    if (!container || container.clientHeight === 0 || container.clientWidth === 0) {
      // If container is not ready, delay the call to next animation frame or tick
      const timer = setTimeout(() => {
        try {
          if (useFlyTo) {
            map.flyTo(center, zoom, { animate: true, duration: 1.5 });
            setTimeout(() => onFlyToCompleteRef.current(), 1600);
          } else {
            map.setView(center, zoom, { animate: true, duration: 1.2 });
          }
        } catch (e) {
          console.warn("ChangeView delayed setView error:", e);
        }
      }, 100);
      return () => clearTimeout(timer);
    }

    try {
      if (useFlyTo) {
        map.flyTo(center, zoom, { animate: true, duration: 1.5 });
        const timer = setTimeout(() => onFlyToCompleteRef.current(), 1600);
        return () => clearTimeout(timer);
      } else {
        map.setView(center, zoom, { animate: true, duration: 1.2 });
      }
    } catch (e) {
      console.warn("ChangeView setView error:", e);
    }
  }, [center[0], center[1], zoom, useFlyTo, map]);

  useEffect(() => {
    if (!map) return;
    if (liveUserPos && !useFlyTo) {
      try {
        const bounds = L.latLngBounds([center, liveUserPos]);
        map.fitBounds(bounds, { padding: [70, 70], animate: true, duration: 1.5 });
      } catch (e) {
        console.warn("ChangeView fitBounds error:", e);
      }
    }
  }, [liveUserPos ? `${liveUserPos[0]},${liveUserPos[1]}` : null, center[0], center[1], map, useFlyTo]);

  return null;
}

function MapEvents({ onLocationSelect, onMapMove, onMapClick }: { onLocationSelect?: (lat: number, lng: number) => void, onMapMove?: (lat: number, lng: number) => void, onMapClick?: () => void }) {
  useMapEvents({
    click(e) {
      if (onLocationSelect) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      } else if (onMapClick) {
        onMapClick();
      }
    },
    moveend() {
      if (onMapMove) {
        // handled via setMapCenter
      }
    }
  });
  return null;
}

// Inner zoom controller that has access to map context
function ZoomButtons() {
  const map = useMap();
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border border-white/20 shadow-lg bg-white/90 dark:bg-[#1A1A1E]/90 backdrop-blur-md">
      <button
        className="w-10 h-10 flex items-center justify-center text-[var(--text-primary)]/70 hover:text-[var(--primary)] hover:bg-black/5 active:scale-90 transition-all border-b border-white/10"
        onClick={() => map.zoomIn()}
        aria-label="Zoom in"
      >
        <Plus size={18} strokeWidth={2.5} />
      </button>
      <button
        className="w-10 h-10 flex items-center justify-center text-[var(--text-primary)]/70 hover:text-[var(--primary)] hover:bg-black/5 active:scale-90 transition-all"
        onClick={() => map.zoomOut()}
        aria-label="Zoom out"
      >
        <Minus size={18} strokeWidth={2.5} />
      </button>
    </div>
  );
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

  const dispatch = useDispatch();
  const { activeTile } = useSelector((state: RootState) => state.map);
  const handleSetActiveTile = (tileId: string) => dispatch(setActiveTile(tileId));
  const [showLayerMenu, setShowLayerMenu] = useState(false);

  const userIcon = L.divIcon({
    html: `
      <div class="relative flex items-center justify-center" style="width: 56px; height: 56px;">
        <div class="absolute bg-[var(--primary)]/10 rounded-full animate-pulse-slow" style="width: 50px; height: 50px;"></div>
        <div class="absolute bg-[var(--primary)]/20 rounded-full animate-ping" style="width: 32px; height: 32px; animation-duration: 3s;"></div>
        <div class="relative bg-white rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.15)] flex items-center justify-center z-10" style="width: 22px; height: 22px;">
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

  const currentTile = TILE_LAYERS.find(t => t.id === activeTile) || TILE_LAYERS[0];

  return (
    <div id="map" className="fixed inset-0 w-full h-full z-0 overflow-hidden bg-[var(--bg-color)]">
      <MapContainer center={searchCenter as L.LatLngExpression} zoom={mapZoom} minZoom={5} maxZoom={18} zoomControl={false} attributionControl={false} style={{ width: '100%', height: '100%' }}>
        <MapEvents
          onLocationSelect={isSelectingLocation ? (lat, lng) => setMapCenter([lat, lng]) : undefined}
          onMapMove={(lat, lng) => {
            if (isSelectingLocation) setMapCenter([lat, lng]);
          }}
          onMapClick={() => bottomSheetOpen && closeBottomSheet()}
        />
        <ChangeView center={searchCenter} liveUserPos={liveUserPos} zoom={mapZoom} useFlyTo={useFlyTo} onFlyToComplete={() => setUseFlyTo(false)} />

        {/* Active tile layer */}
        <TileLayer
          key={currentTile.id}
          url={currentTile.url}
          subdomains={currentTile.subdomains || 'abcd'}
          noWrap={true}
        />

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

        {/* Custom centered bottom controls — needs to be inside MapContainer for ZoomButtons useMap() */}
        <CenteredControls
          activeTile={activeTile}
          showLayerMenu={showLayerMenu}
          setShowLayerMenu={setShowLayerMenu}
          setActiveTile={handleSetActiveTile}
        />
      </MapContainer>
    </div>
  );
};

function CenteredControls({
  activeTile,
  showLayerMenu,
  setShowLayerMenu,
  setActiveTile,
}: {
  activeTile: string;
  showLayerMenu: boolean;
  setShowLayerMenu: (v: boolean) => void;
  setActiveTile: (id: string) => void;
}) {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Layer menu popup (shared)
  const layerMenu = showLayerMenu && (
    <div
      className={`absolute bottom-12 flex flex-col gap-1.5 p-2 rounded-2xl border border-white/20 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200 ${
        isMobile ? 'left-0 origin-bottom-left' : 'left-1/2 -translate-x-1/2 origin-bottom'
      }`}
      style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)', minWidth: 96 }}
    >
      {TILE_LAYERS.map(t => (
        <button
          key={t.id}
          className={`px-3 py-1.5 rounded-xl text-[11px] font-black tracking-tight transition-all ${activeTile === t.id ? 'bg-[#FF5211] text-white shadow' : 'text-[#333] hover:bg-black/5'}`}
          onClick={() => { setActiveTile(t.id); setShowLayerMenu(false); }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );

  const layerButton = (
    <div className="relative flex flex-col items-center">
      {layerMenu}
      <button
        className="w-10 h-10 rounded-2xl bg-white/90 dark:bg-[#1A1A1E]/90 border border-white/20 flex items-center justify-center text-[var(--text-primary)]/70 hover:text-[var(--primary)] hover:bg-white transition-all active:scale-90 shadow-sm"
        onClick={() => setShowLayerMenu(!showLayerMenu)}
        aria-label="Switch map layer"
      >
        <Layers size={18} />
      </button>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {/* Layer icon — bottom-left */}
        <div
          className="leaflet-top leaflet-left"
          style={{ top: 'auto', bottom: 84, left: 12, right: 'auto', transform: 'none', pointerEvents: 'auto' }}
        >
          <div className="leaflet-control" style={{ margin: 0, border: 'none', background: 'transparent' }}>
            {layerButton}
          </div>
        </div>

        {/* Zoom +/- — bottom-right */}
        <div
          className="leaflet-top leaflet-left"
          style={{ top: 'auto', bottom: 84, right: 12, left: 'auto', transform: 'none', pointerEvents: 'auto' }}
        >
          <div className="leaflet-control" style={{ margin: 0, border: 'none', background: 'transparent' }}>
            <ZoomButtons />
          </div>
        </div>
      </>
    );
  }

  // Desktop: both together, centered at bottom
  return (
    <div
      className="leaflet-top leaflet-left"
      style={{ top: 'auto', bottom: 24, left: '50%', transform: 'translateX(-50%)', right: 'auto', pointerEvents: 'auto' }}
    >
      <div className="leaflet-control flex items-center gap-2" style={{ margin: 0, border: 'none', background: 'transparent' }}>
        {layerButton}
        <ZoomButtons />
      </div>
    </div>
  );
}



export default MapView;

