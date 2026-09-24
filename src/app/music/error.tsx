"use client";

import { useEffect } from "react";
import styles from "./error.module.css";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function MusicError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Ошибка в /music:", error);
  }, [error]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Что-то пошло не так!</h2>
      <p className={styles.text}>
        {error.message || "Произошла непредвиденная ошибка"}
      </p>
      <button className={styles.button} onClick={reset}>
        Попробовать снова
      </button>
    </div>
  );
}
