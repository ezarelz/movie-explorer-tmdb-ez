import axios from 'axios';
import { TMDB_BASE_URL, TOKEN, API_KEY } from './config';

export const tmdb = axios.create({
  baseURL: TMDB_BASE_URL,
  timeout: 15000,
});

tmdb.interceptors.request.use((cfg) => {
  cfg.headers = cfg.headers ?? {};
  if (TOKEN) cfg.headers.Authorization = `Bearer ${TOKEN}`;
  if (API_KEY) {
    cfg.params = { ...(cfg.params || {}), api_key: API_KEY };
  }
  return cfg;
});

/** Browser-safe client that only calls YOUR app (no secrets) */
export const appClient = axios.create({
  baseURL: (process.env.NEXT_PUBLIC_APP_BASEURL || '').replace(/\/$/, ''),
});
