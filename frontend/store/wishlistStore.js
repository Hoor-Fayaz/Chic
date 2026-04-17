"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      wishlist: [],
      
      toggle: (product) => {
        const { wishlist } = get();
        const exists = wishlist.some((p) => p._id === product._id);

        set({ 
          wishlist: exists
            ? wishlist.filter((p) => p._id !== product._id)
            : [...wishlist, product]
        });
      },
      
      // Kept for legacy compatibility if called by layout
      loadWishlist: () => {}, 
    }),
    {
      name: "guest-wishlist", 
    }
  )
);
