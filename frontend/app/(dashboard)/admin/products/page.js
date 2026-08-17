"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchProducts, deleteProduct, updateProduct } from "@/lib/api";
import { useToastStore } from "@/store/toastStore";
import { 
    Plus, 
    Search, 
    Edit3, 
    Trash2, 
    Star, 
    Flame, 
    Tag, 
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Loader2
} from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [togglingId, setTogglingId] = useState(null);
  const { showToast } = useToastStore();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await fetchProducts({ limit: 1000, status: 'all' }); 
      setProducts(data.data?.items || []);
    } catch (error) {
      console.error("Failed to load products", error);
      showToast("Failed to load inventory", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await deleteProduct(id);
      setProducts(products.filter(p => p._id !== id));
      showToast(`${name} removed from vault`, "success");
    } catch (error) {
      console.error("Failed to delete product", error);
      showToast("Could not archive product", "error");
    }
  };

  const handleToggle = async (id, field, value) => {
    setTogglingId(`${id}-${field}`);
    try {
      const res = await updateProduct(id, { [field]: !value });
      if (res.success) {
        setProducts(products.map(p => p._id === id ? { ...p, [field]: !value } : p));
      }
    } catch (error) {
      console.error(`Failed to toggle ${field}`, error);
    } finally {
      setTogglingId(null);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="p-20 flex flex-col items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-gray-100 border-t-black rounded-full animate-spin mb-4" />
        <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Inventory Syncing...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-rose-500 font-bold mb-3">Inventory Management</p>
          <h1 className="text-5xl font-display tracking-tight text-gray-900 mb-4">Collection Vault</h1>
          <p className="text-sm text-gray-400 italic max-w-lg">"Hand-curating the architectural silhouettes and textures of the Jannah Chic catalog."</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80 group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-hover:text-black transition-colors" size={16} />
                <input 
                    placeholder="Search Name or SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border border-gray-100 rounded-[1.5rem] pl-14 pr-6 py-4 text-[13px] focus:outline-none focus:ring-1 focus:ring-black transition-all font-medium shadow-sm hover:shadow-md"
                />
            </div>
            <Link href="/admin/products/new">
                <button className="bg-black text-white px-10 py-4 rounded-[1.5rem] text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gray-900 transition-all shadow-2xl shadow-black/20 flex items-center gap-2 active:scale-95">
                    <Plus size={16} /> New Product
                </button>
            </Link>
        </div>
      </div>

      {/* Product List */}
      <div className="bg-white rounded-[3.5rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-100/50 transition-all duration-700">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="text-[9px] uppercase tracking-[0.3em] font-bold text-gray-300 border-b border-gray-50/50">
                        <th className="py-8 px-10">Product Ensemble</th>
                        <th className="py-8 px-6">Availability</th>
                        <th className="py-8 px-6">Attributes</th>
                        <th className="py-8 px-6 text-right">Valuation</th>
                        <th className="py-8 px-10 text-right">Concierge</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50/50">
                    {filteredProducts.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="py-32 text-center">
                                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-6">
                                    <Tag size={24} className="text-gray-200" />
                                </div>
                                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.4em] italic">The vault is currently empty</p>
                            </td>
                        </tr>
                    ) : (
                        filteredProducts.map((p) => (
                            <tr key={p._id} className="group hover:bg-gray-50/30 transition-all duration-500">
                                <td className="py-8 px-10">
                                    <div className="flex items-center gap-8">
                                        <div className="w-16 min-w-[4rem] h-[85px] bg-gray-50 rounded-2xl overflow-hidden shrink-0 border border-gray-100 shadow-sm group-hover:shadow-md transition-all duration-500">
                                            <img src={p.images?.[0]?.url || p.images?.[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 font-display" />
                                        </div>
                                        <div>
                                            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-1.5">{p.name}</h3>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest border-r border-gray-100 pr-3">SKU: {p.sku || 'N/A'}</span>
                                                <span className="text-[9px] text-rose-400 font-bold uppercase tracking-widest italic">{p.category?.name || 'Boutique'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-8 px-6">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-1.5 h-1.5 rounded-full ${p.stock > 10 ? 'bg-green-500 pulse' : p.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                                            <span className="text-[11px] font-bold text-gray-900 uppercase tracking-tight">{p.stock} Units</span>
                                        </div>
                                        {p.stock < 5 && p.stock > 0 && (
                                            <span className="bg-red-50 text-[8px] font-bold text-red-500 uppercase tracking-[0.2em] px-2 py-0.5 rounded-full w-fit">
                                                Low Stock
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="py-8 px-6">
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleToggle(p._id, 'isFeatured', p.isFeatured)}
                                            className={`p-2.5 rounded-xl transition-all border ${p.isFeatured ? 'bg-amber-50 border-amber-200 text-amber-500 shadow-sm' : 'bg-white border-gray-100 text-gray-200 hover:text-amber-400 hover:border-amber-100'}`}
                                            title="Highlight as Featured"
                                        >
                                            {togglingId === `${p._id}-isFeatured` ? <Loader2 size={14} className="animate-spin" /> : <Star size={14} fill={p.isFeatured ? "currentColor" : "none"} />}
                                        </button>
                                        <button 
                                            onClick={() => handleToggle(p._id, 'isNewArrival', p.isNewArrival)}
                                            className={`p-2.5 rounded-xl transition-all border ${p.isNewArrival ? 'bg-rose-50 border-rose-200 text-rose-500 shadow-sm' : 'bg-white border-gray-100 text-gray-200 hover:text-rose-400 hover:border-rose-100'}`}
                                            title="Mark as New Arrival"
                                        >
                                            {togglingId === `${p._id}-isNewArrival` ? <Loader2 size={14} className="animate-spin" /> : <Flame size={14} fill={p.isNewArrival ? "currentColor" : "none"} />}
                                        </button>
                                        <button 
                                            onClick={() => handleToggle(p._id, 'isOnSale', p.isOnSale)}
                                            className={`p-2.5 rounded-xl transition-all border ${p.isOnSale ? 'bg-black border-black text-white shadow-lg' : 'bg-white border-gray-100 text-gray-200 hover:text-black hover:border-black'}`}
                                            title="Place on Sale"
                                        >
                                            {togglingId === `${p._id}-isOnSale` ? <Loader2 size={14} className="animate-spin" /> : <Tag size={14} fill={p.isOnSale ? "currentColor" : "none"} />}
                                        </button>
                                    </div>
                                </td>
                                <td className="py-8 px-6 text-right">
                                    <div className="flex flex-col items-end">
                                        <span className="text-xs font-bold text-gray-900 tracking-widest uppercase">PKR {p.price?.toLocaleString()}</span>
                                        {p.originalPrice && p.originalPrice > p.price && <span className="text-[9px] text-gray-400 line-through mt-1 italic tracking-widest">PKR {p.originalPrice.toLocaleString()}</span>}
                                    </div>
                                </td>
                                <td className="py-8 px-10 text-right">
                                    <div className="flex justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                                        <Link href={`/admin/products/${p._id}/edit`}>
                                            <button className="p-3 bg-white text-gray-400 hover:text-black hover:bg-gray-50 border border-gray-100 rounded-2xl transition-all shadow-sm" title="Edit Master">
                                                <Edit3 size={16} />
                                            </button>
                                        </Link>
                                        <button 
                                            onClick={() => handleDelete(p._id, p.name)}
                                            className="p-3 bg-white text-gray-300 hover:text-red-500 hover:bg-red-50 border border-gray-100 rounded-2xl transition-all shadow-sm"
                                            title="Archive Product"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>

      <div className="mt-16 flex flex-col items-center gap-6">
        <div className="h-px w-24 bg-gray-100" />
        <p className="text-[9px] text-gray-300 text-center leading-relaxed max-w-sm uppercase tracking-[0.2em] italic font-medium">
            "Every catalog item is a testament to Jannah Chic craft. Manage your inventory with intentionality."
        </p>
      </div>
    </div>
  );
}
