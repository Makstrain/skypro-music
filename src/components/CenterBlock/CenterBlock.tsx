"use client";
import { useState, useRef, useEffect } from "react";
import classNames from "classnames";
import styles from "./CenterBlock.module.css";
import { type Track } from "@/data/data";
import { formatTime } from "@/utils/formatTime";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setPlaylistAndTrack } from "@/store/slices/playerSlice";
import { fetchTracks } from "@/store/slices/tracksSlice";
import {
  getUniqueAuthors,
  getUniqueGenres,
  getUniqueYears,
} from "@/utils/filters";

type FilterType = "author" | "year" | "genre" | null;

interface CenterBlockProps {
  initialTracks?: Track[];
  title?: string;
}

export const CenterBlock = ({ initialTracks, title }: CenterBlockProps) => {
  // ✅ Redux
  const {
    items: reduxTracks,
    loading,
    error,
  } = useAppSelector((state) => state.tracks);
  const dispatch = useAppDispatch();

  // ✅ Загружаем треки только если они не переданы через props
  useEffect(() => {
    if (!initialTracks) {
      dispatch(fetchTracks());
    }
  }, [dispatch, initialTracks]);

  // ✅ Используем переданные треки или из Redux
  const tracks = initialTracks ?? reduxTracks;
  const isLoading = initialTracks ? false : loading;
  const displayError = initialTracks ? null : error;

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const filterRef = useRef<HTMLDivElement>(null);

  // ✅ Уникальные значения — из текущих треков
  const authors = getUniqueAuthors(tracks);
  const genres = getUniqueGenres(tracks);
  const years = getUniqueYears(tracks);

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

  const toggleFilter = (filter: FilterType) => {
    if (activeFilter === filter) {
      setActiveFilter(null);
    } else {
      setActiveFilter(filter);
    }
  };

  const filteredTracks = tracks.filter((track) => {
    const matchesSearch =
      track.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.author.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAuthor = selectedAuthor
      ? track.author === selectedAuthor
      : true;
    const matchesGenre = selectedGenre
      ? track.genre.includes(selectedGenre)
      : true;
    const matchesYear = selectedYear
      ? new Date(track.release_date).getFullYear() === selectedYear
      : true;

    return matchesSearch && matchesAuthor && matchesGenre && matchesYear;
  });

  const handleFilterSelect = (type: FilterType, value: string | number) => {
    if (type === "author") {
      setSelectedAuthor(selectedAuthor === value ? null : (value as string));
    } else if (type === "genre") {
      setSelectedGenre(selectedGenre === value ? null : (value as string));
    } else if (type === "year") {
      setSelectedYear(selectedYear === value ? null : (value as number));
    }
    setActiveFilter(null);
  };

  const clearFilters = () => {
    setSelectedAuthor(null);
    setSelectedGenre(null);
    setSelectedYear(null);
    setSearchQuery("");
  };

  const isFilterActive = (type: FilterType): boolean => {
    if (type === "author") return selectedAuthor !== null;
    if (type === "genre") return selectedGenre !== null;
    if (type === "year") return selectedYear !== null;
    return false;
  };

  const handleTrackClick = (track: Track) => {
    dispatch(
      setPlaylistAndTrack({
        playlist: filteredTracks,
        track,
      }),
    );
  };

  const currentTrack = useAppSelector((state) => state.player.currentTrack);
  const isTrackActive = (track: Track) => {
    return currentTrack?._id === track._id;
  };

  // ✅ Заголовок — из props или "Треки"
  const displayTitle = title || "Треки";

  return (
    <div className={styles.centerblock}>
      {/* Поиск */}
      <div className={styles.search}>
        <svg className={styles.searchSvg}>
          <use xlinkHref="/img/icon/sprite.svg#icon-search"></use>
        </svg>
        <input
          className={styles.searchText}
          type="search"
          placeholder="Поиск"
          name="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            className={styles.clearSearch}
            onClick={() => setSearchQuery("")}
          >
            ✕
          </button>
        )}
      </div>

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
            {selectedAuthor && (
              <span
                className={styles.filterBadge}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedAuthor(null);
                }}
              >
                ✕
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
                        [styles.selected]: selectedAuthor === author,
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

        {/* Фильтр по годам */}
        <div className={styles.filterWrapper}>
          <button
            className={classNames(styles.filterButton, {
              [styles.active]: activeFilter === "year",
              [styles.hasFilter]: isFilterActive("year"),
            })}
            onClick={() => toggleFilter("year")}
          >
            году выпуска
            {selectedYear && (
              <span
                className={styles.filterBadge}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedYear(null);
                }}
              >
                {selectedYear}
              </span>
            )}
          </button>
          {activeFilter === "year" && (
            <div className={styles.filterList}>
              <div className={styles.filterListScroll}>
                <ul>
                  {years.map((year) => (
                    <li
                      key={year}
                      className={classNames({
                        [styles.selected]: selectedYear === year,
                      })}
                      onClick={() => handleFilterSelect("year", year)}
                    >
                      {year}
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
            {selectedGenre && (
              <span
                className={styles.filterBadge}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedGenre(null);
                }}
              >
                ✕
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
                        [styles.selected]: selectedGenre === genre,
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
        {(selectedAuthor || selectedGenre || selectedYear || searchQuery) && (
          <button className={styles.clearAllFilters} onClick={clearFilters}>
            Сбросить все
          </button>
        )}
      </div>

      {/* ✅ ОШИБКА ЗАГРУЗКИ */}
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

      {/* ✅ СКЕЛЕТОН ПРИ ЗАГРУЗКЕ */}
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

      {/* ✅ СПИСОК ТРЕКОВ */}
      {!isLoading && !displayError && (
        <>
          <div className={styles.tracksCount}>
            Найдено: {filteredTracks.length}{" "}
            {filteredTracks.length === 1 ? "трек" : "треков"}
          </div>

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
              {filteredTracks.length === 0 ? (
                <div className={styles.noTracks}>
                  <p>Треки не найдены</p>
                  <button onClick={clearFilters}>Сбросить фильтры</button>
                </div>
              ) : (
                filteredTracks.map((track) => (
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
                        <svg className={styles.trackTimeSvg}>
                          <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
                        </svg>
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
