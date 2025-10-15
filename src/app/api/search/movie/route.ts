/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/search/movie/route.ts
import { NextResponse } from 'next/server';
import { tmdb } from '@/lib/axios';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = (searchParams.get('query') || '').trim();
  const include_adult = searchParams.get('include_adult') ?? 'false';
  const language = searchParams.get('language') ?? 'en-US';
  const page = Number(searchParams.get('page') || 1);

  if (!query) {
    return NextResponse.json({ results: [], page: 1, total_pages: 1 });
  }

  try {
    const { data } = await tmdb.get('/search/movie', {
      params: { query, include_adult, language, page },
    });

    const results = (data?.results ?? []).map((m: any) => ({
      id: m.id,
      title: m.title,
      poster_path: m.poster_path,
      release_date: m.release_date,
      vote_average: m.vote_average,
    }));

    return NextResponse.json({
      results,
      page: data?.page ?? 1,
      total_pages: data?.total_pages ?? 1,
    });
  } catch {
    return NextResponse.json({ results: [], page: 1, total_pages: 1 });
  }
}
