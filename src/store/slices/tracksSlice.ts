// src/store/slices/tracksSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Track } from "@/data/data";
import { getTracks } from "@/api/tracks";

interface TracksState {
  items: Track[];
  loading: boolean;
  error: string | null;
  searchQuery: string; // ✅ ДОБАВЛЯЕМ
}

const initialState: TracksState = {
  items: [],
  loading: false,
  error: null,
  searchQuery: "", // ✅ ДОБАВЛЯЕМ
};

export const fetchTracks = createAsyncThunk<
  Track[],
  void,
  { rejectValue: string }
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

const tracksSlice = createSlice({
  name: "tracks",
  initialState,
  reducers: {
    clearTracks: (state) => {
      state.items = [];
      state.error = null;
      state.loading = false;
    },
    // ✅ НОВЫЙ ЭКШЕН
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTracks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTracks.fulfilled,
        (state, action: PayloadAction<Track[]>) => {
          state.loading = false;
          state.items = action.payload;
        },
      )
      .addCase(fetchTracks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Неизвестная ошибка";
      });
  },
});

export const { clearTracks, setSearchQuery } = tracksSlice.actions; // ✅ ДОБАВИЛИ
export default tracksSlice.reducer;
