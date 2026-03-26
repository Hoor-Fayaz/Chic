"use client";

import { create } from "zustand";
import { getWishlistAPI, toggleWishlistAPI } from "@/lib/api";

export const useWishlistStore = create((set, get) => ({
  wishlist: [],
  loading: false,

  // Load wishlist from backend
  loadWishlist: async () => {
    set({ loading: true });
    try {
      const data = await getWishlistAPI();
      set({ wishlist: data });
    } catch (err) {
      console.error("Failed to load wishlist", err);
    } finally {
      set({ loading: false });
    }
  },

  // Toggle product in wishlist
  toggle: async (product) => {
    const { wishlist } = get();
    const exists = wishlist.some((p) => p._id === product._id);

    // 1️⃣ Optimistic update
    const optimistic = exists
      ? wishlist.filter((p) => p._id !== product._id)
      : [...wishlist, product];

    set({ wishlist: optimistic });

    try {
      // 2️⃣ Call backend
      const updated = await toggleWishlistAPI(product._id);
      // fallback to optimistic if backend fails
      if (Array.isArray(updated)) {
  set({ wishlist: updated });
}
    } catch (err) {
      console.error("Toggle wishlist failed", err);
      // rollback to previous state if needed
      set({ wishlist });
    }
  },
}));