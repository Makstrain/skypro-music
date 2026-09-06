"use client";
import { useRef, useEffect } from "react";
import Link from "next/link";
import styles from "./Player.module.css";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  togglePlay,
  setCurrentTime,
  setDuration,
  setVolume,
} from "@/store/slices/playerSlice";

export const Player = () => {
  const dispatch = useAppDispatch();
  const currentTrack = useAppSelector((state) => state.player.currentTrack);
  const isPlaying = useAppSelector((state) => state.player.isPlaying);
  const volume = useAppSelector((state) => state.player.volume);
  const currentTime = useAppSelector((state) => state.player.currentTime);
  const duration = useAppSelector((state) => state.player.duration);

  const audioRef = useRef<HTMLAudioElement>(null);
  const isReadyRef = useRef(false);

  // Сброс флага при смене трека
  useEffect(() => {
    isReadyRef.current = false;
  }, [currentTrack]);

  //  СИНХРОНИЗАЦИЯ ГРОМКОСТИ
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // ПРИ СМЕНЕ ТРЕКА — ОБНОВЛЯЕМ АУДИО
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      const audio = audioRef.current;
      audio.src = currentTrack.track_file;
      audio.load();
    }
  }, [currentTrack]);

  // Управление воспроизведением
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleCanPlay = () => {
      isReadyRef.current = true;
      if (isPlaying) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            if (error.name === "AbortError") {
              console.log("Playback was interrupted");
            } else {
              console.error("Playback error:", error);
            }
          });
        }
      }
    };

    audio.addEventListener("canplay", handleCanPlay);
    return () => {
      audio.removeEventListener("canplay", handleCanPlay);
    };
  }, [currentTrack, isPlaying]);

  // Основной эффект для play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      if (isReadyRef.current) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            if (error.name === "AbortError") {
              console.log("Playback was interrupted");
            } else {
              console.error("Playback error:", error);
            }
          });
        }
      }
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // ПОДПИСКА НА СОБЫТИЯ АУДИО
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      dispatch(setCurrentTime(audio.currentTime));
    };

    const handleLoadedMetadata = () => {
      dispatch(setDuration(audio.duration));
    };

    const handleEnded = () => {
      dispatch(togglePlay());
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [dispatch]);

  //  ОБРАБОТЧИК ГРОМКОСТИ
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    dispatch(setVolume(newVolume)); // ← ОТПРАВЛЯЕМ В REDUX
  };

  // ОБРАБОТЧИК ПРОГРЕССА
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      dispatch(setCurrentTime(newTime));
    }
  };

  const handleTogglePlay = () => {
    dispatch(togglePlay());
  };

  return (
    <div className={styles.bar}>
      <div className={styles.content}>
        <audio ref={audioRef} style={{ display: "none" }} />

        {/* ПРОГРЕСС-БАР */}
        <div className={styles.playerProgress}>
          <input
            type="range"
            className={styles.progressLine}
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleProgressChange}
          />
        </div>

        <div className={styles.playerBlock}>
          <div className={styles.player}>
            <div className={styles.controls}>
              <div className={styles.controlBtn}>
                <svg className={styles.controlBtnSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-prev"></use>
                </svg>
              </div>
              <div
                className={`${styles.controlBtn} ${styles.controlBtnPlay}`}
                onClick={handleTogglePlay}
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

            <div className={styles.trackPlay}>
              <div className={styles.trackPlayContain}>
                <div className={styles.trackPlayImage}>
                  {currentTrack?.logo ? (
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
                    {currentTrack?.name || "Не выбрано"}
                  </Link>
                </div>
                <div className={styles.trackPlayAlbum}>
                  <Link href="#" className={styles.trackPlayAlbumLink}>
                    {currentTrack?.author || ""}
                  </Link>
                </div>
              </div>

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

          {/*  ГРОМКОСТЬ */}
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
