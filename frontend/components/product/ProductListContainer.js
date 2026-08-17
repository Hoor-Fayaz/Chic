"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SortDropdown from "./SortDropdown";
import ProductGrid from "./ProductGrid";
import ProductFilters from "./ProductFilters";
import { fetchProducts } from "@/lib/api";

function ProductListContainerInner({ initialProducts, initialTotal, initialFabrics, initialSizes, initialColors, categories, defaultCategory, defaultLimit = 1000 }) {
  const searchParams = useSearchParams();

  const [products, setProducts] = useState(initialProducts);
  const [total, setTotal] = useState(initialTotal);
  const [availableFabrics, setAvailableFabrics] = useState(initialFabrics);
  const [availableSizes, setAvailableSizes] = useState(initialSizes || []);
  const [availableColors, setAvailableColors] = useState(initialColors || []);
  const [loading, setLoading] = useState(false);

  const [cols, setCols] = useState(4);
  const [showFilters, setShowFilters] = useState(false);

  // Re-fetch whenever URL search params change (filters, sort, search, etc.)
  useEffect(() => {
    const params = {};
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }

    if (defaultCategory && !searchParams.has('category')) {
      params.category = defaultCategory;
    }

    if (!searchParams.has('limit')) {
      params.limit = defaultLimit || 1000;
    }

    let cancelled = false;
    setLoading(true);

    // Safety: if the request hangs on some devices/networks,
    // don't leave a full-screen overlay blocking taps forever.
    const loadingTimeout = setTimeout(() => {
      if (!cancelled) setLoading(false);
    }, 12000);

    fetchProducts(params)
      .then((res) => {
        if (cancelled) return;
        setProducts(res.data?.items || []);
        setTotal(res.data?.total ?? 0);
        setAvailableFabrics(res.data?.availableFabrics || []);
        setAvailableSizes(res.data?.availableSizes || []);
        setAvailableColors(res.data?.availableColors || []);
      })
      .catch(console.error)
      .finally(() => {
        clearTimeout(loadingTimeout);
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      clearTimeout(loadingTimeout);
    };
  }, [searchParams.toString()]);

  return (
    <div className="w-full">
      <SortDropdown
        total={total}
        cols={cols}
        setCols={setCols}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        categories={categories}
      />

      <div className={`grid gap-8 transition-all duration-300 ease-in-out ${showFilters ? 'md:grid-cols-[280px,1fr]' : 'grid-cols-1'}`}>
        {/* Filter Sidebar */}
        {showFilters && (
          <div className="animate-in fade-in slide-in-from-left-4 duration-300">
            <ProductFilters 
              categories={categories} 
              availableFabrics={availableFabrics} 
              availableSizes={availableSizes}
              availableColors={availableColors}
            />
          </div>
        )}

        {/* Grid Container */}
        <div className="w-full relative">
          {loading && (
            <div
              className="pointer-events-none absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl"
              aria-hidden="true"
            >
              <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <ProductGrid products={products} cols={cols} />
        </div>
      </div>
    </div>
  );
}

export default function ProductListContainer({ 
  products = [], 
  total = 0, 
  categories = [], 
  availableFabrics = [],
  availableSizes = [],
  availableColors = [],
  defaultCategory = null,
  defaultLimit = null,
}) {
  return (
    <Suspense fallback={
      <div className="w-full flex justify-center py-20">
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ProductListContainerInner
        initialProducts={products}
        initialTotal={total}
        initialFabrics={availableFabrics}
        initialSizes={availableSizes}
        initialColors={availableColors}
        categories={categories}
        defaultCategory={defaultCategory}
        defaultLimit={defaultLimit}
      />
    </Suspense>
  );
}
