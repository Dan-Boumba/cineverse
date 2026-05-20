import { Movie, MovieDetail, TMDBResponse } from "@/types/movie";
import { TVShow, TVShowDetail } from "@/types/tv";
export { TMDB_LOCALE } from "./lang";

const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY;

async function fetcher<T>(endpoint: string, params: Record<string, string> = {}, locale = "en-US"): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", API_KEY!);
  url.searchParams.set("language", locale);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
  return res.json();
}

export function posterUrl(path: string | null, size = "w500") {
  if (!path) return "/no-poster.png";
  return `${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE}/${size}${path}`;
}

export function backdropUrl(path: string | null, size = "original") {
  if (!path) return null;
  return `${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE}/${size}${path}`;
}

export type SortOption   = "popular" | "top_rated" | "now_playing" | "upcoming" | "trending";
export type TVSortOption = "popular" | "top_rated" | "on_the_air"  | "trending";

export const PROVIDERS = [
  { id: 8,   name: "Netflix",    color: "#e50914" },
  { id: 9,   name: "Prime Video",color: "#00a8e0" },
  { id: 337, name: "Disney+",    color: "#0063e5" },
  { id: 350, name: "Apple TV+",  color: "#555555" },
  { id: 15,  name: "Hulu",       color: "#1ce783" },
  { id: 531, name: "Paramount+", color: "#0064ff" },
] as const;

// Factory: call tmdb(locale) in server components to get locale-bound API functions
export function tmdb(locale = "en-US") {
  const f = <T>(endpoint: string, params: Record<string, string> = {}) =>
    fetcher<T>(endpoint, params, locale);

  return {
    getTrending:   (timeWindow: "day" | "week" = "week") =>
      f<TMDBResponse<Movie>>(`/trending/movie/${timeWindow}`),

    getPopular:    (page = 1) =>
      f<TMDBResponse<Movie>>("/movie/popular", { page: String(page) }),

    getTopRated:   (page = 1) =>
      f<TMDBResponse<Movie>>("/movie/top_rated", { page: String(page) }),

    getUpcoming:   (page = 1) =>
      f<TMDBResponse<Movie>>("/movie/upcoming", { page: String(page) }),

    getNowPlaying: (page = 1) =>
      f<TMDBResponse<Movie>>("/movie/now_playing", { page: String(page) }),

    getMovieDetail: (id: number) =>
      f<MovieDetail>(`/movie/${id}`, {
        append_to_response: "credits,videos,watch/providers,similar",
      }),

    searchMovies: (query: string, page = 1) =>
      f<TMDBResponse<Movie>>("/search/movie", { query, page: String(page), include_adult: "false" }),

    getMoviesByGenre: (genreId: number, page = 1) =>
      f<TMDBResponse<Movie>>("/discover/movie", {
        with_genres: String(genreId), page: String(page), sort_by: "popularity.desc",
      }),

    getGenres: () =>
      f<{ genres: { id: number; name: string }[] }>("/genre/movie/list"),

    getByProvider: (providerId: number, region = "US", page = 1) =>
      f<TMDBResponse<Movie>>("/discover/movie", {
        with_watch_providers: String(providerId), watch_region: region,
        page: String(page), sort_by: "popularity.desc",
      }),

    getNollywood: (page = 1) =>
      f<TMDBResponse<Movie>>("/discover/movie", {
        with_origin_country: "NG", page: String(page),
        sort_by: "popularity.desc", "vote_count.gte": "10",
      }),

    discoverMovies: (params: { sort?: SortOption; genre?: number; year?: number; page?: number }) => {
      const { sort = "popular", genre, year, page = 1 } = params;
      if (sort === "trending" && !genre && !year)
        return f<TMDBResponse<Movie>>("/trending/movie/week", { page: String(page) });
      if (!genre && !year) {
        const ep = sort === "top_rated" ? "/movie/top_rated"
          : sort === "now_playing" ? "/movie/now_playing"
          : sort === "upcoming" ? "/movie/upcoming"
          : "/movie/popular";
        return f<TMDBResponse<Movie>>(ep, { page: String(page) });
      }
      const sortMap: Record<SortOption, string> = {
        popular: "popularity.desc", top_rated: "vote_average.desc",
        now_playing: "primary_release_date.desc", upcoming: "primary_release_date.asc",
        trending: "popularity.desc",
      };
      const dp: Record<string, string> = { sort_by: sortMap[sort], page: String(page), "vote_count.gte": "50" };
      if (genre) dp.with_genres = String(genre);
      if (year)  dp.primary_release_year = String(year);
      if (sort === "upcoming") dp["primary_release_date.gte"] = new Date().toISOString().slice(0, 10);
      return f<TMDBResponse<Movie>>("/discover/movie", dp);
    },

    // TV
    getTrendingTV:   (timeWindow: "day" | "week" = "week") =>
      f<TMDBResponse<TVShow>>(`/trending/tv/${timeWindow}`),

    getPopularTV:    (page = 1) =>
      f<TMDBResponse<TVShow>>("/tv/popular", { page: String(page) }),

    getTopRatedTV:   (page = 1) =>
      f<TMDBResponse<TVShow>>("/tv/top_rated", { page: String(page) }),

    getOnTheAirTV:   (page = 1) =>
      f<TMDBResponse<TVShow>>("/tv/on_the_air", { page: String(page) }),

    getTVDetail: (id: number) =>
      f<TVShowDetail>(`/tv/${id}`, {
        append_to_response: "credits,videos,watch/providers,similar",
      }),

    searchTV: (query: string, page = 1) =>
      f<TMDBResponse<TVShow>>("/search/tv", { query, page: String(page), include_adult: "false" }),

    getTVGenres: () =>
      f<{ genres: { id: number; name: string }[] }>("/genre/tv/list"),

    discoverTV: (params: { sort?: TVSortOption; genre?: number; year?: number; page?: number }) => {
      const { sort = "popular", genre, year, page = 1 } = params;
      if (sort === "trending" && !genre && !year)
        return f<TMDBResponse<TVShow>>("/trending/tv/week", { page: String(page) });
      if (!genre && !year) {
        const ep = sort === "top_rated" ? "/tv/top_rated"
          : sort === "on_the_air" ? "/tv/on_the_air"
          : "/tv/popular";
        return f<TMDBResponse<TVShow>>(ep, { page: String(page) });
      }
      const sortMap: Record<TVSortOption, string> = {
        popular: "popularity.desc", top_rated: "vote_average.desc",
        on_the_air: "first_air_date.desc", trending: "popularity.desc",
      };
      const dp: Record<string, string> = { sort_by: sortMap[sort], page: String(page), "vote_count.gte": "20" };
      if (genre) dp.with_genres = String(genre);
      if (year)  dp.first_air_date_year = String(year);
      return f<TMDBResponse<TVShow>>("/discover/tv", dp);
    },

    getProviderLogos: async (): Promise<Record<number, string>> => {
      const data = await f<{ results: { provider_id: number; logo_path: string }[] }>(
        "/watch/providers/movie", { watch_region: "US" }
      );
      return Object.fromEntries(data.results.map((p) => [p.provider_id, p.logo_path]));
    },
  };
}

