// src/utils/__tests__/filters.test.ts

import { type Track } from "@/data/data";
import {
  getUniqueAuthors,
  getUniqueGenres,
  getUniqueYears,
  getUniqueDecades,
} from "../filters";

// ✅ Мок-трек для тестов
const createTrack = (overrides: Partial<Track> = {}): Track => ({
  _id: 1,
  name: "Test Track",
  author: "Test Author",
  release_date: "2020-01-01",
  genre: ["Рок"],
  duration_in_seconds: 200,
  album: "Test Album",
  logo: null,
  track_file: "test.mp3",
  stared_user: [],
  ...overrides,
});

// ============================================
// getUniqueAuthors
// ============================================

describe("getUniqueAuthors", () => {
  it("возвращает пустой массив при пустом входе", () => {
    expect(getUniqueAuthors([])).toEqual([]);
  });

  it("возвращает пустой массив при вызове без аргумента", () => {
    expect(getUniqueAuthors()).toEqual([]);
  });

  it("возвращает уникальных авторов", () => {
    const tracks = [
      createTrack({ _id: 1, author: "A" }),
      createTrack({ _id: 2, author: "B" }),
      createTrack({ _id: 3, author: "A" }),
    ];
    expect(getUniqueAuthors(tracks)).toEqual(["A", "B"]);
  });

  it("не дублирует авторов", () => {
    const tracks = [
      createTrack({ _id: 1, author: "A" }),
      createTrack({ _id: 2, author: "A" }),
      createTrack({ _id: 3, author: "A" }),
    ];
    expect(getUniqueAuthors(tracks)).toEqual(["A"]);
  });
});

// ============================================
// getUniqueGenres
// ============================================

describe("getUniqueGenres", () => {
  it("возвращает пустой массив при пустом входе", () => {
    expect(getUniqueGenres([])).toEqual([]);
  });

  it("возвращает пустой массив при вызове без аргумента", () => {
    expect(getUniqueGenres()).toEqual([]);
  });

  it("собирает жанры из массива genre каждого трека", () => {
    const tracks = [
      createTrack({ _id: 1, genre: ["Рок", "Инди"] }),
      createTrack({ _id: 2, genre: ["Поп"] }),
    ];
    expect(getUniqueGenres(tracks)).toEqual(["Рок", "Инди", "Поп"]);
  });

  it("не дублирует жанры", () => {
    const tracks = [
      createTrack({ _id: 1, genre: ["Рок", "Поп"] }),
      createTrack({ _id: 2, genre: ["Рок"] }),
      createTrack({ _id: 3, genre: ["Поп"] }),
    ];
    expect(getUniqueGenres(tracks)).toEqual(["Рок", "Поп"]);
  });

  it("обрабатывает пустой массив genre", () => {
    const tracks = [createTrack({ _id: 1, genre: [] })];
    expect(getUniqueGenres(tracks)).toEqual([]);
  });
});

// ============================================
// getUniqueYears
// ============================================

describe("getUniqueYears", () => {
  it("возвращает пустой массив при пустом входе", () => {
    expect(getUniqueYears([])).toEqual([]);
  });

  it("возвращает пустой массив при вызове без аргумента", () => {
    expect(getUniqueYears()).toEqual([]);
  });

  it("извлекает уникальные годы", () => {
    const tracks = [
      createTrack({ _id: 1, release_date: "2020-01-01" }),
      createTrack({ _id: 2, release_date: "2021-05-05" }),
      createTrack({ _id: 3, release_date: "2020-10-10" }),
    ];
    expect(getUniqueYears(tracks)).toEqual([2021, 2020]);
  });

  it("сортирует годы по убыванию", () => {
    const tracks = [
      createTrack({ _id: 1, release_date: "2005-01-01" }),
      createTrack({ _id: 2, release_date: "2020-01-01" }),
      createTrack({ _id: 3, release_date: "1990-01-01" }),
    ];
    expect(getUniqueYears(tracks)).toEqual([2020, 2005, 1990]);
  });

  it("фильтрует NaN (невалидная дата)", () => {
    const tracks = [
      createTrack({ _id: 1, release_date: "2020-01-01" }),
      createTrack({ _id: 2, release_date: "invalid-date" }),
    ];
    expect(getUniqueYears(tracks)).toEqual([2020]);
  });

  it("возвращает пустой массив если все даты невалидны", () => {
    const tracks = [
      createTrack({ _id: 1, release_date: "invalid" }),
      createTrack({ _id: 2, release_date: "also-invalid" }),
    ];
    expect(getUniqueYears(tracks)).toEqual([]);
  });
});

// ============================================
// getUniqueDecades
// ============================================

describe("getUniqueDecades", () => {
  it("возвращает пустой массив при пустом входе", () => {
    expect(getUniqueDecades([])).toEqual([]);
  });

  it("возвращает пустой массив при вызове без аргумента", () => {
    expect(getUniqueDecades()).toEqual([]);
  });

  it("группирует годы в десятилетия", () => {
    const tracks = [
      createTrack({ _id: 1, release_date: "1995-01-01" }), // 1990-е
      createTrack({ _id: 2, release_date: "2020-01-01" }), // 2020-е
    ];
    expect(getUniqueDecades(tracks)).toEqual(["1990-е", "2020-е"]);
  });

  it("не дублирует десятилетия", () => {
    const tracks = [
      createTrack({ _id: 1, release_date: "1995-01-01" }),
      createTrack({ _id: 2, release_date: "1999-12-31" }),
      createTrack({ _id: 3, release_date: "1990-06-15" }),
    ];
    expect(getUniqueDecades(tracks)).toEqual(["1990-е"]);
  });

  it("сортирует десятилетия по возрастанию", () => {
    const tracks = [
      createTrack({ _id: 1, release_date: "2020-01-01" }),
      createTrack({ _id: 2, release_date: "1980-01-01" }),
      createTrack({ _id: 3, release_date: "2000-01-01" }),
    ];
    expect(getUniqueDecades(tracks)).toEqual(["1980-е", "2000-е", "2020-е"]);
  });

  it("фильтрует NaN", () => {
    const tracks = [
      createTrack({ _id: 1, release_date: "1995-01-01" }),
      createTrack({ _id: 2, release_date: "invalid" }),
    ];
    expect(getUniqueDecades(tracks)).toEqual(["1990-е"]);
  });
});
