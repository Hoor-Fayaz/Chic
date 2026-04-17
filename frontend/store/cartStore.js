import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      
      addItem: (product, quantity = 1, size = null, color = null) =>
        set((state) => {
          const existsIndex = state.cart.findIndex(
            (item) => item.product?._id === product._id && item.size === size && item.color === color
          );

          if (existsIndex > -1) {
            const newCart = [...state.cart];
            newCart[existsIndex].quantity += quantity;
            return { cart: newCart };
          }

          return {
            cart: [...state.cart, { product, quantity, size, color, price: product.price }],
          };
        }),

      removeItem: (index) =>
        set((state) => ({
          cart: state.cart.filter((_, i) => i !== index),
        })),

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "guest-cart-storage", 
    }
  )
);
