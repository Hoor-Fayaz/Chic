'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function ProductFilters({ categories = [] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || ''
  );
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || '');
    setSort(searchParams.get('sort') || 'newest');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  const updateQuery = (next) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <aside className="space-y-6 rounded-2xl bg-white p-5 shadow-sm">
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Category
        </h3>
        <div className="space-y-2 text-sm">
          <button
            type="button"
            onClick={() => updateQuery({ category: '' })}
            className={`block w-full text-left ${
              !selectedCategory ? 'font-semibold text-gray-900' : 'text-gray-600'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              type="button"
              onClick={() => updateQuery({ category: cat._id })}
              className={`block w-full text-left ${
                selectedCategory === cat._id
                  ? 'font-semibold text-gray-900'
                  : 'text-gray-600'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Sort by
        </h3>
        <select
          value={sort}
          onChange={(e) => updateQuery({ sort: e.target.value })}
          className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm focus:border-gray-900 focus:outline-none"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>
    </aside>
  );
}

