import ProductSkeleton from "@/components/product/ProductSkeleton";

export default function Loading() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-10 lg:px-0">
        <div className="mb-6 flex items-baseline justify-between animate-pulse">
          <div className="h-8 w-32 bg-gray-200 rounded-full" />
          <div className="h-4 w-16 bg-gray-100 rounded-full" />
        </div>

        <div className="grid gap-8 md:grid-cols-[260px,1fr]">
          {/* Sidebar Skeleton */}
          <aside className="space-y-6 hidden md:block">
            {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-3xl p-6 h-40 animate-pulse" />
            ))}
          </aside>
          
          {/* Grid Skeleton */}
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
