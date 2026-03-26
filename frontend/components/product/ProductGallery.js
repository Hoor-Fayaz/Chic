"use client";

import { useState, useRef } from "react";
import ProductZoom from "./ProductZoom";
import { ChevronUp, ChevronDown } from "lucide-react";

export default function ProductGallery({ images = [] }) {
  const thumbnailRefs = useRef([]);
  // Find primary or default to first
  const primaryIndex = images.findIndex((img) => img.isPrimary);
  const initialIndex = primaryIndex !== -1 ? primaryIndex : 0;
  
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  
  if (!images || images.length === 0) {
    return <div className="aspect-[2/3] w-full bg-gray-100 rounded-[2.5rem]" />;
  }

  const activeImage = images[activeIndex];

  const scrollThumbnails = (direction) => {
    const container = document.getElementById('thumbnail-container');
    if (container) {
      const scrollAmount = direction === 'up' ? -150 : 150;
      container.scrollBy({ top: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-8 items-start">
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex flex-row md:flex-col items-center gap-2 group/thumbs">
          {/* Scroll Up Arrow */}
          <button 
            onClick={() => scrollThumbnails('up')}
            className="hidden md:flex items-center justify-center p-1 text-gray-400 hover:text-black transition"
          >
            <ChevronUp size={20} />
          </button>

          <div 
            id="thumbnail-container"
            className="flex flex-row md:flex-col gap-4 min-w-[100px] max-h-[600px] overflow-x-auto md:overflow-y-auto no-scrollbar py-2 scroll-smooth"
          >
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`relative flex-shrink-0 w-20 h-28 md:w-28 md:h-40 rounded-[1.5rem] overflow-hidden border-2 transition-all duration-300 ${
                  activeIndex === index
                    ? "border-black ring-2 ring-black ring-offset-2"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={img.url}
                  alt={img.alt || `Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Scroll Down Arrow */}
          <button 
            onClick={() => scrollThumbnails('down')}
            className="hidden md:flex items-center justify-center p-1 text-gray-400 hover:text-black transition"
          >
            <ChevronDown size={20} />
          </button>
        </div>
      )}



      {/* Main Display */}
      <div className="flex-1">
        <div className="relative group overflow-hidden rounded-3xl bg-gray-50 border border-gray-100 shadow-sm transition-all duration-500">
          <ProductZoom
            src={activeImage.url}
            alt={activeImage.alt || "Product image"}
          />
          
          {/* Discount Badge overlay if needed (optional, can be passed as prop) */}
        </div>
      </div>
    </div>
  );
}