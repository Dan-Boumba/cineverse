import Link from "next/link";
import Image from "next/image";
import { TVShow } from "@/types/tv";
import { posterUrl } from "@/lib/tmdb";

interface Props {
  show: TVShow;
}

export default function TVCard({ show }: Props) {
  const year = show.first_air_date?.slice(0, 4) ?? "";
  const rating = show.vote_average?.toFixed(1) ?? "N/A";

  return (
    <Link href={`/series/${show.id}`} className="group flex-shrink-0 w-36 md:w-44">
      <div className="relative overflow-hidden rounded-md transition-transform duration-200 group-hover:scale-105 group-hover:z-10">
        <div className="relative aspect-[2/3] bg-gray-800">
          <Image
            src={posterUrl(show.poster_path)}
            alt={show.name}
            fill
            sizes="(max-width: 768px) 144px, 176px"
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200" />
          <div className="absolute top-2 left-2 bg-black/70 text-yellow-400 text-xs font-bold px-1.5 py-0.5 rounded">
            ★ {rating}
          </div>
          {/* TV badge */}
          <div className="absolute top-2 right-2 bg-blue-600/80 text-white text-xs font-bold px-1.5 py-0.5 rounded">
            TV
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-200">
          <p className="text-white text-xs font-semibold line-clamp-2">{show.name}</p>
          {year && <p className="text-gray-400 text-xs mt-0.5">{year}</p>}
        </div>
      </div>
      <p className="text-gray-300 text-xs mt-1.5 line-clamp-2 group-hover:text-white transition-colors">
        {show.name}
      </p>
    </Link>
  );
}
