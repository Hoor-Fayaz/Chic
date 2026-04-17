"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, Sparkles } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    // Simulate API call — replace with your backend endpoint
    await new Promise((r) => setTimeout(r, 1000));
    setStatus("success");
  };

  return (
    <section className="bg-gray-900 text-white py-24 px-4 overflow-hidden relative">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mt-48 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mb-48 blur-3xl" />

      <div className="relative max-w-2xl mx-auto text-center space-y-8">
        {/* Label */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full">
          <Sparkles size={12} className="text-yellow-400" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-300">
            Exclusive Access
          </span>
        </div>

        {/* Heading */}
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight leading-[0.95]">
            Join Our World.
          </h2>
          <p className="text-gray-400 text-[15px] leading-relaxed max-w-md mx-auto">
            Subscribe for early access to new collections, exclusive offers, and styling inspiration. 
            Get <span className="text-white font-bold">10% off</span> your first order.
          </p>
        </div>

        {/* Form */}
        {status === "success" ? (
          <div className="flex flex-col items-center gap-4 py-6 animate-in fade-in duration-500">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle size={32} className="text-green-400" />
            </div>
            <p className="text-lg font-display font-bold">You're in!</p>
            <p className="text-gray-400 text-sm">Your exclusive discount code has been sent to your inbox.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
              placeholder="Your email address"
              className={`flex-1 bg-white/10 border ${
                status === "error" ? "border-red-400" : "border-white/20"
              } rounded-full px-6 py-4 text-sm text-white placeholder-gray-500 outline-none focus:border-white/40 focus:bg-white/15 transition-all`}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="group shrink-0 flex items-center gap-2 bg-white text-gray-900 rounded-full px-8 py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-gray-100 transition-all disabled:opacity-60 shadow-xl shadow-black/20"
            >
              {status === "loading" ? (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
              ) : (
                <>
                  Subscribe
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="text-red-400 text-xs -mt-4">Please enter a valid email address.</p>
        )}

        <p className="text-[10px] text-gray-600 uppercase tracking-widest">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
