"use client";

import { useEffect } from "react";
import { useWishlistStore } from "@/store/wishlistStore";
import ProductCard from "@/components/product/ProductCard";

export default function WishlistPage() {
  const wishlist = useWishlistStore((s) => s.wishlist);
  const loadWishlist = useWishlistStore((s) => s.loadWishlist);
  const loading = useWishlistStore((s) => s.loading);

  useEffect(() => {
    loadWishlist();
  }, []);

  if (loading)
    return <p className="text-center mt-10">Loading wishlist...</p>;

  if (!wishlist.length)
    return <p className="text-center mt-10">Your wishlist is empty.</p>;

  return (
    <div className="max-w-6xl mx-auto p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
      {wishlist.map((product) => (
        <ProductCard key={product._id} product={product} showRemove={true} />
      ))}
    </div>
  );
}