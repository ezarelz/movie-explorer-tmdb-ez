/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { tmdb as api } from '@/lib/axios';
import type { Credits, MovieSummary } from '@/lib/types';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page') || 1);
  try {
    const { data } = await api.get('/movie/now_playing', {
      params: { language: 'en-US', page },
    });
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: e?.response?.status || 500 }
    );
  }
}

export const getMovieDetail = async (
  id: string | number
): Promise<MovieSummary> => {
  const { data } = await api.get(`/movie/${id}`, {
    params: { language: 'en-US' },
  });
  return data;
};

export const getMovieCredits = async (
  id: string | number
): Promise<Credits> => {
  const { data } = await api.get(`/movie/${id}/credits`, {
    params: { language: 'en-US' },
  });
  return data;
};

export const getMovieReleaseDates = async (id: string | number) => {
  const { data } = await api.get(`/movie/${id}/release_dates`);
  return data as {
    results: Array<{
      iso_3166_1: string;
      release_dates: Array<{ certification: string }>;
    }>;
  };
};
