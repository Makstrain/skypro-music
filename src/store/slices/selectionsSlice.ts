// src/store/slices/selectionsSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ApiSelection } from "@/api/types";
import { getSelections } from "@/api/selections";

// Тип состояния
interface SelectionsState {
  items: ApiSelection[];
  loading: boolean;
  error: string | null;
}

//  Начальное состояние
const initialState: SelectionsState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunk для загрузки подборок
export const fetchSelections = createAsyncThunk<
  ApiSelection[],
  void,
  { rejectValue: string }
>("selections/fetchSelections", async (_, { rejectWithValue }) => {
  try {
    const selections = await getSelections();
    return selections;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Ошибка при загрузке подборок";
    return rejectWithValue(message);
  }
});

// Слайс
const selectionsSlice = createSlice({
  name: "selections",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSelections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSelections.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchSelections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Неизвестная ошибка";
      });
  },
});

export default selectionsSlice.reducer;
