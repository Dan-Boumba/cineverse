"use client";

import { useState } from "react";
import Image from "next/image";
import { Movie } from "@/types/movie";
import MovieCard from "./MovieCard";

interface Provider {
  id: number;
  name: string;
  color: string;
  logo_path: string | null;
}

interface ProviderData {
  provider: Provider;
  movies: Movie[];
}

interface Props {
  data: ProviderData[];
}

export default function StreamingFilter({ data }: Props) {
  const [activeId, setActiveId] = useState(data[0]?.provider.id ?? null);
  const active = data.find((d) => d.provider.id === activeId);

  return (
    <>
      {/* Logo filter buttons */}
      <div className="flex flex-wrap gap-4 mt-8">
        {data.map(({ provider }) => {
          const isActive = provider.id === activeId;
          return (
            <button
              key={provider.id}
              onClick={() => setActiveId(provider.id)}
              title={provider.name}
              className="relative rounded-xl overflow-hidden transition-all duration-200"
              style={{
                width: 72,
                height: 72,
                outline: isActive ? `3px solid ${provider.color}` : "3px solid transparent",
                outlineOffset: "2px",
                opacity: isActive ? 1 : 0.5,
                transform: isActive ? "scale(1.08)" : "scale(1)",
              }}
            >
              {provider.logo_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                  alt={provider.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: provider.color }}
                >
                  {provider.name.slice(0, 2)}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Active provider movies */}
      {active && (
        <div className="mt-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-8 rounded-full" style={{ background: active.provider.color }} />
            <div>
              <h2 className="text-white text-2xl font-bold">{active.provider.name}</h2>
              <p className="text-gray-500 text-xs mt-0.5">{active.movies.length} movies available</p>
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-9 gap-4">
            {active.movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
