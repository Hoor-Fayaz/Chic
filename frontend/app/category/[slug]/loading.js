import ProductSkeleton from "@/components/product/ProductSkeleton";

export default function Loading() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-12 lg:px-8">
        <div className="mb-12 animate-pulse">
            <div className="h-6 w-48 bg-gray-200 rounded-full mb-4" />
            <div className="h-10 w-64 bg-gray-300 rounded-full" />
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
