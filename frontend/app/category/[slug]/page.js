import ProductListContainer from "@/components/product/ProductListContainer";
import { fetchProducts, fetchCategories } from "@/lib/api";

export async function generateMetadata({ params }) {
  const title = params.slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
    
  return {
    title: `${title} | Jannah Chic`,
    description: `Discover the curated ${title} collection at Jannah Chic.`,
  };
}

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params, searchParams }) {
  const slug = params.slug;

  let categories = [];
  let category = null;
  let products = [];
  let total = 0;
  let availableFabrics = [];
  let availableSizes = [];
  let availableColors = [];

  try {
    // Fetch categories first to resolve the slug → MongoDB _id
    const categoriesRes = await fetchCategories();
    categories = categoriesRes.data?.categories || categoriesRes.data?.items || [];
    
    // Flexible category matching (slug, name, singular/plural, case-insensitive)
    const normalize = (str) => (str || "").toLowerCase().trim().replace(/[^a-z0-9]/g, "");
    const cleanSlug = normalize(slug);

    category = categories.find((c) => {
      const cSlug = normalize(c.slug);
      const cName = normalize(c.name);
      return (
        cSlug === cleanSlug ||
        cName === cleanSlug ||
        cSlug.replace(/s$/, "") === cleanSlug.replace(/s$/, "") ||
        cName.replace(/s$/, "") === cleanSlug.replace(/s$/, "") ||
        cSlug.includes(cleanSlug) ||
        cleanSlug.includes(cSlug)
      );
    }) || null;

    // Fetch all products (limit: 1000) filtered by category ID or slug
    const targetCategory = category?._id || slug;
    const queryParams = { ...searchParams, category: targetCategory, limit: 1000 };
    const productsRes = await fetchProducts(queryParams);

    products = productsRes.data?.items || [];
    total = productsRes.data?.total ?? products.length;
    availableFabrics = productsRes.data?.availableFabrics || [];
    availableSizes = productsRes.data?.availableSizes || [];
    availableColors = productsRes.data?.availableColors || [];
  } catch (err) {
    console.error(`❌ Failed to load category data [${slug}]:`, err.message);
  }

  const categoryName = category?.name || slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-10 lg:px-0">
        
        {/* Header Section */}
        <div className="mb-10 border-b border-gray-100 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-bold mb-3">
              Collection
            </p>
            <h1 className="text-4xl md:text-5xl font-display tracking-tight text-gray-900 mb-3">
              {categoryName}
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed italic">
              {category?.description || "Curated silhouettes for the discerning wardrobe."}
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
            defaultCategory={category?._id || slug}
            defaultLimit={1000}
        />
      </div>
    </div>
  );
}

