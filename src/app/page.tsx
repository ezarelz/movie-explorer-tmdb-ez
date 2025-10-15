// app/page.tsx
import Navbar from '@/components/navbar';
import HomeClient, { type MovieSummary } from '@/components/HomeClient';
import { tmdb as api } from '@/lib/axios';
import Footer from '@/components/Footer';

type MovieList = { results: MovieSummary[] };

async function getTrending(window: 'day' | 'week' = 'day'): Promise<MovieList> {
  try {
    const { data } = await api.get(`/trending/all/${window}`, {
      params: { language: 'en-US', page: 1 },
    });
    return (data ?? { results: [] }) as MovieList;
  } catch {
    return { results: [] };
  }
}

async function getNewRelease(page = 1) {
  try {
    const { data } = await api.get('/movie/now_playing', {
      params: { language: 'en-US', page },
    });
    return (data ?? { results: [], page: 1, total_pages: 1 }) as {
      results: MovieSummary[];
      page: number;
      total_pages: number;
    };
  } catch {
    return { results: [], page: 1, total_pages: 1 };
  }
}

export default async function HomePage() {
  const [trending, newRelease] = await Promise.all([
    getTrending('day'),
    getNewRelease(1),
  ]);

  const hero = trending.results?.[0] ?? null;

  return (
    <main className='min-h-screen bg-[#0B0B11] text-white'>
      <Navbar />
      <HomeClient
        initialHero={hero}
        trending={trending.results ?? []}
        newRelease={newRelease.results ?? []}
      />
      <Footer />
    </main>
  );
}
