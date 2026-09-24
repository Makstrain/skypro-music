// src/hooks/useLikeTrack.ts

"use client";

import { useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addLikedTracks, removeLikedTracks } from "@/store/slices/tracksSlice";
import { withReauth } from "@/utils/withReauth";
import { addLike, removeLike } from "@/api/favorites";
import { Track } from "@/data/data";

interface ReturnTypeHook {
  isLoading: boolean;
  errorMsg: string | null;
  toggleLike: () => void;
  isLike: boolean;
}

export const useLikeTrack = (track: Track | null): ReturnTypeHook => {
  const { favoriteTracks } = useAppSelector((state) => state.tracks);
  const { access, refresh } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const isLike = favoriteTracks.some((t) => t._id === track?._id);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggleLike = useCallback(() => {
    //  Неавторизован — показываем сообщение
    if (!access) {
      setErrorMsg("Войдите, чтобы ставить лайки");
      // Скрываем через 3 секунды
      setTimeout(() => setErrorMsg(null), 3000);
      return;
    }

    if (!track || !refresh) return;

    const actionApi = isLike ? removeLike : addLike;
    const actionSlice = isLike ? removeLikedTracks : addLikedTracks;

    setIsLoading(true);
    setErrorMsg(null);

    withReauth(
      (newToken) => actionApi(newToken || access, track._id),
      refresh,
      dispatch,
    )
      .then(() => {
        // Успех — обновляем Redux
        dispatch(actionSlice(track));
      })
      .catch((error) => {
        const message =
          error instanceof Error
            ? error.message
            : "Произошла ошибка. Попробуйте позже";
        setErrorMsg(message);
        // Скрываем через 3 секунды
        setTimeout(() => setErrorMsg(null), 3000);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [access, refresh, track, isLike, dispatch]);

  return {
    isLoading,
    errorMsg,
    toggleLike,
    isLike,
  };
};
