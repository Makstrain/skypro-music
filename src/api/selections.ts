// src/api/selections.ts

import {
  ApiSelection,
  SelectionsApiResponse,
  SelectionApiResponse,
} from "./types";

const API_URL = "https://webdev-music-003b5b991590.herokuapp.com";

//  Защитник типа для списка подборок
function isSelectionsApiResponse(
  value: unknown,
): value is SelectionsApiResponse {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  return typeof obj.success === "boolean" && Array.isArray(obj.data);
}

// Защитник типа для одной подборки
function isSelectionApiResponse(value: unknown): value is SelectionApiResponse {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.success === "boolean" &&
    typeof obj.data === "object" &&
    obj.data !== null
  );
}

// Получить все подборки
export async function getSelections(): Promise<ApiSelection[]> {
  const res = await fetch(`${API_URL}/catalog/selection/all`);

  if (!res.ok) {
    throw new Error(`Ошибка при получении подборок: ${res.status}`);
  }

  const data: unknown = await res.json();

  if (!isSelectionsApiResponse(data)) {
    throw new Error("Неверный формат данных от API");
  }

  return data.data;
}

// Получить подборку по id
export async function getSelectionById(id: string): Promise<ApiSelection> {
  const res = await fetch(`${API_URL}/catalog/selection/${id}/`);

  if (res.status === 404) {
    throw new Error("NOT_FOUND");
  }

  if (!res.ok) {
    throw new Error(`Ошибка при получении подборки: ${res.status}`);
  }

  const data: unknown = await res.json();

  if (!isSelectionApiResponse(data)) {
    throw new Error("Неверный формат данных от API");
  }

  return data.data;
}
