// lib/favorites.ts
export type FavMovie = {
  id: number;
  title: string;
  overview?: string | null;
  poster_path?: string | null;
  release_date?: string | null;
  vote_average?: number | null;
  addedAt: number; // for sorting newest-first
};

const KEY = 'tmdb:favorites';
const TICK = 'tmdb:favorites:tick'; // to sync across tabs

const listeners = new Set<() => void>();
const hasWindow = typeof window !== 'undefined';

function notify(): void {
  listeners.forEach((fn) => fn());
  // cross-tab sync
  if (!hasWindow) return;
  try {
    localStorage.setItem(TICK, String(Date.now()));
  } catch {}
}

/* =========
   READ/WRITE
   ========= */

// If you already have a storage helper (e.g. /lib/storage.ts),
// you can swap these two functions to use it instead.
// Example (adjust names to your helper):
// import { getItem, setItem } from '@/lib/storage';

export function readFavorites(): FavMovie[] {
  if (!hasWindow) return [];
  try {
    const raw = localStorage.getItem(KEY); // or: getItem<string | null>(KEY)
    return raw ? (JSON.parse(raw) as FavMovie[]) : [];
  } catch {
    return [];
  }
}

function writeFavorites(next: FavMovie[]): void {
  if (!hasWindow) return;
  try {
    localStorage.setItem(KEY, JSON.stringify(next)); // or: setItem(KEY, next)
  } catch {}
  notify();
}

/* =========
   API
   ========= */

export function isFavorite(id: number): boolean {
  return readFavorites().some((m) => m.id === id);
}

export function toggleFavorite(movie: Omit<FavMovie, 'addedAt'>): boolean {
  const list = readFavorites();
  const idx = list.findIndex((m) => m.id === movie.id);
  if (idx >= 0) {
    list.splice(idx, 1);
    writeFavorites(list);
    return false;
  }
  const next: FavMovie = { ...movie, addedAt: Date.now() };
  writeFavorites([next, ...list]);
  return true;
}

export function removeFavorite(id: number): void {
  writeFavorites(readFavorites().filter((m) => m.id !== id));
}

/** Subscribes to in-memory + cross-tab updates.
 *  IMPORTANT: return a cleanup with `void` return type. */
export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    // ensure Effect cleanup returns void, not boolean
    listeners.delete(fn);
  };
}

/* =========
   Cross-tab
   ========= */
if (hasWindow) {
  window.addEventListener('storage', (e) => {
    if (e.key === KEY || e.key === TICK) notify();
  });
}
