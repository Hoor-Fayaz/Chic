"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HiOutlineX } from "react-icons/hi";
import { useCartStore } from "@/store/cartStore";
import { useToastStore } from "@/store/toastStore";
import { fetchPublicSettings } from "@/lib/api";
import { Minus, Plus, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { showToast } = useToastStore();
  const cartItems = useCartStore((state) => state.cart || []);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const [contactPhone, setContactPhone] = useState('923098730221');

  useEffect(() => {
    fetchPublicSettings()
      .then(res => { if (res?.data?.contactPhone) setContactPhone(res.data.contactPhone); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleRemove = (cartItemId) => {
    try {
      removeItem(cartItemId);
      showToast("Item removed from cart", "info");
    } catch (err) {
      console.error("Remove item failed", err);
      showToast("Failed to remove item", "error");
    }
  };

  if (!isLoaded) {
    return (
      <div className="bg-gray-50 min-h-screen flex justify-center items-center">
        <p className="text-gray-500">Loading your cart...</p>
      </div>
    );
  }

  const items = cartItems;
  const subtotal = items.reduce(
    (sum, item) => sum + (item.price || item.product?.price || 0) * item.quantity,
    0
  );

  const handleWhatsAppCheckout = () => {
    const phoneNumber = contactPhone.replace(/\D/g, '');
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://jannah.com';
    
    let message = `🌟 *JANNAH - NEW ORDER INQUIRY*\n\n`;
    message += `Hello team, I would like to place an order for the following items:\n\n`;
    message += `📋 *ORDER DETAILS*\n`;
    message += `------------------------------\n`;
    
    items.forEach((item, idx) => {
      const product = item.product;
      const productUrl = `${currentOrigin}/product/${product?.slug}`;
      
      message += `*Item ${idx + 1}:* ${product?.name}\n`;
      message += `*Quantity:* ${item.quantity}\n`;
      if (item.size) message += `*Size:* ${item.size}\n`;
      if (item.color) message += `*Color:* ${item.color}\n`;
      message += `*Price:* PKR ${(item.price * item.quantity).toLocaleString()}\n`;
      message += `*Article Link:*\n${productUrl}\n\n`;
    });
    
    message += `------------------------------\n`;
    message += `💰 *Subtotal: PKR ${subtotal.toLocaleString()}*\n\n`;
    message += `Please confirm the payment and delivery details! Thank you. ✨`;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-10 lg:px-0">
        <h1 className="mb-6 text-2xl font-display tracking-tight text-gray-900">
          Shopping Cart
        </h1>

        {items.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="text-sm text-gray-600">
              Your cart is empty. Discover something you love.
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
                    key={item.cartItemId}
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
                          onClick={() => handleRemove(item.cartItemId)}
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
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center border border-gray-100 rounded-lg overflow-hidden h-9 bg-gray-50">
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="w-8 flex justify-center items-center hover:bg-gray-100 transition"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 flex justify-center items-center font-bold text-[11px]">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="w-8 flex justify-center items-center hover:bg-gray-100 transition"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="font-bold text-gray-900 text-[13px]">
                          PKR {(item.price * item.quantity).toLocaleString()}
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
                  <span>PKR {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span>To be discussed on WhatsApp</span>
                </div>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-4 text-sm font-bold text-gray-900">
                <span className="uppercase tracking-widest text-[10px]">Total</span>
                <span>PKR {subtotal.toLocaleString()}</span>
              </div>
              <button
                onClick={handleWhatsAppCheckout}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-black py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white hover:bg-gray-900 transition-all shadow-xl shadow-black/5 hover:-translate-y-0.5 active:translate-y-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                Complete Order via WhatsApp
              </button>

            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

