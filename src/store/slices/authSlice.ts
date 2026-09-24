// src/store/slices/authSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  signin as signinApi,
  signup as signupApi,
  getTokens,
  User,
  SignupPayload,
  SigninPayload,
} from "@/api/auth";

// ТИПЫ

interface AuthState {
  user: User | null;
  access: string | null;
  refresh: string | null;
  loading: boolean;
  error: string | null;
}

// НАЧАЛЬНОЕ СОСТОЯНИЕ

// Читаем токены из localStorage при инициализации
const getInitialState = (): AuthState => {
  // Проверяем, что мы в браузере (localStorage доступен)
  if (typeof window === "undefined") {
    return {
      user: null,
      access: null,
      refresh: null,
      loading: false,
      error: null,
    };
  }

  const access = localStorage.getItem("access");
  const refresh = localStorage.getItem("refresh");
  const userRaw = localStorage.getItem("user");

  let user: User | null = null;
  if (userRaw) {
    try {
      user = JSON.parse(userRaw);
    } catch {
      user = null;
    }
  }

  return {
    user,
    access,
    refresh,
    loading: false,
    error: null,
  };
};

const initialState: AuthState = getInitialState();

// ASYNC THUNKS

// Вход
export const signinThunk = createAsyncThunk<
  { user: User; access: string; refresh: string },
  SigninPayload,
  { rejectValue: string }
>("auth/signin", async (payload, { rejectWithValue }) => {
  try {
    // 1. Получаем данные пользователя
    const user = await signinApi(payload);
    // 2. Получаем токены
    const tokens = await getTokens(payload);

    return {
      user,
      access: tokens.access,
      refresh: tokens.refresh,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ошибка при входе";
    return rejectWithValue(message);
  }
});

// Регистрация
export const signupThunk = createAsyncThunk<
  void,
  SignupPayload,
  { rejectValue: string }
>("auth/signup", async (payload, { rejectWithValue }) => {
  try {
    await signupApi(payload);
    // После регистрации ничего не делаем — редирект на signin
    return;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Ошибка при регистрации";
    return rejectWithValue(message);
  }
});

// СЛАЙС

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Выход
    logout: (state) => {
      state.user = null;
      state.access = null;
      state.refresh = null;
      state.error = null;
      state.loading = false;

      // Чистим localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");
      }
    },

    setAccessToken: (state, action: PayloadAction<string>) => {
      state.access = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("access", action.payload);
      }
    },

    //  Очистить ошибку (например, при новом запросе)
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ========== SIGNIN ==========
      .addCase(signinThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signinThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.access = action.payload.access;
        state.refresh = action.payload.refresh;

        // Сохраняем в localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("access", action.payload.access);
          localStorage.setItem("refresh", action.payload.refresh);
          localStorage.setItem("user", JSON.stringify(action.payload.user));
        }
      })
      .addCase(signinThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Неизвестная ошибка";
      })

      // ========== SIGNUP ==========
      .addCase(signupThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signupThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Неизвестная ошибка";
      });
  },
});

export const { logout, clearError, setAccessToken } = authSlice.actions;
export default authSlice.reducer;
