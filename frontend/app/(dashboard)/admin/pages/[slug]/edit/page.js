'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchPage, updatePage } from '@/lib/api';
import { Loader2, Save, ArrowLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function EditPagePage() {
  const { slug } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({ title: '', content: '', metaDescription: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchPage(slug)
      .then((res) => {
        if (res.data) {
          setForm({
            title: res.data.title || '',
            content: res.data.content || '',
            metaDescription: res.data.metaDescription || '',
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updatePage(slug, form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert('Failed to save: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="animate-spin text-gray-400" size={28} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/pages"
            className="flex items-center gap-2 text-[11px] uppercase tracking-widest font-bold text-gray-400 hover:text-black transition-colors"
          >
            <ArrowLeft size={14} />
            All Pages
          </Link>
          <span className="text-gray-200">/</span>
          <h1 className="text-2xl font-display font-semibold text-gray-900">{form.title}</h1>
        </div>
        <a
          href={`/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-black transition-colors"
        >
          <ExternalLink size={12} />
          Preview
        </a>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Page Title */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5 shadow-sm">
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">
              Page Title
            </label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-black outline-none transition text-sm font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">
              Meta Description <span className="text-gray-300 normal-case">(used by Google)</span>
            </label>
            <input
              value={form.metaDescription}
              onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
              className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-black outline-none transition text-sm"
              placeholder="Short description for search engines..."
            />
          </div>
        </div>

        {/* Content Editor */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400">
              Page Content
            </label>
            <span className="text-[9px] text-gray-300 uppercase tracking-widest">Plain text — line breaks are preserved</span>
          </div>
          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows={24}
            className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-black outline-none transition text-sm font-mono leading-relaxed resize-y"
            placeholder="Write your page content here..."
          />
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-gray-400">
            Changes are reflected on the live storefront immediately after saving.
          </p>
          <button
            type="submit"
            disabled={saving}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${saved
                ? 'bg-green-600 text-white'
                : 'bg-black text-white hover:bg-gray-800'
              }`}
          >
            {saving ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Save size={14} />
            )}
            {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
