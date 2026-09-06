// src/store/slices/playerSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Track } from "@/data/data";

// 1. ОПИСЫВАЕМ ТИП СОСТОЯНИЯ
interface PlayerState {
  currentTrack: Track | null; // Текущий трек
  isPlaying: boolean; // Играет или нет
  volume: number; // Громкость (0-100)
  currentTime: number; // Текущее время в секундах
  duration: number; // Общая длительность в секундах
}

// 2. НАЧАЛЬНОЕ СОСТОЯНИЕ
const initialState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
  volume: 50,
  currentTime: 0,
  duration: 0,
};

// 3. СОЗДАЕМ СЛАЙС
const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    // Установить трек
    setTrack: (state, action: PayloadAction<Track>) => {
      state.currentTrack = action.payload;
      state.isPlaying = true; // Новый трек — на паузу
      state.currentTime = 0;
      state.duration = 0;
    },
    // Воспроизвести
    play: (state) => {
      state.isPlaying = true;
    },
    // Пауза
    pause: (state) => {
      state.isPlaying = false;
    },
    // Переключить play/pause
    togglePlay: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    // Установить громкость
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },
    // Обновить текущее время
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },
    // Установить длительность
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
  },
});

// 4. ЭКСПОРТИРУЕМ ACTIONS
export const {
  setTrack,
  play,
  pause,
  togglePlay,
  setVolume,
  setCurrentTime,
  setDuration,
} = playerSlice.actions;

// 5. ЭКСПОРТИРУЕМ REDUCER
export default playerSlice.reducer;
