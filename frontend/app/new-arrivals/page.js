import ProductListContainer from "@/components/product/ProductListContainer";
import { fetchProducts, fetchCategories } from "@/lib/api";

export const metadata = {
  title: "New Arrivals | Jannah Chic",
  description: "Discover the latest additions to our curated collection.",
};

export default async function NewArrivalsPage({ searchParams }) {
  const [productsRes, categoriesRes] = await Promise.all([
    fetchProducts({
      ...searchParams,
      isNewArrival: "true",
      limit: 50,
    }),
    fetchCategories(),
  ]);

  const products = productsRes.data?.items || [];
  const total = productsRes.data?.total ?? products.length;
  const categories = categoriesRes.data?.items || [];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-10 lg:px-0">
        {/* Header Section */}
        <div className="mb-10 border-b border-gray-100 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-bold mb-3">
              Spring / Summer '24
            </p>
            <h1 className="text-4xl md:text-5xl font-display tracking-tight text-gray-900 mb-3">
              Just Landed
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed italic">
              "Architectural silhouettes and premium textiles handpicked for the modern wardrobe."
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
