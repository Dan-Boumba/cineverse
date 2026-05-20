import { tmdb, TMDB_LOCALE } from "@/lib/tmdb";
import { getLang } from "@/lib/getLang";
import { t } from "@/lib/lang";
import HeroBanner from "@/components/HeroBanner";
import MovieCarousel from "@/components/MovieCarousel";
import TVCarousel from "@/components/TVCarousel";

export default async function HomePage() {
  const lang = await getLang();
  const api  = tmdb(TMDB_LOCALE[lang]);
  const tr   = (key: string) => t[lang][key] ?? t.en[key] ?? key;

  const empty = { results: [] };
  const [trending, popular, topRated, upcoming, nowPlaying, netflix, prime, disney, trendingTV, popularTV, topRatedTV, nollywood] = await Promise.all([
    api.getTrending("week").catch(() => empty), api.getPopular().catch(() => empty),
    api.getTopRated().catch(() => empty), api.getUpcoming().catch(() => empty),
    api.getNowPlaying().catch(() => empty), api.getByProvider(8).catch(() => empty),
    api.getByProvider(9).catch(() => empty), api.getByProvider(337).catch(() => empty),
    api.getTrendingTV("week").catch(() => empty), api.getPopularTV().catch(() => empty),
    api.getTopRatedTV().catch(() => empty), api.getNollywood().catch(() => empty),
  ]);

  const heroMovies = trending.results.slice(0, 3);

  return (
    <div className="pb-12">
      {heroMovies.length > 0 && <HeroBanner movies={heroMovies} />}
      <MovieCarousel title={tr("trending_movies")} movies={trending.results} />
      <TVCarousel    title={tr("trending_series")} shows={trendingTV.results} accentColor="#3b82f6" />
      <MovieCarousel title={tr("now_playing")}     movies={nowPlaying.results} />
      <TVCarousel    title={tr("popular_series")}  shows={popularTV.results}  accentColor="#3b82f6" />
      <MovieCarousel title={tr("on_netflix")}      movies={netflix.results}   accentColor="#e50914" />
      <MovieCarousel title={tr("on_prime")}        movies={prime.results}     accentColor="#00a8e0" />
      <MovieCarousel title={tr("on_disney")}       movies={disney.results}    accentColor="#0063e5" />
      <MovieCarousel title={tr("popular_movies")}  movies={popular.results} />
      <TVCarousel    title={tr("top_rated_series")}shows={topRatedTV.results} accentColor="#3b82f6" />
      <MovieCarousel title={tr("top_rated_movies")}movies={topRated.results} />
      <MovieCarousel title={tr("upcoming")}        movies={upcoming.results} />
      <MovieCarousel title={tr("nollywood")}       movies={nollywood.results} accentColor="#00843D" />
    </div>
  );
}
