"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.css";
import { useState, useRef, useEffect } from "react";

export const Header = () => {
  const menuRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLDivElement>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const closeMenu = () => {
    setIsMenuOpen(false);
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

      <div
        className={`${styles.menu} ${isMenuOpen ? styles.menuOpen : ""}`}
        ref={menuRef}
      >
        <ul className={styles.menuList}>
          <li className={styles.menuItem}>
            <Link href="/" className={styles.menuLink} onClick={closeMenu}>
              Главное
            </Link>
          </li>
          <li className={styles.menuItem}>
            <Link
              href="/playlist"
              className={styles.menuLink}
              onClick={closeMenu}
            >
              Мой плейлист
            </Link>
          </li>
          <li className={styles.menuItem}>
            <Link
              href="/signin"
              className={styles.menuLink}
              onClick={closeMenu}
            >
              Войти
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};
