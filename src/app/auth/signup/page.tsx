"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import classNames from "classnames";
import styles from "./signup.module.css";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { signupThunk, clearError } from "@/store/slices/authSlice";

export default function Signup() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { loading, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      dispatch(clearError());
      setLocalError(null);
    };
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Валидация
    if (
      !email.trim() ||
      !username.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setLocalError("Заполните все поля");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Пароли не совпадают");
      return;
    }

    if (password.length < 6) {
      setLocalError("Пароль должен быть минимум 6 символов");
      return;
    }

    if (username.length < 3) {
      setLocalError("Имя пользователя должно быть минимум 3 символа");
      return;
    }

    setLocalError(null);

    const result = await dispatch(
      signupThunk({
        email: email.trim(),
        password,
        username: username.trim(), // ✅ теперь отдельное поле
      }),
    );

    if (signupThunk.fulfilled.match(result)) {
      router.push("/auth/signin");
    }
  };

  const displayError = localError || error;

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
        type="text"
        name="username"
        placeholder="Имя пользователя"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        disabled={loading}
        required
        minLength={3}
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
        minLength={6}
      />
      <input
        className={styles.modal__input}
        type="password"
        name="confirmPassword"
        placeholder="Повторите пароль"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        disabled={loading}
        required
      />

      <div className={styles.errorContainer}>
        {displayError && <span>{displayError}</span>}
      </div>

      <button
        type="submit"
        className={styles.modal__btnSignupEnt}
        disabled={loading}
      >
        {loading ? "Регистрация..." : "Зарегистрироваться"}
      </button>
    </form>
  );
}
