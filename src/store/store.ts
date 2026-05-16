import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import uiReducer from "./uiSlice";
import searchReducer from "./searchSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    ui: uiReducer,
    search: searchReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
