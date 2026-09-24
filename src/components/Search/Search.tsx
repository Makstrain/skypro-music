"use client";

import styles from "./Search.module.css";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSearchQuery } from "@/store/slices/tracksSlice";

export const Search = () => {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector((state) => state.tracks.searchQuery);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleClear = () => {
    dispatch(setSearchQuery(""));
  };

  return (
    <div className={styles.searchWrapper}>
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
          onChange={handleChange}
        />
        {searchQuery && (
          <button className={styles.clearSearch} onClick={handleClear}>
            ✕
          </button>
        )}
      </div>
    </div>
  );
};
