// src/store/index.ts

import { configureStore } from "@reduxjs/toolkit";
import playerReducer from "./slices/playerSlice";
import tracksReducer from "./slices/tracksSlice";
import selectionsReducer from "./slices/selectionsSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    player: playerReducer,
    tracks: tracksReducer,
    selections: selectionsReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
