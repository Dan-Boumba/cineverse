import SkeletonCarousel from "@/components/SkeletonCarousel";

export default function Loading() {
  return (
    <div className="pb-12">
      <div className="relative w-full h-[50vw] min-h-[300px] max-h-[600px] bg-gray-900 animate-pulse" />
      <div className="pt-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCarousel key={i} />
        ))}
      </div>
    </div>
  );
}
