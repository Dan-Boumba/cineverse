import { NextRequest, NextResponse } from "next/server";
import { discoverMovies, getMoviesByGenre, SortOption } from "@/lib/tmdb";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const genre  = searchParams.get("genre");
  const sort   = (searchParams.get("sort") ?? "popular") as SortOption;
  const year   = searchParams.get("year");
  const page   = Number(searchParams.get("page") ?? 1);

  // Legacy genre-only path (used by GenreFilter)
  if (genre && !searchParams.has("sort")) {
    const data = await getMoviesByGenre(Number(genre), page).catch(() => ({ results: [], total_pages: 0 }));
    return NextResponse.json(data);
  }

  const data = await discoverMovies({
    sort,
    genre: genre ? Number(genre) : undefined,
    year:  year  ? Number(year)  : undefined,
    page,
  }).catch(() => ({ results: [], total_pages: 0 }));

  return NextResponse.json(data);
}
