"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { X } from "lucide-react";

const messages = [
  { text: "Free shipping on orders over Rs. 5,000 within Pakistan", link: "/shipping" },
  { text: "New collection just dropped — Shop Now", link: "/shop" },
  { text: "Hassle-free returns within 7 days", link: "/returns" },
  { text: "Exclusive styles. Limited stock. Don't miss out.", link: "/new-arrivals" },
];

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    const dismissed = localStorage.getItem("announcement_dismissed");
    if (!dismissed) setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible) return;
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % messages.length);
    }, 3500);
    return () => clearInterval(intervalRef.current);
  }, [visible]);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem("announcement_dismissed", "1");
  };

  if (!visible) return null;

  const msg = messages[current];

  return (
    <div className="relative bg-gray-900 text-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-center gap-4">
        {/* Scrolling messages */}
        <div className="flex-1 text-center overflow-hidden">
          <div
            key={current}
            className="animate-in fade-in slide-in-from-bottom-1 duration-500"
          >
            <Link
              href={msg.link}
              className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-200 hover:text-white transition-colors"
            >
              {msg.text}
            </Link>
          </div>
        </div>

        {/* Dots */}
        <div className="hidden sm:flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2 -bottom-0 pb-0.5">
        </div>

        {/* Dismiss */}
        <button
          onClick={dismiss}
          aria-label="Dismiss announcement"
          className="ml-auto shrink-0 p-1 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
        >
          <X size={14} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-[2px] bg-white/20 w-full">
        <div
          key={current}
          className="h-full bg-white/60 animate-[progress_3.5s_linear_forwards]"
          style={{ width: "100%" }}
        />
      </div>

      <style jsx>{`
        @keyframes progress {
          from { width: 0% }
          to { width: 100% }
        }
      `}</style>
    </div>
  );
}
