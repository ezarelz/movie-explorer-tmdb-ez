// components/MovieSection.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Star, Loader2 } from 'lucide-react';
import { buildImageUrl } from '@/lib/config';
import type { MovieSummary } from '@/components/HomeClient';

export type MovieSectionProps = {
  title?: string;
  movies: MovieSummary[];
  /** Mode: true = carousel trending, false/undefined = grid new release */
  isTrending?: boolean;

  /** HOVER: hanya dipakai di mode trending untuk update hero */
  onHoverMovie?: (m: MovieSummary) => void;

  /** === Carousel options (isTrending: true) === */
  autoplayMs?: number;
  stepRatio?: number;

  /** === Grid infinite scroll (isTrending: false) === */
  hasMore?: boolean;
  onLoadMore?: () => Promise<void> | void;
  loadingMore?: boolean;
};

export default function MovieSection(props: MovieSectionProps) {
  const {
    title,
    movies,
    isTrending,
    onHoverMovie,
    autoplayMs = 3000,
    stepRatio = 0.85,

    hasMore,
    onLoadMore,
    loadingMore,
  } = props;

  if (isTrending) {
    return (
      <TrendingCarousel
        title={title}
        movies={movies}
        onHoverMovie={onHoverMovie}
        autoplayMs={autoplayMs}
        stepRatio={stepRatio}
      />
    );
  }

  return (
    <GridWithInfiniteScroll
      title={title}
      movies={movies}
      hasMore={hasMore}
      onLoadMore={onLoadMore}
      loadingMore={loadingMore}
    />
  );
}

