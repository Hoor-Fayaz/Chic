"use client";

import { useEffect, useState } from "react";
import { fetchProducts } from "@/lib/api";
import ProductCard from "./ProductCard";

export default function RelatedProducts({ categoryId, currentProductId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRelated() {
      try {
        if (!categoryId) return;
        const res = await fetchProducts({ category: categoryId, limit: 5 });
        const items = res.data?.items || [];
        // Filter out current product
        setProducts(items.filter(p => p._id !== currentProductId).slice(0, 4));
      } catch (err) {
        console.error("Failed to load related products", err);
      } finally {
        setLoading(false);
      }
    }
    loadRelated();
  }, [categoryId, currentProductId]);

  if (loading) return (
     <div className="mt-20 border-t border-gray-100 pt-16">
        <h3 className="text-xl font-display text-gray-900 mb-8">Other Treasures You May Like</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-[2/3] bg-gray-100 rounded-[2.5rem]" />
            ))}
        </div>
     </div>
  );

  if (products.length === 0) return null;

  return (
    <div className="mt-20 border-t border-gray-100 pt-16">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-display text-gray-900">Other Treasures You May Like</h3>
        <a href={`/shop?category=${categoryId}`} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
            View Collection
        </a>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
