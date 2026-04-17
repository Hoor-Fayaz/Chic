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
    <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
        <div className="max-w-md">
          <p className="text-[10px] uppercase tracking-[0.4em] text-rose-500 font-bold mb-3">Collection Taxonomy</p>
          <h1 className="text-5xl font-display tracking-tight text-gray-900 mb-4">Master Categories</h1>
          <p className="text-sm text-gray-400 italic">"Architecting the departmental hierarchy of the Jannah Chic experience."</p>
        </div>
        
        <form onSubmit={handleSubmit} className="flex w-full md:w-auto gap-3 group">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Collection Name..."
            className="flex-1 md:w-72 border border-gray-100 bg-white rounded-[1.5rem] px-6 py-4 text-[13px] font-medium focus:border-black focus:outline-none transition-all shadow-sm group-hover:shadow-md"
            disabled={creating}
          />
          <button
            type="submit"
            disabled={creating || !name.trim()}
            className="bg-black text-white px-10 py-4 rounded-[1.5rem] text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gray-900 transition-all flex items-center gap-2 disabled:opacity-50 shadow-2xl shadow-black/20 active:scale-95"
          >
            {creating ? <Loader2 className="animate-spin" size={14} /> : <Plus size={14} />}
            Add Collection
          </button>
        </form>
      </div>

      <div className="bg-white rounded-[3.5rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-100/50 transition-all duration-700">
        {loading ? (
          <div className="p-32 flex flex-col items-center justify-center text-gray-300">
             <div className="w-12 h-12 border-4 border-gray-50 border-t-black rounded-full animate-spin mb-8" />
             <p className="text-[10px] uppercase font-bold tracking-[0.4em] animate-pulse">Syncing Collections...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-32 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-6">
                <Tag size={24} className="text-gray-200" />
            </div>
            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.4em] italic font-display">No departmental structures defined</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50/50">
            {categories.map((cat) => (
              <div key={cat._id} className="flex items-center justify-between px-10 py-8 hover:bg-gray-50/30 transition-all duration-500 group">
                <div className="flex items-center gap-8">
                   <div className="w-16 h-16 bg-gray-50 rounded-[1.5rem] flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white group-hover:rotate-12 transition-all duration-700 shadow-sm border border-gray-100">
                      <Tag size={22} className="group-hover:scale-110 transition-transform" />
                   </div>
                   <div>
                      <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-1.5">{cat.name}</h3>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.3em] font-display">{cat.slug}</p>
                   </div>
                </div>
                
                <button
                  onClick={() => handleDelete(cat._id, cat.name)}
                  disabled={deletingId === cat._id}
                  className="p-4 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all disabled:opacity-30 border border-transparent hover:border-red-100 group-hover:opacity-100 opacity-0"
                  title="Archive Collection"
                >
                  {deletingId === cat._id ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Trash2 size={20} />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-16 flex flex-col items-center gap-6">
        <div className="h-px w-24 bg-gray-100" />
        <p className="text-[9px] text-gray-300 text-center leading-relaxed max-w-sm uppercase tracking-[0.2em] italic font-medium">
            "Departmental order ensures a seamless transition for the modern client."
        </p>
      </div>
    </div>

  );
}
