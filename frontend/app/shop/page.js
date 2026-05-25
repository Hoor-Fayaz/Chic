import ProductFilters from "@/components/product/ProductFilters";
import ProductListContainer from "@/components/product/ProductListContainer";
import { fetchProducts, fetchCategories } from "@/lib/api";
import { Suspense } from "react";

export async function generateMetadata({ searchParams }) {
  return {
    title: `The Catalog | Jannah Chic`,
    description: `Explore our premium collection at Jannah Chic. Discover architectural silhouettes and timeless textures.`,
  };
}

export const dynamic = "force-dynamic";

export default async function ShopPage({ searchParams }) {
  let products = [];
  let total = 0;
  let availableFabrics = [];
  let availableSizes = [];
  let availableColors = [];
  let categories = [];

  try {
    const [productsRes, categoriesRes] = await Promise.all([
      fetchProducts({ ...searchParams, limit: 1000 }),
      fetchCategories(),
    ]);

    products = productsRes.data?.items || [];
    total = productsRes.data?.total ?? products.length;
    availableFabrics = productsRes.data?.availableFabrics || [];
    availableSizes = productsRes.data?.availableSizes || [];
    availableColors = productsRes.data?.availableColors || [];
    categories = categoriesRes.data?.items || [];
  } catch (err) {
    console.error("❌ Failed to load Shop page data:", err.message);
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-10 lg:px-0">
        
        {/* Header Section */}
        <div className="mb-10 border-b border-gray-100 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-bold mb-3">
              The Catalog
            </p>
            <h1 className="text-4xl md:text-5xl font-display tracking-tight text-gray-900 mb-3">
              Shop
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed italic">
              "Explore our complete range of architectural silhouettes and timeless textures."
            </p>
          </div>
        </div>

        <div className="w-full">
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
    </div>
  );
}
