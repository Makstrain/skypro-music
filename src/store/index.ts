// src/store/index.ts

import { configureStore } from "@reduxjs/toolkit";
import playerReducer from "./slices/playerSlice";

export const store = configureStore({
  reducer: {
    player: playerReducer, // ← Добавляем слайс плеера
    // Позже добавим tracksReducer и другие
  },
});

// Тип для всего состояния
export type RootState = ReturnType<typeof store.getState>;

// Тип для dispatch
export type AppDispatch = typeof store.dispatch;
