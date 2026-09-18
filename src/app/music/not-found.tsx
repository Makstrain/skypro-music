// src/app/music/not-found.tsx
import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.text}>Страница не найдена</p>
      <Link href="/music/main" className={styles.link}>
        Вернуться на главную
      </Link>
    </div>
  );
}
