// components/navbar.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { buildImageUrl } from '@/lib/config';
import { Menu } from 'lucide-react';
import MobileMenu from '@/components/mobile/MobileMenu';

type Suggestion = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date?: string;
  vote_average?: number;
};

export default function Navbar() {
  const [q, setQ] = useState('');
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Suggestion[]>([]);
  const [active, setActive] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false); // mobile

  const lastY = useRef(0);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  // Hide on scroll
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      const delta = y - lastY.current;
      if (y > 80 && delta > 2) setHidden(true);
      else if (delta < -2) setHidden(false);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Debounced suggestions
  useEffect(() => {
    const term = q.trim();
    if (!term) {
      setItems([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const url =
          `/api/search/movie?query=${encodeURIComponent(term)}` +
          `&include_adult=false&language=en-US&page=1`;
        const res = await fetch(url);
        const data = await res.json();
        setItems((data?.results ?? []).slice(0, 8));
        setActive(0);
        setOpen(true);
      } catch {
        setItems([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  // Close dropdown on outside click
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!(e.target as HTMLElement)?.closest?.('#nav-search-wrap'))
        setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  const gotoMovie = (id: number) => {
    setOpen(false);
    router.push(`/movie/${id}`);
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!open || items.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => (i + 1) % items.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => (i - 1 + items.length) % items.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const pick = items[active];
      if (pick) gotoMovie(pick.id);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <header
      className={[
        'sticky top-0 z-40 transition-transform duration-300',
        hidden ? '-translate-y-full' : 'translate-y-0',
        'bg-gradient-to-b from-black/40 to-transparent backdrop-blur-[2px]',
      ].join(' ')}
    >
      <div className='mx-auto max-w-6xl px-4 py-4'>
        <div className='flex items-center justify-between'>
          {/* Brand */}
          <Link href='/' className='flex items-center gap-2'>
            <span className='inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 overflow-hidden'>
              <Image
                src='/icons/movie-icon.svg'
                alt='Movie'
                width={20}
                height={20}
                priority
              />
            </span>
            <span className='text-lg font-semibold'>Movie</span>
          </Link>

          {/* Desktop links */}
          <nav className='hidden items-center gap-6 md:flex'>
            <Link href='/' className='text-sm text-white/90 hover:text-white'>
              Home
            </Link>
            <Link
              href='/favorites'
              className='text-sm text-white/90 hover:text-white'
            >
              Favorites
            </Link>
          </nav>

          {/* Right: search + hamburger (mobile) */}
          <div className='flex items-center gap-3'>
            {/* Search + dropdown */}
            <div
              id='nav-search-wrap'
              ref={wrapRef}
              className='relative ml-4 flex-1 md:max-w-sm'
            >
              <form onSubmit={onSubmit} aria-label='Search movies'>
                <label className='relative block'>
                  <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50' />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder='Search Movie'
                    autoComplete='off'
                    className='w-full rounded-full border border-white/10 bg-white/10 py-2 pl-10 pr-4 text-sm text-white placeholder:text-white/50 outline-none transition focus:border-white/20 focus:bg-white/[0.15]'
                  />
                </label>
              </form>

              {open && (
                <div
                  role='listbox'
                  aria-label='Search suggestions'
                  className='absolute left-0 right-0 mt-2 rounded-xl border border-white/10 bg-[#16161D] p-2 shadow-2xl'
                >
                  {loading && (
                    <div className='px-3 py-2 text-sm text-white/60'>
                      Searching…
                    </div>
                  )}

                  {!loading && items.length === 0 && (
                    <div className='px-3 py-2 text-sm text-white/60'>
                      No results
                    </div>
                  )}

                  {!loading &&
                    items.map((m, i) => {
                      const poster = m.poster_path
                        ? buildImageUrl(m.poster_path)
                        : '/placeholder.png';
                      const isActive = i === active;
                      return (
                        <button
                          key={m.id}
                          role='option'
                          aria-selected={isActive}
                          onClick={() => gotoMovie(m.id)}
                          className={[
                            'flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left',
                            isActive ? 'bg-white/10' : 'hover:bg-white/5',
                          ].join(' ')}
                        >
                          <div className='relative h-10 w-7 overflow-hidden rounded'>
                            <Image
                              src={poster}
                              alt={m.title}
                              fill
                              className='object-cover'
                            />
                          </div>
                          <div className='flex-1'>
                            <div className='line-clamp-1 text-sm'>
                              {m.title}
                            </div>
                            {m.release_date && (
                              <div className='text-xs text-white/50'>
                                {m.release_date.slice(0, 4)}
                              </div>
                            )}
                          </div>
                          {typeof m.vote_average === 'number' && (
                            <div className='text-xs text-white/60'>
                              ⭐ {m.vote_average.toFixed(1)}
                            </div>
                          )}
                        </button>
                      );
                    })}

                  {items.length > 0 && (
                    <button
                      onClick={() => {
                        setOpen(false);
                        router.push(
                          `/search?q=${encodeURIComponent(q.trim())}`
                        );
                      }}
                      className='mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-sm hover:bg-white/15'
                    >
                      See all results for “{q.trim()}”
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Hamburger (mobile only) */}
            <button
              type='button'
              aria-label='Open menu'
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
              className='md:hidden rounded-lg p-2 hover:bg-white/10 '
            >
              <Menu className='h-6 w-6' />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile side menu */}
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
