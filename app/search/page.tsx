import { tmdb, TMDB_LOCALE } from "@/lib/tmdb";
import { getLang } from "@/lib/getLang";
import { t } from "@/lib/lang";
import { Movie } from "@/types/movie";
import { TVShow } from "@/types/tv";
import MovieCard from "@/components/MovieCard";
import TVCard from "@/components/TVCard";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

type Result =
  | { type: "movie"; item: Movie }
  | { type: "tv";    item: TVShow };

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query  = q?.trim() ?? "";

  const lang = await getLang();
  const api  = tmdb(TMDB_LOCALE[lang]);
  const tr   = (key: string) => t[lang][key] ?? t.en[key] ?? key;

  let results: Result[] = [];
  let totalMovies = 0;
  let totalTV = 0;

  if (query) {
    const [movies, shows] = await Promise.all([
      api.searchMovies(query).catch(() => ({ results: [], total_results: 0 })),
      api.searchTV(query).catch(()    => ({ results: [], total_results: 0 })),
    ]);

    totalMovies = movies.total_results;
    totalTV     = shows.total_results;

    const movieResults: Result[] = movies.results.map((m) => ({ type: "movie", item: m }));
    const tvResults:    Result[] = shows.results.map((s)  => ({ type: "tv",    item: s }));

    // Interleave: sort combined list by vote_average descending
    results = [...movieResults, ...tvResults].sort(
      (a, b) => b.item.vote_average - a.item.vote_average
    );
  }

  const total = totalMovies + totalTV;

  return (
    <div className="min-h-screen pt-24 px-6 md:px-16 max-w-screen-2xl mx-auto">
      <h1 className="text-white text-2xl font-bold mb-2">
        {query ? `${tr("see_all_results")} "${query}"` : tr("search_title")}
      </h1>

      {query && total > 0 && (
        <p className="text-gray-400 text-sm mb-8">
          {total} {tr("results_found")}
          <span className="text-gray-600 ml-2">
            ({totalMovies} {tr("movies").toLowerCase()} · {totalTV} {tr("series").toLowerCase()})
          </span>
        </p>
      )}

      {!query && (
        <p className="text-gray-500 mt-16 text-center">{tr("search_hint")}</p>
      )}

      {query && results.length === 0 && (
        <p className="text-gray-500 mt-16 text-center">
          {tr("no_movies_found")} &quot;{query}&quot;.
        </p>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-9 gap-4">
          {results.map((r) =>
            r.type === "movie"
              ? <MovieCard key={`m-${r.item.id}`} movie={r.item as Movie} />
              : <TVCard    key={`t-${r.item.id}`} show={r.item as TVShow} />
          )}
        </div>
      )}
    </div>
  );
}
