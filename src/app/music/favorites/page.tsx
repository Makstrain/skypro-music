// src/app/music/favorites/page.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CenterBlock } from "@/components/CenterBlock/CenterBlock";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchFavorites } from "@/store/slices/tracksSlice";

export default function FavoritesPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { access } = useAppSelector((state) => state.auth);
  const { favoriteTracks, favoritesLoading, favoritesError } = useAppSelector(
    (state) => state.tracks,
  );

  // Редирект неавторизованных
  useEffect(() => {
    if (!access) {
      router.push("/auth/signin");
    }
  }, [access, router]);

  // Загрузка избранного
  useEffect(() => {
    if (access) {
      dispatch(fetchFavorites());
    }
  }, [access, dispatch]);

  // Пока идёт редирект — ничего не рендерим
  if (!access) {
    return null;
  }

  // ✅ Ошибка
  if (favoritesError) {
    return (
      <div className="centerColumn">
        <div style={{ padding: "60px 20px", textAlign: "center" }}>
          <h3 style={{ marginBottom: "20px", color: "#ffffff" }}>
            Что-то пошло не так
          </h3>
          <p style={{ marginBottom: "20px", color: "#696969" }}>
            {favoritesError}
          </p>
          <button
            onClick={() => dispatch(fetchFavorites())}
            style={{
              padding: "12px 32px",
              background: "#580ea2",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  // ✅ Список избранного (со скелетоном через isLoading)
  return (
    <CenterBlock
      initialTracks={favoriteTracks}
      title="Мои треки"
      isLoading={favoritesLoading}
    />
  );
}
