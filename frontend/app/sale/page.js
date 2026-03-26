import ProductGrid from "@/components/product/ProductGrid";
import { fetchProducts } from "@/lib/api";

export const metadata = {
  title: "Sale | Jannah Chic",
  description: "Shop exclusive deals and discounted styles at Jannah Chic.",
};

export default async function SalePage({ searchParams }) {
  const productsRes = await fetchProducts({
    ...searchParams,
    isOnSale: "true",
    limit: 40,
  });

  const products = productsRes.data?.items || [];
  const total = productsRes.data?.total ?? products.length;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Sale Banner */}
      <div className="bg-rose-600 py-3 text-center">
        <p className="text-sm font-semibold tracking-widest uppercase text-white">
          ✦ Exclusive Sale — Limited Time Offers ✦
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 lg:px-0">
        {/* Header */}
        <div className="mb-10 border-b border-gray-200 pb-6">
          <p className="text-[11px] uppercase tracking-[0.3em] text-rose-500 font-semibold mb-2">
            Limited Offers
          </p>
          <h1 className="text-4xl font-display tracking-tight text-gray-900">Sale</h1>
          <p className="mt-2 text-sm text-gray-500 max-w-xl">
            Curated pieces at special prices — handpicked by our team.
          </p>
          <p className="mt-3 text-xs text-gray-400">{total} item{total !== 1 ? "s" : ""} on sale</p>
        </div>

        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-2xl font-display text-gray-300 mb-2">✦</p>
            <p className="text-lg font-display text-gray-400">No sale items right now.</p>
            <p className="text-sm text-gray-400 mt-1">
              Sales are added by our team — check back soon for exclusive deals.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
