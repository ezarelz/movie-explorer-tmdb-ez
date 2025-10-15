// components/HomeClient.tsx
'use client';

import { useState } from 'react';
import Hero from '@/components/Hero';
import MovieSection from '@/components/MovieSection';

export type MovieSummary = {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average?: number;
  release_date?: string;
  overview?: string;
};

export interface HomeClientProps {
  initialHero: MovieSummary | null;
  trending: MovieSummary[];
  newRelease: MovieSummary[];
}

export default function HomeClient({
  initialHero,
  trending,
  newRelease,
}: HomeClientProps) {
  const [heroMovie, setHeroMovie] = useState<MovieSummary | null>(initialHero);
  const [preferPoster, setPreferPoster] = useState(false);

  return (
    <>
      {heroMovie && (
        <section className='relative'>
          <Hero movie={heroMovie} preferPoster={preferPoster} />
        </section>
      )}

      <section className='mx-auto max-w-6xl px-4 py-10'>
        {/* Trending */}
        <div className='mb-10'>
          <h2 className='mb-6 text-xl font-semibold'>Trending Now</h2>
          <MovieSection
            title=''
            movies={trending}
            isTrending
            onHoverMovie={(m) => {
              setHeroMovie(m);
              setPreferPoster(true); // use poster when hovering Trending
            }}
          />
        </div>

        {/* New Release */}
        <div className='mb-16'>
          <h2 className='mb-6 text-xl font-semibold'>New Release</h2>
          <MovieSection
            title=''
            movies={newRelease}
            onHoverMovie={(m) => {
              setHeroMovie(m);
              setPreferPoster(false); // prefer backdrop here
            }}
          />
        </div>
      </section>
    </>
  );
}
