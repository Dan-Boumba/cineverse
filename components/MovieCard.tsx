import Link from "next/link";
import Image from "next/image";
import { Movie } from "@/types/movie";
import { posterUrl } from "@/lib/tmdb";

interface Props {
  movie: Movie;
}

export default function MovieCard({ movie }: Props) {
  const year = movie.release_date?.slice(0, 4) ?? "";
  const rating = movie.vote_average?.toFixed(1) ?? "N/A";

  return (
    <Link href={`/movie/${movie.id}`} className="group flex-shrink-0 w-36 md:w-44">
      <div className="relative overflow-hidden rounded-md transition-transform duration-200 group-hover:scale-105 group-hover:z-10">
        <div className="relative aspect-[2/3] bg-gray-800">
          <Image
            src={posterUrl(movie.poster_path)}
            alt={movie.title}
            fill
            sizes="(max-width: 768px) 144px, 176px"
            className="object-cover"
            unoptimized
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200" />
          {/* Rating badge */}
          <div className="absolute top-2 left-2 bg-black/70 text-yellow-400 text-xs font-bold px-1.5 py-0.5 rounded">
            ★ {rating}
          </div>
        </div>
        {/* Info on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-200">
          <p className="text-white text-xs font-semibold line-clamp-2">{movie.title}</p>
          {year && <p className="text-gray-400 text-xs mt-0.5">{year}</p>}
        </div>
      </div>
      <p className="text-gray-300 text-xs mt-1.5 line-clamp-2 group-hover:text-white transition-colors">
        {movie.title}
      </p>
    </Link>
  );
}
