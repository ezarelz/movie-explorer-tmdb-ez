'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

/** Bentuk data item */
export type RailItem = {
  id: string | number;
  title: string;
  posterUrl: string;
  rating?: number; // 0–10
  href?: string; // optional link detail
};

type Props = {
  title?: string;
  items: RailItem[];
  /** width perpindahan tiap klik; default 85% lebar container */
  stepRatio?: number; // 0..1
};

export default function HorizontalRail({
  title = 'Trending Now',
  items,
  stepRatio = 0.85,
}: Props) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const updateArrows = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < maxScroll - 4);
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
  }, []);

  const scrollByStep = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const step = Math.round(el.clientWidth * stepRatio);
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  return (
    <section className='relative'>
      <div className='mb-3 flex items-end justify-between'>
        <h2 className='text-lg font-semibold tracking-tight'>{title}</h2>

        {/* Panah versi mobile kecil */}
        <div className='flex gap-2 md:hidden'>
          <button
            aria-label='Scroll left'
            onClick={() => scrollByStep(-1)}
            disabled={!canLeft}
            className='rounded-lg border border-white/10 px-2 py-1 disabled:opacity-40'
          >
            <ChevronLeft className='size-5' />
          </button>
          <button
            aria-label='Scroll right'
            onClick={() => scrollByStep(1)}
            disabled={!canRight}
            className='rounded-lg border border-white/10 px-2 py-1 disabled:opacity-40'
          >
            <ChevronRight className='size-5' />
          </button>
        </div>
      </div>

      <div className='group relative'>
        {/* Edge fade (opsional, biar elegan) */}
        <div className='pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black to-transparent opacity-0 transition-opacity group-hover:opacity-100' />
        <div className='pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black to-transparent opacity-0 transition-opacity group-hover:opacity-100' />

        {/* Tombol panah desktop (muncul saat hover) */}
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

        {/* SCROLLER */}
        <div
          ref={scrollerRef}
          className='
            scrollbar-hide overflow-x-auto overflow-y-visible
            scroll-smooth snap-x snap-mandatory
            [scrollbar-gutter:stable] 
          '
        >
          <ul className='flex gap-4 px-1'>
            {items.map((m, i) => {
              const Card = (
                <article
                  key={m.id}
                  className='
                    snap-start
                    w-[140px] sm:w-[170px] md:w-[200px]
                    shrink-0
                  '
                >
                  <div className='relative aspect-[2/3] overflow-hidden rounded-xl bg-neutral-800'>
                    <Image
                      src={m.posterUrl}
                      alt={m.title}
                      fill
                      sizes='(max-width:768px) 140px, (max-width:1024px) 170px, 200px'
                      className='object-cover'
                      priority={i < 4}
                    />
                    <div className='absolute left-2 top-2 rounded-md bg-black/70 px-1.5 py-0.5 text-[11px]'>
                      #{i + 1}
                    </div>
                  </div>
                  <h3 className='mt-2 line-clamp-1 text-sm font-medium'>
                    {m.title}
                  </h3>
                  {typeof m.rating === 'number' && (
                    <div className='mt-0.5 flex items-center gap-1 text-xs text-yellow-400/90'>
                      <Star className='size-3' />
                      <span>{m.rating.toFixed(1)}/10</span>
                    </div>
                  )}
                </article>
              );

              return (
                <li key={m.id} className='list-none'>
                  {m.href ? (
                    <Link
                      href={m.href}
                      className='block transition hover:opacity-90'
                    >
                      {Card}
                    </Link>
                  ) : (
                    Card
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
