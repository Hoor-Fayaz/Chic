import ProductListContainer from "@/components/product/ProductListContainer";
import { fetchProducts, fetchCategories } from "@/lib/api";

export const metadata = {
  title: "Sale | Jannah Chic",
  description: "Shop exclusive deals and discounted styles at Jannah Chic.",
};

export default async function SalePage({ searchParams }) {
  const [productsRes, categoriesRes] = await Promise.all([
    fetchProducts({
      ...searchParams,
      isOnSale: "true",
      limit: 50,
    }),
    fetchCategories(),
  ]);

  const products = productsRes.data?.items || [];
  const total = productsRes.data?.total ?? products.length;
  const categories = categoriesRes.data?.items || [];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Sale Banner */}
      <div className="bg-rose-600 py-3 text-center">
        <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-white">
          ✦ Exclusive Sale — Limited Time Offers ✦
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 lg:px-0">
        {/* Header Section */}
        <div className="mb-10 border-b border-gray-100 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-[10px] uppercase tracking-[0.4em] text-rose-600 font-bold mb-3">
              Special Offers
            </p>
            <h1 className="text-4xl md:text-5xl font-display tracking-tight text-gray-900 mb-3">
              Sale
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed italic">
              "Curated pieces at special prices. Timeless style, now more accessible."
            </p>
          </div>
        </div>

        <ProductListContainer 
            products={products} 
            total={total} 
            categories={categories} 
        />
      </div>
    </div>
  );
}
