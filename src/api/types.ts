// src/api/types.ts

// Тип трека, как его возвращает API
export interface ApiTrack {
  _id: number;
  name: string;
  author: string;
  release_date: string;
  genre: string[];
  duration_in_seconds: number;
  album: string;
  logo: {
    type: string;
    data: number[];
  } | null;
  track_file: string;
  staredUser: number[];
}

// Ответ API для списка треков
export interface TracksApiResponse {
  success: boolean;
  data: ApiTrack[];
}

//  Тип подборки, как его возвращает API
export interface ApiSelection {
  _id: number;
  name?: string; // ← опционально (может отсутствовать)
  items: number[]; // ← массив ID треков
  owner: number[];
  __v?: number;
}

// Ответ API для списка подборок
export interface SelectionsApiResponse {
  success: boolean;
  data: ApiSelection[];
}

// Ответ API для одной подборки
export interface SelectionApiResponse {
  success: boolean;
  data: ApiSelection;
}
