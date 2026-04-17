"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import ProductCard from "../product/ProductCard";
import ProductSkeleton from "../product/ProductSkeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductCarousel({ title, products = [], loading = false }) {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const swiperRef = useRef(null);

  if (!loading && !products.length) return null;

  return (
    <section className="bg-white py-16 overflow-hidden">
      <div className="mx-auto max-w-[1600px] px-4 lg:px-12">

        {/* Header */}
        <div className="mb-6 sm:mb-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-display tracking-tight text-gray-900 sm:text-3xl">
                {title}
            </h2>
            <div className="h-1 w-12 bg-black rounded-full" />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              disabled={isBeginning && !swiperRef.current?.params?.loop}
              className={`h-11 w-11 rounded-full border flex items-center justify-center transition-all ${
                (!isBeginning || swiperRef.current?.params?.loop) ? 'border-gray-200 text-gray-900 hover:bg-black hover:text-white hover:border-black shadow-sm' : 'border-gray-100 text-gray-200 cursor-not-allowed'
              }`}
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={() => swiperRef.current?.slideNext()}
              disabled={isEnd && !swiperRef.current?.params?.loop}
              className={`h-11 w-11 rounded-full border flex items-center justify-center transition-all ${
                (!isEnd || swiperRef.current?.params?.loop) ? 'border-gray-200 text-gray-900 hover:bg-black hover:text-white hover:border-black shadow-sm' : 'border-gray-100 text-gray-200 cursor-not-allowed'
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Carousel Content */}
        <div className="-mx-4 px-4 lg:-mx-8 lg:px-8 pb-4">
          {loading ? (
             <div className="flex gap-6 overflow-hidden">
              {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="min-w-[280px] md:min-w-[320px]">
                    <ProductSkeleton />
                  </div>
                ))}
             </div>
          ) : (
            <Swiper
              modules={[Autoplay, Navigation]}
              spaceBetween={16}
              autoplay={{
                delay: 1500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
              }}
              loop={true}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
              }}
              onSlideChange={(swiper) => {
                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
              }}
              breakpoints={{
                0: { slidesPerView: 2.5, spaceBetween: 12 },
                640: { slidesPerView: 3.2, spaceBetween: 16 },
                1024: { slidesPerView: 3.5, spaceBetween: 24 },
                1280: { slidesPerView: 4.8, spaceBetween: 24 },
                1600: { slidesPerView: 5.8, spaceBetween: 24 }
              }}
              className="!overflow-visible"
            >
              {products.map((product) => (
                <SwiperSlide key={product._id} className="pb-4">
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

      </div>
    </section>
  );
}
