import { NextRequest, NextResponse } from "next/server";
import { discoverTV, TVSortOption } from "@/lib/tmdb";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const sort  = (searchParams.get("sort") ?? "popular") as TVSortOption;
  const genre = searchParams.get("genre");
  const year  = searchParams.get("year");
  const page  = Number(searchParams.get("page") ?? 1);

  const data = await discoverTV({
    sort,
    genre: genre ? Number(genre) : undefined,
    year:  year  ? Number(year)  : undefined,
    page,
  }).catch(() => ({ results: [], total_pages: 0 }));

  return NextResponse.json(data);
}
