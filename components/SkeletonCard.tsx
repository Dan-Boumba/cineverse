export default function SkeletonCard() {
  return (
    <div className="shrink-0 w-36 md:w-44">
      <div className="relative aspect-2/3 bg-gray-800 rounded-md animate-pulse" />
      <div className="mt-1.5 h-3 bg-gray-800 rounded animate-pulse w-3/4" />
    </div>
  );
}
