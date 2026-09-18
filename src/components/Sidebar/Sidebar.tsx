"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Sidebar.module.css";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSelections } from "@/store/slices/selectionsSlice";

// Три картинки по порядку
const PLAYLIST_IMAGES = [
  "/img/playlist01.png",
  "/img/playlist02.png",
  "/img/playlist03.png",
];

export const Sidebar = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.selections);

  // Загружаем подборки при монтировании
  useEffect(() => {
    dispatch(fetchSelections());
  }, [dispatch]);

  // Оставляем первые 3 с непустым items
  const displayedSelections = items
    .filter((selection) => selection.items.length > 0)
    .slice(0, 3);

  return (
    <div className={styles.sidebar}>
      {/* Профиль пользователя */}
      <div className={styles.personal}>
        <p className={styles.personalName}>Sergey.Ivanov</p>
        <div className={styles.personalIcon}>
          <svg>
            <use xlinkHref="/img/icon/sprite.svg#logout"></use>
          </svg>
        </div>
      </div>

      {/* Блок с плейлистами */}
      <div className={styles.block}>
        <div className={styles.list}>
          {/* Скелетон при загрузке */}
          {loading && (
            <>
              {[0, 1, 2].map((i) => (
                <div key={i} className={styles.item}>
                  <div className={styles.skeletonCard}></div>
                </div>
              ))}
            </>
          )}

          {/* Ошибка */}
          {error && !loading && (
            <div className={styles.errorMessage}>
              <p>Не удалось загрузить подборки</p>
              <button
                className={styles.retryButton}
                onClick={() => dispatch(fetchSelections())}
              >
                Попробовать снова
              </button>
            </div>
          )}

          {/* Подборки */}
          {!loading &&
            !error &&
            displayedSelections.map((selection, index) => (
              <div key={selection._id} className={styles.item}>
                <Link
                  href={`/music/category/${selection._id}`}
                  className={styles.link}
                >
                  <Image
                    className={styles.img}
                    src={PLAYLIST_IMAGES[index % PLAYLIST_IMAGES.length]}
                    alt={selection.name || "Подборка"}
                    width={250}
                    height={150}
                  />
                </Link>
              </div>
            ))}

          {/* Если подборок нет */}
          {!loading && !error && displayedSelections.length === 0 && (
            <p className={styles.emptyMessage}>Подборки не найдены</p>
          )}
        </div>
      </div>
    </div>
  );
};
