// "use client";
// import ProductCard from "../product/ProductCard";

// export default function ProductCarousel({ title, products = [] }) {
//   if (!products.length) return null;

//   return (
//     <section className="bg-white py-10">
//       <div className="mx-auto max-w-6xl px-4 lg:px-0">
//         <h2 className="mb-6 text-lg font-semibold tracking-tight text-gray-900">{title}</h2>
//         <div className="flex gap-4 overflow-x-auto pb-4">
//           {products.map((product) => (
//             <div key={product._id} className="flex-shrink-0 w-[250px]">
//               <ProductCard product={product} />
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";
import ProductCard from "../product/ProductCard";

export default function ProductCarousel({ title, products = [] }) {
  const scrollRef = useRef(null);
  const [current, setCurrent] = useState(0);

  if (!products.length) return null;

  const scroll = (direction) => {
    const container = scrollRef.current;
    const cardWidth = 300;

    if (direction === "left") {
      container.scrollBy({ left: -cardWidth * 2, behavior: "smooth" });
      setCurrent((prev) => Math.max(prev - 1, 0));
    } else {
      container.scrollBy({ left: cardWidth * 2, behavior: "smooth" });
      setCurrent((prev) => Math.min(prev + 1, products.length - 1));
    }
  };

  // auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      scroll("right");
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-6xl px-4 lg:px-0">

        {/* Title */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-gray-900">
            {title}
          </h2>

          {/* arrows */}
          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="h-9 w-9 rounded-full border flex items-center justify-center hover:bg-gray-100"
            >
              ←
            </button>

            <button
              onClick={() => scroll("right")}
              className="h-9 w-9 rounded-full border flex items-center justify-center hover:bg-gray-100"
            >
              →
            </button>
          </div>
        </div>

        {/* carousel */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide"
        >
          {products.map((product) => (
            <div key={product._id} className="min-w-[280px] md:min-w-[300px]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* dots */}
        <div className="mt-6 flex justify-center gap-2">
          {products.slice(0, 6).map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full ${
                current === i ? "bg-gray-900" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}