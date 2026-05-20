import { tmdb, TMDB_LOCALE } from "@/lib/tmdb";
import { getLang } from "@/lib/getLang";
import { t } from "@/lib/lang";
import MoviesExplorer from "@/components/MoviesExplorer";

export default async function MoviesPage() {
  const lang = await getLang();
  const api  = tmdb(TMDB_LOCALE[lang]);
  const tr   = (key: string) => t[lang][key] ?? t.en[key] ?? key;

  const empty = { results: [] as never[], total_pages: 0 };
  const [{ genres }, initialData] = await Promise.all([
    api.getGenres().catch(() => ({ genres: [] as {id:number;name:string}[] })),
    api.getPopular().catch(() => empty),
  ]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 md:px-16">
      <h1 className="text-white text-3xl md:text-4xl font-black mb-2">{tr("movies_title")}</h1>
      <p className="text-gray-400 text-sm">{tr("movies_subtitle")}</p>
      <MoviesExplorer genres={genres} initialMovies={initialData.results} initialTotalPages={initialData.total_pages} />
    </div>
  );
}
