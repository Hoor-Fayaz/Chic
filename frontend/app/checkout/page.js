import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Checkout | Jannah Chic",
};

export default function CheckoutPage() {
  // Server-side redirect
  redirect("/cart");

  // Fallback JSX to satisfy the Server Component compiler
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400 animate-pulse uppercase tracking-widest text-[10px] font-bold">
        Redirecting to cart...
      </p>
    </div>
  );
}
