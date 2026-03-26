"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { fetchProductBySlug } from "@/lib/api";
import ProductGallery from "@/components/product/ProductGallery";
import AddToCartSection from "@/components/product/AddToCartSection";
import ReviewList from "@/components/product/ReviewList";
import ReviewForm from "@/components/product/ReviewForm";
import ReviewStars from "@/components/product/ReviewStars";

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await fetchProductBySlug(slug);
        if (!data) notFound();
        setProduct(data);
      } catch (err) {
        console.error(err);
        notFound();
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-display text-2xl animate-pulse">Loading Chic...</div>;
  if (!product) return notFound();

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-12 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="mb-6 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold flex items-center gap-2">
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <span className="text-gray-300">/</span>
          <Link href="/shop" className="hover:text-black transition-colors">
            Shop
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        {/* Main Layout */}
        <div className="grid gap-12 lg:grid-cols-12 mb-20">
          
          {/* LEFT: Image Gallery (Span 7) */}
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} />
          </div>


          {/* RIGHT: Product Details (Span 5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-1">
              {/* Category | Material */}
              <div className="flex justify-between items-start">
                  <p className="text-[11px] font-medium text-gray-500 tracking-wide">
                    {product.category?.name || "Collection"} {product.fabric ? `| ${product.fabric}` : ""}
                  </p>
                  <ReviewStars rating={product.ratingAverage || 0} count={product.ratingCount || 0} size={12} />
              </div>
              
              <h1 className="text-3xl font-display font-bold tracking-tight text-gray-900">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-center gap-3 pt-2">
                {product.originalPrice && product.originalPrice > product.price ? (
                    <>
                        <span className="text-lg font-bold text-gray-900">
                            PKR {product.price?.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                            PKR {product.originalPrice.toLocaleString()}
                        </span>
                    </>
                ) : (
                    <span className="text-lg font-bold text-gray-900">
                        PKR {product.price?.toLocaleString()}
                    </span>
                )}
              </div>
            </div>

            {/* Add to Cart Section handles sizes, SKU, quantity, and details */}
            <AddToCartSection product={product} />
          </div>
        </div>

        {/* REVIEWS SECTION */}
        <div className="border-t border-gray-100 pt-16 grid grid-cols-1 lg:grid-cols-2 gap-16">
            <ReviewList productId={product._id} refreshKey={refreshKey} />
            <div className="lg:sticky lg:top-24 h-fit">
                <ReviewForm productId={product._id} onReviewAdded={() => setRefreshKey(prev => prev + 1)} />
            </div>
        </div>

      </div>
    </div>
  );
}