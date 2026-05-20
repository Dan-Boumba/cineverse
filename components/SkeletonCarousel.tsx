import SkeletonCard from "./SkeletonCard";

interface Props {
  count?: number;
}

export default function SkeletonCarousel({ count = 8 }: Props) {
  return (
    <section className="mb-10">
      <div className="h-5 bg-gray-800 rounded animate-pulse w-48 mb-3 mx-6 md:mx-16" />
      <div className="flex gap-3 overflow-hidden px-6 md:px-16 pb-2">
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </section>
  );
}
