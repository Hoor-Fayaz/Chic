"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HiOutlineX } from "react-icons/hi";
import { fetchCart, removeCartItem } from "@/lib/api";
import { useCartStore } from "@/store/cartStore";
import { useToastStore } from "@/store/toastStore";

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToastStore();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const res = await fetchCart();
      if (res.success && res.data && res.data.cart) {
        setCart(res.data.cart);
        useCartStore.getState().setCart(res.data.cart.items);
      } else {
        setCart(null);
        useCartStore.getState().setCart([]);
      }
    } catch {
      setCart(null);
      useCartStore.getState().setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (index) => {
    try {
      const res = await removeCartItem(index);
      if (res.success && res.data && res.data.cart) {
        setCart(res.data.cart);
        useCartStore.getState().setCart(res.data.cart.items);
        showToast("Item removed from bag", "info");
      } else {
        // If data.cart isn't returned, reload manually
        loadCart();
        showToast("Item removed from bag", "info");
      }
    } catch (err) {
      console.error("Remove item failed", err);
      showToast("Failed to remove item", "error");
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex justify-center items-center">
        <p className="text-gray-500">Loading your cart...</p>
      </div>
    );
  }

  const items = cart?.items || [];
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-10 lg:px-0">
        <h1 className="mb-6 text-2xl font-display tracking-tight text-gray-900">
          Shopping Bag
        </h1>

        {items.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="text-sm text-gray-600">
              Your bag is empty. Discover something you love.
            </p>
            <Link
              href="/shop"
              className="mt-4 inline-flex rounded-full bg-gray-900 px-6 py-2.5 text-xs font-semibold uppercase tracking-wide text-white hover:bg-black"
            >
              Browse collection
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
            <div className="space-y-4">
              {items.map((item, index) => {
                const product = item.product;
                const primaryImage =
                  product?.images?.find((img) => img.isPrimary) ||
                  product?.images?.[0] ||
                  null;

                return (
                  <div
                    key={`${product?._id}-${index}`}
                    className="flex gap-4 rounded-2xl bg-white p-4 shadow-sm"
                  >
                    <div className="h-28 w-24 overflow-hidden rounded-xl bg-gray-100">
                      {primaryImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={primaryImage.url}
                          alt={primaryImage.alt || product?.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-gray-200" />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-between text-sm">
                      <div className="relative pr-6">
                        <button
                          onClick={() => handleRemove(index)}
                          className="absolute -top-1 -right-1 p-1 text-gray-400 hover:text-rose-600 transition-colors"
                          title="Remove item"
                        >
                          <HiOutlineX className="h-5 w-5" />
                        </button>
                        <Link
                          href={`/product/${product?.slug}`}
                          className="font-medium text-gray-900 hover:underline"
                        >
                          {product?.name}
                        </Link>
                        {item.size && (
                          <p className="mt-1 text-xs text-gray-500">
                            Size: {item.size}
                          </p>
                        )}
                        {item.color && (
                          <p className="mt-0.5 text-xs text-gray-500">
                            Color: {item.color}
                          </p>
                        )}

                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>Qty: {item.quantity}</span>
                        <span className="font-semibold text-gray-900">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <aside className="space-y-4 rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Order Summary
              </h2>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-4 text-sm font-bold text-gray-900">
                <span className="uppercase tracking-widest text-[10px]">Total</span>
                <span>PKR {subtotal.toLocaleString()}</span>
              </div>
              <Link
                href="/checkout"
                className="mt-6 inline-flex w-full justify-center rounded-full bg-black py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white hover:bg-gray-900 transition-all shadow-xl shadow-black/5 hover:-translate-y-0.5 active:translate-y-0"
              >
                Proceed to Shipping
              </Link>

            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

