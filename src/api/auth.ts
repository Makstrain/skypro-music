// src/api/auth.ts

const API_URL = "https://webdev-music-003b5b991590.herokuapp.com";

export interface SignupPayload {
  email: string;
  password: string;
  username: string;
}

export interface SigninPayload {
  email: string;
  password: string;
}

export interface User {
  _id: number;
  email: string;
  username: string;
}

export interface Tokens {
  access: string;
  refresh: string;
}

export interface SignupResponse {
  message: string;
  result: User;
  success: boolean;
}

// ЗАЩИТНИКИ ТИПОВ

function isUser(value: unknown): value is User {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj._id === "number" &&
    typeof obj.email === "string" &&
    typeof obj.username === "string"
  );
}

function isTokens(value: unknown): value is Tokens {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  return typeof obj.access === "string" && typeof obj.refresh === "string";
}

// ФУНКЦИИ API
//  Регистрация
export async function signup(payload: SignupPayload): Promise<SignupResponse> {
  const res = await fetch(`${API_URL}/user/signup/`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "content-type": "application/json",
    },
  });

  const data: unknown = await res.json();

  if (!res.ok) {
    // API возвращает { message: "..." } при ошибке
    if (typeof data === "object" && data !== null && "message" in data) {
      throw new Error(String((data as { message: unknown }).message));
    }
    throw new Error(`Ошибка регистрации: ${res.status}`);
  }

  return data as SignupResponse;
}

// Вход (получить данные пользователя)
export async function signin(payload: SigninPayload): Promise<User> {
  const res = await fetch(`${API_URL}/user/login/`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "content-type": "application/json",
    },
  });

  const data: unknown = await res.json();

  if (!res.ok) {
    if (typeof data === "object" && data !== null && "message" in data) {
      throw new Error(String((data as { message: unknown }).message));
    }
    throw new Error(`Ошибка входа: ${res.status}`);
  }

  if (!isUser(data)) {
    throw new Error("Неверный формат данных от API");
  }

  return data;
}

// Получить токены (access + refresh)
export async function getTokens(payload: SigninPayload): Promise<Tokens> {
  const res = await fetch(`${API_URL}/user/token/`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "content-type": "application/json",
    },
  });

  const data: unknown = await res.json();

  if (!res.ok) {
    if (typeof data === "object" && data !== null && "message" in data) {
      throw new Error(String((data as { message: unknown }).message));
    }
    throw new Error(`Ошибка получения токена: ${res.status}`);
  }

  if (!isTokens(data)) {
    throw new Error("Неверный формат токенов от API");
  }

  return data;
}

// Обновить access-токен
export async function refreshAccessToken(refresh: string): Promise<string> {
  const res = await fetch(`${API_URL}/user/token/refresh/`, {
    method: "POST",
    body: JSON.stringify({ refresh }),
    headers: {
      "content-type": "application/json",
    },
  });

  const data: unknown = await res.json();

  if (!res.ok) {
    if (typeof data === "object" && data !== null && "detail" in data) {
      throw new Error(String((data as { detail: unknown }).detail));
    }
    throw new Error(`Ошибка обновления токена: ${res.status}`);
  }

  if (
    typeof data !== "object" ||
    data === null ||
    !("access" in data) ||
    typeof (data as { access: unknown }).access !== "string"
  ) {
    throw new Error("Неверный формат токена от API");
  }

  return (data as { access: string }).access;
}
