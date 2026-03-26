"use client";

import { useState, useEffect } from "react";
import { fetchCategories, createCategoryAPI, deleteCategoryAPI } from "@/lib/api";
import { useToastStore } from "@/store/toastStore";
import { Trash2, Plus, Loader2, Tag } from "lucide-react";

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const { showToast } = useToastStore();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await fetchCategories();
      if (res.success && res.data) {
        setCategories(res.data.items || []);
      }
    } catch (err) {
      console.error("Failed to load categories", err);
      showToast("Failed to sync collections", "error");
    } finally {
      setLoading(false);
    }
  };

  const slugify = (text) =>
    text.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setCreating(true);
    try {
      const res = await createCategoryAPI({
        name: name.trim(),
        slug: slugify(name),
      });

      if (res.success) {
        setName("");
        showToast(`"${name}" collection created`, "success");
        loadCategories();
      }
    } catch (err) {
      showToast(err.message || "Failed to create category", "error");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id, catName) => {
    if (!confirm(`Are you sure you want to delete "${catName}"?`)) return;

    setDeletingId(id);
    try {
      const res = await deleteCategoryAPI(id);
      if (res.success) {
        showToast(`"${catName}" removed`, "success");
        loadCategories();
      }
    } catch (err) {
      showToast(err.message || "Failed to delete category", "error");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-display tracking-tight text-gray-900">Categories</h1>
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-gray-400 mt-2">Manage your boutique collections</p>
        </div>
        
        <form onSubmit={handleSubmit} className="flex w-full md:w-auto gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New Category Name"
            className="flex-1 md:w-64 border border-gray-100 bg-white rounded-2xl px-6 py-3 text-sm font-medium focus:border-black focus:outline-none transition-all"
            disabled={creating}
          />
          <button
            type="submit"
            disabled={creating || !name.trim()}
            className="bg-black text-white px-8 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gray-900 transition-all flex items-center gap-2 disabled:opacity-50 shadow-xl shadow-black/5"
          >
            {creating ? <Loader2 className="animate-spin" size={14} /> : <Plus size={14} />}
            Add Collection
          </button>
        </form>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-24 flex flex-col items-center justify-center text-gray-300">
             <Loader2 className="animate-spin mb-6" size={40} />
             <p className="text-[10px] uppercase font-bold tracking-[0.3em]">Loading Collections</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-24 text-center">
            <Tag size={48} className="mx-auto text-gray-100 mb-6" />
            <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] font-display">No categories found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {categories.map((cat) => (
              <div key={cat._id} className="flex items-center justify-between p-8 hover:bg-gray-50/50 transition-colors group">
                <div className="flex items-center gap-6">
                   <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all duration-700 shadow-sm border border-gray-50">
                      <Tag size={20} />
                   </div>
                   <div>
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">{cat.name}</h3>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">{cat.slug}</p>
                   </div>
                </div>
                
                <button
                  onClick={() => handleDelete(cat._id, cat.name)}
                  disabled={deletingId === cat._id}
                  className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-30"
                  title="Delete Category"
                >
                  {deletingId === cat._id ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Trash2 size={18} />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="mt-12 text-[9px] text-gray-400 text-center leading-relaxed italic max-w-lg mx-auto uppercase tracking-tighter opacity-70">
        Deleting a category will hide it from the storefront and customer navigation. Existing products in this category will remain, but the category path will no longer be available.
      </p>
    </div>

  );
}