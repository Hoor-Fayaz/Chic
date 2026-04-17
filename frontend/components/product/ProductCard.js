

"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { HiOutlineX } from "react-icons/hi";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuthStore } from "@/store/authStore";
import { useToastStore } from "@/store/toastStore";
import ReviewStars from "./ReviewStars";

export default function ProductCard({ product, showRemove = false, onRemove = null }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { wishlist, toggle } = useWishlistStore();
  const { showToast } = useToastStore();
  const liked = wishlist.some((p) => p._id === product._id);

  const primaryImage =
    product.images?.find((img) => img.isPrimary) || product.images?.[0] || null;
  const hoverImage =
    product.images?.find((img) => !img.isPrimary) || product.images?.[1] || null;

  const pieceType = product.tags?.find(t => t.toLowerCase() === '2 piece' || t.toLowerCase() === '3 piece');

  return (
    <div className="group flex flex-col bg-white overflow-hidden transition-all duration-500">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-[#f8f8f8] aspect-[4/5] lg:aspect-[2/3]">

        {/* Wishlist Icon */}
        <button
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (liked) {
                showToast(`Removed from wishlist`, "info");
            } else {
                showToast(`Added to favorites!`, "success");
            }
            toggle(product);
          }}
          className="absolute right-4 top-4 z-20 rounded-full bg-white/80 backdrop-blur-md p-2.5 shadow-sm hover:bg-white hover:scale-110 transition-all duration-300"
        >
          <Heart
            size={18}
            className={`transition-colors duration-300 ${
              liked ? "fill-red-500 text-red-500" : "text-gray-400 group-hover:text-gray-600"
            }`}
          />
        </button>

        {showRemove && (
          <button
            aria-label="Remove from wishlist"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              showToast(`Removed from favorites`, "info");
              if (onRemove) onRemove(product);
              else toggle(product);
            }}
            className="absolute left-4 top-4 z-20 rounded-full bg-white/80 backdrop-blur-md p-2 shadow-sm hover:bg-rose-50 hover:text-rose-600 transition-all font-bold"
          >
            <HiOutlineX size={18} />
          </button>
        )}

        {/* Badges */}
        <div className="absolute left-4 top-4 z-20 flex flex-col gap-2">
            {product.isOnSale && product.price < product.originalPrice && (
                <span className="bg-rose-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                    Sale {product.discountPercent || Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </span>
            )}
            {product.isNewArrival && (
                <span className="bg-black text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                    New
                </span>
            )}
        </div>

        <Link href={`/product/${product.slug}`} className="block h-full w-full">
          {primaryImage ? (
            <div className="relative h-full w-full">
              <Image
                src={primaryImage.url}
                alt={primaryImage.alt || product.name}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                className={`object-cover transition-all duration-700 ease-out ${
                  hoverImage ? "group-hover:opacity-0 group-hover:scale-105" : "group-hover:scale-110"
                }`}
              />
              {hoverImage && (
                <Image
                  src={hoverImage.url}
                  alt={hoverImage.alt || product.name}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                  className="object-cover opacity-0 scale-110 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-100"
                />
              )}
            </div>
          ) : (
            <div className="h-full w-full bg-gray-100" />
          )}
        </Link>
        
        {/* Quick View / Hover Info Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/20 to-transparent pointer-events-none hidden md:block">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white font-bold drop-shadow-sm">View Details</span>
        </div>
      </div>

      <div className="mt-5 px-1 space-y-2 text-center md:text-left">
        <div className="space-y-0.5">
          <p className="text-[10px] uppercase font-bold tracking-[0.15em] text-gray-400">
            {product.category?.name || "Premium Collection"}
            {pieceType && <span className="text-gray-300 ml-2 mr-2">|</span>}
            {pieceType && <span className="text-gray-500">{pieceType}</span>}
          </p>
          <p className="text-[14px] font-medium text-gray-900 tracking-tight leading-tight truncate">
            {product.name}
          </p>
        </div>
        
        <div className="flex items-center justify-center md:justify-start gap-2.5">
          <span className="text-[15px] font-bold text-gray-900">
            Rs. {product.price?.toLocaleString()}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-gray-400 line-through">
                Rs. {product.originalPrice.toLocaleString()}
              </span>
              <span className="text-[10px] font-bold text-red-500 px-1.5 py-0.5 bg-red-50 rounded-full">
                -{product.discountPercent}%
              </span>
            </div>
          )}
        </div>

        {product.ratingCount > 0 && (
          <div className="mt-1 flex justify-center md:justify-start">
            <ReviewStars rating={product.ratingAverage} count={product.ratingCount} size={10} />
          </div>
        )}
      </div>
    </div>

  );
}
