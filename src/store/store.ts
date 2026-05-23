import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import uiReducer from "./uiSlice";
import searchReducer from "./searchSlice";
import mapReducer from "./mapSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    ui: uiReducer,
    search: searchReducer,
    map: mapReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
