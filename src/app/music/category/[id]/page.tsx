// src/app/music/category/[id]/page.tsx

import { notFound } from "next/navigation";
import { getSelectionById } from "@/api/selections";
import { getTracks } from "@/api/tracks";
import { CenterBlock } from "@/components/CenterBlock/CenterBlock";

interface CategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params;

  let selection;
  let allTracks;

  try {
    [selection, allTracks] = await Promise.all([
      getSelectionById(id),
      getTracks(),
    ]);
  } catch (error) {
    if (error instanceof Error && error.message === "NOT_FOUND") {
      notFound();
    }
    throw error;
  }

  // Фильтруем треки: оставляем только те, чей _id есть в selection.items
  const selectionTracks = allTracks.filter((track) =>
    selection.items.includes(track._id),
  );

  // Сохраняем порядок из items
  const orderedTracks = selection.items
    .map((trackId) => selectionTracks.find((t) => t._id === trackId))
    .filter((t): t is NonNullable<typeof t> => t !== undefined);

  // Название подборки (или "Подборка")
  const title = selection.name || "Подборка";

  return <CenterBlock initialTracks={orderedTracks} title={title} />;
}
