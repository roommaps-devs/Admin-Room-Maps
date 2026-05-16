"use client";

import React from 'react';
import { Marker, Circle } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';

interface MapMarkersProps {
  filteredRooms: any[];
  searchCenter: [number, number];
  searchRadius: number;
  liveUserPos: [number, number] | null;
  selectedRoom: any;
  hoveredRoomId: string | null;
  setHoveredRoomId: (id: string | null) => void;
  openBottomSheet: (room: any) => void;
  createClusterCustomIcon: (cluster: any) => L.DivIcon;
  userIcon: L.DivIcon;
  searchIcon: L.DivIcon;
  formatRentCompact: (amount: number) => string;
}

const MapMarkers: React.FC<MapMarkersProps> = ({
  filteredRooms,
  searchCenter,
  searchRadius,
  liveUserPos,
  selectedRoom,
  hoveredRoomId,
  setHoveredRoomId,
  openBottomSheet,
  createClusterCustomIcon,
  userIcon,
  searchIcon,
  formatRentCompact
}) => {
  return (
    <>
      <Circle
        center={searchCenter}
        radius={searchRadius}
        pathOptions={{
          color: 'var(--primary)',
          weight: 3,
          fillColor: 'var(--primary)',
          fillOpacity: 0.05,
          className: 'animate-radius-breath'
        }}
      />

      {liveUserPos && <Marker position={liveUserPos} icon={userIcon} zIndexOffset={-100} />}
      {!selectedRoom && <Marker position={searchCenter} icon={searchIcon} zIndexOffset={-50} />}

      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={createClusterCustomIcon}
        maxClusterRadius={40}
        spiderfyOnMaxZoom={true}
        showCoverageOnHover={false}
      >
        {filteredRooms.map((room: any) => {
          const isSelected = selectedRoom?.id === room.id;
          const isHovered = hoveredRoomId === room.id;
          const pinColor = room.category === 'travelers' ? '#10B981' : 'var(--primary)';
          
          const icon = L.divIcon({
            html: `
              <div class="relative flex flex-col items-center group ${isSelected ? 'z-[2000]' : 'z-[500]'}">
                ${room.isTrending ? `
                  <div class="absolute -top-1.5 -right-1.5 w-4 h-4 bg-yellow-400 rounded-full border border-white shadow-[0_0_10px_rgba(250,204,21,0.5)] z-10 flex items-center justify-center animate-bounce">
                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="var(--text-primary)" stroke="var(--text-primary)" stroke-width="3"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  </div>
                ` : ''}
                
                <div class="flex flex-col items-center transition-all duration-300 ${isSelected ? 'scale-110 -translate-y-2' : (isHovered ? 'scale-105 -translate-y-1' : '')}">
                  <!-- Price Pill -->
                  <div 
                    class="relative px-2.5 py-1 rounded-[10px] shadow-[0_4px_12px_rgba(0,0,0,0.12)] font-bold text-[13px] flex items-center justify-center min-w-[50px] text-white border border-white/20 backdrop-blur-sm transition-all" 
                    style="background: ${isSelected ? 'var(--primary)' : pinColor}"
                  >
                    ${isSelected ? `
                      <span class="animate-in fade-in zoom-in duration-300">Selected</span>
                    ` : '₹' + formatRentCompact(room.rent)}
                    
                    ${!isSelected ? `
                      <div class="absolute inset-0 rounded-[10px] bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    ` : ''}
                  </div>
                  
                  <!-- Bottom Pointer -->
                  <div class="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] -mt-[1px] filter drop-shadow-sm" style="border-top-color: ${isSelected ? 'var(--primary)' : pinColor}"></div>
                </div>
              </div>
            `,
            className: '',
            iconSize: [60, 40],
            iconAnchor: [30, 36]
          });

          return (
            <Marker
              key={room.id}
              position={[room.lat, room.lng]}
              icon={icon}
              interactive={true}
              bubblingMouseEvents={false}
              eventHandlers={{
                click: (e) => {
                  if (e.originalEvent) e.originalEvent.stopPropagation();
                  openBottomSheet(room);
                },
                mouseover: () => setHoveredRoomId(room.id),
                mouseout: () => setHoveredRoomId(null)
              }}
            />
          );
        })}
      </MarkerClusterGroup>
    </>
  );
};

export default MapMarkers;
