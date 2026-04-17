"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchPublicSettings } from "@/lib/api";

export default function AutoSwiper() {
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicSettings().then(res => {
        if (res.success && res.data?.section2?.slides?.length > 0) {
            setSlides(res.data.section2.slides);
        } else {
            // Fallback
            setSlides([
                { imageUrl: "https://picsum.photos/1600/900?random=1", link: "/shop", title: "Summer Sale 2026" },
                { imageUrl: "https://picsum.photos/1600/900?random=2", link: "/category/new-arrivals", title: "New Arrivals" }
            ]);
        }
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [slides.length]);

  if (loading) return <div className="h-64 bg-gray-50 animate-pulse" />;

  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative w-full h-[75vh] lg:h-[95vh] overflow-hidden">
        {slides.map((slide, i) => (
          <Link
            key={i}
            href={slide.link}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <div
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.imageUrl})` }}
            >
              <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                <h2 className="px-6 text-white text-2xl sm:text-5xl lg:text-7xl font-display font-medium tracking-tight text-center drop-shadow-xl max-w-4xl">
                  {slide.title}
                </h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
