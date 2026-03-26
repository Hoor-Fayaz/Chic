import { create } from "zustand";
import { fetchCart } from "@/lib/api";

export const useCartStore = create((set, get) => ({
  cart: [],
  loading: false,

  // ✅ Load cart from backend
  loadCart: async () => {
    set({ loading: true });
    try {
      const res = await fetchCart();
      if (res.success && res.data?.cart?.items) {
        set({ cart: res.data.cart.items });
      }
    } catch (err) {
      console.error("Failed to load cart", err);
    } finally {
      set({ loading: false });
    }
  },

  // ✅ Sync local state with full backend response
  setCart: (items) => set({ cart: items || [] }),

  addItem: (product) =>
    set((state) => {
      // This is a simple local fallback, but we usually prefer syncing with the backend response
      const exists = state.cart.find((item) => item.product?._id === product._id);

      if (exists) {
        return {
          cart: state.cart.map((item) =>
            item.product?._id === product._id
              ? { ...item, quantity: (item.quantity || 1) + 1 }
              : item
          ),
        };
      }

      return {
        cart: [...state.cart, { product, quantity: 1 }],
      };
    }),

  removeItem: (id) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.product?._id !== id),
    })),

  clearCart: () => set({ cart: [] }),
}));