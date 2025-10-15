// components/favorite/FavoriteButton.tsx
'use client';

import { Heart } from 'lucide-react';
import { useFavorites, type FavoriteInput } from '@/features/favorites/hooks';

type Props = {
  movie: FavoriteInput;
  size?: number;
  className?: string;
};

export default function FavoriteButton({
  movie,
  size = 18,
  className = '',
}: Props) {
  const { ids, toggle } = useFavorites();
  const active = ids.has(movie.id);

  const handleClick = () => {
    const wasActive = active;
    toggle({
      ...movie,
      poster_path: movie.poster_path ?? undefined,
      release_date: movie.release_date ?? undefined,
      vote_average: movie.vote_average ?? undefined,
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('toast', {
          detail: {
            message: wasActive
              ? 'Removed from Favorites'
              : 'Success Add to Favorites',
          },
        })
      );
    }
  };

  return (
    <button
      type='button'
      onClick={handleClick}
      aria-pressed={active}
      title={active ? 'Remove from Favorites' : 'Add to Favorites'}
      className={`inline-flex items-center justify-center rounded-xl bg-white/10 p-2 hover:bg-neutral-800 ${className}`}
    >
      <Heart
        size={size}
        className={active ? 'text-rose-500' : 'text-white'}
        fill={active ? 'currentColor' : 'none'}
      />
    </button>
  );
}
