'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';

export default function ProductFilters({ categories = [], availableFabrics = [] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [selectedSizes, setSelectedSizes] = useState(searchParams.get('sizes')?.split(',') || []);
  const [selectedFabrics, setSelectedFabrics] = useState(searchParams.get('fabrics')?.split(',') || []);

  const [expanded, setExpanded] = useState({
    categories: true,
    price: true,
    size: true,
    fabric: false
  });

  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || '');
    setSort(searchParams.get('sort') || 'newest');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setSelectedSizes(searchParams.get('sizes')?.split(',').filter(Boolean) || []);
    setSelectedFabrics(searchParams.get('fabrics')?.split(',').filter(Boolean) || []);
  }, [searchParams.toString()]);

  const updateQuery = (next) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
        params.delete(key);
      } else {
        const valStr = Array.isArray(value) ? value.join(',') : value;
        params.set(key, valStr);
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  const toggleSize = (size) => {
    const next = selectedSizes.includes(size)
      ? selectedSizes.filter(s => s !== size)
      : [...selectedSizes, size];
    updateQuery({ sizes: next });
  };

  const toggleFabric = (fabric) => {
    const next = selectedFabrics.includes(fabric)
      ? selectedFabrics.filter(f => f !== fabric)
      : [...selectedFabrics, fabric];
    updateQuery({ fabrics: next });
  };

  const clearAll = () => {
    router.push(pathname);
  };

  const toggleSection = (section) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
      
      {/* Search Result Feedback / Clear */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900">Filters</h2>
          <button 
            onClick={clearAll}
            className="text-[9px] uppercase tracking-wider font-bold text-gray-400 hover:text-black flex items-center gap-1 transition-colors"
          >
            <RotateCcw size={10} /> Clear All
          </button>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50">
        <button 
            onClick={() => toggleSection('categories')}
            className="flex w-full items-center justify-between mb-4"
        >
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-900">Collection</h3>
            {expanded.categories ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {expanded.categories && (
            <div className="space-y-2 text-sm">
                <button
                    onClick={() => updateQuery({ category: '' })}
                    className={`block w-full text-left py-1 transition-colors ${!selectedCategory ? 'font-bold text-black border-l-2 border-black pl-3' : 'text-gray-500 hover:text-black pl-3'}`}
                >
                    All Items
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat._id}
                        onClick={() => updateQuery({ category: cat._id })}
                        className={`block w-full text-left py-1 transition-colors ${selectedCategory === cat._id ? 'font-bold text-black border-l-2 border-black pl-3' : 'text-gray-500 hover:text-black pl-3'}`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>
        )}
      </div>

      {/* Sort */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-900 mb-4">Sort By</h3>
        <select
          value={sort}
          onChange={(e) => updateQuery({ sort: e.target.value })}
          className="w-full bg-gray-50 rounded-xl border-none px-4 py-3 text-xs font-semibold focus:ring-1 focus:ring-black outline-none transition-all cursor-pointer shadow-inner"
        >
          <option value="newest">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* Price Range */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50">
        <button 
            onClick={() => toggleSection('price')}
            className="flex w-full items-center justify-between mb-4"
        >
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-900">Price Palette</h3>
            {expanded.price ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {expanded.price && (
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-gray-400">Min</label>
                        <input 
                            type="number" 
                            placeholder="0"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            onBlur={() => updateQuery({ minPrice })}
                            className="w-full bg-gray-50 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-black outline-none border-none shadow-inner"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-gray-400">Max</label>
                        <input 
                            type="number" 
                            placeholder="50k+"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            onBlur={() => updateQuery({ maxPrice })}
                            className="w-full bg-gray-50 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-black outline-none border-none shadow-inner"
                        />
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* Sizes */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50">
        <button 
            onClick={() => toggleSection('size')}
            className="flex w-full items-center justify-between mb-4"
        >
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-900">Size</h3>
            {expanded.size ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {expanded.size && (
            <div className="flex flex-wrap gap-2">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                    <button
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={`w-10 h-10 rounded-xl text-[10px] font-bold transition-all border ${
                            selectedSizes.includes(size)
                            ? 'bg-black text-white border-black shadow-lg shadow-black/10'
                            : 'bg-white text-gray-500 border-gray-100 hover:border-black'
                        }`}
                    >
                        {size}
                    </button>
                ))}
            </div>
        )}
      </div>

      {/* Fabric — dynamically sourced from your live product catalog */}
      {availableFabrics.length > 0 && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50">
          <button
            onClick={() => toggleSection('fabric')}
            className="flex w-full items-center justify-between mb-4"
          >
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-900">Fabric</h3>
            {expanded.fabric ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {expanded.fabric && (
            <div className="space-y-2">
              {availableFabrics.sort().map(fabric => (
                <button
                  key={fabric}
                  onClick={() => toggleFabric(fabric)}
                  className="flex items-center gap-3 w-full text-left py-1 transition-colors group"
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                    selectedFabrics.includes(fabric)
                      ? 'bg-black border-black'
                      : 'border-gray-200 group-hover:border-black'
                  }`}>
                    {selectedFabrics.includes(fabric) && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <span className={`text-xs capitalize ${selectedFabrics.includes(fabric) ? 'font-bold text-black' : 'text-gray-500 hover:text-black'}`}>
                    {fabric}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

    </aside>
  );
}

