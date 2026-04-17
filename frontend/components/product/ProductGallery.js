"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import ProductZoom from "./ProductZoom";
import { ChevronUp, ChevronDown, Maximize2, X } from "lucide-react";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

export default function ProductGallery({ images = [] }) {
  const thumbnailRefs = useRef([]);
  // Find primary or default to first
  const primaryIndex = images.findIndex((img) => img.isPrimary);
  const initialIndex = primaryIndex !== -1 ? primaryIndex : 0;
  
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const swiperRef = useRef(null);
  
  if (!images || images.length === 0) {
    return <div className="aspect-[2/3] w-full bg-gray-100 rounded-[2.5rem]" />;
  }

  const scrollThumbnails = (direction) => {
    const container = document.getElementById('thumbnail-container');
    if (container) {
      const scrollAmount = direction === 'up' ? -150 : 150;
      container.scrollBy({ top: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleThumbnailClick = (index) => {
    setActiveIndex(index);
    if (swiperRef.current) {
        swiperRef.current.swiper.slideTo(index);
    }
  };

  return (
    <>
      <div className="flex flex-col-reverse md:flex-row gap-8 items-start w-full min-w-0 overflow-hidden">
        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex flex-row md:flex-col items-center justify-start md:justify-center gap-2 group/thumbs w-full md:w-auto overflow-hidden min-w-0">
            {/* Scroll Up Arrow */}
            <button 
              onClick={() => scrollThumbnails('up')}
              className="hidden md:flex items-center justify-center p-1 text-gray-400 hover:text-black transition"
            >
              <ChevronUp size={20} />
            </button>

            <div 
              id="thumbnail-container"
              className="flex flex-row md:flex-col gap-4 min-w-[100px] max-w-full max-h-[600px] overflow-x-auto md:overflow-y-auto no-scrollbar py-2 scroll-smooth px-1"
            >
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`relative flex-shrink-0 w-20 h-28 md:w-28 md:h-40 rounded-[1.5rem] overflow-hidden border-2 transition-all duration-300 ${
                    activeIndex === index
                      ? "border-black ring-2 ring-black ring-offset-2"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt || `Thumbnail ${index + 1}`}
                    fill
                    sizes="112px"
                    className="object-cover"
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

        {/* Main Display Container */}
        <div className="flex-1 w-full min-w-0 relative group">
            {/* Expand Overlay Button */}
            <button 
               onClick={() => setIsFullscreen(true)}
               className="absolute top-4 right-4 z-10 p-3 bg-white/80 backdrop-blur-sm rounded-full text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-white active:scale-95"
               title="View Fullscreen"
            >
               <Maximize2 size={18} />
            </button>

            <Swiper
                onSwiper={(swiper) => { swiperRef.current = { swiper }; }}
                onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                initialSlide={activeIndex}
                spaceBetween={20}
                slidesPerView={1}
                className="w-full rounded-[2.5rem] overflow-hidden bg-[#fdfdfd] border border-gray-100/50 shadow-sm transition-all duration-500"
            >
                {images.map((img, idx) => (
                    <SwiperSlide key={idx} className="cursor-zoom-in" onClick={() => setIsFullscreen(true)}>
                        <ProductZoom
                            src={img.url}
                            alt={img.alt || "Product image"}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center animate-in fade-in duration-300">
            {/* Close Button */}
            <button 
              onClick={() => setIsFullscreen(false)} 
              className="absolute top-6 right-6 lg:top-8 lg:right-8 z-[110] p-3 text-white/50 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full"
              title="Close Fullscreen"
            >
              <X size={24} />
            </button>
            
            <div className="w-full max-w-6xl h-full flex flex-col items-center justify-center p-4 md:p-12 relative pb-8 md:pb-12">
               <Swiper
                  initialSlide={activeIndex}
                  onSlideChange={(swiper) => handleThumbnailClick(swiper.activeIndex)}
                  modules={[Navigation]}
                  navigation={images.length > 1}
                  spaceBetween={30}
                  slidesPerView={1}
                  className="w-full h-full flex items-center justify-center swiper-theme-white mt-8" // Assuming swiper-button-white or custom styling needed
                >
                  {images.map((img, idx) => (
                    <SwiperSlide key={idx} className="flex items-center justify-center h-[80vh] md:h-[85vh]">
                      <div className="relative w-full h-full flex items-center justify-center">
                          <Image
                            src={img.url}
                            alt={img.alt || "Fullscreen product image"}
                            fill
                            className="object-contain"
                            sizes="100vw"
                          />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                
                {/* Visual Indicator in Lightbox */}
                <div className="text-white/50 text-xs tracking-[0.2em] font-bold uppercase mt-4">
                    {activeIndex + 1} / {images.length}
                </div>
            </div>
            
            {/* Global style to inject white swiper buttons specifically for lightbox */}
            <style jsx global>{`
               .swiper-theme-white .swiper-button-next,
               .swiper-theme-white .swiper-button-prev {
                  color: white !important;
                  opacity: 0.7;
                  transition: opacity 0.3s;
               }
               .swiper-theme-white .swiper-button-next:hover,
               .swiper-theme-white .swiper-button-prev:hover {
                  opacity: 1;
               }
            `}</style>
        </div>
      )}
    </>
  );
}
