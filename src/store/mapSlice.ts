import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Room } from '@/lib/types';

interface MapState {
  searchCenter: [number, number];
  mapZoom: number;
  liveUserPos: [number, number] | null;
  locationState: 'pending' | 'denied' | 'granted' | 'skipped';
  selectedRoom: Room | null;
  bottomSheetOpen: boolean;
  searchRadius: number;
  showRadiusPopup: boolean;
  priceRange: [number, number];
  showProfileMenu: boolean;
}

const initialState: MapState = {
  searchCenter: [30.7046, 76.7179], // Default: Chandigarh
  mapZoom: 13,
  liveUserPos: null,
  locationState: 'pending',
  selectedRoom: null,
  bottomSheetOpen: false,
  searchRadius: 5000,
  showRadiusPopup: false,
  priceRange: [0, 1000000],
  showProfileMenu: false,
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setSearchCenter: (state, action: PayloadAction<[number, number]>) => {
      state.searchCenter = action.payload;
    },
    setMapZoom: (state, action: PayloadAction<number>) => {
      state.mapZoom = action.payload;
    },
    setLiveUserPos: (state, action: PayloadAction<[number, number] | null>) => {
      state.liveUserPos = action.payload;
    },
    setLocationState: (state, action: PayloadAction<MapState['locationState']>) => {
      state.locationState = action.payload;
    },
    setSelectedRoom: (state, action: PayloadAction<Room | null>) => {
      state.selectedRoom = action.payload;
    },
    setBottomSheetOpen: (state, action: PayloadAction<boolean>) => {
      state.bottomSheetOpen = action.payload;
    },
    setSearchRadius: (state, action: PayloadAction<number>) => {
      state.searchRadius = action.payload;
    },
    setShowRadiusPopup: (state, action: PayloadAction<boolean>) => {
      state.showRadiusPopup = action.payload;
    },
    setPriceRange: (state, action: PayloadAction<[number, number]>) => {
      state.priceRange = action.payload;
    },
    setShowProfileMenu: (state, action: PayloadAction<boolean>) => {
      state.showProfileMenu = action.payload;
    },
  },
});

export const {
  setSearchCenter,
  setMapZoom,
  setLiveUserPos,
  setLocationState,
  setSelectedRoom,
  setBottomSheetOpen,
  setSearchRadius,
  setShowRadiusPopup,
  setPriceRange,
  setShowProfileMenu,
} = mapSlice.actions;

export default mapSlice.reducer;
