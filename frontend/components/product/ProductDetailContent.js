"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import ProductGallery from "@/components/product/ProductGallery";
import AddToCartSection from "@/components/product/AddToCartSection";
import ReviewList from "@/components/product/ReviewList";
import ReviewForm from "@/components/product/ReviewForm";
import ReviewStars from "@/components/product/ReviewStars";
import { useCurrencyStore } from "@/store/currencyStore";

export default function ProductDetailContent({ product }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const router = useRouter();
  const { formatPrice, getNumericPrice } = useCurrencyStore();

  // Optimistic local state for immediately un-blocking visual updates
  const [localStats, setLocalStats] = useState({
      ratingAverage: product?.ratingAverage || 0,
      ratingCount: product?.ratingCount || 0
  });

  if (!product) return notFound();

  const pieceType = product.tags?.find(t => t.toLowerCase() === '2 piece' || t.toLowerCase() === '3 piece');

  const activePrice = getNumericPrice(product, false);
  const activeOriginalPrice = getNumericPrice(product, true);
  const hasDiscount = activeOriginalPrice > activePrice && activePrice > 0;

  const handleReviewAdded = (newRating) => {
      setRefreshKey(prev => prev + 1);
      
      // Instantly update stats for the user without waiting for standard router refresh
      setLocalStats(prev => {
          const newCount = prev.ratingCount + 1;
          const newTotal = (prev.ratingAverage * prev.ratingCount) + newRating;
          return {
              ratingCount: newCount,
              ratingAverage: newCount === 0 ? 0 : Math.round((newTotal / newCount) * 10) / 10
          };
      });

      router.refresh();
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-12 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="mb-6 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold flex items-center flex-wrap gap-2">
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
          <div className="lg:col-span-7 min-w-0 w-full overflow-hidden">
            <ProductGallery images={product.images} />
          </div>

          {/* RIGHT: Product Details (Span 5) */}
          <div className="lg:col-span-5 space-y-6 min-w-0 w-full overflow-hidden">
            <div className="space-y-1">
              {/* Category | Material */}
              <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-2">
                  <p className="text-[11px] font-medium text-gray-500 tracking-wide uppercase">
                    {product.category?.name || "Collection"} 
                    {pieceType ? ` | ${pieceType}` : ""}
                    {product.fabric ? ` | ${product.fabric}` : ""}
                  </p>
                  <ReviewStars rating={localStats.ratingAverage} count={localStats.ratingCount} size={12} />
              </div>
              
              <h1 className="text-3xl font-display font-bold tracking-tight text-gray-900 break-words">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-center gap-3 pt-2">
                {hasDiscount ? (
                    <>
                        <span className="text-lg font-bold text-gray-900">
                            {formatPrice(product, false)}
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                            {formatPrice(product, true)}
                        </span>
                    </>
                ) : (
                    <span className="text-lg font-bold text-gray-900">
                        {formatPrice(product, false)}
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
                <ReviewForm productId={product._id} onReviewAdded={handleReviewAdded} />
            </div>
        </div>

      </div>
    </div>
  );
}
