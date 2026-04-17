"use client";
import Link from "next/link";
import Image from "next/image";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { useEffect, useState } from "react";
import { fetchPublicSettings } from "@/lib/api";

export default function Footer() {
  const [brand, setBrand] = useState({
    contactPhone: '923141988998',
    instagramUrl: 'https://www.instagram.com/jannah_chic?igsh=MW56bG9lNzJudWRrMg==',
  });

  useEffect(() => {
    fetchPublicSettings()
      .then(res => {
        if (res?.data) {
          setBrand({
            contactPhone: res.data.contactPhone || '923141988998',
            instagramUrl: res.data.instagramUrl || 'https://www.instagram.com/jannah_chic?igsh=MW56bG9lNzJudWRrMg==',
          });
        }
      })
      .catch(() => {}); // fail silently, defaults still show
  }, []);

  return (
    <footer className="border-t border-gray-100 bg-white pt-20 pb-12">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        {/* TOP GRID */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 text-sm text-gray-500">

          {/* Brand */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-10 w-10 grayscale">
                <Image 
                  src="/logoo.png" 
                  alt="Jannah Chic" 
                  fill
                  className="object-contain" 
                />
              </div>
              <h3 className="text-lg font-display tracking-[0.2em] uppercase text-gray-900 border-l border-gray-100 pl-3">
                Jannah Chic
              </h3>
            </Link>
            <p className="text-gray-400 max-w-xs leading-relaxed italic text-[12px]">
              "Curating architectural silhouettes and timeless textures for the modern wardrobe."
            </p>
          </div>

          {/* Collections */}
          <div className="space-y-6">
            <h4 className="font-bold text-gray-900 uppercase tracking-widest text-[10px]">The Collections</h4>
            <ul className="space-y-3 font-semibold text-[12px]">
              <li><Link href="/shop" className="hover:text-black transition-colors">All Pieces</Link></li>
              <li><Link href="/category/sarees" className="hover:text-black transition-colors">House of Sarees</Link></li>
              <li><Link href="/category/frocks" className="hover:text-black transition-colors">Signature Frocks</Link></li>
              <li><Link href="/category/unstitched" className="hover:text-black transition-colors">Unstitched Textiles</Link></li>
              <li><Link href="/sale" className="text-rose-600 hover:text-rose-700 transition-colors">Limited Vault (Sale)</Link></li>
            </ul>
          </div>

          {/* Concierge */}
          <div className="space-y-6">
            <h4 className="font-bold text-gray-900 uppercase tracking-widest text-[10px]">Concierge</h4>
            <ul className="space-y-3 font-semibold text-[12px]">
              <li><Link href="/track" className="hover:text-black transition-colors">Tracking Logistics</Link></li>
              <li><Link href="/shipping" className="hover:text-black transition-colors">Shipping Information</Link></li>
              <li><Link href="/returns" className="hover:text-black transition-colors">Refund Policy</Link></li>
              <li><Link href="/faqs" className="hover:text-black transition-colors">Frequently Asked</Link></li>
              <li><Link href="/contact" className="hover:text-black transition-colors">Atelier Support</Link></li>
            </ul>
          </div>

          {/* The Label */}
          <div className="space-y-6">
            <h4 className="font-bold text-gray-900 uppercase tracking-widest text-[10px]">The Label</h4>
            <ul className="space-y-3 font-semibold text-[12px]">
              <li><Link href="/about" className="hover:text-black transition-colors">Our Story</Link></li>
              <li><Link href="/terms" className="hover:text-black transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-black transition-colors">Privacy Charter</Link></li>
              <li><Link href="/careers" className="hover:text-black transition-colors">Join the Atelier</Link></li>
            </ul>
          </div>

        </div>

        {/* BOTTOM ROW */}
        <div className="mt-20 pt-10 border-t border-gray-50 flex flex-col items-center justify-between gap-8 text-[10px] font-bold uppercase tracking-widest text-gray-400 md:flex-row">
          
          {/* Social Icons */}
          <div className="flex gap-6 items-center">
            <a
              href={brand.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-gray-400 hover:text-pink-500 transition-all hover:-translate-y-1 text-base"
            >
              <FaInstagram />
            </a>
            <a
              href={`https://wa.me/${brand.contactPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="text-gray-400 hover:text-green-500 transition-all hover:-translate-y-1 text-base"
            >
              <FaWhatsapp />
            </a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="cursor-default border-none outline-none">
              &copy; {new Date().getFullYear()} Jannah Chic Atelier.
            </Link>
            <span className="h-1 w-1 bg-gray-200 rounded-full"></span>
            <span className="text-gray-900">Designed for Modest Perfection.</span>
          </div>

          <div className="flex gap-4 items-center grayscale opacity-50">
             <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-3" alt="Visa" />
             <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-5" alt="Mastercard" />
          </div>
        </div>
      </div>
    </footer>
  );
}

