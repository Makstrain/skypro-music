"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./Sidebar.module.css";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSelections } from "@/store/slices/selectionsSlice";
import { logout } from "@/store/slices/authSlice";
import { useIsMounted } from "@/hooks/useIsMounted";

// Три картинки по порядку
const PLAYLIST_IMAGES = [
  "/img/playlist01.png",
  "/img/playlist02.png",
  "/img/playlist03.png",
];

export const Sidebar = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { items, loading, error } = useAppSelector((state) => state.selections);
  const { access } = useAppSelector((state) => state.auth);
  const isMounted = useIsMounted();

  // Загружаем подборки при монтировании
  useEffect(() => {
    dispatch(fetchSelections());
  }, [dispatch]);

  //  Выход
  const handleLogout = () => {
    dispatch(logout());
    router.push("/auth/signin");
  };

  // Оставляем первые 3 с непустым items
  const displayedSelections = items
    .filter((selection) => selection.items.length > 0)
    .sort((a, b) => a._id - b._id)
    .slice(0, 3);

  return (
    <div className={styles.sidebar}>
      {/*  Кнопка выхода — только для авторизованных */}
      {isMounted && access && (
        <div className={styles.logoutBlock}>
          <div className={styles.logoutIcon} onClick={handleLogout}>
            <Image
              src="/img/icon/logout.svg"
              alt="Выйти"
              width={20}
              height={20}
            />
          </div>
        </div>
      )}

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
