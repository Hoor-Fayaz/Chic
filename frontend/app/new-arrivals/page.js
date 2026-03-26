import ProductGrid from "@/components/product/ProductGrid";
import { fetchProducts } from "@/lib/api";

export const metadata = {
  title: "New Arrivals | Jannah Chic",
  description: "Discover the latest additions to our curated collection.",
};

export default async function NewArrivalsPage({ searchParams }) {
  const productsRes = await fetchProducts({
    ...searchParams,
    isNewArrival: "true",
    limit: 40,
  });

  const products = productsRes.data?.items || [];
  const total = productsRes.data?.total ?? products.length;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-10 lg:px-0">
        {/* Hero Header */}
        <div className="mb-10 border-b border-gray-200 pb-6">
          <p className="text-[11px] uppercase tracking-[0.3em] text-gray-400 font-semibold mb-2">
            Just Landed
          </p>
          <h1 className="text-4xl font-display tracking-tight text-gray-900">New Arrivals</h1>
          <p className="mt-2 text-sm text-gray-500 max-w-xl">
            Fresh styles, handpicked for the season. Be the first to wear what's new.
          </p>
          <p className="mt-3 text-xs text-gray-400">{total} item{total !== 1 ? "s" : ""}</p>
        </div>

        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-2xl font-display text-gray-300 mb-2">✦</p>
            <p className="text-lg font-display text-gray-400">No new arrivals yet.</p>
            <p className="text-sm text-gray-400 mt-1">
              New styles are being added — check back soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
