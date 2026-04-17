"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Client-side redirect to Cart
    router.replace("/cart");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#f8f5f2] flex flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center gap-6 animate-in fade-in duration-1000">
        <div className="w-12 h-12 border-2 border-black border-t-transparent rounded-full animate-spin" />
        <div className="text-center">
          <h1 className="text-2xl font-display font-medium text-gray-900 tracking-tight">Checkout</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mt-2">
            Redirecting to cart...
          </p>
        </div>
      </div>
    </div>
  );
}
