// app/favorites/page.tsx
'use client';

import type { JSX } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';

import { useFavorites } from '@/features/favorites/hooks';
import FavoriteButton from '@/components/favorite/FavoriteButton';
import { buildImageUrl } from '@/lib/config';

export default function FavoritesPage(): JSX.Element {
  const { items, isEmpty } = useFavorites();

  return (
    <main className='min-h-screen bg-black text-white'>
      <Navbar />

      <div className='mx-auto max-w-6xl px-4 md:px-6 py-8 md:py-10'>
        <h1 className='mb-6 text-[28px] md:text-[36px] font-bold tracking-[-0.02em]'>
          Favorites
        </h1>

        {isEmpty ? (
          <section className='grid place-items-center py-28'>
            <div className='text-center'>
              <div className='mx-auto mb-6 h-24 w-24 opacity-60'>
                <Image
                  src='/icons/clapboard.svg'
                  alt=''
                  width={96}
                  height={96}
                  className='mx-auto opacity-60'
                />
              </div>
              <p className='mb-1 text-sm font-semibold text-white/90'>
                Data Empty
              </p>
              <p className='mb-6 text-xs text-white/60'>
                You don’t have a favorite movie yet
              </p>
              <Link
                href='/'
                className='inline-flex items-center rounded-full bg-[#961200] px-5 py-2 text-sm font-semibold hover:opacity-90'
              >
                Explore Movie
              </Link>
            </div>
          </section>
        ) : (
          <ul className='divide-y divide-white/5'>
            {items.map((m) => {
              const q = [
                m.title,
                (m.release_date ?? '').slice(0, 4) || undefined,
                'trailer',
              ]
                .filter(Boolean)
                .join(' ');

              const trailerUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
                q
              )}`;

              return (
                <li key={m.id} className='py-6 md:py-7'>
                  {/* one row */}
                  <div className='relative flex items-start gap-4 md:gap-6'>
                    {/* Poster (fixed width) */}
                    <Link
                      href={`/movie/${m.id}`}
                      className='block overflow-hidden rounded-xl shrink-0'
                    >
                      <Image
                        src={buildImageUrl(m.poster_path ?? undefined)}
                        alt={m.title}
                        width={182}
                        height={270}
                        className='w-[104px] h-[156px] md:w-[182px] md:h-[270px] object-cover'
                      />
                    </Link>

                    {/* Text column (flex-1 ensures it sits to the RIGHT of poster) */}
                    <div className='min-w-0 flex-1 pr-14 md:pr-0'>
                      {/* Title */}
                      <Link
                        href={`/movie/${m.id}`}
                        className='block text-base md:text-[24px] md:leading-9 font-semibold hover:underline'
                      >
                        {m.title}
                      </Link>

                      {/* Rating */}
                      {typeof m.vote_average === 'number' && (
                        <div className='mt-1 inline-flex items-center gap-1.5 text-xs md:text-sm'>
                          <svg
                            className='h-4 w-4 md:h-[22px] md:w-[22px] fill-[#E4A802] text-[#E4A802]'
                            viewBox='0 0 24 24'
                          >
                            <path d='M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z' />
                          </svg>
                          <span className='rounded-md border border-white/10 px-2 py-0.5 text-white/90'>
                            {m.vote_average.toFixed(1)}
                            <span className='text-white/60'>/10</span>
                          </span>
                        </div>
                      )}

                      {/* Overview (now properly to the RIGHT of the poster) */}
                      <p className='mt-2 line-clamp-2 text-sm md:text-[16px] md:leading-[30px] text-[#A4A7AE]'>
                        {m.overview ?? 'No overview available.'}
                      </p>

                      {/* CTA */}
                      <div className='mt-3'>
                        <Link
                          href={trailerUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                          aria-label={`Watch trailer: ${m.title}`}
                          className='inline-flex items-center gap-2 rounded-full bg-[#961200] px-4 md:px-5 py-2 text-sm font-semibold text-white hover:opacity-90'
                        >
                          <svg
                            width='18'
                            height='18'
                            viewBox='0 0 24 24'
                            fill='none'
                          >
                            <path d='M8 5v14l11-7L8 5z' fill='currentColor' />
                          </svg>
                          Watch Trailer
                        </Link>
                      </div>
                    </div>

                    {/* Heart inside same container, a bit higher */}
                    <FavoriteButton
                      movie={{
                        id: m.id,
                        title: m.title,
                        poster_path: m.poster_path ?? undefined,
                        vote_average: m.vote_average ?? undefined,
                        release_date: m.release_date ?? undefined,
                        overview: m.overview ?? undefined,
                      }}
                      className='absolute top-1.5 md:top-2 right-2 z-10 rounded-full border border-white/10 bg-[rgba(10,13,18,0.6)] backdrop-blur p-2 md:p-3 hover:bg-black/70'
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <Footer />
    </main>
  );
}
