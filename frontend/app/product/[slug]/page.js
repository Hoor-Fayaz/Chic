import { notFound } from "next/navigation";
import { fetchProductBySlug } from "@/lib/api";
import ProductDetailContent from "@/components/product/ProductDetailContent";
import RelatedProducts from "@/components/product/RelatedProducts";

// ✅ Server-side Metadata for Professional SEO
export async function generateMetadata({ params }) {
  try {
    const product = await fetchProductBySlug(params.slug);
    if (!product) return { title: "Product Not Found | Jannah" };

    return {
      title: `${product.name} | Jannah`,
      description: product.description || `Discover ${product.name} from Jannah's premium collection.`,
      openGraph: {
        title: product.name,
        description: product.description,
        images: [{ url: product.images?.[0]?.url }],
      },
    };
  } catch {
    return { title: "Jannah" };
  }
}

export default async function ProductPage({ params }) {
  const { slug } = params;
  
  let product;
  try {
    product = await fetchProductBySlug(slug);
    if (!product) notFound();
  } catch (err) {
    console.error("Product Load Error:", err);
    // If it's a connection error, next will show the global error boundary or 404
    // But for production readiness, let's just use notFound if product is missing
    notFound(); 
  }

  return (
    <div className="bg-gray-50 min-h-screen overflow-x-hidden w-full max-w-[100vw]">
      <ProductDetailContent product={product} />
      
      {/* RELATED PRODUCTS SECTION */}
      <div className="mx-auto max-w-6xl px-4 pb-20 lg:px-8">
        <RelatedProducts categoryId={product.category?._id} currentProductId={product._id} />
      </div>
    </div>
  );
}