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
            newCart[existsIndex] = {
              ...newCart[existsIndex],
              quantity: newCart[existsIndex].quantity + quantity
            };
            return { cart: newCart };
          }

          const cartItemId = `${product._id}-${size}-${color}-${Date.now()}`;
          return {
            cart: [...state.cart, { cartItemId, product, quantity, size, color, price: product.price }],
          };
        }),

      removeItem: (cartItemId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.cartItemId !== cartItemId),
        })),

      updateQuantity: (cartItemId, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) => 
            item.cartItemId === cartItemId 
              ? { ...item, quantity: Math.max(1, quantity) } 
              : item
          ),
        })),

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "guest-cart-storage", 
    }
  )
);
