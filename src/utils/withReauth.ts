// src/utils/withReauth.ts

import { AppDispatch } from "@/store";
import { setAccessToken } from "@/store/slices/authSlice";
import { refreshAccessToken } from "@/api/auth";

/**
 * Обёртка для API-запросов с автопродлением access-токена.
 *
 * @param apiFunction — колбэк, принимает access-токен, делает запрос
 * @param refresh — refresh-токен
 * @param dispatch — Redux dispatch
 *
 * Если запрос вернул 401 — обновляет access через refresh и повторяет запрос.
 */
export const withReauth = async <T>(
  apiFunction: (access: string) => Promise<T>,
  refresh: string,
  dispatch: AppDispatch,
): Promise<T> => {
  try {
    // Первая попытка — с пустым access.
    // Колбэк сам подставит `newToken || access` (см. использование).
    return await apiFunction("");
  } catch (error) {
    // Проверяем, что это 401 (наша специальная ошибка из favorites.ts)
    const is401 =
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      (error as { status: number }).status === 401;

    if (is401) {
      // Обновляем токен
      const newAccess = await refreshAccessToken(refresh);
      // Сохраняем в Redux + localStorage
      dispatch(setAccessToken(newAccess));
      // Повторяем запрос с новым токеном
      return await apiFunction(newAccess);
    }

    // Не 401 — пробрасываем
    throw error;
  }
};
