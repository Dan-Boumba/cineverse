"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { useT } from "@/context/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

interface Suggestion {
  id: number;
  title: string;
  subtitle: string;
  poster_path: string | null;
  vote_average: number;
  type: "movie" | "tv";
}

export default function Navbar() {
  const tr = useT();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (showSearch) inputRef.current?.focus();
  }, [showSearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setFocused(false);
        if (!query) setShowSearch(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [query]);

  const fetchSuggestions = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setSuggestions(data.results ?? []);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    fetchSuggestions(val);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      closeSearch();
    }
  };

  const handleSuggestionClick = (id: number, type: "movie" | "tv") => {
    router.push(type === "tv" ? `/series/${id}` : `/movie/${id}`);
    closeSearch();
  };

  const closeSearch = () => {
    setShowSearch(false);
    setQuery("");
    setSuggestions([]);
    setFocused(false);
  };

  const showDropdown = focused && (suggestions.length > 0 || (loading && query.length >= 2));

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 md:px-16 py-3"
      style={{
        background: scrolled
          ? "rgba(20,20,20,0.98)"
          : "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)",
      }}
    >
      <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <span
            className="text-2xl md:text-3xl font-black tracking-tight"
            style={{ color: "#e50914", letterSpacing: "-1px" }}
          >
            CINEVERSE
          </span>
        </Link>

        {/* Nav links (desktop) */}
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-300">
          <Link href="/" className="hover:text-white transition-colors">{tr("home")}</Link>
          <Link href="/movies" className="hover:text-white transition-colors">{tr("movies")}</Link>
          <Link href="/series" className="hover:text-white transition-colors">{tr("series")}</Link>
          <Link href="/streaming" className="hover:text-white transition-colors">{tr("streaming")}</Link>
          <Link href="/genres" className="hover:text-white transition-colors">{tr("genres")}</Link>
        </div>

        {/* Right side: hamburger (mobile) + language switcher + search */}
        <div ref={wrapperRef} className="relative flex items-center gap-3">
          {/* Hamburger (mobile only) */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden text-gray-300 hover:text-white transition-colors p-1"
            aria-label="Menu"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>
          {showSearch ? (
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={handleChange}
                  onFocus={() => setFocused(true)}
                  placeholder={tr("search_placeholder")}
                  className="bg-black/90 border border-gray-500 text-white px-3 py-1.5 text-sm rounded outline-none focus:border-white w-52 md:w-72 transition-all"
                />
                {loading && (
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                    <div className="w-3.5 h-3.5 border-2 border-gray-500 border-t-white rounded-full animate-spin" />
                  </div>
                )}

                {/* Suggestions dropdown */}
                {showDropdown && (
                  <div className="absolute top-full mt-1 left-0 right-0 rounded-lg overflow-hidden shadow-2xl border border-gray-700"
                    style={{ background: "#1a1a1a", minWidth: "280px" }}>
                    {suggestions.map((s, i) => (
                      <button
                        key={s.id}
                        type="button"
                        onMouseDown={() => handleSuggestionClick(s.id, s.type)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/10 transition-colors text-left"
                        style={{ borderBottom: i < suggestions.length - 1 ? "1px solid #2a2a2a" : "none" }}
                      >
                        {/* Poster thumbnail */}
                        <div className="shrink-0 w-8 h-12 relative rounded overflow-hidden bg-gray-800">
                          {s.poster_path ? (
                            <Image
                              src={`https://image.tmdb.org/t/p/w92${s.poster_path}`}
                              alt={s.title}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">?</div>
                          )}
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-white text-sm font-medium truncate">{s.title}</p>
                            <span
                              className="shrink-0 text-xs px-1.5 py-0.5 rounded font-semibold"
                              style={{ background: s.type === "tv" ? "#3b82f6" : "#e50914", color: "#fff", fontSize: "10px" }}
                            >
                              {s.type === "tv" ? "TV" : "Film"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            {s.subtitle && <span className="text-gray-400 text-xs">{s.subtitle}</span>}
                            {s.vote_average > 0 && (
                              <span className="text-yellow-400 text-xs">★ {s.vote_average.toFixed(1)}</span>
                            )}
                          </div>
                        </div>
                        <svg className="w-4 h-4 text-gray-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ))}
                    {/* See all results */}
                    {query.trim().length >= 2 && (
                      <button
                        type="submit"
                        className="w-full px-3 py-2.5 text-sm text-center transition-colors hover:bg-white/10"
                        style={{ color: "#e50914", borderTop: "1px solid #2a2a2a" }}
                      >
                        {tr("see_all_results")} &quot;{query}&quot;
                      </button>
                    )}
                  </div>
                )}
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className="text-gray-300 hover:text-white transition-colors p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Mobile full-screen overlay */}
      {menuOpen && (
        <div className="fixed inset-0 flex flex-col md:hidden" style={{ background: "#141414" }}>
          <div className="flex flex-col items-center justify-center flex-1 gap-8">
            {[
              { key: "home",      href: "/" },
              { key: "movies",    href: "/movies" },
              { key: "series",    href: "/series" },
              { key: "streaming", href: "/streaming" },
              { key: "genres",    href: "/genres" },
            ].map(({ key, href }) => (
              <Link
                key={key}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="text-2xl font-semibold text-gray-300 hover:text-white transition-colors"
              >
                {tr(key)}
              </Link>
            ))}
          </div>
          <div className="flex justify-center pb-14">
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </nav>
  );
}
