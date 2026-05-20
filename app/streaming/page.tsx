import { tmdb, PROVIDERS, TMDB_LOCALE } from "@/lib/tmdb";
import { getLang } from "@/lib/getLang";
import { t } from "@/lib/lang";
import StreamingFilter from "@/components/StreamingFilter";

export default async function StreamingPage() {
  const lang = await getLang();
  const api  = tmdb(TMDB_LOCALE[lang]);
  const tr   = (key: string) => t[lang][key] ?? t.en[key] ?? key;

  const [logos, ...providerResults] = await Promise.all([
    api.getProviderLogos(),
    ...PROVIDERS.map((p) => api.getByProvider(p.id).then((res) => ({ provider: p, movies: res.results }))),
  ]);

  const data = (providerResults as { provider: typeof PROVIDERS[number]; movies: never[] }[]).map(
    ({ provider, movies }) => ({
      provider: { ...provider, logo_path: (logos as Record<number, string>)[provider.id] ?? null },
      movies,
    })
  );

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 md:px-16">
      <h1 className="text-white text-3xl md:text-4xl font-black mb-2">{tr("streaming_title")}</h1>
      <p className="text-gray-400 text-sm">{tr("streaming_subtitle")}</p>
      <StreamingFilter data={data} />
    </div>
  );
}
