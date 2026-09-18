import styles from "./loading.module.css";

export default function MusicLoading() {
  return (
    <div className={styles.container}>
      {/* Заголовок */}
      <div className={styles.skeletonHeader}></div>

      {/* Фильтры */}
      <div className={styles.skeletonFilters}>
        <div className={styles.skeletonFilterButton}></div>
        <div className={styles.skeletonFilterButton}></div>
        <div className={styles.skeletonFilterButton}></div>
      </div>

      {/* Список треков */}
      <div className={styles.skeletonList}>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className={styles.skeletonItem}>
            <div className={styles.skeletonImage}></div>
            <div className={styles.skeletonBarTitle}></div>
            <div className={styles.skeletonBarAuthor}></div>
            <div className={styles.skeletonBarAlbum}></div>
            <div className={styles.skeletonBarTime}></div>
          </div>
        ))}
      </div>
    </div>
  );
}
