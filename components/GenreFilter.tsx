"use client";

import { useState, useEffect, useCallback } from "react";
import { Movie } from "@/types/movie";
import MovieCard from "./MovieCard";

interface Genre {
  id: number;
  name: string;
}

interface Props {
  genres: Genre[];
  initialGenreId: number;
  initialMovies: Movie[];
  initialTotalPages: number;
}

const GENRE_COLORS: Record<number, string> = {
  28:    "#e50914", // Action
  12:    "#f5a623", // Adventure
  16:    "#7ed321", // Animation
  35:    "#f8d200", // Comedy
  80:    "#4a4a4a", // Crime
  99:    "#417505", // Documentary
  18:    "#9b59b6", // Drama
  10751: "#50e3c2", // Family
  14:    "#8b5cf6", // Fantasy
  36:    "#d4a017", // History
  27:    "#b91c1c", // Horror
  10402: "#ec4899", // Music
  9648:  "#2d3748", // Mystery
  10749: "#e91e8c", // Romance
  878:   "#00bcd4", // Sci-Fi
  10770: "#607d8b", // TV Movie
  53:    "#ff5722", // Thriller
  10752: "#795548", // War
  37:    "#a0522d", // Western
};

export default function GenreFilter({ genres, initialGenreId, initialMovies, initialTotalPages }: Props) {
  const [activeId, setActiveId] = useState(initialGenreId);
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchMovies = useCallback(async (genreId: number, p: number, append = false) => {
    append ? setLoadingMore(true) : setLoading(true);
    try {
      const res = await fetch(`/api/movies?genre=${genreId}&page=${p}`);
      const data = await res.json();
      setMovies((prev) => append ? [...prev, ...data.results] : data.results);
      setTotalPages(data.total_pages);
    } finally {
      append ? setLoadingMore(false) : setLoading(false);
    }
  }, []);

  const handleGenreClick = (id: number) => {
    if (id === activeId) return;
    setActiveId(id);
    setPage(1);
    fetchMovies(id, 1);
  };

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchMovies(activeId, next, true);
  };

  const activeColor = GENRE_COLORS[activeId] ?? "#e50914";
  const activeGenre = genres.find((g) => g.id === activeId);

  return (
    <>
      {/* Genre filter pills */}
      <div className="flex flex-wrap gap-2 mt-6">
        {genres.map((g) => {
          const isActive = g.id === activeId;
          const color = GENRE_COLORS[g.id] ?? "#666";
          return (
            <button
              key={g.id}
              onClick={() => handleGenreClick(g.id)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
              style={{
                background: isActive ? color : "rgba(255,255,255,0.07)",
                color: isActive ? "#fff" : "#aaa",
                outline: isActive ? `2px solid ${color}` : "2px solid transparent",
                outlineOffset: "2px",
              }}
            >
              {g.name}
            </button>
          );
        })}
      </div>

      {/* Section header */}
      <div className="flex items-center gap-3 mt-10 mb-6">
        <div className="w-1.5 h-8 rounded-full" style={{ background: activeColor }} />
        <div>
          <h2 className="text-white text-2xl font-bold">{activeGenre?.name}</h2>
          <p className="text-gray-500 text-xs mt-0.5">{movies.length} movies loaded</p>
        </div>
      </div>

      {/* Movie grid */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="w-10 h-10 border-4 border-gray-700 border-t-white rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-9 gap-4">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {page < totalPages && (
            <div className="flex justify-center mt-10">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="flex items-center gap-2 px-8 py-3 rounded-full text-sm font-semibold text-white transition-all disabled:opacity-50"
                style={{ background: activeColor }}
              >
                {loadingMore ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load more"
                )}
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
