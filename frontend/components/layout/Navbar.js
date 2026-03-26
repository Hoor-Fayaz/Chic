"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HiOutlineUser, HiOutlineShoppingCart, HiOutlineHeart } from "react-icons/hi";
import { useAuthStore } from "@/store/authStore";
import { logoutUser } from "@/lib/api";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { useEffect } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/new-arrivals", label: "New Arrivals" },
  { href: "/category/sarees", label: "Sarees" },
  { href: "/category/frocks", label: "Frocks" },
  { 
    href: "/category/unstitched", 
    label: "Unstitched",
    children: [
      { href: "/category/unstitched-2pc", label: "2 Piece Suits" },
      { href: "/category/unstitched-3pc", label: "3 Piece Suits" },
    ]
  },
  { href: "/sale", label: "Sale" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const wishlist = useWishlistStore((state) => state.wishlist);
  const loadWishlist = useWishlistStore((state) => state.loadWishlist);

  const cart = useCartStore((state) => state.cart);
  const loadCart = useCartStore((state) => state.loadCart);

  const cartCount = cart.reduce((total, item) => total + (item.quantity || 0), 0);

  // ✅ Load initial data after login
  useEffect(() => {
    if (user) {
      loadWishlist();
      loadCart();
    }
  }, [user]);

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
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-0">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <img 
            src="/logoo.png" 
            alt="Logo" 
            className="h-16 w-auto object-contain" 
          />
          <span className="text-xl font-display tracking-[0.35em] uppercase text-gray-900 leading-none">
            Jannah Chic
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden items-center gap-8 text-sm font-medium text-gray-700 md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            
            if (item.children) {
              return (
                <div key={item.label} className="group relative py-2">
                  <Link
                    href={item.href}
                    className={`flex items-center gap-1 transition-colors hover:text-black ${
                      isActive ? "text-black" : "text-gray-600"
                    }`}
                  >
                    {item.label}
                    <svg className="h-3 w-3 fill-current transition-transform group-hover:rotate-180" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </Link>
                  
                  {/* Dropdown Menu */}
                  <div className="invisible absolute top-full left-0 mt-1 min-w-[200px] origin-top-left scale-95 opacity-0 transition-all group-hover:visible group-hover:scale-100 group-hover:opacity-100">
                    <div className="rounded-xl border border-gray-100 bg-white p-2 shadow-xl">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block rounded-lg px-4 py-2.5 text-xs text-gray-600 transition-colors hover:bg-gray-50 hover:text-black"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

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
        <div className="relative flex items-center gap-5 text-gray-700">
          {/* Wishlist */}
          <Link href="/wishlist" className="relative hover:text-black">
            <HiOutlineHeart className="h-6 w-6" />
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 text-xs bg-rose-600 text-white rounded-full h-5 w-5 grid place-items-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link href="/cart" className="relative hover:text-black">
            <HiOutlineShoppingCart className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 text-[10px] bg-red-600 text-white rounded-full h-5 w-5 grid place-items-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              {user.role === "admin" && (
                <Link
                  href="/admin/dashboard"
                  className="hidden text-gray-700 hover:text-black md:inline"
                >
                  Admin
                </Link>
              )}

              <Link
                href="/profile"
                className="hidden md:inline hover:text-black"
              >
                <HiOutlineUser className="h-6 w-6" />
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-gray-300 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-gray-700 hover:border-gray-900 hover:text-black"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="hidden rounded-full border border-gray-900 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-gray-900 hover:bg-gray-900 hover:text-white md:inline"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}