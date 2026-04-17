export default function ProductSkeleton() {
  return (
    <div className="flex flex-col animate-pulse">
      <div className="relative aspect-[2/3] w-full bg-gray-200 rounded-[2.5rem] overflow-hidden">
        {/* Shimmer Effect */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />
      </div>
      <div className="mt-5 px-1 space-y-3">
        <div className="space-y-1.5">
          <div className="h-2 w-1/3 bg-gray-100 rounded-full" />
          <div className="h-4 w-3/4 bg-gray-200 rounded-full" />
        </div>
        <div className="h-4 w-1/2 bg-gray-200 rounded-full" />
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(i => (
             <div key={i} className="h-2 w-2 bg-gray-100 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
