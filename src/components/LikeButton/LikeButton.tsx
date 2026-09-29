"use client";

import classNames from "classnames";
import styles from "./LikeButton.module.css";
import { useLikeTrack } from "@/hooks/useLikeTrack";
import { Track } from "@/data/data";

interface LikeButtonProps {
  track: Track | null;
  size?: "small" | "large";
}

export const LikeButton = ({ track, size = "small" }: LikeButtonProps) => {
  const { isLike, isLoading, errorMsg, toggleLike } = useLikeTrack(track);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLike();
  };

  return (
    <div className={styles.wrapper} onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        className={classNames(styles.likeBtn, styles[size], {
          [styles.liked]: isLike,
          [styles.loading]: isLoading,
        })}
        onClick={handleClick}
        disabled={isLoading}
        aria-label={isLike ? "Убрать из избранного" : "Добавить в избранное"}
      >
        <svg className={styles.likeSvg}>
          <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
        </svg>
      </button>

      {errorMsg && <span className={styles.tooltip}>{errorMsg}</span>}
    </div>
  );
};
