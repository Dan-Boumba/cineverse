import { Genre, Credits, Video, WatchProviders } from "./movie";

export interface TVShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  original_language: string;
  origin_country: string[];
}

export interface TVShowDetail extends TVShow {
  genres: Genre[];
  number_of_seasons: number;
  number_of_episodes: number;
  episode_run_time: number[];
  status: string;
  tagline: string;
  networks: { id: number; name: string; logo_path: string | null }[];
  spoken_languages: { iso_639_1: string; name: string }[];
  credits: Credits;
  videos: { results: Video[] };
  "watch/providers": { results: Record<string, WatchProviders> };
  similar: { results: TVShow[] };
}
