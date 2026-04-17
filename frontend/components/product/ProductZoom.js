"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProductZoom({ src, alt }) {
  const [zoomStyle, setZoomStyle] = useState({});
  const [showZoom, setShowZoom] = useState(false);

  function handleMouseMove(e) {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();

    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomStyle({
      backgroundImage: `url(${src})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: "200%", // zoom level
    });
  }

  return (
    <div
      className="relative w-full aspect-[4/5] lg:aspect-[2/3] overflow-hidden rounded-[2.5rem] bg-[#fdfdfd] border border-gray-100/50 shadow-sm cursor-zoom-in group"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setShowZoom(true)}
      onMouseLeave={() => setShowZoom(false)}
    >
      {/* Normal Image Optimized */}
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        priority
        className="object-cover transition-opacity duration-300"
      />


      {/* Zoom Layer */}
      {showZoom && (
        <div
          className="absolute inset-0"
          style={zoomStyle}
        />
      )}
    </div>
  );
}
