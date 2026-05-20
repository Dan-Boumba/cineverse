"use client";

import { useState } from "react";

interface Props {
  videoKey: string;
  title: string;
}

export default function TrailerSection({ videoKey, title }: Props) {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="mt-10">
      <h2 className="text-white text-xl font-bold mb-4">Trailer</h2>
      <div className="relative w-full max-w-3xl aspect-video rounded-xl overflow-hidden bg-black">
        {playing ? (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
            title={title}
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        ) : (
          <>
            <img
              src={`https://img.youtube.com/vi/${videoKey}/maxresdefault.jpg`}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <button
                onClick={() => setPlaying(true)}
                className="w-16 h-16 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                style={{ background: "#e50914" }}
              >
                <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
