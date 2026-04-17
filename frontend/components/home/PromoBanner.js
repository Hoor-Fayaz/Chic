"use client";
import Link from "next/link";

const promoBanners = [
  { img: "https://picsum.photos/400/500", link: "/shop" },
  { img: "/banners/promo-2.jpg", link: "/category/new-arrivals" },
];

export default function PromoBanner() {
  return (
    <section className="bg-gray-50 py-10">
      <div className="mx-auto max-w-6xl grid gap-4 px-4 sm:grid-cols-2 lg:px-0">
        {promoBanners.map((banner, i) => (
          <Link
            key={i}
            href={banner.link}
            className="block overflow-hidden rounded-2xl shadow-lg"
          >
            <div
              className="h-48 bg-cover bg-center sm:h-64 lg:h-80"
              style={{ backgroundImage: `url(${banner.img})` }}
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
