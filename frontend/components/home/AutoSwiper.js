"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchPublicSettings } from "@/lib/api";
import { DEMO_IMAGES } from "@/lib/demoImages";

export default function AutoSwiper() {
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicSettings().then(res => {
        if (res.success && res.data?.section2?.slides?.length > 0) {
            setSlides(res.data.section2.slides);
        } else {
            setSlides([
                { imageUrl: DEMO_IMAGES.sareeBanner, link: "/category/sarees", title: "Silk Saree Collection" },
                { imageUrl: DEMO_IMAGES.frockBanner, link: "/category/frocks", title: "Festive Frocks" }
            ]);
        }
    }).catch(() => {
        setSlides([
            { imageUrl: DEMO_IMAGES.sareeBanner, link: "/category/sarees", title: "Silk Saree Collection" },
            { imageUrl: DEMO_IMAGES.frockBanner, link: "/category/frocks", title: "Festive Frocks" }
        ]);
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
    <section className="relative w-full overflow-hidden bg-white">
      <div className="relative w-full h-[52vh] sm:h-[60vh] lg:h-[88vh] overflow-hidden touch-pan-y">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === current ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <div
              className="pointer-events-none absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.imageUrl})` }}
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-black/25 to-black/35"
              aria-hidden="true"
            />

            <div className="relative h-full mx-auto max-w-[1600px] px-4 lg:px-12">
              <div className="flex h-full items-center justify-center">
                <div className="text-center max-w-4xl">
                  <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-white/70">
                    Jannah
                  </p>
                  <h2 className="mt-4 px-2 text-white text-2xl sm:text-5xl lg:text-7xl font-display font-semibold tracking-tight text-center drop-shadow-xl">
                    {slide.title}
                  </h2>
                  <div className="mt-8 flex items-center justify-center gap-3">
                    <Link
                      href={slide.link}
                      className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-[10px] font-bold uppercase tracking-widest text-gray-900 shadow-2xl shadow-black/30 hover:bg-gray-100 active:scale-95 transition"
                    >
                      Shop Now
                    </Link>
                    <Link
                      href="/new-arrivals"
                      className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/0 px-7 py-3.5 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white/10 active:scale-95 transition"
                    >
                      New Arrivals
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
