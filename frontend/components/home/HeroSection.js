"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchPublicSettings } from "@/lib/api";
import { HeroSkeleton } from "../ui/Skeletons";

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
    }, 4000);
    return () => clearInterval(interval);
  }, [settings?.slides?.length]);

  if (loading) return <HeroSkeleton />;

  const hero = settings || {};
  const slides = hero.slides?.length > 0 ? hero.slides : [
      { imageUrl: "https://picsum.photos/1200/800?random=1", link: "/shop" }
  ];

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto grid max-w-[1600px] items-center gap-12 px-4 py-12 lg:grid-cols-2 lg:px-12 lg:py-20">
        
        {/* LEFT CONTENT */}
        <div className="flex flex-col justify-center space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-left duration-700 lg:pr-8">
          <div className="space-y-2">
            <p className="text-[10px] font-sans font-bold uppercase tracking-[0.4em] text-gray-400">
                {hero.subtitle || "New Season • Jannah Chic"}
            </p>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display tracking-tight text-gray-900 leading-[1.1]">
            {hero.title || "The Art of Elegance."}
          </h1>

          <p className="max-w-md text-sm text-gray-500 leading-relaxed font-medium">
            {hero.description || "Discover our curated collection of contemporary textures and timeless silhouettes designed for the discerning individual."}
          </p>

          <div className="flex items-center gap-4 sm:gap-6 pt-2 sm:pt-4">
            <Link
              href={hero.link || "/shop"}
              className="group relative overflow-hidden rounded-full bg-black px-8 sm:px-10 py-3.5 sm:py-4 text-[10px] font-bold uppercase tracking-widest text-white transition-all shadow-2xl shadow-black/20"
            >
              <span className="relative z-10">Shop Collection</span>
              <div className="absolute inset-0 bg-gray-800 translate-y-full group-hover:translate-y-0 transition-transform" />
            </Link>

            <Link
              href="/category/new-arrivals"
              className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
            >
              Explore Trends
            </Link>
          </div>
        </div>

        {/* RIGHT IMAGE BANNERS (Slider) */}
        <div className="relative aspect-[4/5] md:aspect-auto md:h-[550px] lg:h-[620px] overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] shadow-[-15px_15px_50px_-15px_rgba(0,0,0,0.12)] bg-gray-100 border border-white lg:rotate-1">
          {slides.map((slide, i) => (
            <Link
                key={i}
                href={slide.link || "/shop"}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                i === current ? "opacity-100 scale-100 z-10" : "opacity-0 scale-110 z-0"
                }`}
            >
                <Image 
                    src={slide.imageUrl}
                    alt="Hero Banner"
                    fill
                    priority={i === 0}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent" />
            </Link>
            ))}
          
          {/* Slide Indicators */}
          {slides.length > 1 && (
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                {slides.map((_, i) => (
                    <button 
                        key={i} 
                        onClick={() => setCurrent(i)}
                        className={`h-1.5 rounded-full transition-all duration-500 ${i === current ? 'w-10 bg-white shadow-lg' : 'w-2 bg-white/40 hover:bg-white/60'}`}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}


