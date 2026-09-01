"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "./Player.module.css";
import { data, type Track } from "@/data/data";

// Функция для форматирования времени
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const Player = () => {
  // Берем первый трек из данных для примера
  const [currentTrack] = useState<Track>(data[0]);
  // Состояние для воспроизведения
  const [isPlaying, setIsPlaying] = useState(false);
  // Состояние для громкости
  const [volume, setVolume] = useState(50);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
  };

  return (
    <div className={styles.bar}>
      <div className={styles.content}>
        {/* Прогресс-бар */}
        <div className={styles.playerProgress}>
          <input
            type="range"
            className={styles.progressLine}
            min="0"
            max="100"
            defaultValue="0"
          />
        </div>

        <div className={styles.playerBlock}>
          {/* Левая часть: кнопки управления */}
          <div className={styles.player}>
            <div className={styles.controls}>
              <div className={styles.controlBtn}>
                <svg className={styles.controlBtnSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-prev"></use>
                </svg>
              </div>
              <div
                className={`${styles.controlBtn} ${styles.controlBtnPlay}`}
                onClick={togglePlay}
              >
                <svg className={styles.controlBtnPlaySvg}>
                  <use
                    xlinkHref={`/img/icon/sprite.svg#${isPlaying ? "icon-pause" : "icon-play"}`}
                  ></use>
                </svg>
              </div>
              <div className={styles.controlBtn}>
                <svg className={styles.controlBtnSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-next"></use>
                </svg>
              </div>
              <div className={styles.controlBtn}>
                <svg className={styles.controlBtnSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-repeat"></use>
                </svg>
              </div>
              <div className={styles.controlBtn}>
                <svg className={styles.controlBtnSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-shuffle"></use>
                </svg>
              </div>
            </div>

            {/* Центральная часть: текущий трек */}
            <div className={styles.trackPlay}>
              <div className={styles.trackPlayContain}>
                <div className={styles.trackPlayImage}>
                  {currentTrack.logo ? (
                    <img
                      src={currentTrack.logo}
                      alt={currentTrack.name}
                      width={51}
                      height={51}
                    />
                  ) : (
                    <svg className={styles.trackPlaySvg}>
                      <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
                    </svg>
                  )}
                </div>
                <div className={styles.trackPlayAuthor}>
                  <Link href="#" className={styles.trackPlayAuthorLink}>
                    {currentTrack.name}
                  </Link>
                </div>
                <div className={styles.trackPlayAlbum}>
                  <Link href="#" className={styles.trackPlayAlbumLink}>
                    {currentTrack.author}
                  </Link>
                </div>
              </div>

              {/* Лайк / Дизлайк */}
              <div className={styles.trackPlayLikeDis}>
                <div className={styles.likeBtn}>
                  <svg className={styles.likeSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
                  </svg>
                </div>
                <div className={styles.dislikeBtn}>
                  <svg className={styles.dislikeSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-dislike"></use>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Правая часть: громкость */}
          <div className={styles.volumeBlock}>
            <div className={styles.volumeContent}>
              <div className={styles.volumeImage}>
                <svg className={styles.volumeSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-volume"></use>
                </svg>
              </div>
              <div className={styles.volumeProgress}>
                <input
                  className={styles.volumeProgressLine}
                  type="range"
                  name="volume"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
