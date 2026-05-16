import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AppMode = 'rent' | 'travelers';

interface UIState {
  mode: AppMode;
  isProfileMenuOpen: boolean;
  showTravelersSheet: boolean;
}

const initialState: UIState = {
  mode: 'rent',
  isProfileMenuOpen: false,
  showTravelersSheet: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<AppMode>) => {
      state.mode = action.payload;
    },
    setProfileMenu: (state, action: PayloadAction<boolean>) => {
      state.isProfileMenuOpen = action.payload;
    },
    setTravelersSheet: (state, action: PayloadAction<boolean>) => {
      state.showTravelersSheet = action.payload;
    },
  },
});

export const { setMode, setProfileMenu, setTravelersSheet } = uiSlice.actions;
export default uiSlice.reducer;
