/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import type { JSX } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { buildImageUrl } from '@/lib/config';
import Footer from '@/components/Footer';

type TMDBMovie = {
  id: number;
  title?: string;
  poster_path: string | null;
  release_date?: string;
  vote_average?: number;
};

export default function SearchView(): JSX.Element {
  const sp = useSearchParams();
  const q = (sp.get('q') ?? '').trim();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TMDBMovie[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    setResults([]);
    if (!q) return;

    const ctrl = new AbortController();
    (async () => {
      try {
        setLoading(true);
        const url =
          `/api/search/movie?query=${encodeURIComponent(q)}` +
          `&include_adult=false&language=en-US&page=1`;
        const res = await fetch(url, { signal: ctrl.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setResults((data?.results ?? []) as TMDBMovie[]);
      } catch (e: any) {
        if (e?.name !== 'AbortError') setError('Failed to fetch results.');
      } finally {
        setLoading(false);
      }
    })();

    return () => ctrl.abort();
  }, [q]);

  const body = useMemo(() => {
    if (!q)
      return <p className='text-white/70'>Type something in the search box…</p>;
    if (loading) return <p className='text-white/70'>Searching “{q}”…</p>;
    if (error) return <p className='text-rose-400'>{error}</p>;
    if (!results.length)
      return <p className='text-white/70'>No results for “{q}”.</p>;

    return (
      <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5'>
        {results.map((m) => {
          const poster = m.poster_path
            ? buildImageUrl(m.poster_path)
            : '/placeholder.png';
          const title = m.title ?? 'Untitled';
          return (
            <Link
              key={m.id}
              href={`/movie/${m.id}`}
              className='rounded-xl bg-white/5 p-2 transition hover:bg-white/10'
            >
              <div className='relative aspect-[2/3] overflow-hidden rounded-lg bg-neutral-800'>
                <Image src={poster} alt={title} fill className='object-cover' />
              </div>
              <h3 className='mt-2 line-clamp-1 text-sm font-medium'>{title}</h3>
              <div className='mt-0.5 text-xs text-white/60'>
                {m.release_date?.slice(0, 4) ?? '—'}
                {typeof m.vote_average === 'number' &&
                  ` • ⭐ ${m.vote_average.toFixed(1)}`}
              </div>
            </Link>
          );
        })}
      </div>
    );
  }, [q, loading, error, results]);

  return (
    <main className='min-h-screen bg-[#0B0B11] text-white'>
      <div className='mx-auto max-w-6xl px-4 py-8'>
        <div className='mb-6 flex items-center justify-between'>
          <h1 className='text-xl font-semibold'>Search{q ? `: “${q}”` : ''}</h1>

          <motion.button
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={{
              type: 'spring',
              stiffness: 380,
              damping: 24,
              mass: 0.6,
            }}
            onClick={() => router.push('/')}
            className='cursor-pointer inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/90 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/70'
            style={{ willChange: 'transform' }}
            aria-label='Back to home'
          >
            ← Back to Home
          </motion.button>
        </div>

        {body}
        <Footer />
      </div>
    </main>
  );
}
