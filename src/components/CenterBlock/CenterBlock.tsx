"use client";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import classNames from "classnames";
import styles from "./CenterBlock.module.css";
import { type Track } from "@/data/data";
import { formatTime } from "@/utils/formatTime";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setPlaylistAndTrack } from "@/store/slices/playerSlice";
import {
  fetchTracks,
  fetchFavorites,
  setSearchQuery,
  toggleAuthor,
  toggleGenre,
  setSortBy,
  resetFilters,
  type SortType,
} from "@/store/slices/tracksSlice";
import { getUniqueAuthors, getUniqueGenres } from "@/utils/filters";
import { LikeButton } from "@/components/LikeButton/LikeButton";

type FilterType = "author" | "year" | "genre" | null;

interface CenterBlockProps {
  initialTracks?: Track[];
  title?: string;
  isLoading?: boolean;
}

// ✅ Варианты сортировки
const SORT_OPTIONS: { value: SortType; label: string }[] = [
  { value: "default", label: "По умолчанию" },
  { value: "new", label: "Сначала новые" },
  { value: "old", label: "Сначала старые" },
];

export const CenterBlock = ({
  initialTracks,
  title,
  isLoading: externalIsLoading,
}: CenterBlockProps) => {
  // Redux
  const {
    items: reduxTracks,
    loading,
    error,
    searchQuery,
    favoritesLoaded,
    selectedAuthors,
    selectedGenres,
    sortBy,
  } = useAppSelector((state) => state.tracks);
  const { access } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  // Загружаем треки только если они не переданы через props
  useEffect(() => {
    if (!initialTracks) {
      dispatch(fetchTracks());
    }
  }, [dispatch, initialTracks]);

  // Загружаем избранное, если авторизован и ещё не загружено
  useEffect(() => {
    if (access && !favoritesLoaded) {
      dispatch(fetchFavorites());
    }
  }, [dispatch, access, favoritesLoaded]);

  // ✅ Сброс фильтров при монтировании (переходе на страницу)
  useEffect(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  // Используем переданные треки или из Redux
  const tracks = initialTracks ?? reduxTracks;

  // Приоритет: prop isLoading > Redux loading
  const isLoading =
    externalIsLoading !== undefined
      ? externalIsLoading
      : initialTracks
        ? false
        : loading;

  const displayError = initialTracks ? null : error;

  // ✅ activeFilter — локально (UI-состояние)
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);

  const filterRef = useRef<HTMLDivElement>(null);

  // ✅ useMemo — уникальные значения из НЕотфильтрованных треков
  const authors = useMemo(() => getUniqueAuthors(tracks), [tracks]);
  const genres = useMemo(() => getUniqueGenres(tracks), [tracks]);

  // ✅ useMemo — фильтрация (И между фильтрами, ИЛИ внутри)
  const filteredTracks = useMemo(() => {
    return tracks.filter((track) => {
      // Поиск — только по name, startsWith
      const matchesSearch = searchQuery.trim()
        ? track.name.toLowerCase().startsWith(searchQuery.toLowerCase().trim())
        : true;

      // Авторы (ИЛИ)
      const matchesAuthor =
        selectedAuthors.length === 0 || selectedAuthors.includes(track.author);

      // Жанры (ИЛИ)
      const matchesGenre =
        selectedGenres.length === 0 ||
        track.genre.some((g) => selectedGenres.includes(g));

      return matchesSearch && matchesAuthor && matchesGenre;
    });
  }, [tracks, searchQuery, selectedAuthors, selectedGenres]);

  // ✅ useMemo — сортировка
  const sortedTracks = useMemo(() => {
    if (sortBy === "default") {
      return filteredTracks;
    }

    const result = [...filteredTracks];

    if (sortBy === "new") {
      result.sort(
        (a, b) =>
          new Date(b.release_date).getTime() -
          new Date(a.release_date).getTime(),
      );
    } else if (sortBy === "old") {
      result.sort(
        (a, b) =>
          new Date(a.release_date).getTime() -
          new Date(b.release_date).getTime(),
      );
    }

    return result;
  }, [filteredTracks, sortBy]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setActiveFilter(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ✅ useCallback — переключение фильтра
  const toggleFilter = useCallback((filter: FilterType) => {
    setActiveFilter((prev) => (prev === filter ? null : filter));
  }, []);

  // ✅ useCallback — выбор автора/жанра (toggle)
  const handleFilterSelect = useCallback(
    (type: FilterType, value: string | number) => {
      if (type === "author") {
        dispatch(toggleAuthor(value as string));
      } else if (type === "genre") {
        dispatch(toggleGenre(value as string));
      }
      // не закрываем список — можно выбрать несколько
    },
    [dispatch],
  );

  // ✅ useCallback — сортировка
  const handleSortSelect = useCallback(
    (value: SortType) => {
      dispatch(setSortBy(value));
      setActiveFilter(null);
    },
    [dispatch],
  );

  // ✅ useCallback — очистка фильтров
  const clearFilters = useCallback(() => {
    dispatch(resetFilters());
    dispatch(setSearchQuery(""));
  }, [dispatch]);

  // ✅ useCallback — проверка активного фильтра
  const isFilterActive = useCallback(
    (type: FilterType): boolean => {
      if (type === "author") return selectedAuthors.length > 0;
      if (type === "genre") return selectedGenres.length > 0;
      if (type === "year") return sortBy !== "default";
      return false;
    },
    [selectedAuthors, selectedGenres, sortBy],
  );

  // ✅ useCallback — клик по треку
  const handleTrackClick = useCallback(
    (track: Track) => {
      dispatch(
        setPlaylistAndTrack({
          playlist: sortedTracks,
          track,
        }),
      );
    },
    [dispatch, sortedTracks],
  );

  const currentTrack = useAppSelector((state) => state.player.currentTrack);

  // ✅ useCallback — проверка активного трека
  const isTrackActive = useCallback(
    (track: Track) => {
      return currentTrack?._id === track._id;
    },
    [currentTrack],
  );

  // Заголовок — из props или "Треки"
  const displayTitle = title || "Треки";

  // ✅ Текущий выбранный вариант сортировки
  const currentSortLabel =
    SORT_OPTIONS.find((o) => o.value === sortBy)?.label || "По умолчанию";

  return (
    <div className={styles.centerblock}>
      {/* Заголовок */}
      <h2 className={styles.h2}>{displayTitle}</h2>

      {/* Фильтры */}
      <div className={styles.filter} ref={filterRef}>
        <div className={styles.filterTitle}>Искать по:</div>

        {/* Фильтр по исполнителям */}
        <div className={styles.filterWrapper}>
          <button
            className={classNames(styles.filterButton, {
              [styles.active]: activeFilter === "author",
              [styles.hasFilter]: isFilterActive("author"),
            })}
            onClick={() => toggleFilter("author")}
          >
            исполнителю
            {selectedAuthors.length > 0 && (
              <span className={styles.filterBadge}>
                {selectedAuthors.length}
              </span>
            )}
          </button>
          {activeFilter === "author" && (
            <div className={styles.filterList}>
              <div className={styles.filterListScroll}>
                <ul>
                  {authors.map((author) => (
                    <li
                      key={author}
                      className={classNames({
                        [styles.selected]: selectedAuthors.includes(author),
                      })}
                      onClick={() => handleFilterSelect("author", author)}
                    >
                      {author}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Фильтр по годам (сортировка) */}
        <div className={styles.filterWrapper}>
          <button
            className={classNames(styles.filterButton, {
              [styles.active]: activeFilter === "year",
              [styles.hasFilter]: isFilterActive("year"),
            })}
            onClick={() => toggleFilter("year")}
          >
            году выпуска
          </button>
          {activeFilter === "year" && (
            <div className={styles.filterList}>
              <div className={styles.filterListScroll}>
                <ul>
                  {SORT_OPTIONS.map((option) => (
                    <li
                      key={option.value}
                      className={classNames({
                        [styles.selected]: sortBy === option.value,
                      })}
                      onClick={() => handleSortSelect(option.value)}
                    >
                      {option.label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Фильтр по жанрам */}
        <div className={styles.filterWrapper}>
          <button
            className={classNames(styles.filterButton, {
              [styles.active]: activeFilter === "genre",
              [styles.hasFilter]: isFilterActive("genre"),
            })}
            onClick={() => toggleFilter("genre")}
          >
            жанру
            {selectedGenres.length > 0 && (
              <span className={styles.filterBadge}>
                {selectedGenres.length}
              </span>
            )}
          </button>
          {activeFilter === "genre" && (
            <div className={styles.filterList}>
              <div className={styles.filterListScroll}>
                <ul>
                  {genres.map((genre) => (
                    <li
                      key={genre}
                      className={classNames({
                        [styles.selected]: selectedGenres.includes(genre),
                      })}
                      onClick={() => handleFilterSelect("genre", genre)}
                    >
                      {genre}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Кнопка сброса всех фильтров */}
        {(selectedAuthors.length > 0 ||
          selectedGenres.length > 0 ||
          sortBy !== "default" ||
          searchQuery) && (
          <button className={styles.clearAllFilters} onClick={clearFilters}>
            Сбросить все
          </button>
        )}
      </div>

      {/* ОШИБКА ЗАГРУЗКИ */}
      {displayError && (
        <div className={styles.errorContainer}>
          <h3 className={styles.errorTitle}>Что-то пошло не так</h3>
          <p className={styles.errorText}>{displayError}</p>
          <button
            className={styles.errorButton}
            onClick={() => dispatch(fetchTracks())}
          >
            Попробовать снова
          </button>
        </div>
      )}

      {/* СКЕЛЕТОН ПРИ ЗАГРУЗКЕ */}
      {isLoading && !displayError && (
        <div className={styles.content}>
          <div className={styles.contentTitle}>
            <span className={`${styles.colHeader} ${styles.col01}`}>Трек</span>
            <span className={`${styles.colHeader} ${styles.col02}`}>
              Исполнитель
            </span>
            <span className={`${styles.colHeader} ${styles.col03}`}>
              Альбом
            </span>
            <span className={`${styles.colHeader} ${styles.col04}`}>
              <svg className={styles.colSvg}>
                <use xlinkHref="/img/icon/sprite.svg#icon-watch"></use>
              </svg>
            </span>
          </div>

          <div className={styles.contentPlaylist}>
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className={styles.skeletonItem}>
                <div className={`${styles.skeletonTitle} ${styles.col01}`}>
                  <div className={styles.skeletonImage}></div>
                  <div
                    className={`${styles.skeletonBar} ${styles.skeletonBarTitle}`}
                  ></div>
                </div>
                <div
                  className={`${styles.skeletonBar} ${styles.skeletonBarAuthor}`}
                ></div>
                <div
                  className={`${styles.skeletonBar} ${styles.skeletonBarAlbum}`}
                ></div>
                <div
                  className={`${styles.skeletonBar} ${styles.skeletonBarTime}`}
                ></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* СПИСОК ТРЕКОВ */}
      {!isLoading && !displayError && (
        <>
          <div className={styles.content}>
            <div className={styles.contentTitle}>
              <span className={`${styles.colHeader} ${styles.col01}`}>
                Трек
              </span>
              <span className={`${styles.colHeader} ${styles.col02}`}>
                Исполнитель
              </span>
              <span className={`${styles.colHeader} ${styles.col03}`}>
                Альбом
              </span>
              <span className={`${styles.colHeader} ${styles.col04}`}>
                <svg className={styles.colSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-watch"></use>
                </svg>
              </span>
            </div>

            <div className={styles.contentPlaylist}>
              {sortedTracks.length === 0 ? (
                <div className={styles.noTracks}>
                  <p>Нет подходящих треков</p>
                  <button onClick={clearFilters}>Сбросить фильтры</button>
                </div>
              ) : (
                sortedTracks.map((track) => (
                  <div
                    key={track._id}
                    className={styles.playlistItem}
                    onClick={() => handleTrackClick(track)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className={styles.playlistTrack}>
                      <div className={`${styles.trackTitle} ${styles.col01}`}>
                        <div className={styles.trackTitleImage}>
                          {isTrackActive(track) ? (
                            <span className={styles.activeDot}></span>
                          ) : (
                            <svg className={styles.trackTitleSvg}>
                              <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
                            </svg>
                          )}
                        </div>
                        <div>
                          <a className={styles.trackTitleLink} href="#">
                            {track.name}
                          </a>
                        </div>
                      </div>
                      <div className={`${styles.trackAuthor} ${styles.col02}`}>
                        <a className={styles.trackAuthorLink} href="#">
                          {track.author}
                        </a>
                      </div>
                      <div className={`${styles.trackAlbum} ${styles.col03}`}>
                        <a className={styles.trackAlbumLink} href="#">
                          {track.album}
                        </a>
                      </div>
                      <div className={styles.trackTime}>
                        <LikeButton track={track} size="small" />
                        <span className={styles.trackTimeText}>
                          {formatTime(track.duration_in_seconds)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