/* =====================================================================================
   1) TRENDING CAROUSEL (auto move + drag + wheel, scrollbar hidden)
===================================================================================== */
function TrendingCarousel({
  title,
  movies,
  onHoverMovie,
  autoplayMs = 3000,
  stepRatio = 0.85,
}: {
  title?: string;
  movies: MovieSummary[];
  onHoverMovie?: (m: MovieSummary) => void;
  autoplayMs?: number;
  stepRatio?: number;
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const [paused, setPaused] = useState(false);

  // drag state
  const draggingRef = useRef(false);
  const movedRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollRef = useRef(0);

  const updateArrows = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < max - 4);
  };

  useEffect(() => {
    updateArrows();
    const el = scrollerRef.current;
    if (!el) return;
    const onResize = () => updateArrows();
    window.addEventListener('resize', onResize);
    el.addEventListener('scroll', updateArrows);
    return () => {
      window.removeEventListener('resize', onResize);
      el.removeEventListener('scroll', updateArrows);
    };
  }, [movies.length]);

  const stepPx = () => {
    const el = scrollerRef.current;
    if (!el) return 0;
    return Math.round(el.clientWidth * stepRatio);
  };

  const scrollByStep = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const step = stepPx();
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  // autoplay
  useEffect(() => {
    if (!autoplayMs || autoplayMs <= 0) return;
    const el = scrollerRef.current;
    if (!el) return;

    const id = setInterval(() => {
      if (paused) return;
      const max = el.scrollWidth - el.clientWidth;
      const next = Math.min(el.scrollLeft + stepPx(), max);
      if (max - el.scrollLeft <= 8)
        el.scrollTo({ left: 0, behavior: 'smooth' });
      else el.scrollTo({ left: next, behavior: 'smooth' });
    }, autoplayMs);

    return () => clearInterval(id);
  }, [autoplayMs, paused, stepPx]);

  // drag + wheel
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      // ⬅️ don't start dragging if press begins on a link or button (let click work)
      if (target?.closest('a,button')) return;

      draggingRef.current = true;
      movedRef.current = false;
      startXRef.current = e.clientX;
      startScrollRef.current = el.scrollLeft;
      setPaused(true);
      (el as HTMLElement).style.cursor = 'grabbing';
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      const dx = e.clientX - startXRef.current;
      if (Math.abs(dx) > 5) movedRef.current = true;
      el.scrollLeft = startScrollRef.current - dx;
    };

    const endDrag = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      (el as HTMLElement).style.cursor = '';
      setPaused(false);
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', endDrag);
    el.addEventListener('pointercancel', endDrag);
    el.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', endDrag);
      el.removeEventListener('pointercancel', endDrag);
      el.removeEventListener('wheel', onWheel as EventListener);
    };
  }, []);

  return (
    <div
      className='group relative'
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {title && <h3 className='mb-4 text-lg font-semibold'>{title}</h3>}

      {/* edge fades */}
      <div className='pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#0B0B11] to-transparent opacity-0 transition-opacity group-hover:opacity-100' />
      <div className='pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#0B0B11] to-transparent opacity-0 transition-opacity group-hover:opacity-100' />

      {/* arrows */}
      <button
        onClick={() => scrollByStep(-1)}
        disabled={!canLeft}
        aria-label='Scroll left'
        className='absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-black/60 p-2 backdrop-blur md:block disabled:opacity-40'
      >
        <ChevronLeft className='size-6' />
      </button>
      <button
        onClick={() => scrollByStep(1)}
        disabled={!canRight}
        aria-label='Scroll right'
        className='absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-black/60 p-2 backdrop-blur md:block disabled:opacity-40'
      >
        <ChevronRight className='size-6' />
      </button>

      {/* scroller */}
      <div
        ref={scrollerRef}
        className='
          scrollbar-hide overflow-x-auto overflow-y-visible scroll-smooth
          snap-x snap-mandatory [scrollbar-gutter:stable]
          select-none touch-pan-x
        '
      >
        <ul className='flex gap-4 px-1'>
          {movies.map((m, i) => {
            const poster = m.poster_path
              ? buildImageUrl(m.poster_path)
              : '/placeholder.png';
            const label = m.title ?? m.name ?? 'Untitled';
            const href = `/movie/${m.id}`;
            return (
              <li
                key={m.id}
                className='list-none snap-start w-[140px] sm:w-[170px] md:w-[200px] shrink-0'
              >
                <Link
                  href={href}
                  aria-label={`Open ${label}`}
                  className='block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/70'
                  onMouseEnter={() => onHoverMovie?.(m)} // keeps the hero-hover behavior
                  onClick={(e) => {
                    // If it was a drag, don't navigate; otherwise let the native link work.
                    if (movedRef.current) {
                      e.preventDefault();
                    }
                  }}
                  prefetch={false}
                >
                  <article
                    className='cursor-pointer'
                    onMouseEnter={() => onHoverMovie?.(m)}
                  >
                    <div className='relative aspect-[2/3] overflow-hidden rounded-xl bg-neutral-800'>
                      <Image
                        src={poster}
                        alt={label}
                        fill
                        sizes='(max-width:768px) 140px, (max-width:1024px) 170px, 200px'
                        className='object-cover'
                        priority={i < 4}
                      />
                      <div className='absolute left-2 top-2 rounded-md bg-black/70 px-1.5 py-0.5 text-[11px]'>
                        #{i + 1}
                      </div>
                    </div>
                    <h4 className='mt-2 line-clamp-1 text-sm font-medium'>
                      {label}
                    </h4>
                    {typeof m.vote_average === 'number' && (
                      <div className='mt-0.5 flex items-center gap-1 text-xs text-yellow-400/90'>
                        <Star className='size-3' />
                        <span>{m.vote_average.toFixed(1)}/10</span>
                      </div>
                    )}
                  </article>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* mobile arrows */}
      <div className='mt-3 flex gap-2 md:hidden'>
        <button
          aria-label='left'
          onClick={() => scrollByStep(-1)}
          disabled={!canLeft}
          className='rounded-lg border border-white/10 px-3 py-1 disabled:opacity-40'
        >
          <ChevronLeft className='size-5' />
        </button>
        <button
          aria-label='right'
          onClick={() => scrollByStep(1)}
          disabled={!canRight}
          className='rounded-lg border border-white/10 px-3 py-1 disabled:opacity-40'
        >
          <ChevronRight className='size-5' />
        </button>
      </div>
    </div>
  );
}

/* =====================================================================================
   2) GRID + INFINITE SCROLL (4 columns, multi row)
===================================================================================== */
function GridWithInfiniteScroll({
  title,
  movies,
  hasMore,
  onLoadMore,
  loadingMore,
}: {
  title?: string;
  movies: MovieSummary[];
  hasMore?: boolean;
  onLoadMore?: () => Promise<void> | void;
  loadingMore?: boolean;
}) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [ioReady, setIoReady] = useState(false);

  // setup IntersectionObserver once
  useEffect(() => {
    if (!onLoadMore) return;
    const el = sentinelRef.current;
    if (!el) return;

    const ob = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !loadingMore) {
          onLoadMore();
        }
      },
      { rootMargin: '800px 0px 800px 0px', threshold: 0.01 }
    );

    ob.observe(el);
    setIoReady(true);
    return () => ob.disconnect();
  }, [hasMore, onLoadMore, loadingMore]);

  const cards = useMemo(
    () =>
      movies.map((m) => {
        const poster = m.poster_path
          ? buildImageUrl(m.poster_path)
          : '/placeholder.png';
        const label = m.title ?? m.name ?? 'Untitled';
        return (
          <div key={m.id} className='rounded-xl bg-neutral-900/40 p-2'>
            <div className='relative aspect-[2/3] overflow-hidden rounded-lg bg-neutral-800'>
              <Image src={poster} alt={label} fill className='object-cover' />
            </div>
            <h4 className='mt-2 line-clamp-1 text-sm font-medium'>{label}</h4>
            {typeof m.vote_average === 'number' && (
              <div className='mt-0.5 flex items-center gap-1 text-xs text-yellow-400/90'>
                <Star className='size-3' />
                <span>{m.vote_average.toFixed(1)}/10</span>
              </div>
            )}
          </div>
        );
      }),
    [movies]
  );

  return (
    <div>
      {title && <h3 className='mb-4 text-lg font-semibold'>{title}</h3>}

      <div
        className='
    grid grid-cols-2 gap-4
    md:grid-cols-3 lg:grid-cols-4
  '
      >
        {movies.map((m) => {
          const href = `/movie/${m.id}`;
          const poster = m.poster_path
            ? buildImageUrl(m.poster_path)
            : '/placeholder.png';
          const title = m.title ?? m.name ?? 'Untitled';

          return (
            <Link
              key={m.id}
              href={href}
              className='block rounded-xl bg-neutral-900/40 p-2 focus:outline-none
                   focus-visible:ring-2 focus-visible:ring-rose-500/70'
            >
              <article>
                <div className='relative aspect-[2/3] overflow-hidden rounded-lg bg-neutral-800'>
                  <Image
                    src={poster}
                    alt={title}
                    fill
                    className='object-cover'
                  />
                </div>
                <h4 className='mt-2 line-clamp-1 text-sm font-medium'>
                  {title}
                </h4>
              </article>
            </Link>
          );
        })}
      </div>

      {/* sentinel untuk load-more */}
      {onLoadMore && (
        <div className='mt-6 flex items-center justify-center'>
          <div ref={sentinelRef} className='h-1 w-1 opacity-0' />
          {loadingMore && (
            <div className='flex items-center gap-2 text-sm text-white/70'>
              <Loader2 className='size-4 animate-spin' />
              Loading more...
            </div>
          )}
          {!hasMore && movies.length > 0 && (
            <p className='text-center text-sm text-white/50'>
              You’ve reached the end.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
