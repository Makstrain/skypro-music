import styles from "./CenterBlock.module.css";

export const CenterBlock = () => {
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
        />
      </div>

      {/* Заголовок */}
      <h2 className={styles.h2}>Треки</h2>

      {/* Фильтры */}
      <div className={styles.filter}>
        <div className={styles.filterTitle}>Искать по:</div>
        <button className={styles.filterButton}>исполнителю</button>
        <button className={styles.filterButton}>году выпуска</button>
        <button className={styles.filterButton}>жанру</button>
      </div>

      {/* Список треков */}
      <div className={styles.content}>
        {/* Заголовки колонок */}
        <div className={styles.contentTitle}>
          <span className={`${styles.colHeader} ${styles.col01}`}>Трек</span>
          <span className={`${styles.colHeader} ${styles.col02}`}>
            Исполнитель
          </span>
          <span className={`${styles.colHeader} ${styles.col03}`}>Альбом</span>
          <span className={`${styles.colHeader} ${styles.col04}`}>
            <svg className={styles.colSvg}>
              <use xlinkHref="/img/icon/sprite.svg#icon-watch"></use>
            </svg>
          </span>
        </div>

        {/* Список */}
        <div className={styles.contentPlaylist}>
          {/* Трек 1 */}
          <div className={styles.playlistItem}>
            <div className={styles.playlistTrack}>
              <div className={`${styles.trackTitle} ${styles.col01}`}>
                <div className={styles.trackTitleImage}>
                  <svg className={styles.trackTitleSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
                  </svg>
                </div>
                <div>
                  <a className={styles.trackTitleLink} href="#">
                    Guilt <span className={styles.trackTitleSpan}></span>
                  </a>
                </div>
              </div>
              <div className={`${styles.trackAuthor} ${styles.col02}`}>
                <a className={styles.trackAuthorLink} href="#">
                  Nero
                </a>
              </div>
              <div className={`${styles.trackAlbum} ${styles.col03}`}>
                <a className={styles.trackAlbumLink} href="#">
                  Welcome Reality
                </a>
              </div>
              <div className={styles.trackTime}>
                <svg className={styles.trackTimeSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
                </svg>
                <span className={styles.trackTimeText}>4:44</span>
              </div>
            </div>
          </div>

          {/* Трек 2 */}
          <div className={styles.playlistItem}>
            <div className={styles.playlistTrack}>
              <div className={`${styles.trackTitle} ${styles.col01}`}>
                <div className={styles.trackTitleImage}>
                  <svg className={styles.trackTitleSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
                  </svg>
                </div>
                <div>
                  <a className={styles.trackTitleLink} href="#">
                    Elektro <span className={styles.trackTitleSpan}></span>
                  </a>
                </div>
              </div>
              <div className={`${styles.trackAuthor} ${styles.col02}`}>
                <a className={styles.trackAuthorLink} href="#">
                  Dynoro, Outwork, Mr. Gee
                </a>
              </div>
              <div className={`${styles.trackAlbum} ${styles.col03}`}>
                <a className={styles.trackAlbumLink} href="#">
                  Elektro
                </a>
              </div>
              <div className={styles.trackTime}>
                <svg className={styles.trackTimeSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
                </svg>
                <span className={styles.trackTimeText}>2:22</span>
              </div>
            </div>
          </div>

          {/* Трек 3 */}
          <div className={styles.playlistItem}>
            <div className={styles.playlistTrack}>
              <div className={`${styles.trackTitle} ${styles.col01}`}>
                <div className={styles.trackTitleImage}>
                  <svg className={styles.trackTitleSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
                  </svg>
                </div>
                <div>
                  <a className={styles.trackTitleLink} href="#">
                    I&apos;m Fire{" "}
                    <span className={styles.trackTitleSpan}></span>
                  </a>
                </div>
              </div>
              <div className={`${styles.trackAuthor} ${styles.col02}`}>
                <a className={styles.trackAuthorLink} href="#">
                  Ali Bakgor
                </a>
              </div>
              <div className={`${styles.trackAlbum} ${styles.col03}`}>
                <a className={styles.trackAlbumLink} href="#">
                  I&apos;m Fire
                </a>
              </div>
              <div className={styles.trackTime}>
                <svg className={styles.trackTimeSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
                </svg>
                <span className={styles.trackTimeText}>2:22</span>
              </div>
            </div>
          </div>

          {/* Трек 4 */}
          <div className={styles.playlistItem}>
            <div className={styles.playlistTrack}>
              <div className={`${styles.trackTitle} ${styles.col01}`}>
                <div className={styles.trackTitleImage}>
                  <svg className={styles.trackTitleSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
                  </svg>
                </div>
                <div>
                  <a className={styles.trackTitleLink} href="#">
                    Non Stop{" "}
                    <span className={styles.trackTitleSpan}>(Remix)</span>
                  </a>
                </div>
              </div>
              <div className={`${styles.trackAuthor} ${styles.col02}`}>
                <a className={styles.trackAuthorLink} href="#">
                  Стоункат, Psychopath
                </a>
              </div>
              <div className={`${styles.trackAlbum} ${styles.col03}`}>
                <a className={styles.trackAlbumLink} href="#">
                  Non Stop
                </a>
              </div>
              <div className={styles.trackTime}>
                <svg className={styles.trackTimeSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
                </svg>
                <span className={styles.trackTimeText}>4:12</span>
              </div>
            </div>
          </div>

          {/* Трек 5 */}
          <div className={styles.playlistItem}>
            <div className={styles.playlistTrack}>
              <div className={`${styles.trackTitle} ${styles.col01}`}>
                <div className={styles.trackTitleImage}>
                  <svg className={styles.trackTitleSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
                  </svg>
                </div>
                <div>
                  <a className={styles.trackTitleLink} href="#">
                    Run Run{" "}
                    <span className={styles.trackTitleSpan}>(feat. AR/CO)</span>
                  </a>
                </div>
              </div>
              <div className={`${styles.trackAuthor} ${styles.col02}`}>
                <a className={styles.trackAuthorLink} href="#">
                  Jaded, Will Clarke, AR/CO
                </a>
              </div>
              <div className={`${styles.trackAlbum} ${styles.col03}`}>
                <a className={styles.trackAlbumLink} href="#">
                  Run Run
                </a>
              </div>
              <div className={styles.trackTime}>
                <svg className={styles.trackTimeSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
                </svg>
                <span className={styles.trackTimeText}>2:54</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
