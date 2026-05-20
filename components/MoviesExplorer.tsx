"use client";

import { useState, useCallback } from "react";
import { Movie } from "@/types/movie";
import { SortOption } from "@/lib/tmdb";
import MovieCard from "./MovieCard";

interface Genre { id: number; name: string }

interface Props {
  genres: Genre[];
  initialMovies: Movie[];
  initialTotalPages: number;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "popular",     label: "Popular"     },
  { value: "trending",    label: "Trending"    },
  { value: "top_rated",   label: "Top Rated"   },
  { value: "now_playing", label: "Now Playing" },
  { value: "upcoming",    label: "Upcoming"    },
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 35 }, (_, i) => currentYear - i);

export default function MoviesExplorer({ genres, initialMovies, initialTotalPages }: Props) {
  const [sort, setSort]         = useState<SortOption>("popular");
  const [genreId, setGenreId]   = useState<number | null>(null);
  const [year, setYear]         = useState<number | null>(null);
  const [movies, setMovies]     = useState<Movie[]>(initialMovies);
  const [page, setPage]         = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [loading, setLoading]   = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const buildUrl = (s: SortOption, g: number | null, y: number | null, p: number) => {
    const params = new URLSearchParams({ sort: s, page: String(p) });
    if (g) params.set("genre", String(g));
    if (y) params.set("year",  String(y));
    return `/api/movies?${params}`;
  };

  const fetchMovies = useCallback(async (
    s: SortOption, g: number | null, y: number | null, p: number, append = false
  ) => {
    append ? setLoadingMore(true) : setLoading(true);
    try {
      const res  = await fetch(buildUrl(s, g, y, p));
      const data = await res.json();
      setMovies((prev) => append ? [...prev, ...data.results] : data.results);
      setTotalPages(data.total_pages);
    } finally {
      append ? setLoadingMore(false) : setLoading(false);
    }
  }, []);

  const handleSort = (s: SortOption) => {
    setSort(s); setPage(1);
    fetchMovies(s, genreId, year, 1);
  };

  const handleGenre = (id: number | null) => {
    const next = id === genreId ? null : id;
    setGenreId(next); setPage(1);
    fetchMovies(sort, next, year, 1);
  };

  const handleYear = (y: number | null) => {
    setYear(y); setPage(1);
    fetchMovies(sort, genreId, y, 1);
  };

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchMovies(sort, genreId, year, next, true);
  };

  return (
    <>
      {/* ── Sort tabs ── */}
      <div className="flex gap-2 mt-6 flex-wrap">
        {SORT_OPTIONS.map((o) => (
          <button
            key={o.value}
            onClick={() => handleSort(o.value)}
            className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200"
            style={{
              background: sort === o.value ? "#e50914" : "rgba(255,255,255,0.07)",
              color:      sort === o.value ? "#fff"    : "#aaa",
            }}
          >
            {o.label}
          </button>
        ))}
      </div>

      {/* ── Filters row ── */}
      <div className="flex flex-wrap items-center gap-3 mt-5">
        {/* Genre filter */}
        <div className="flex flex-wrap gap-2">
          {genres.map((g) => (
            <button
              key={g.id}
              onClick={() => handleGenre(g.id)}
              className="px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 border"
              style={{
                borderColor: genreId === g.id ? "#e50914" : "transparent",
                background:  genreId === g.id ? "rgba(229,9,20,0.15)" : "rgba(255,255,255,0.06)",
                color:       genreId === g.id ? "#e50914" : "#888",
              }}
            >
              {g.name}
            </button>
          ))}
        </div>

        {/* Year picker */}
        <select
          value={year ?? ""}
          onChange={(e) => handleYear(e.target.value ? Number(e.target.value) : null)}
          className="ml-auto px-3 py-1.5 rounded-lg text-sm outline-none cursor-pointer"
          style={{ background: "#1f1f1f", border: "1px solid #444", color: "#e5e5e5" }}
        >
          <option value="" style={{ background: "#1f1f1f", color: "#e5e5e5" }}>All years</option>
          {YEARS.map((y) => (
            <option key={y} value={y} style={{ background: "#1f1f1f", color: "#e5e5e5" }}>{y}</option>
          ))}
        </select>
      </div>

      {/* ── Active filters summary ── */}
      {(genreId || year) && (
        <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
          <span>Filtering by:</span>
          {genreId && (
            <span className="px-2 py-0.5 rounded-full bg-red-900/40 text-red-400">
              {genres.find((g) => g.id === genreId)?.name}
              <button onClick={() => handleGenre(null)} className="ml-1 hover:text-white">✕</button>
            </span>
          )}
          {year && (
            <span className="px-2 py-0.5 rounded-full bg-gray-700 text-gray-300">
              {year}
              <button onClick={() => handleYear(null)} className="ml-1 hover:text-white">✕</button>
            </span>
          )}
        </div>
      )}

      {/* ── Movie grid ── */}
      <div className="mt-8">
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-10 h-10 border-4 border-gray-700 border-t-white rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {movies.length === 0 ? (
              <p className="text-center text-gray-500 py-24">No movies found for this combination.</p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-9 gap-4">
                {movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            )}

            {page < totalPages && movies.length > 0 && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="flex items-center gap-2 px-8 py-3 rounded-full text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {loadingMore ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Loading...
                    </>
                  ) : "Load more"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
