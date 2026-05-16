"use client";

import React from 'react';
import Link from 'next/link';
import { X, Home, MapPin, Plane, PlusCircle } from 'lucide-react';
import { getDistance } from '@/lib/utils';
import { UI_STRINGS } from '@/lib/constants/strings';
import { Room } from '@/lib/types';

interface RoomsListModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'rent' | 'travelers';
  inRangeRooms: Room[];
  filteredRooms: Room[];
  searchCenter: [number, number];
  searchRadius: number;
  missingLocationCount: number;
  setShowRadiusPopup: (show: boolean) => void;
  openBottomSheet: (room: Room, playSound?: boolean) => void;
  onPostRoom: () => void;
  formatRent: (rent: number) => string;
}

const RoomsListModal: React.FC<RoomsListModalProps> = ({
  isOpen,
  onClose,
  mode,
  inRangeRooms,
  filteredRooms,
  searchCenter,
  searchRadius,
  missingLocationCount,
  setShowRadiusPopup,
  openBottomSheet,
  onPostRoom,
  formatRent
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[5000] bg-[var(--bg-color)]/40 backdrop-blur-md pointer-events-auto flex items-end justify-center md:items-center px-0 md:px-6" onClick={onClose}>
      <div className="w-full max-w-[500px] h-[85vh] md:h-[600px] bg-[var(--bg-surface-elevated)] border-t md:border border-[var(--glass-border)] rounded-t-[32px] md:rounded-[32px] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-500" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 pb-4 border-b border-[var(--glass-border)]">
          <div className="w-12 h-1 bg-[var(--text-primary)]/10 rounded-full mx-auto mb-4 md:hidden"></div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tight">{mode === 'travelers' ? UI_STRINGS.map.roomsList.listedStays : UI_STRINGS.map.roomsList.listedRooms}</h3>
              <div className="flex flex-col gap-0.5 mt-1">
                <p className="text-[12px] text-[var(--primary)] font-bold">
                  {inRangeRooms.length} {mode === 'travelers' ? UI_STRINGS.map.roomsList.stays : UI_STRINGS.map.roomsList.rooms} {UI_STRINGS.map.roomsList.nearCenter} ({searchRadius >= 1000 ? `${searchRadius / 1000}km` : `${searchRadius}m`})
                </p>
                <p className="text-[11px] text-[var(--text-primary)]/30">
                  {UI_STRINGS.map.roomsList.showing} {filteredRooms.length} {UI_STRINGS.map.roomsList.totalIndexed}
                  {missingLocationCount > 0 && ` • ${missingLocationCount} ${UI_STRINGS.map.roomsList.hiddenMissingCoords}`}
                </p>
              </div>
            </div>
            <button className="w-10 h-10 rounded-full bg-[var(--bg-surface)] flex items-center justify-center text-[var(--text-primary)]/30 hover:bg-[var(--bg-surface-elevated)] transition-all" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Rooms list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {inRangeRooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--bg-surface)] flex items-center justify-center mb-6">
                <Home size={32} className="text-[var(--text-primary)]/30" />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] tracking-tight mb-2">{UI_STRINGS.map.roomsList.noRoomsFound}</h3>
              <p className="text-sm text-[var(--text-primary)]/50 max-w-[200px] mx-auto mb-8">{UI_STRINGS.map.roomsList.tryExpanding}</p>

              <div className="flex flex-col gap-3 w-full max-w-[260px] mx-auto">
                <button
                  className="w-full bg-[var(--primary)]/20 text-[var(--primary)] hover:bg-[var(--primary)]/30 border border-[var(--primary)]/30 font-semibold py-3 rounded-xl transition-all"
                  onClick={() => setShowRadiusPopup(true)}
                >
                  {UI_STRINGS.map.roomsList.adjustRadius}
                </button>
                <Link href="/" className="w-full bg-[var(--bg-surface)] text-[var(--text-primary)]/70 hover:bg-[var(--bg-surface-elevated)] hover:text-[var(--text-primary)] border border-[var(--glass-border)] font-semibold py-3 rounded-xl transition-all block">
                  {UI_STRINGS.map.roomsList.viewTrending}
                </Link>
              </div>
            </div>
          ) : (
            inRangeRooms.map((room: Room) => {
              const dist = getDistance(Number(searchCenter[0]), Number(searchCenter[1]), Number(room.lat), Number(room.lng));
              return (
                <div key={room.id} className="flex items-start gap-4 p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--glass-border)] transition-all hover:border-[var(--primary)]/50 cursor-pointer group" onClick={() => {
                  openBottomSheet(room, true);
                  onClose();
                }}>
                  <div className="flex-shrink-0 w-14 h-14 bg-[var(--primary)]/10 rounded-xl flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                    🏠
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-black text-[var(--text-primary)] truncate">{room.name}</div>
                    <div className="flex items-center gap-1.5 text-[10px] font-black tracking-widest text-[var(--primary)] uppercase mt-1">
                      <span>{room.type || '1BHK'}</span>
                      <span className="w-1 h-1 rounded-full bg-[var(--bg-surface-elevated)]"></span>
                      <span>{dist}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[12px] text-[var(--text-primary)]/30 mt-1 truncate">
                      <MapPin size={12} />
                      {room.city || room.location || UI_STRINGS.common.location}
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="text-[17px] font-black text-[var(--text-primary)]">₹{formatRent(room.rent)}</div>
                    <div className="text-[10px] text-[var(--text-primary)]/30 uppercase font-black tracking-tighter">{room.category === 'travelers' ? UI_STRINGS.map.roomsList.day : UI_STRINGS.map.roomsList.month}</div>
                    {(room.isTravelerFriendly || room.rentType === 'daily') && (
                      <div className="flex items-center justify-end gap-1 text-[10px] text-[#10B981] font-bold mt-1">
                        <Plane size={10} /> {UI_STRINGS.map.roomsList.traveler}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Post new room CTA */}
        <div className="p-4 border-t border-[var(--glass-border)] bg-[var(--bg-surface-elevated)]">
          <button className="w-full py-4 bg-[var(--primary)] text-[var(--text-primary)] font-black rounded-2xl shadow-lg shadow-[var(--primary)]/20 transition-all active:scale-95 flex items-center justify-center gap-2" onClick={() => {
            onClose();
            onPostRoom();
          }}>
            <PlusCircle size={20} /> {UI_STRINGS.map.roomsList.postYourRoomFree}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomsListModal;
