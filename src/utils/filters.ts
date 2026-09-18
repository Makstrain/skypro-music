import { type Track } from "@/data/data";

export const getUniqueAuthors = (tracks: Track[] = []): string[] => {
  const authors = tracks.map((track) => track.author);
  return [...new Set(authors)];
};

export const getUniqueGenres = (tracks: Track[] = []): string[] => {
  const genres = tracks.flatMap((track) => track.genre);
  return [...new Set(genres)];
};

export const getUniqueYears = (tracks: Track[] = []): number[] => {
  const years = tracks
    .map((track) => new Date(track.release_date).getFullYear())
    .filter((year) => !isNaN(year));
  return [...new Set(years)].sort((a, b) => b - a);
};

export const getUniqueDecades = (tracks: Track[] = []): string[] => {
  const years = tracks
    .map((track) => new Date(track.release_date).getFullYear())
    .filter((year) => !isNaN(year));
  const decades = years.map((year) => `${Math.floor(year / 10) * 10}-е`);
  return [...new Set(decades)].sort();
};
