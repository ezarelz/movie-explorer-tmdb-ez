// features/favorites/storage.ts
import type { FavMovie } from '@/lib/types';

const KEY = 'fav-movies';

export const favStorage = {
  load(): FavMovie[] {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem(KEY) || '[]') as FavMovie[];
    } catch {
      return [];
    }
  },
  save(list: FavMovie[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEY, JSON.stringify(list));
    // notify same-tab listeners
    window.dispatchEvent(new CustomEvent('fav:update'));
  },
};
