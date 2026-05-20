import { NextRequest, NextResponse } from "next/server";
import { searchMovies, searchTV } from "@/lib/tmdb";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json({ results: [] });

  const [movies, shows] = await Promise.all([
    searchMovies(q, 1).catch(() => ({ results: [] })),
    searchTV(q, 1).catch(() => ({ results: [] })),
  ]);

  const movieResults = movies.results.slice(0, 4).map((m) => ({
    id: m.id,
    title: m.title,
    subtitle: m.release_date?.slice(0, 4) ?? "",
    poster_path: m.poster_path,
    vote_average: m.vote_average,
    type: "movie" as const,
  }));

  const tvResults = shows.results.slice(0, 3).map((s) => ({
    id: s.id,
    title: s.name,
    subtitle: s.first_air_date?.slice(0, 4) ?? "",
    poster_path: s.poster_path,
    vote_average: s.vote_average,
    type: "tv" as const,
  }));

  // Interleave: sort all by popularity (vote_average as proxy), cap at 7
  const combined = [...movieResults, ...tvResults]
    .sort((a, b) => b.vote_average - a.vote_average)
    .slice(0, 7);

  return NextResponse.json({ results: combined });
}
