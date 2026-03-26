import { FaFacebookF, FaInstagram, FaTwitter, FaTiktok } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 lg:px-0">
        {/* TOP GRID */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 text-sm text-gray-600">

          {/* Brand */}
          <div className="flex flex-col gap-4 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <img 
                src="/logoo.png" 
                alt="Logo" 
                className="h-12 w-auto object-contain" 
              />
              <h3 className="text-xl font-display tracking-[0.2em] uppercase text-gray-900">
                Jannah Chic
              </h3>
            </div>
            <p className="text-gray-500 max-w-xs">
              Elevating your fashion experience with curated Sarees, Frocks, and Unstitched collections.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="mb-3 font-semibold text-gray-900 uppercase tracking-wider text-xs">Shop</h4>
            <ul className="space-y-2">
              <li><a href="/shop" className="hover:text-black">All Collections</a></li>
              <li><a href="/category/sarees" className="hover:text-black">Sarees</a></li>
              <li><a href="/category/frocks" className="hover:text-black">Frocks</a></li>
              <li><a href="/category/unstitched" className="hover:text-black">Unstitched</a></li>
              <li><a href="/category/sale" className="hover:text-black">Sale</a></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="mb-4 font-bold text-gray-900 uppercase tracking-widest text-[11px]">Help</h4>
            <ul className="space-y-3 text-[13px] font-medium">
              <li><a href="/track" className="hover:text-black transition-colors">Track Order</a></li>
              <li><a href="/shipping" className="hover:text-black transition-colors">Shipping Info</a></li>
              <li><a href="/returns" className="hover:text-black transition-colors">Returns & Exchanges</a></li>
              <li><a href="/faqs" className="hover:text-black transition-colors">FAQs</a></li>
              <li><a href="/contact" className="hover:text-black transition-colors">Contact Support</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 font-bold text-gray-900 uppercase tracking-widest text-[11px]">Company</h4>
            <ul className="space-y-3 text-[13px] font-medium">
              <li><a href="/about" className="hover:text-black transition-colors">About Us</a></li>
              <li><a href="/terms" className="hover:text-black transition-colors">Terms & Conditions</a></li>
              <li><a href="/privacy" className="hover:text-black transition-colors">Privacy Policy</a></li>
              <li><a href="/careers" className="hover:text-black transition-colors">Careers</a></li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="my-8 border-t border-gray-200"></div>

        {/* BOTTOM ROW */}
        <div className="flex flex-col items-center justify-between gap-6 text-sm text-gray-500 md:flex-row">

          {/* Social Icons */}
          <div className="flex gap-5 text-gray-600">
            <a href="#" aria-label="Facebook" className="hover:text-black">
              <FaFacebookF className="h-5 w-5" />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-black">
              <FaInstagram className="h-5 w-5" />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-black">
              <FaTwitter className="h-5 w-5" />
            </a>
            <a href="#" aria-label="TikTok" className="hover:text-black">
              <FaTiktok className="h-5 w-5" />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-center md:text-right">
            &copy; {new Date().getFullYear()} Jannah Chic. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}