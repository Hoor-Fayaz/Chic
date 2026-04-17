import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';

export default function ProductGrid({ products = [], loading = false, cols = 4 }) {
  const colClasses = {
    1: "grid-cols-1 md:grid-cols-1",
    2: "grid-cols-2 md:grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3 md:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4",
  };
  
  const gridClass = colClasses[cols] || colClasses[4];

  if (loading) {
    return (
      <div className={`grid gap-x-8 gap-y-12 ${gridClass}`}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="py-20 text-center bg-white rounded-[3rem] border border-gray-100 flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
        </div>
        <p className="text-sm font-display text-gray-500">
          No treasures found matching these filters.
        </p>
      </div>
    );
  }

  return (
    <div className={`grid gap-x-4 sm:gap-x-8 gap-y-12 ${gridClass}`}>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}

