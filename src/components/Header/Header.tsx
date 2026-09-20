"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./Header.module.css";
import { useState, useRef, useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";

export const Header = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const menuRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLDivElement>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // ✅ Выход
  const handleLogout = () => {
    dispatch(logout());
    closeMenu();
    router.push("/auth/signin");
  };

  // Закрытие при клике вне меню
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        burgerRef.current &&
        !burgerRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <Image
          src="/img/logo.png"
          alt="logo"
          width={113}
          height={17}
          className={styles.logoImage}
          priority
        />
      </div>
      <div className={styles.burger} onClick={toggleMenu} ref={burgerRef}>
        <span className={styles.burgerLine}></span>
        <span className={styles.burgerLine}></span>
        <span className={styles.burgerLine}></span>
      </div>

      {/* Меню */}
      <div
        className={`${styles.menu} ${isMenuOpen ? styles.menuOpen : ""}`}
        ref={menuRef}
      >
        <ul className={styles.menuList}>
          <li className={styles.menuItem}>
            <Link
              href="/music/main"
              className={styles.menuLink}
              onClick={closeMenu}
            >
              Главное
            </Link>
          </li>
          <li className={styles.menuItem}>
            <Link href="#" className={styles.menuLink} onClick={closeMenu}>
              Мои треки
            </Link>
          </li>
          <li className={styles.menuItem}>
            <button
              type="button"
              className={styles.menuLink}
              onClick={handleLogout}
            >
              Выйти
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};
