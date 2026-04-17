'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchAdminPages } from '@/lib/api';
import { FileText, ChevronRight, Loader2 } from 'lucide-react';

const PAGE_LABELS = {
  about: 'Our Story',
  terms: 'Terms & Conditions',
  privacy: 'Privacy Charter',
  shipping: 'Shipping Information',
  returns: 'Refund Policy',
  faqs: 'Frequently Asked Questions',
  contact: 'Atelier Support',
  careers: 'Join the Atelier',
};

export default function AdminPagesPage() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminPages()
      .then((res) => setPages(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="animate-spin text-gray-400" size={28} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-semibold text-gray-900">Storefront Pages</h1>
        <p className="text-sm text-gray-400 mt-1">Edit the content shown on your public-facing footer pages.</p>
      </div>

      <div className="space-y-3">
        {pages
          .filter((page) => page.slug !== 'faqs')
          .map((page) => (
            <Link
              key={page.slug}
              href={`/admin/pages/${page.slug}/edit`}
              className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl px-6 py-5 hover:border-gray-300 hover:shadow-sm transition-all group"
            >
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-black/5 transition-colors">
                <FileText size={16} className="text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{PAGE_LABELS[page.slug] || page.title}</p>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-0.5">/{page.slug}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-gray-400">
                {new Date(page.updatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
              <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-600 transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
