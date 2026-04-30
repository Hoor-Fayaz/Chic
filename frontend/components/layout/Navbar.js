"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { 
  HiOutlineUser, 
  HiOutlineShoppingCart, 
  HiOutlineHeart, 
  HiOutlineMenu, 
  HiOutlineX,
  HiOutlineSearch 
} from "react-icons/hi";
import { useAuthStore } from "@/store/authStore";
import { logoutUser } from "@/lib/api";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { fetchCategories } from "@/lib/api";

const staticItems = [
  { href: "/", label: "Home" },
  { href: "/new-arrivals", label: "New Arrivals" },
];

const saleItem = { href: "/sale", label: "Sale" };

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const wishlist = useWishlistStore((state) => state.wishlist);
  const cart = useCartStore((state) => state.cart || []);

  const cartCount = cart.reduce((total, item) => total + (item.quantity || 0), 0);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedMobileItem, setExpandedMobileItem] = useState(null);
  
  const [dynamicNavItems, setDynamicNavItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch and Build Navigation Tree
  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await fetchCategories();
        if (res.success && res.data.items) {
          const tree = buildNavigationTree(res.data.items);
          setDynamicNavItems(tree);
        }
      } catch (err) {
        console.error("Categories fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    getCategories();
  }, []);

  const buildNavigationTree = (items) => {
    // Return only top-level active categories as flat links for a cleaner navbar
    return items
      .filter(item => item.isActive && !item.parent)
      .map(item => ({
        href: `/category/${item.slug}`,
        label: item.name
      }));
  };

  const navItems = [...staticItems, ...dynamicNavItems, saleItem];

  // Close search/menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
    setSearchQuery("");
  };

  // Prevent background scroll
  useEffect(() => {
    if (mobileMenuOpen || searchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen, searchOpen]);

  // Dependencies removed for LocalStorage flow

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.error("Logout failed", e);
    }
    logout();
    router.push("/");
  };

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-4 lg:px-12">
          
          <div className="flex items-center gap-4">
            {/* Mobile Hamburger Icon */}
            <button 
              className="md:hidden -ml-2 p-3 text-gray-700 hover:text-black active:scale-95 transition-transform"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <HiOutlineMenu className="h-6 w-6" />
            </button>

            <Link href="/" className="flex items-center gap-3">
              <Image 
                src="/logoo.png" 
                alt="Logo" 
                width={64}
                height={64}
                priority
                className="h-12 md:h-16 w-auto object-contain" 
              />
              <span className="text-lg md:text-xl font-display tracking-[0.35em] uppercase text-gray-900 leading-none">
                Jannah Chic
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-8 text-sm font-medium text-gray-700 md:flex">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition-colors hover:text-black ${
                    isActive ? "text-black" : "text-gray-600"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Icons */}
          <div className="relative flex items-center gap-4 text-gray-700">
            {/* Search Toggle */}
            <button 
                onClick={() => setSearchOpen(true)}
                className="hover:text-black p-1"
                aria-label="Search"
            >
                <HiOutlineSearch className="h-6 w-6" />
            </button>

            {/* Wishlist */}
            <Link href="/wishlist" className="relative hover:text-black">
              <HiOutlineHeart className="h-6 w-6" />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 text-[10px] bg-rose-600 text-white rounded-full h-4 w-4 md:h-5 md:w-5 grid place-items-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative hover:text-black">
              <HiOutlineShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 text-[10px] bg-red-600 text-white rounded-full h-4 w-4 md:h-5 md:w-5 grid place-items-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth Block Removed for WhatsApp Only Flow */}
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white animate-in fade-in duration-300">
          <div className="mx-auto w-full max-w-4xl px-6 pt-12">
            <div className="flex justify-end mb-12">
              <button 
                onClick={() => setSearchOpen(false)}
                className="group flex items-center gap-2 text-gray-400 hover:text-black transition-colors"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest">Close Search</span>
                <HiOutlineX size={24} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>
            
            <form onSubmit={handleSearch} className="relative">
              <input
                autoFocus
                placeholder="Search our collection..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-b-2 border-gray-100 pb-8 text-3xl md:text-5xl font-display tracking-tight text-gray-900 focus:outline-none focus:border-black transition-all placeholder:text-gray-100 placeholder:italic"
              />
              <button 
                type="submit"
                className="absolute right-0 bottom-8 text-gray-300 hover:text-black transition-colors"
                aria-label="Submit search"
              >
                <HiOutlineSearch size={40} />
              </button>
            </form>

            <div className="mt-12 space-y-4">
              <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400">Popular Searches</p>
              <div className="flex flex-wrap gap-3">
                {['Sarees', 'Chiffon', 'New Arrivals', 'Unstitched'].map(term => (
                   <button 
                    key={term}
                    onClick={() => {
                        setSearchOpen(false);
                        const slug = term.toLowerCase().replace(/ /g, '-');
                        if (term === 'New Arrivals') {
                          router.push('/new-arrivals');
                        } else if (term === 'Sarees' || term === 'Unstitched') {
                          router.push(`/category/${slug}`);
                        } else {
                          setSearchQuery(term);
                          router.push(`/search?q=${encodeURIComponent(term)}`);
                          return;
                        }
                        setSearchQuery("");
                    }}
                    className="px-6 py-2 rounded-full border border-gray-100 text-xs font-semibold text-gray-600 hover:border-black hover:text-black transition-all"
                   >
                    {term}
                   </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Slide-out Menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
          role="presentation"
        >
          <div
            className="fixed inset-y-0 left-0 z-50 w-[80%] max-w-[300px] bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-left duration-300"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Mobile Menu Header */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <span className="text-[12px] font-display tracking-[0.2em] uppercase font-bold text-gray-900">
                Menu
              </span>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-full hover:bg-gray-200 text-gray-500 hover:text-black transition"
              >
                <HiOutlineX size={20} />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <div className="flex-1 overflow-y-auto py-4 px-4 space-y-3">
              {/* Mobile Search Bar */}
              <form onSubmit={handleSearch} className="relative mb-6">
                 <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                 <input 
                    placeholder="Search treasures..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black transition-all"
                 />
              </form>

              {navItems.map((item) => {
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-3 text-sm font-bold uppercase tracking-widest border-b border-gray-50 last:border-0 ${
                      isActive ? "text-black" : "text-gray-800"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Footer Actions (Auth/Logout) */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-3">
             {/* Auth Block Removed */}
            </div>

          </div>
        </div>
      )}
    </>
  );
}
