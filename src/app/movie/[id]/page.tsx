/* eslint-disable @typescript-eslint/no-explicit-any */
// app/movie/[id]/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Star, Video, Smile } from 'lucide-react';
import PageContainer from '@/components/container/movie-details/PageContainer';
import { buildImageUrl } from '@/lib/config';
import {
  getMovieDetail,
  getMovieCredits,
  getMovieReleaseDates,
} from '@/lib/database-tmdb/movie/route';
import FavoriteButton from '@/components/favorite/FavoriteButton';
import CastSection from '@/components/movie/CastSection';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';

type Props = { params: Promise<{ id: string }> };

function certToAge(cert?: string) {
  if (!cert) return null;
  const c = cert.toUpperCase();
  if (c === 'G') return 0;
  if (c === 'PG') return 10;
  if (c === 'PG-13') return 13;
  if (c === 'R') return 17;
  if (c === 'NC-17') return 18;
  const m = c.match(/(\d{1,2})/);
  return m ? Number(m[1]) : null;
}

export default async function MovieDetailPage({ params }: Props) {
  const { id } = await params;

  const [movie, credits, releases] = await Promise.all([
    getMovieDetail(id),
    getMovieCredits(id),
    getMovieReleaseDates(id).catch(() => null),
  ]);

  const title = movie.original_title || movie.name || 'Untitled';
  const date = movie.release_date
    ? new Date(movie.release_date).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '—';

  const genres = (movie.genres ?? []).map((g) => g.name);
  const mainGenre = genres[0] ?? '—';

  const us = releases?.results?.find((r: any) => r.iso_3166_1 === 'US');
  const cert =
    us?.release_dates?.find((r: any) => r.certification)?.certification ||
    releases?.results?.find((r: any) => r.release_dates?.[0]?.certification)
      ?.release_dates?.[0]?.certification ||
    '';
  const ageLimit = certToAge(cert);

  // use SAME image for bg + poster (per figma)
  const sameImg = movie.poster_path || movie.backdrop_path || null;

  const trailerHref = title
    ? `https://www.youtube.com/results?search_query=${encodeURIComponent(
        title + ' trailer'
      )}`
    : 'https://www.youtube.com';

  return (
    <>
      <section className=' bg-[#0B0B11] text-white'>
        <Navbar />
      </section>
      <PageContainer>
        {/* Back to Home */}
        <div className='mb-2'>
          <Link
            href='/'
            className='inline-flex items-center gap-2 rounded-xl border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-white/80 hover:bg-neutral-800'
          >
            <ArrowLeft className='h-4 w-4' />
            Back to Home
          </Link>
        </div>

        {/* ================= Hero ================= */}
        <section className='relative overflow-hidden rounded-3xl border border-white/10'>
          {sameImg && (
            <Image
              src={buildImageUrl(sameImg)}
              alt={title}
              fill
              priority
              sizes='100vw'
              className='absolute inset-0 -z-10 h-full w-full object-cover'
            />
          )}
          <div className='absolute inset-0 -z-10 bg-gradient-to-b from-black/70 via-black/85 to-black/95' />

          {/* grid: 1 col on mobile, 2 cols on lg+ */}
          <div className='grid gap-6 p-5 sm:p-8 lg:gap-10 lg:p-10 lg:[grid-template-columns:220px_1fr]'>
            {/* Poster */}
            <div className='mx-auto w-[160px] overflow-hidden rounded-[14px] border border-white/15 bg-neutral-900/70 shadow-inner sm:w-[200px] lg:mx-0 lg:w-[220px]'>
              <div className='aspect-[2/3]'>
                {sameImg && (
                  <Image
                    src={buildImageUrl(sameImg)}
                    alt={title}
                    width={660}
                    height={990}
                    className='h-full object-cover'
                  />
                )}
              </div>
            </div>

            {/* Right column */}
            <div className='flex flex-col'>
              <h1 className='text-2xl font-semibold leading-tight sm:text-3xl md:text-4xl'>
                {title}
              </h1>

              <p className='mt-3 flex items-center gap-2 text-white/80'>
                <Calendar className='h-4 w-4' />
                {date}
              </p>

              {/* CTAs: full-width trailer on mobile, heart to the right */}
              <div className='mt-4 flex items-center gap-3'>
                <a
                  href={trailerHref}
                  target='_blank'
                  rel='noreferrer'
                  className='flex-1 rounded-xl border border-white/10 bg-rose-600 px-5 py-2 text-center text-sm font-semibold text-white hover:bg-rose-500 sm:flex-none sm:w-auto'
                >
                  Watch Trailer
                </a>
                <div className='rounded-full border border-white/10 bg-neutral-900 p-2'>
                  <FavoriteButton
                    movie={{
                      id: movie.id,
                      title,
                      poster_path: sameImg ?? undefined,
                      release_date: movie.release_date ?? undefined,
                      vote_average: movie.vote_average,
                      overview: movie.overview ?? undefined,
                    }}
                    className='cursor-pointer'
                  />
                </div>
              </div>

              {/* ===== Stat grid (in this column, 3-up, values white) ===== */}
              <div className='mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3'>
                <div className='flex items-center gap-3 rounded-2xl border border-white/10 bg-neutral-900/95 px-6 py-5'>
                  <Star className='h-5 w-5 text-yellow-400' />
                  <div>
                    <p className='text-xs text-white/60'>Rating</p>
                    <p className='text-base font-semibold text-white'>
                      {movie.vote_average?.toFixed(1) ?? '—'}/10
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-3 rounded-2xl border border-white/10 bg-neutral-900/95 px-6 py-5'>
                  <Video className='h-5 w-5 text-white' />
                  <div>
                    <p className='text-xs text-white/60'>Genre</p>
                    <p className='text-base font-semibold text-white'>
                      {mainGenre}
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-3 rounded-2xl border border-white/10 bg-neutral-900/95 px-6 py-5'>
                  <Smile className='h-5 w-5 text-white' />
                  <div>
                    <p className='text-xs text-white/60'>Age Limit</p>
                    <p className='text-base font-semibold text-white'>
                      {ageLimit ?? '—'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Overview (heading white) */}
              {movie.overview && (
                <div className='mt-6 sm:mt-8'>
                  <h2 className='mb-2 text-base font-semibold text-white sm:text-lg'>
                    Overview
                  </h2>
                  <p className='text-white/80'>{movie.overview}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Optional: chips */}
        {genres.length > 1 && (
          <div className='flex flex-wrap items-center gap-2'>
            {genres.map((g) => (
              <span
                key={g}
                className='rounded-xl border border-white/10 bg-neutral-900 px-3 py-1 text-xs'
              >
                {g}
              </span>
            ))}
          </div>
        )}

        {/* Cast & Crew (first 5 + toggle; no scrollbar) */}
        {credits.cast?.length > 0 && <CastSection credits={credits} />}
      </PageContainer>
      <footer className='pt-2 bg-[#0B0B11] text-white'>
        <Footer />
      </footer>
    </>
  );
}
