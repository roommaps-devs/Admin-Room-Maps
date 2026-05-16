import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SearchSuggestion } from '@/lib/types';

interface SearchState {
  searchQuery: string;
  suggestions: SearchSuggestion[];
  isSearching: boolean;
  showSuggestions: boolean;
}

const initialState: SearchState = {
  searchQuery: '',
  suggestions: [],
  isSearching: false,
  showSuggestions: false,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSuggestions: (state, action: PayloadAction<SearchSuggestion[]>) => {
      state.suggestions = action.payload;
    },
    setIsSearching: (state, action: PayloadAction<boolean>) => {
      state.isSearching = action.payload;
    },
    setShowSuggestions: (state, action: PayloadAction<boolean>) => {
      state.showSuggestions = action.payload;
    },
  },
});

export const { setSearchQuery, setSuggestions, setIsSearching, setShowSuggestions } = searchSlice.actions;
export default searchSlice.reducer;
