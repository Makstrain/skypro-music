import Link from "next/link";
import styles from "./Player.module.css";

export const Player = () => {
  return (
    <div className={styles.bar}>
      <div className={styles.content}>
        {/* Прогресс-бар */}
        <div className={styles.playerProgress}></div>

        <div className={styles.playerBlock}>
          {/* Левая часть: кнопки управления */}
          <div className={styles.player}>
            <div className={styles.controls}>
              <div className={styles.controlBtn}>
                <svg className={styles.controlBtnSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-prev"></use>
                </svg>
              </div>
              <div className={`${styles.controlBtn} ${styles.controlBtnPlay}`}>
                <svg className={styles.controlBtnPlaySvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-play"></use>
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
                  <svg className={styles.trackPlaySvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
                  </svg>
                </div>
                <div className={styles.trackPlayAuthor}>
                  <Link
                    href="/artist/basta"
                    className={styles.trackPlayAuthorLink}
                  >
                    Ты та...
                  </Link>
                </div>
                <div className={styles.trackPlayAlbum}>
                  <Link
                    href="/album/basta"
                    className={styles.trackPlayAlbumLink}
                  >
                    Баста
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
                  name="range"
                  min="0"
                  max="100"
                  defaultValue="50"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
