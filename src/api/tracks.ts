// src/api/tracks.ts

import { ApiTrack, TracksApiResponse } from "./types";
import { Track } from "@/data/data";

const API_URL = "https://webdev-music-003b5b991590.herokuapp.com";

//  Защитник типа
function isTracksApiResponse(value: unknown): value is TracksApiResponse {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  return typeof obj.success === "boolean" && Array.isArray(obj.data);
}

// Маппинг ApiTrack → Track (для совместимости с компонентами)
function mapApiTrackToTrack(apiTrack: ApiTrack): Track {
  return {
    _id: apiTrack._id,
    name: apiTrack.name,
    author: apiTrack.author,
    release_date: apiTrack.release_date,
    genre: apiTrack.genre,
    duration_in_seconds: apiTrack.duration_in_seconds,
    album: apiTrack.album,
    logo: null, // ⚠️ в API логотип — объект Buffer, в компонентах ожидается string | null
    track_file: apiTrack.track_file,
    stared_user: apiTrack.staredUser,
  };
}

// Получить все треки
export async function getTracks(): Promise<Track[]> {
  const res = await fetch(`${API_URL}/catalog/track/all/`);

  if (!res.ok) {
    throw new Error(`Ошибка при получении треков: ${res.status}`);
  }

  const data: unknown = await res.json();

  if (!isTracksApiResponse(data)) {
    throw new Error("Неверный формат данных от API");
  }

  return data.data.map(mapApiTrackToTrack);
}
