// src/store/slices/tracksSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Track } from "@/data/data";
import { getTracks } from "@/api/tracks";
import { getFavorites } from "@/api/favorites";
import { withReauth } from "@/utils/withReauth";
import type { RootState, AppDispatch } from "@/store";

// ============================================
// ТИПЫ
// ============================================

export type SortType = "default" | "new" | "old";

interface TracksState {
  items: Track[];
  loading: boolean;
  error: string | null;
  searchQuery: string;

  // Фильтры
  selectedAuthors: string[];
  selectedGenres: string[];
  sortBy: SortType;

  // избранное
  favoriteTracks: Track[];
  favoritesLoading: boolean;
  favoritesError: string | null;
  favoritesLoaded: boolean;
}

const initialState: TracksState = {
  items: [],
  loading: false,
  error: null,
  searchQuery: "",

  // Выбранные фильтры
  selectedAuthors: [],
  selectedGenres: [],
  sortBy: "default",

  // избранное
  favoriteTracks: [],
  favoritesLoading: false,
  favoritesError: null,
  favoritesLoaded: false,
};

// ============================================
// THUNK — все треки
// ============================================

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

// ============================================
// THUNK — избранное
// ============================================

export const fetchFavorites = createAsyncThunk<
  Track[],
  void,
  { rejectValue: string; state: RootState }
>(
  "tracks/fetchFavorites",
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const { access, refresh } = getState().auth;

      if (!access) {
        return rejectWithValue("Нет авторизации");
      }

      if (!refresh) {
        return rejectWithValue("Нет refresh-токена");
      }

      return await withReauth(
        (newToken) => getFavorites(newToken || access),
        refresh,
        dispatch as AppDispatch,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Ошибка при загрузке избранного";
      return rejectWithValue(message);
    }
  },
);

// ============================================
// СЛАЙС
// ============================================

const tracksSlice = createSlice({
  name: "tracks",
  initialState,
  reducers: {
    clearTracks: (state) => {
      state.items = [];
      state.error = null;
      state.loading = false;
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    // Фильтры
    toggleAuthor: (state, action: PayloadAction<string>) => {
      const author = action.payload;
      if (state.selectedAuthors.includes(author)) {
        state.selectedAuthors = state.selectedAuthors.filter(
          (a) => a !== author,
        );
      } else {
        state.selectedAuthors.push(author);
      }
    },

    toggleGenre: (state, action: PayloadAction<string>) => {
      const genre = action.payload;
      if (state.selectedGenres.includes(genre)) {
        state.selectedGenres = state.selectedGenres.filter((g) => g !== genre);
      } else {
        state.selectedGenres.push(genre);
      }
    },

    setSortBy: (state, action: PayloadAction<SortType>) => {
      state.sortBy = action.payload;
    },

    // Сброс фильтров
    resetFilters: (state) => {
      state.selectedAuthors = [];
      state.selectedGenres = [];
      state.sortBy = "default";
    },

    // избранное
    addLikedTracks: (state, action: PayloadAction<Track>) => {
      const exists = state.favoriteTracks.some(
        (t) => t._id === action.payload._id,
      );
      if (!exists) {
        state.favoriteTracks.push(action.payload);
      }
    },

    removeLikedTracks: (state, action: PayloadAction<Track>) => {
      state.favoriteTracks = state.favoriteTracks.filter(
        (t) => t._id !== action.payload._id,
      );
    },

    setFavoriteTracks: (state, action: PayloadAction<Track[]>) => {
      state.favoriteTracks = action.payload;
    },

    clearFavorites: (state) => {
      state.favoriteTracks = [];
      state.favoritesError = null;
      state.favoritesLoading = false;
      state.favoritesLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // ====== FETCH TRACKS ======
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
      })

      // ====== FETCH FAVORITES ======
      .addCase(fetchFavorites.pending, (state) => {
        state.favoritesLoading = true;
        state.favoritesError = null;
      })
      .addCase(
        fetchFavorites.fulfilled,
        (state, action: PayloadAction<Track[]>) => {
          state.favoritesLoading = false;
          state.favoriteTracks = action.payload;
          state.favoritesLoaded = true;
        },
      )
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.favoritesLoading = false;
        state.favoritesError = action.payload || "Неизвестная ошибка";
      });
  },
});

// ============================================
// ЭКСПОРТ
// ============================================

export const {
  clearTracks,
  setSearchQuery,
  toggleAuthor,
  toggleGenre,
  setSortBy,
  resetFilters,
  addLikedTracks,
  removeLikedTracks,
  setFavoriteTracks,
  clearFavorites,
} = tracksSlice.actions;

export default tracksSlice.reducer;