// Keep flat exports for API routes (locale is passed per-request there)
export const searchMovies = (query: string, page = 1, locale = "en-US") =>
  fetcher<TMDBResponse<Movie>>("/search/movie", { query, page: String(page), include_adult: "false" }, locale);

export const searchTV = (query: string, page = 1, locale = "en-US") =>
  fetcher<TMDBResponse<TVShow>>("/search/tv", { query, page: String(page), include_adult: "false" }, locale);

export const getMoviesByGenre = (genreId: number, page = 1, locale = "en-US") =>
  fetcher<TMDBResponse<Movie>>("/discover/movie", {
    with_genres: String(genreId), page: String(page), sort_by: "popularity.desc",
  }, locale);

export const discoverMovies = (params: { sort?: SortOption; genre?: number; year?: number; page?: number }, locale = "en-US") => {
  const { sort = "popular", genre, year, page = 1 } = params;
  if (sort === "trending" && !genre && !year)
    return fetcher<TMDBResponse<Movie>>("/trending/movie/week", { page: String(page) }, locale);
  if (!genre && !year) {
    const ep = sort === "top_rated" ? "/movie/top_rated"
      : sort === "now_playing" ? "/movie/now_playing"
      : sort === "upcoming" ? "/movie/upcoming"
      : "/movie/popular";
    return fetcher<TMDBResponse<Movie>>(ep, { page: String(page) }, locale);
  }
  const sortMap: Record<SortOption, string> = {
    popular: "popularity.desc", top_rated: "vote_average.desc",
    now_playing: "primary_release_date.desc", upcoming: "primary_release_date.asc",
    trending: "popularity.desc",
  };
  const dp: Record<string, string> = { sort_by: sortMap[sort], page: String(page), "vote_count.gte": "50" };
  if (genre) dp.with_genres = String(genre);
  if (year)  dp.primary_release_year = String(year);
  if (sort === "upcoming") dp["primary_release_date.gte"] = new Date().toISOString().slice(0, 10);
  return fetcher<TMDBResponse<Movie>>("/discover/movie", dp, locale);
};

export const discoverTV = (params: { sort?: TVSortOption; genre?: number; year?: number; page?: number }, locale = "en-US") => {
  const { sort = "popular", genre, year, page = 1 } = params;
  if (sort === "trending" && !genre && !year)
    return fetcher<TMDBResponse<TVShow>>("/trending/tv/week", { page: String(page) }, locale);
  if (!genre && !year) {
    const ep = sort === "top_rated" ? "/tv/top_rated" : sort === "on_the_air" ? "/tv/on_the_air" : "/tv/popular";
    return fetcher<TMDBResponse<TVShow>>(ep, { page: String(page) }, locale);
  }
  const sortMap: Record<TVSortOption, string> = {
    popular: "popularity.desc", top_rated: "vote_average.desc",
    on_the_air: "first_air_date.desc", trending: "popularity.desc",
  };
  const dp: Record<string, string> = { sort_by: sortMap[sort], page: String(page), "vote_count.gte": "20" };
  if (genre) dp.with_genres = String(genre);
  if (year)  dp.first_air_date_year = String(year);
  return fetcher<TMDBResponse<TVShow>>("/discover/tv", dp, locale);
};
