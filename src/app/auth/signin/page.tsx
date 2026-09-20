"use client";
// src/app/auth/signin/page.tsx

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import classNames from "classnames";
import styles from "./signin.module.css";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { signinThunk, clearError } from "@/store/slices/authSlice";

export default function Signin() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { access, loading, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Если уже авторизован — редирект на главную
  useEffect(() => {
    if (access) {
      router.push("/music/main");
    }
  }, [access, router]);

  // Очищаем ошибку при размонтировании
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      return;
    }

    dispatch(signinThunk({ email: email.trim(), password }));
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        className={classNames(styles.modal__input, styles.login)}
        type="email"
        name="email"
        placeholder="Почта"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
        required
      />
      <input
        className={styles.modal__input}
        type="password"
        name="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
        required
      />

      {/* Ошибка */}
      <div className={styles.errorContainer}>
        {error && <span>{error}</span>}
      </div>

      <button
        type="submit"
        className={styles.modal__btnEnter}
        disabled={loading}
      >
        {loading ? "Вход..." : "Войти"}
      </button>

      <Link href="/auth/signup" className={styles.modal__btnSignup}>
        Зарегистрироваться
      </Link>
    </form>
  );
}
