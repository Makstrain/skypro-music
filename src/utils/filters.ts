import { data, type Track } from "@/data/data";

// Получить уникальных авторов
export const getUniqueAuthors = (): string[] => {
  const authors = data.map((track) => track.author);
  return [...new Set(authors)];
};

// Получить уникальные жанры (из массива genre)
export const getUniqueGenres = (): string[] => {
  const genres = data.flatMap((track) => track.genre);
  return [...new Set(genres)];
};

// Получить уникальные годы из release_date
export const getUniqueYears = (): number[] => {
  const years = data.map((track) => new Date(track.release_date).getFullYear());
  return [...new Set(years)].sort((a, b) => b - a); // Сортировка по убыванию
};

// Получить уникальные десятилетия (для группировки по годам)
export const getUniqueDecades = (): string[] => {
  const years = data.map((track) => new Date(track.release_date).getFullYear());
  const decades = years.map((year) => `${Math.floor(year / 10) * 10}-е`);
  return [...new Set(decades)].sort();
};
