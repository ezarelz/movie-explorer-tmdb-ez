// features/favorites/hooks.ts
'use client';

import { useEffect, useMemo, useState } from 'react';
import type { FavMovie } from '@/lib/types';
import { favStorage } from './storage';

export type FavoriteInput = FavMovie; // sudah termasuk overview?

export function useFavorites() {
  const [list, setList] = useState<FavMovie[]>([]);

  useEffect(() => {
    const refresh = () => setList(favStorage.load());
    refresh();

    const onLocal = () => refresh();
    const onStorage = (e: StorageEvent) => e.key === 'fav-movies' && refresh();

    if (typeof window !== 'undefined') {
      window.addEventListener('fav:update', onLocal as EventListener);
      window.addEventListener('storage', onStorage);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('fav:update', onLocal as EventListener);
        window.removeEventListener('storage', onStorage);
      }
    };
  }, []);

  const ids = useMemo(() => new Set(list.map((m) => m.id)), [list]);

  const toggle = (payload: FavoriteInput) => {
    const current = favStorage.load();
    const idx = current.findIndex((m) => m.id === payload.id);

    if (idx >= 0) {
      current.splice(idx, 1);
      favStorage.save(current);
      return false;
    }

    // Simpan dengan normalisasi aman tipe
    const next: FavMovie = {
      id: payload.id,
      title: payload.title,
      poster_path: payload.poster_path ?? undefined,
      vote_average: payload.vote_average ?? undefined,
      release_date: payload.release_date ?? undefined,
      overview: payload.overview ?? undefined,
    };

    favStorage.save([next, ...current]);
    return true;
  };

  return {
    items: list,
    ids,
    isEmpty: list.length === 0,
    toggle,
  };
}
