export const TMDB_BASE_URL = process.env.NEXT_APP_BASEURL;

export const IMAGE_BASE_URL = process.env.NEXT_APP_BASEIMGURL;

export const API_KEY = process.env.NEXT_APP_APIKEY;
export const TOKEN = process.env.NEXT_APP_TOKEN;

const IMAGE_BASE =
  process.env.NEXT_PUBLIC_BASEIMGURL ?? 'https://image.tmdb.org/t/p';
export const buildImageUrl = (path?: string | null) =>
  path ? `${IMAGE_BASE}/w500${path}` : '/placeholder.png';
