"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Movie } from "@/types/movie";
import { backdropUrl } from "@/lib/tmdb";

interface Props {
  movies: Movie[];
}

export default function HeroBanner({ movies }: Props) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (animating || index === current) return;
      setAnimating(true);
      setTimeout(() => {
        setCurrent(index);
        setAnimating(false);
      }, 400);
    },
    [animating, current]
  );

  const next = useCallback(() => {
    goTo((current + 1) % movies.length);
  }, [current, movies.length, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const movie = movies[current];
  const bg = backdropUrl(movie.backdrop_path);
  const year = movie.release_date?.slice(0, 4) ?? "";
  const rating = movie.vote_average?.toFixed(1) ?? "";

  return (
    <div className="relative w-full h-[56vw] min-h-[400px] max-h-[700px] mb-8 overflow-hidden">
      {/* Backdrop */}
      {bg && (
        <Image
          key={movie.id}
          src={bg}
          alt={movie.title}
          fill
          priority
          className="object-cover transition-opacity duration-700"
          style={{ opacity: animating ? 0 : 1 }}
          unoptimized
        />
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-t from-[#141414] via-transparent to-transparent" />

      {/* Content */}
      <div
        className="absolute bottom-16 left-6 md:left-16 max-w-lg transition-opacity duration-400"
        style={{ opacity: animating ? 0 : 1 }}
      >
        <h1 className="text-white text-3xl md:text-5xl font-black mb-3 drop-shadow-lg">
          {movie.title}
        </h1>
        <div className="flex items-center gap-3 mb-4 text-sm text-gray-300">
          {rating && <span className="text-yellow-400 font-semibold">★ {rating}</span>}
          {year && <span>{year}</span>}
        </div>
        <p className="text-gray-200 text-sm md:text-base line-clamp-3 mb-6 drop-shadow">
          {movie.overview}
        </p>
        <div className="flex gap-3">
          <Link
            href={`/movie/${movie.id}`}
            className="flex items-center gap-2 bg-white text-black font-bold px-6 py-2.5 rounded hover:bg-gray-200 transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            More Info
          </Link>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-5 left-6 md:left-16 flex gap-2">
        {movies.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === current ? "24px" : "8px",
              height: "8px",
              background: i === current ? "#e50914" : "rgba(255,255,255,0.4)",
            }}
          />
        ))}
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={() => goTo((current - 1 + movies.length) % movies.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => next()}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
