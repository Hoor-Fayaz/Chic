"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const PAGE_LABELS = {
  "/track": "Track Your Order",
  "/shipping": "Shipping Information",
  "/returns": "Returns & Exchanges",
  "/faqs": "Frequently Asked Questions",
  "/contact": "Contact Us",
  "/about": "Our Story",
  "/terms": "Terms & Conditions",
  "/privacy": "Privacy Policy",
  "/careers": "Careers",
};

export default function InfoHeader() {
  const pathname = usePathname();
  const label = PAGE_LABELS[pathname] || "Help Center";

  return (
    <div className="border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-400 font-medium mb-6">
          <Link href="/" className="hover:text-gray-700 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-gray-700">{label}</span>
        </nav>

        {/* Page Title */}
        <h1 className="text-3xl lg:text-4xl font-display font-medium text-gray-900 tracking-tight">
          {label}
        </h1>
      </div>
    </div>
  );
}
