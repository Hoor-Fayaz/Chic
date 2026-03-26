import ProductGrid from "@/components/product/ProductGrid";
import { fetchProducts, fetchCategories } from "@/lib/api";

export async function generateMetadata({ params }) {
  const titleSlug = params.slug.replace(/-/g, " ");
  const title = titleSlug.charAt(0).toUpperCase() + titleSlug.slice(1);
  return {
    title: `${title} | Jannah Chic`,
    description: `Shop our ${title} collection at Jannah Chic.`,
  };
}

export default async function CategoryPage({ params, searchParams }) {
  const slug = params.slug;

  // Fetch categories first to resolve the slug → MongoDB _id
  const categoriesRes = await fetchCategories();
  const categories = categoriesRes.data?.categories || categoriesRes.data?.items || [];
  const category = categories.find((c) => c.slug === slug) || null;

  // Now fetch products filtered by the resolved category ID
  const queryParams = { ...searchParams };
  if (category?._id) {
    queryParams.category = category._id;
  } else if (!category) {
    // Slug not found — fetch zero products gracefully
    queryParams.category = "none";
  }

  const productsRes = await fetchProducts(queryParams);
  const products = productsRes.data?.items || [];
  const total = productsRes.data?.total ?? products.length;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-10 lg:px-0">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display tracking-tight text-gray-900">
            {category?.name || slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
          </h1>
          {category?.description && (
            <p className="mt-2 text-sm text-gray-500">{category.description}</p>
          )}
          <p className="mt-1 text-xs text-gray-400">{total} item{total !== 1 ? "s" : ""}</p>
        </div>

        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-lg font-display text-gray-400">No products found in this category.</p>
            <p className="text-sm text-gray-400 mt-1">Check back soon — new arrivals are on their way.</p>
          </div>
        )}
      </div>
    </div>
  );
}
