/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { tmdb } from '@/lib/axios';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const window = searchParams.get('window') || 'day'; // day|week
  try {
    const { data } = await tmdb.get(`/trending/movie/${window}`, {
      params: { language: 'en-US', page: 1 },
    });
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: e?.response?.status || 500 }
    );
  }
}
