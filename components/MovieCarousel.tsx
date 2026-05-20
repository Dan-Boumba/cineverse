"use client";

import { useRef } from "react";
import { Movie } from "@/types/movie";
import MovieCard from "./MovieCard";

interface Props {
  title: string;
  movies: Movie[];
  accentColor?: string;
}

export default function MovieCarousel({ title, movies, accentColor }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!ref.current) return;
    const amount = ref.current.clientWidth * 0.75;
    ref.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  if (!movies.length) return null;

  return (
    <section className="mb-10">
      <h2 className="text-white text-lg md:text-xl font-semibold mb-3 px-6 md:px-16 flex items-center gap-2">
        {accentColor && (
          <span className="w-1 h-5 rounded-full inline-block" style={{ background: accentColor }} />
        )}
        {title}
      </h2>
      <div className="relative group/carousel">
        {/* Left arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-2 rounded-r opacity-0 group-hover/carousel:opacity-100 transition-opacity h-full flex items-center"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Cards */}
        <div
          ref={ref}
          className="flex gap-3 overflow-x-auto scrollbar-hide px-6 md:px-16 pb-2"
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-2 rounded-l opacity-0 group-hover/carousel:opacity-100 transition-opacity h-full flex items-center"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}
