export type MovieSummary = {
  id: number;
  original_title: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string;
  overview?: string;
  genres?: { id: number; name: string }[];
};

export type FavMovie = {
  id: number;
  title: string;
  poster_path?: string;
  release_date?: string;
  vote_average?: number | string;
  overview?: string;
};

export type Credits = {
  cast: {
    id: number;
    name?: string;
    original_name?: string; // ⬅️ add this for fallback
    character: string;
    profile_path: string | null;
  }[];
};
