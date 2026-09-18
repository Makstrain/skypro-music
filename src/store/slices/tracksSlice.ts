// src/store/slices/tracksSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Track } from "@/data/data";
import { getTracks } from "@/api/tracks";

//  Тип состояния
interface TracksState {
  items: Track[];
  loading: boolean;
  error: string | null;
}

//  Начальное состояние
const initialState: TracksState = {
  items: [],
  loading: false,
  error: null,
};

//  Async thunk для загрузки треков
export const fetchTracks = createAsyncThunk<
  Track[], // ← что вернёт при успехе
  void, // ← что принимает (ничего)
  { rejectValue: string } // ← что вернёт при ошибке
>("tracks/fetchTracks", async (_, { rejectWithValue }) => {
  try {
    const tracks = await getTracks();
    return tracks;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Ошибка при загрузке треков";
    return rejectWithValue(message);
  }
});

//  Слайс
const tracksSlice = createSlice({
  name: "tracks",
  initialState,
  reducers: {
    // Очистить треки (пригодится при выходе)
    clearTracks: (state) => {
      state.items = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Загрузка началась
      .addCase(fetchTracks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Загрузка успешна
      .addCase(
        fetchTracks.fulfilled,
        (state, action: PayloadAction<Track[]>) => {
          state.loading = false;
          state.items = action.payload;
        },
      )
      // Загрузка с ошибкой
      .addCase(fetchTracks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Неизвестная ошибка";
      });
  },
});

export const { clearTracks } = tracksSlice.actions;
export default tracksSlice.reducer;
