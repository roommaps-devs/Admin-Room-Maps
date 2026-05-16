"use client";

import React from 'react';
import { X, Loader2, MapPin, Navigation, Map as MapIcon, Globe } from 'lucide-react';
import { UI_STRINGS } from '@/lib/constants/strings';
import { useUniqueCities } from '@/lib/hooks/useRooms';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  tempQuery: string;
  setTempQuery: (query: string) => void;
  isSearching: boolean;
  suggestions: any[];
  onSearch: () => void;
  onSelectSuggestion: (feature: any) => void;
  locationState: string;
  requestLocation: () => void;
  setIsSelectingLocation: (isSelecting: boolean) => void;
  playClickSound: () => void;
  searchInputRef:  any;
}


const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  tempQuery,
  setTempQuery,
  isSearching,
  suggestions,
  onSearch,
  onSelectSuggestion,
  locationState,
  requestLocation,
  setIsSelectingLocation,
  playClickSound,
  searchInputRef
}) => {
  const { data: cities } = useUniqueCities();

  const handleCityClick = (city: string) => {
    setTempQuery(city);
    playClickSound();
    // Use a small timeout to ensure the state update is processed before searching
    setTimeout(() => {
      onSearch();
    }, 50);
  };
  return (
    <div className={`fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-[var(--bg-color)]/90 backdrop-blur-xl transition-all duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className={`bg-[var(--bg-surface-elevated)]/70 backdrop-blur-2xl border border-[var(--glass-border)] rounded-[32px] p-8 w-full max-w-[480px] shadow-2xl transition-all duration-500 ${isOpen ? 'translate-y-0 scale-100' : 'translate-y-8 scale-95'} max-h-[85dvh] overflow-y-auto flex flex-col`}>
        <button className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[var(--bg-surface)] flex items-center justify-center text-[var(--text-primary)]/30 hover:bg-[var(--bg-surface-elevated)] hover:text-[var(--text-primary)] transition-all shrink-0" onClick={onClose}>
          <X size={18} />
        </button>
        <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tight mb-8">{UI_STRINGS.map.search.enterLocation}</h3>
        <form onSubmit={(e) => { e.preventDefault(); onSearch(); }}>
          <div className="relative mb-6">
            <input
              ref={searchInputRef}
              type="text"
              autoFocus
              placeholder={UI_STRINGS.map.search.placeholder}
              value={tempQuery}
              onChange={(e) => setTempQuery(e.target.value)}
              className="w-full bg-[var(--bg-surface)] border border-[var(--glass-border)] rounded-2xl px-6 py-4 text-[var(--text-primary)] placeholder:text-[var(--text-primary)]/20 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
            />
            {isSearching && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--primary)]">
                <Loader2 size={18} className="animate-spin" />
              </div>
            )}
          </div>

          {tempQuery.length >= 3 && (
            <ul className="max-h-[300px] overflow-y-auto bg-[var(--bg-surface)] rounded-2xl border border-[var(--glass-border)] mb-6 divide-y divide-white/5">
              {!isSearching && suggestions.length === 0 && (
                <li className="px-6 py-4 text-[var(--text-primary)]/40 text-sm italic">{UI_STRINGS.map.search.noResults}</li>
              )}
              {!isSearching && suggestions.map((feature, idx) => {
                const { name, city, state, country } = feature.properties;
                return (
                  <li
                    key={idx}
                    className="px-6 py-4 flex items-center gap-4 cursor-pointer hover:bg-[var(--bg-surface)] transition-all group"
                    onClick={() => onSelectSuggestion(feature)}
                  >
                    <MapPin size={18} className="text-[var(--primary)] group-hover:scale-110 transition-transform" />
                    <div className="flex flex-col">
                      <strong className="text-[var(--text-primary)] text-[15px]">{name || city || state}</strong>
                      <small className="text-[var(--text-primary)]/40 text-[11px] truncate">{[city, state, country].filter(Boolean).filter(v => v !== name).join(', ')}</small>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {tempQuery.length === 0 && cities && cities.length > 0 && (
            <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              <div className="flex items-center gap-2 mb-4 px-1">
                <Globe size={14} className="text-[var(--primary)]" />
                <span className="text-[11px] font-black uppercase tracking-widest text-[var(--text-primary)]/40">Trending Cities</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {cities.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => handleCityClick(city)}
                    className="px-4 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--glass-border)] text-[var(--text-primary)]/70 text-[13px] font-bold hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] hover:border-[var(--primary)]/30 transition-all active:scale-95"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button type="submit" className="w-full bg-[var(--primary)] text-[var(--text-primary)] font-bold py-4 rounded-2xl shadow-[0_10px_25px_rgba(255,82,17,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]">{UI_STRINGS.map.search.searchBtn}</button>
        </form>

        {locationState !== 'granted' ? (
          <div className="flex flex-col gap-2 mt-4">
            <button className="flex items-center justify-center gap-2 w-full bg-[var(--bg-surface)] border border-[var(--glass-border)] text-[var(--text-primary)] font-bold py-4 rounded-2xl hover:bg-[var(--bg-surface-elevated)] transition-all" onClick={() => {
              requestLocation();
              onClose();
            }}>
              <Navigation size={18} className="text-[var(--primary)]" /> {UI_STRINGS.map.search.useCurrentLocation}
            </button>
            <button className="flex items-center justify-center gap-2 w-full bg-[var(--bg-surface)] border border-[var(--glass-border)] text-[var(--text-primary)] font-bold py-4 rounded-2xl hover:bg-[var(--bg-surface-elevated)] transition-all" onClick={() => {
              onClose();
              setIsSelectingLocation(true);
              playClickSound();
            }}>
              <MapIcon size={18} className="text-[var(--primary)]" /> {UI_STRINGS.map.search.selectFromMap}
            </button>
          </div>
        ) : (
          <button className="w-full mt-4 text-[var(--text-primary)]/30 text-sm hover:text-[var(--text-primary)] transition-colors" onClick={onClose}>
            {UI_STRINGS.common.cancel}
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchModal;
