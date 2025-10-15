// components/Hero.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Play } from 'lucide-react';
import type { MovieSummary } from '@/components/HomeClient';
import { buildImageUrl } from '@/lib/config';

type Props = { movie: MovieSummary; preferPoster?: boolean };

export default function Hero({ movie, preferPoster = false }: Props) {
  const title = movie.title ?? movie.name ?? 'Untitled';
  const backdropUrl =
    (movie.backdrop_path && buildImageUrl(movie.backdrop_path)) ||
    (movie.poster_path && buildImageUrl(movie.poster_path)) ||
    '/placeholder.png';
  const posterUrl = movie.poster_path ? buildImageUrl(movie.poster_path) : null;
  const overview = movie.overview ?? '';

  return (
    <section className='relative h-[60vh] min-h-[360px] w-full overflow-hidden'>
      {/* Layer 1: base backdrop */}
      <div className='absolute inset-0 z-0'>
        <Image
          src={backdropUrl}
          alt={title}
          fill
          priority
          sizes='80vw'
          className='object-cover object-[35%_center]' /* push focus slightly left */
        />
      </div>

      {/* Layer 2: poster stretched (only when preferPoster) */}
      {preferPoster && posterUrl && (
        <div className='absolute inset-0 z-10'>
          <Image
            src={posterUrl}
            alt={`${title} poster`}
            fill
            priority
            sizes='100vw'
            className='object-cover object-[25%_center]'
          />
          {/* darken a bit so text is readable */}
          <div className='absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent' />
        </div>
      )}

      {/* Layer 3: bottom fade to blend with page bg */}
      <div className='pointer-events-none absolute inset-x-0 bottom-0 z-20 h-40 bg-gradient-to-t from-[#0B0B11] to-transparent' />

      {/* Content (on top of everything) */}
      <div className='relative z-30 mx-auto flex h-full max-w-6xl items-center px-4'>
        <div className='max-w-xl'>
          <h1 className='leading-tight text-3xl font-extrabold md:text-5xl'>
            {title}
          </h1>

          {overview && (
            <p className='mt-3 line-clamp-3 text-sm text-white/80 md:text-base'>
              {overview}
            </p>
          )}

          <div className='mt-6 flex items-center gap-3'>
            <Link
              href={`https://www.youtube.com`}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-2 rounded-full bg-rose-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-rose-500'
            >
              <Play className='h-4 w-4 fill-white' />
              Watch Trailer
            </Link>
            <Link
              href={`/movie/${movie.id ?? ''}`}
              className='inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10'
            >
              See Detail
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
