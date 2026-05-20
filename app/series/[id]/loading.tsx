export default function Loading() {
  return (
    <div className="min-h-screen pb-12">
      <div className="relative w-full h-[50vw] min-h-[300px] max-h-[600px] bg-gray-900 animate-pulse" />
      <div className="px-6 md:px-16 -mt-32 relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="shrink-0 w-40 md:w-56 aspect-2/3 rounded-lg bg-gray-800 animate-pulse" />
          <div className="flex-1 pt-4 space-y-4">
            <div className="h-8 bg-gray-800 rounded animate-pulse w-2/3" />
            <div className="h-4 bg-gray-800 rounded animate-pulse w-1/3" />
            <div className="space-y-2 mt-4">
              <div className="h-3 bg-gray-800 rounded animate-pulse" />
              <div className="h-3 bg-gray-800 rounded animate-pulse" />
              <div className="h-3 bg-gray-800 rounded animate-pulse w-3/4" />
            </div>
            <div className="flex gap-2 mt-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-6 w-20 bg-gray-800 rounded-full animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
