/* eslint-disable @typescript-eslint/no-explicit-any */
// components/movie/CastSection.tsx
'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { buildImageUrl } from '@/lib/config';
import type { Credits } from '@/lib/types';

export default function CastSection({ credits }: { credits: Credits }) {
  const [expanded, setExpanded] = useState(false);
  const cast = useMemo(
    () =>
      (credits?.cast ?? [])
        .slice()
        .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0)),
    [credits]
  );
  const visible = expanded ? cast : cast.slice(0, 5);
  if (!cast.length) return null;

  return (
    <section>
      <div className='mb-4 flex items-center justify-between'>
        <h3 className='text-lg font-semibold'>Cast &amp; Crew</h3>
        <button
          onClick={() => setExpanded((v) => !v)}
          className='text-sm text-white/80 underline-offset-4 hover:underline'
        >
          {expanded ? 'Hide' : 'See all'}
        </button>
      </div>

      <ul className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'>
        {visible.map((c) => {
          const personName = c.name || c.original_name || '—';
          return (
            <li
              key={c.id}
              className='rounded-2xl border border-white/10 bg-neutral-900 p-3'
            >
              <div className='mb-3 overflow-hidden rounded-xl bg-neutral-800'>
                <Image
                  src={
                    c.profile_path
                      ? buildImageUrl(c.profile_path)
                      : '/placeholder.png'
                  }
                  alt={personName}
                  width={300}
                  height={450}
                  className='h-48 w-full object-cover'
                />
              </div>
              <p className='line-clamp-1 text-sm font-semibold'>{personName}</p>
              <p className='line-clamp-1 text-xs text-white/60'>
                {c.character || '—'}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
