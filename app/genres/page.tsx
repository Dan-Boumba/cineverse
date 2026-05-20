import { tmdb, TMDB_LOCALE } from "@/lib/tmdb";
import { getLang } from "@/lib/getLang";
import { t } from "@/lib/lang";
import GenreFilter from "@/components/GenreFilter";

export default async function GenresPage() {
  const lang = await getLang();
  const api  = tmdb(TMDB_LOCALE[lang]);
  const tr   = (key: string) => t[lang][key] ?? t.en[key] ?? key;

  const { genres }   = await api.getGenres().catch(() => ({ genres: [] as {id:number;name:string}[] }));
  const firstGenre   = genres[0];
  const initialData  = firstGenre
    ? await api.getMoviesByGenre(firstGenre.id).catch(() => ({ results: [], total_pages: 0 }))
    : { results: [], total_pages: 0 };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 md:px-16">
      <h1 className="text-white text-3xl md:text-4xl font-black mb-2">{tr("genres_title")}</h1>
      <p className="text-gray-400 text-sm">{tr("genres_subtitle")}</p>
      <GenreFilter genres={genres} initialGenreId={firstGenre?.id ?? 0} initialMovies={initialData.results} initialTotalPages={initialData.total_pages} />
    </div>
  );
}
