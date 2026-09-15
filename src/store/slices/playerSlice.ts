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
  playlist: Track[]; // Текущий плейлист
  currentIndex: number; // Индекс текущего трека в плейлисте
  isShuffle: boolean;
  isRepeat: boolean;
}

// 2. НАЧАЛЬНОЕ СОСТОЯНИЕ
const initialState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
  volume: 50,
  currentTime: 0,
  duration: 0,
  playlist: [],
  currentIndex: -1,
  isShuffle: false,
  isRepeat: false,
};

// 3. СОЗДАЕМ СЛАЙС
const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    //  УСТАНОВИТЬ ПЛЕЙЛИСТ И ТРЕК
    setPlaylistAndTrack: (
      state,
      action: PayloadAction<{ playlist: Track[]; track: Track }>,
    ) => {
      state.playlist = action.payload.playlist;
      const index = action.payload.playlist.findIndex(
        (t) => t._id === action.payload.track._id,
      );
      state.currentIndex = index;
      state.currentTrack = action.payload.track;
      state.isPlaying = true;
      state.currentTime = 0;
      state.duration = 0;
    },

    //  СЛЕДУЮЩИЙ ТРЕК
    nextTrack: (state) => {
      if (state.playlist.length === 0) return;

      let nextIndex: number;

      if (state.isShuffle) {
        // ✅ Случайный трек (кроме текущего)
        if (state.playlist.length === 1) {
          nextIndex = 0;
        } else {
          do {
            nextIndex = Math.floor(Math.random() * state.playlist.length);
          } while (nextIndex === state.currentIndex);
        }
      } else {
        // Обычный порядок
        nextIndex = (state.currentIndex + 1) % state.playlist.length;
      }

      state.currentIndex = nextIndex;
      state.currentTrack = state.playlist[nextIndex];
      state.isPlaying = true;
      state.currentTime = 0;
      state.duration = 0;
    },

    // ПРЕДЫДУЩИЙ ТРЕК
    prevTrack: (state) => {
      if (state.playlist.length === 0) return;

      let prevIndex: number;

      if (state.isShuffle) {
        if (state.playlist.length === 1) {
          prevIndex = 0;
        } else {
          do {
            prevIndex = Math.floor(Math.random() * state.playlist.length);
          } while (prevIndex === state.currentIndex);
        }
      } else {
        prevIndex =
          (state.currentIndex - 1 + state.playlist.length) %
          state.playlist.length;
      }

      state.currentIndex = prevIndex;
      state.currentTrack = state.playlist[prevIndex];
      state.isPlaying = true;
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
    /// Перемешивание
    toggleShuffle: (state) => {
      state.isShuffle = !state.isShuffle;
    },
    ///Повтор
    toggleRepeat: (state) => {
      state.isRepeat = !state.isRepeat;
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
  setPlaylistAndTrack,
  nextTrack,
  prevTrack,
  play,
  pause,
  togglePlay,
  toggleShuffle,
  setVolume,
  setCurrentTime,
  setDuration,
  toggleRepeat,
} = playerSlice.actions;

// 5. ЭКСПОРТИРУЕМ REDUCER
export default playerSlice.reducer;
