"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const SORT_OPTIONS = [
  { label: "Featured", value: "" },
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Top Rated", value: "top_rated" },
];

export default function SortDropdown({ total = 0, cols = 4, setCols, showFilters, setShowFilters, categories = [] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const currentSort = searchParams.get("sort") || "";
  const currentLabel = SORT_OPTIONS.find((o) => o.value === currentSort)?.label || "Featured";

  const currentCategoryId = searchParams.get("category");
  const currentCategory = categories?.find(c => c._id === currentCategoryId);
  const isUnstitched = currentCategory?.name?.toLowerCase().includes("unstitched");
  const currentSearch = searchParams.get("search")?.toLowerCase() || "";

  const handleUnstitchedFilter = (value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSelect = (value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }
    router.push(`${pathname}?${params.toString()}`);
    setOpen(false);
  };

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-gray-100 gap-4">
      
      {/* Left side: Filter Toggle + Count */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full sm:w-auto">
        <button 
          onClick={() => setShowFilters && setShowFilters(!showFilters)}
          className="flex w-fit items-center gap-2 border border-gray-200 rounded-full px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all shrink-0"
        >
          Filter by
          <ChevronDown size={12} className={`transition-transform duration-300 ${showFilters ? "rotate-180" : ""}`} />
        </button>

        {/* Unstitched Specialized Tabs */}
        {isUnstitched && (
           <div className="flex items-center bg-gray-100 rounded-full p-1 overflow-x-auto no-scrollbar w-full sm:w-fit">
              <button 
                 onClick={() => handleUnstitchedFilter('')} 
                 className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${currentSearch === '' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-black'}`}
              >
                 All Unstitched
              </button>
              <button 
                 onClick={() => handleUnstitchedFilter('2 piece')} 
                 className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${currentSearch === '2 piece' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-black'}`}
              >
                 2 Piece
              </button>
              <button 
                 onClick={() => handleUnstitchedFilter('3 piece')} 
                 className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${currentSearch === '3 piece' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-black'}`}
              >
                 3 Piece
              </button>
           </div>
        )}
      </div>

      {/* Right Side: Grid Switcher + Sort */}
      <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
        
        {/* Layout Switcher (Hidden on strictly mobile, or scaled down) */}
        <div className="hidden sm:flex items-center gap-2.5 sm:border-r sm:border-gray-200 sm:pr-4">
          <button onClick={() => setCols && setCols(1)} className={`transition-colors ${cols === 1 ? 'text-black' : 'text-gray-400 hover:text-gray-900'}`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/></svg>
          </button>
          <button onClick={() => setCols && setCols(2)} className={`transition-colors ${cols === 2 ? 'text-black' : 'text-gray-400 hover:text-gray-900'}`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="18" rx="1"/><rect x="14" y="3" width="7" height="18" rx="1"/></svg>
          </button>
          <button onClick={() => setCols && setCols(3)} className={`transition-colors ${cols === 3 ? 'text-black' : 'text-gray-400 hover:text-gray-900'}`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="5" height="18" rx="1"/><rect x="9.5" y="3" width="5" height="18" rx="1"/><rect x="17" y="3" width="5" height="18" rx="1"/></svg>
          </button>
          <button onClick={() => setCols && setCols(4)} className={`transition-colors ${cols === 4 ? 'text-black' : 'text-gray-400 hover:text-gray-900'}`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1.5" y="3" width="4" height="18" rx="1"/><rect x="7" y="3" width="4" height="18" rx="1"/><rect x="13" y="3" width="4" height="18" rx="1"/><rect x="18.5" y="3" width="4" height="18" rx="1"/></svg>
          </button>
        </div>

        {/* Sort Dropdown */}
        <div className="relative w-full sm:w-auto" ref={ref}>
          <button
            onClick={() => setOpen(!open)}
            className="w-full sm:w-auto flex items-center justify-between gap-2 border border-gray-200 rounded-full px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all"
          >
            Sort: {currentLabel}
            <ChevronDown
              size={12}
              className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            />
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-2 w-full sm:w-52 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-black/10 overflow-hidden z-30 animate-in fade-in slide-in-from-top-2 duration-200">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full text-left px-5 py-3.5 text-[12px] font-medium transition-colors hover:bg-gray-50 ${
                    currentSort === opt.value
                      ? "text-black font-bold bg-gray-50"
                      : "text-gray-600"
                  }`}
                >
                  {opt.label}
                  {currentSort === opt.value && (
                    <span className="ml-2 text-black">✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
