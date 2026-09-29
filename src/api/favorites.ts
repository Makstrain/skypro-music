// src/api/favorites.ts

import { Track } from "@/data/data";

const API_URL = "https://webdev-music-003b5b991590.herokuapp.com";

interface FavoritesApiResponse {
  success: boolean;
  data: Track[];
}

function isFavoritesApiResponse(value: unknown): value is FavoritesApiResponse {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  return typeof obj.success === "boolean" && Array.isArray(obj.data);
}

function throwIf401(res: Response) {
  if (res.status === 401) {
    const error = new Error("Unauthorized");
    (error as Error & { status?: number }).status = 401;
    throw error;
  }
}

export async function getFavorites(access: string): Promise<Track[]> {
  const res = await fetch(`${API_URL}/catalog/track/favorite/all/`, {
    method: "GET",
    headers: { Authorization: `Bearer ${access}` },
  });

  throwIf401(res);

  if (!res.ok) {
    throw new Error(`Ошибка при получении избранного: ${res.status}`);
  }

  const data: unknown = await res.json();

  if (!isFavoritesApiResponse(data)) {
    throw new Error("Неверный формат данных от API");
  }

  return data.data;
}

export async function addLike(access: string, trackId: number): Promise<void> {
  const res = await fetch(`${API_URL}/catalog/track/${trackId}/favorite/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${access}` },
  });

  throwIf401(res);

  if (!res.ok) {
    throw new Error(`Ошибка при добавлении в избранное: ${res.status}`);
  }
}

export async function removeLike(
  access: string,
  trackId: number,
): Promise<void> {
  const res = await fetch(`${API_URL}/catalog/track/${trackId}/favorite/`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${access}` },
  });

  throwIf401(res);

  if (!res.ok) {
    throw new Error(`Ошибка при удалении из избранного: ${res.status}`);
  }
}
