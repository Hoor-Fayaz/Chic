"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchPublicSettings } from "@/lib/api";

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicSettings()
      .then(res => {
        if (res.success && res.data) {
          setSettings(res.data.section1);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const slides = settings?.slides || [];
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [settings?.slides?.length]);

  if (loading) return (
    <div className="h-[600px] w-full bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
    </div>
  );

  const hero = settings || {};
  const slides = hero.slides?.length > 0 ? hero.slides : [
      { imageUrl: "https://picsum.photos/1200/800?random=1", link: "/shop" }
  ];

  return (
    <section className="relative overflow-hidden bg-gray-50">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-2 lg:px-0 lg:py-20">
        
        {/* LEFT CONTENT */}
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
            {hero.subtitle || "New Season • SS'26"}
          </p>

          <h1 className="text-4xl font-display tracking-tight text-gray-900 sm:text-5xl">
            {hero.title || "Effortless style for every day."}
          </h1>

          <p className="max-w-md text-sm text-gray-600">
            {hero.description || "Discover elevated essentials, statement pieces, and timeless silhouettes inspired by contemporary fashion houses."}
          </p>

          <div className="flex gap-4">
            <Link
              href={hero.link || "/shop"}
              className="rounded-full bg-gray-900 px-6 py-2.5 text-xs font-semibold uppercase tracking-wide text-white hover:bg-black transition-all"
            >
              Shop collection
            </Link>

            <Link
              href="/category/new-arrivals"
              className="rounded-full border border-gray-300 px-6 py-2.5 text-xs font-semibold uppercase tracking-wide text-gray-900 hover:border-gray-900 transition-all shadow-sm"
            >
              New arrivals
            </Link>
          </div>
        </div>

        {/* RIGHT IMAGE BANNERS (Slider) */}
        <div className="relative h-80 overflow-hidden rounded-[2.5rem] shadow-2xl bg-gray-100 border border-white">
          {slides.map((slide, i) => (
            <div
                key={i}
                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
                i === current ? "opacity-100" : "opacity-0"
                }`}
                style={{ backgroundImage: `url(${slide.imageUrl})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent" />
            </div>
            ))}
          
          {/* Slide Indicators */}
          {slides.length > 1 && (
            <div className="absolute bottom-6 left-6 flex gap-2">
                {slides.map((_, i) => (
                    <div 
                        key={i} 
                        className={`h-1 rounded-full transition-all duration-500 ${i === current ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`}
                    />
                ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

