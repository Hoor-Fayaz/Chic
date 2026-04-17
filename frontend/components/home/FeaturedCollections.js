"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchPublicSettings } from "@/lib/api";
import { CardGridSkeleton } from "../ui/Skeletons";

export default function FeaturedCollections({ categories: apiCategories = [] }) {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("Featured Collections");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicSettings().then(res => {
        if (res.success && res.data?.section3?.items?.length > 0) {
            const cmsItems = res.data.section3.items.map(item => {
                const cat = apiCategories.find(c => c._id === item.categoryId);
                return {
                    ...item,
                    name: item.label || cat?.name || "Collection",
                    slug: cat?.slug || "#"
                };
            });
            setItems(cmsItems);
            setTitle(res.data.section3.title || "Featured Collections");
        } else {
            // Fallback to auto categories
            setItems(apiCategories.map(c => ({ ...c, label: c.name })));
        }
    }).finally(() => setLoading(false));
  }, [apiCategories]);

  if (loading) return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-[1600px] px-4 lg:px-12">
        <div className="mb-10 h-10 w-64 bg-gray-50 rounded-lg animate-pulse" />
        <CardGridSkeleton count={3} />
      </div>
    </section>
  );

  if (!items.length) return null;

  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-[1600px] px-4 lg:px-12">
        <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-display font-bold tracking-tight text-gray-900">
            {title}
            </h2>
            <div className="h-1 w-12 bg-black mt-2 mx-auto md:mx-0 rounded-full" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
          {items.map((item, i) => (
            <Link
              key={item._id || i}
              href={`/category/${item.slug}`}
              className="relative block overflow-hidden rounded-[1.5rem] sm:rounded-[3rem] aspect-[3/4] group shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <img
                src={item.imageUrl || item.image || "/products/placeholder.png"}
                alt={item.name}
                className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 text-white opacity-90 group-hover:opacity-100 transition-opacity">
                <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-70 mb-1 block">Explore</span>
                    <h3 className="text-2xl font-display font-semibold tracking-tight">{item.name}</h3>
                </div>
              </div>

            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
