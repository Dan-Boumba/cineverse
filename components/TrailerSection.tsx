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
            src={`https://www.youtube-nocookie.com/embed/${videoKey}?autoplay=1&rel=0&modestbranding=1`}
            title={title}
            allow="autoplay; encrypted-media; fullscreen"
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
            <a
              href={`https://www.youtube.com/watch?v=${videoKey}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium text-white/80 hover:text-white transition-colors"
              style={{ background: "rgba(0,0,0,0.6)" }}
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Watch on YouTube
            </a>
          </>
        )}
      </div>
    </section>
  );
}
