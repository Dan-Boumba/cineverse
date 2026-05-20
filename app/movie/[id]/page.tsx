import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { tmdb, TMDB_LOCALE, posterUrl, backdropUrl } from "@/lib/tmdb";
import { getLang } from "@/lib/getLang";
import { WatchProvider } from "@/types/movie";
import MovieCarousel from "@/components/MovieCarousel";
import TrailerSection from "@/components/TrailerSection";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function MoviePage({ params }: Props) {
  const { id } = await params;
  const lang  = await getLang();
  const api   = tmdb(TMDB_LOCALE[lang]);
  const movie = await api.getMovieDetail(Number(id)).catch(() => null);
  if (!movie) notFound();

  const director = movie.credits?.crew?.find((c) => c.job === "Director");
  const cast = movie.credits?.cast?.slice(0, 8) ?? [];
  const trailer = movie.videos?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube" && v.official
  ) ?? movie.videos?.results?.find((v) => v.type === "Trailer" && v.site === "YouTube");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const watchProviders = (movie as any)["watch/providers"]?.results ?? {};
  const usProviders = watchProviders["US"] ?? watchProviders["FR"] ?? Object.values(watchProviders)[0];

  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : null;

  const bg = backdropUrl(movie.backdrop_path);

  return (
    <div className="min-h-screen">
      {/* Hero backdrop */}
      <div className="relative w-full h-[50vw] min-h-[300px] max-h-[600px]">
        {bg && (
          <Image src={bg} alt={movie.title} fill className="object-cover" unoptimized />
        )}
        <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-[#141414] via-transparent to-black/30" />
      </div>

      {/* Content */}
      <div className="px-6 md:px-16 -mt-32 relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="shrink-0">
            <div className="relative w-40 md:w-56 aspect-2/3 rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={posterUrl(movie.poster_path, "w342")}
                alt={movie.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-white text-3xl md:text-4xl font-black mb-2">{movie.title}</h1>
            {movie.tagline && (
              <p className="text-gray-400 italic mb-4">{movie.tagline}</p>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300 mb-4">
              {movie.vote_average > 0 && (
                <span className="text-yellow-400 font-bold">★ {movie.vote_average.toFixed(1)}</span>
              )}
              {movie.release_date && <span>{movie.release_date.slice(0, 4)}</span>}
              {runtime && <span>{runtime}</span>}
              {movie.status && (
                <span className="px-2 py-0.5 rounded border border-gray-600 text-xs">
                  {movie.status}
                </span>
              )}
            </div>

            {/* Genres */}
            {movie.genres?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres.map((g) => (
                  <span key={g.id} className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ background: "#e50914", color: "white" }}>
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {/* Overview */}
            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6 max-w-2xl">
              {movie.overview}
            </p>

            {/* Director */}
            {director && (
              <p className="text-sm text-gray-400 mb-2">
                <span className="text-gray-200 font-semibold">Director:</span> {director.name}
              </p>
            )}

            {/* Languages / Countries */}
            {(movie.spoken_languages?.length ?? 0) > 0 && (
              <p className="text-sm text-gray-400 mb-2">
                <span className="text-gray-200 font-semibold">Language:</span>{" "}
                {movie.spoken_languages?.map((l) => l.name).join(", ")}
              </p>
            )}
          </div>
        </div>

        {/* Trailer */}
        {trailer && <TrailerSection videoKey={trailer.key} title={trailer.name} />}

        {/* Where to Watch */}
        {usProviders && (
          <section className="mt-10">
            <h2 className="text-white text-xl font-bold mb-4">Where to Watch</h2>
            {usProviders.flatrate && (
              <div className="mb-4">
                <p className="text-gray-400 text-sm mb-2">Stream</p>
                <div className="flex flex-wrap gap-3">
                  {usProviders.flatrate.map((p: WatchProvider) => (
                    <div key={p.provider_id} className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2">
                      <Image
                        src={`https://image.tmdb.org/t/p/w45${p.logo_path}`}
                        alt={p.provider_name}
                        width={28}
                        height={28}
                        className="rounded"
                        unoptimized
                      />
                      <span className="text-white text-sm">{p.provider_name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {usProviders.rent && (
              <div className="mb-4">
                <p className="text-gray-400 text-sm mb-2">Rent</p>
                <div className="flex flex-wrap gap-3">
                  {usProviders.rent.map((p: WatchProvider) => (
                    <div key={p.provider_id} className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2">
                      <Image
                        src={`https://image.tmdb.org/t/p/w45${p.logo_path}`}
                        alt={p.provider_name}
                        width={28}
                        height={28}
                        className="rounded"
                        unoptimized
                      />
                      <span className="text-white text-sm">{p.provider_name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {usProviders.link && (
              <a
                href={usProviders.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm text-blue-400 hover:text-blue-300 mt-1"
              >
                View all options on JustWatch →
              </a>
            )}
          </section>
        )}

        {/* Cast */}
        {cast.length > 0 && (
          <section className="mt-10">
            <h2 className="text-white text-xl font-bold mb-4">Cast</h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
              {cast.map((actor) => (
                <div key={actor.id} className="shrink-0 w-24 text-center">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-800 mb-2">
                    {actor.profile_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                        alt={actor.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600 text-2xl">
                        ?
                      </div>
                    )}
                  </div>
                  <p className="text-white text-xs font-semibold line-clamp-2">{actor.name}</p>
                  <p className="text-gray-500 text-xs line-clamp-1">{actor.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Similar movies */}
        {movie.similar?.results?.length > 0 && (
          <div className="mt-10">
            <MovieCarousel title="Similar Movies" movies={movie.similar.results} />
          </div>
        )}
      </div>
    </div>
  );
}
