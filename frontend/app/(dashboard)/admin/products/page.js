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
      const data = await fetchProducts({ limit: 200, status: 'all' }); 
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
    <div className="max-w-7xl mx-auto py-10 px-4">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-display tracking-tight text-gray-900">Collection Vault</h1>
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-gray-400 mt-2">Curate and manage your boutique items</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                    placeholder="Search Name or SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border border-gray-100 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black transition-all font-medium"
                />
            </div>
            <Link href="/admin/products/new">
                <button className="bg-black text-white px-8 py-3.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-900 transition-all shadow-xl shadow-black/10 flex items-center gap-2">
                    <Plus size={16} /> New Product
                </button>
            </Link>
        </div>
      </div>

      {/* Product List */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 border-b border-gray-50">
                        <th className="py-6 px-8">Product Details</th>
                        <th className="py-6 px-4">Stock Status</th>
                        <th className="py-6 px-4">Market Flags</th>
                        <th className="py-6 px-4 text-right">Pricing</th>
                        <th className="py-6 px-8 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {filteredProducts.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="py-24 text-center">
                                <Tag size={48} className="mx-auto text-gray-100 mb-4" />
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest font-display">No treasures found in vault</p>
                            </td>
                        </tr>
                    ) : (
                        filteredProducts.map((p) => (
                            <tr key={p._id} className="group hover:bg-gray-50/50 transition-all duration-700">
                                <td className="py-8 px-8">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 aspect-[2/3] bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                                            <img src={p.images?.[0]?.url || p.images?.[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">{p.name}</h3>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">SKU: {p.sku || 'N/A'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-8 px-4">
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${p.stock > 10 ? 'bg-green-500' : p.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                                            <span className="text-sm font-bold text-gray-900">{p.stock} In Stock</span>
                                        </div>
                                        {p.stock < 5 && p.stock > 0 && (
                                            <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest flex items-center gap-1">
                                                <AlertTriangle size={10} /> Low Stock Alert
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="py-8 px-4">
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleToggle(p._id, 'isFeatured', p.isFeatured)}
                                            className={`p-2 rounded-xl transition-all border ${p.isFeatured ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-white border-gray-100 text-gray-300 hover:border-amber-200 hover:text-amber-400'}`}
                                            title="Featured Product"
                                        >
                                            {togglingId === `${p._id}-isFeatured` ? <Loader2 size={14} className="animate-spin" /> : <Star size={14} fill={p.isFeatured ? "currentColor" : "none"} />}
                                        </button>
                                        <button 
                                            onClick={() => handleToggle(p._id, 'isNewArrival', p.isNewArrival)}
                                            className={`p-2 rounded-xl transition-all border ${p.isNewArrival ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-gray-100 text-gray-300 hover:border-blue-200 hover:text-blue-400'}`}
                                            title="New Arrival"
                                        >
                                            {togglingId === `${p._id}-isNewArrival` ? <Loader2 size={14} className="animate-spin" /> : <Flame size={14} fill={p.isNewArrival ? "currentColor" : "none"} />}
                                        </button>
                                        <button 
                                            onClick={() => handleToggle(p._id, 'isOnSale', p.isOnSale)}
                                            className={`p-2 rounded-xl transition-all border ${p.isOnSale ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-white border-gray-100 text-gray-300 hover:border-rose-200 hover:text-rose-400'}`}
                                            title="On Sale"
                                        >
                                            {togglingId === `${p._id}-isOnSale` ? <Loader2 size={14} className="animate-spin" /> : <Tag size={14} fill={p.isOnSale ? "currentColor" : "none"} />}
                                        </button>
                                    </div>
                                </td>
                                <td className="py-8 px-4 text-right">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-900 tracking-tight">PKR {p.price?.toLocaleString()}</span>
                                        {p.originalPrice && p.originalPrice > p.price && <span className="text-[10px] text-gray-400 line-through">PKR {p.originalPrice.toLocaleString()}</span>}
                                    </div>
                                </td>
                                <td className="py-8 px-8 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link href={`/admin/products/${p._id}/edit`}>
                                            <button className="p-3 text-gray-300 hover:text-black hover:bg-gray-100 rounded-xl transition-all" title="Edit Master">
                                                <Edit3 size={18} />
                                            </button>
                                        </Link>
                                        <button 
                                            onClick={() => handleDelete(p._id, p.name)}
                                            className="p-3 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                            title="Archive Product"
                                        >
                                            <Trash2 size={18} />
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

      <p className="mt-12 text-[9px] text-gray-400 text-center leading-relaxed max-w-lg mx-auto uppercase tracking-tighter opacity-60">
        Master inventory console. Rapid toggles update storefront storefront immediately. 
        Archiving items will hide them from customers but preserve transaction history.
      </p>
    </div>
  );
}