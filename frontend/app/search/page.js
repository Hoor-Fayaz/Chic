import ProductListContainer from "@/components/product/ProductListContainer";
import { fetchProducts, fetchCategories } from "@/lib/api";
import { HiOutlineSearch } from "react-icons/hi";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }) {
  const query = searchParams.q || "";
  return {
    title: `Search results for "${query}" | Jannah Chic`,
  };
}

export default async function SearchPage({ searchParams }) {
  const query = searchParams.q || "";
  
  let products = [];
  let total = 0;
  let categories = [];
  let availableFabrics = [];
  let availableSizes = [];
  let availableColors = [];

  try {
    const [productsRes, categoriesRes] = await Promise.all([
      fetchProducts({ ...searchParams, search: query, limit: 1000 }),
      fetchCategories(),
    ]);

    products = productsRes.data?.items || [];
    total = productsRes.data?.total || 0;
    availableFabrics = productsRes.data?.availableFabrics || [];
    availableSizes = productsRes.data?.availableSizes || [];
    availableColors = productsRes.data?.availableColors || [];
    categories = categoriesRes.data?.items || [];
  } catch (err) {
    console.error(`❌ Failed to load Search results for "${query}":`, err.message);
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-12 lg:px-0">
        
        {/* Search Header */}
        <div className="mb-12 border-b border-gray-100 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
                <div className="flex items-center gap-4 text-gray-400 mb-4">
                    <HiOutlineSearch size={24} />
                    <span className="text-[10px] uppercase font-bold tracking-[0.3em]">Search Directory</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-display tracking-tight text-gray-900 mb-3">
                    {query ? `Results for "${query}"` : "Discover our collection"}
                </h1>
                <p className="text-sm text-gray-400 italic">
                    Successfully located results matching your specific search.
                </p>
            </div>
        </div>

        <ProductListContainer 
            products={products} 
            total={total} 
            categories={categories} 
            availableFabrics={availableFabrics}
            availableSizes={availableSizes}
            availableColors={availableColors}
            defaultLimit={1000}
        />
      </div>
    </div>
  );
}
