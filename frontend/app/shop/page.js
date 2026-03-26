import ProductGrid from "@/components/product/ProductGrid";
import ProductFilters from "@/components/product/ProductFilters";
import { fetchProducts, fetchCategories } from "@/lib/api";

export const metadata = {
  title: "Shop | Chic",
};

export const dynamic = "force-dynamic";

export default async function ShopPage({ searchParams }) {
  const [productsRes, categoriesRes] = await Promise.all([
    fetchProducts(searchParams),
    fetchCategories(),
  ]);

  const products = productsRes.data?.items || [];
  const categories = categoriesRes.data?.items || [];

  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-10 lg:px-0">
        <div className="mb-6 flex items-baseline justify-between">
          <h1 className="text-2xl font-display tracking-tight text-gray-900">
            Shop
          </h1>
          <p className="text-xs text-gray-500">
            {productsRes.total} items
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-[260px,1fr]">
          <ProductFilters categories={categories} />
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  );
}

