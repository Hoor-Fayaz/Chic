"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchAdminReviews, deleteReviewAPI } from "@/lib/api";
import { useToastStore } from "@/store/toastStore";
import { Search, Trash2, MessageSquare, Star } from "lucide-react";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { showToast } = useToastStore();

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const data = await fetchAdminReviews({ limit: 100 }); 
      setReviews(data.data?.items || []);
    } catch (error) {
      console.error("Failed to load reviews", error);
      showToast("Failed to load reviews", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(`Are you sure you want to permanently delete this review?`)) return;
    try {
      await deleteReviewAPI(id);
      setReviews(reviews.filter(r => r._id !== id));
      showToast('Review removed and product rating updated', "success");
    } catch (error) {
      console.error("Failed to delete review", error);
      showToast("Could not delete review", "error");
    }
  };

  const filteredReviews = reviews.filter(r => 
    r.comment?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.guestName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.guestEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="p-20 flex flex-col items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-gray-100 border-t-black rounded-full animate-spin mb-4" />
        <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Loading Client Feedback...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-cyan-500 font-bold mb-3">Community Standards</p>
          <h1 className="text-5xl font-display tracking-tight text-gray-900 mb-4">Reviews Management</h1>
          <p className="text-sm text-gray-400 italic max-w-lg">"Ensure the highest prestige of brand experience by moderating client feedback."</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80 group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-hover:text-black transition-colors" size={16} />
                <input 
                    placeholder="Search reviews, users, or products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border border-gray-100 rounded-[1.5rem] pl-14 pr-6 py-4 text-[13px] focus:outline-none focus:ring-1 focus:ring-black transition-all font-medium shadow-sm hover:shadow-md"
                />
            </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-[3.5rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-100/50 transition-all duration-700">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="text-[9px] uppercase tracking-[0.3em] font-bold text-gray-300 border-b border-gray-50/50">
                        <th className="py-8 px-10">Client</th>
                        <th className="py-8 px-6">Product</th>
                        <th className="py-8 px-6">Rating</th>
                        <th className="py-8 px-6">Comment</th>
                        <th className="py-8 px-10 text-right">Moderation</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50/50">
                    {filteredReviews.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="py-32 text-center">
                                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-6">
                                    <MessageSquare size={24} className="text-gray-200" />
                                </div>
                                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.4em] italic">No reviews found</p>
                            </td>
                        </tr>
                    ) : (
                        filteredReviews.map((r) => (
                            <tr key={r._id} className="group hover:bg-gray-50/30 transition-all duration-500">
                                <td className="py-8 px-10">
                                  <div>
                                      <h3 className="text-xs font-bold text-gray-900 tracking-wider mb-1.5">
                                          {r.user ? r.user.name : (r.guestName || 'Anonymous')}
                                          {!r.user && <span className="ml-2 text-[8px] text-cyan-600 font-bold px-1.5 py-0.5 bg-cyan-50 rounded">Guest</span>}
                                      </h3>
                                      <span className="text-[9px] text-gray-400 font-bold tracking-widest">{new Date(r.createdAt).toLocaleDateString()}</span>
                                  </div>
                                </td>
                                
                                <td className="py-8 px-6">
                                  <div className="flex items-center gap-4 max-w-[200px]">
                                    {r.product?.images?.[0] && (
                                      <img src={r.product.images[0].url || r.product.images[0]} className="w-10 h-10 rounded-lg object-cover border border-gray-100" alt="product" />
                                    )}
                                    <span className="text-[11px] font-bold text-gray-900 tracking-tight leading-tight line-clamp-2">{r.product?.name || 'Unknown Product'}</span>
                                  </div>
                                </td>

                                <td className="py-8 px-6">
                                    <div className="flex items-center gap-1">
                                      <span className="text-sm font-bold text-gray-900 mr-2">{r.rating}.0</span>
                                      {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={12} className={i < r.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                                      ))}
                                    </div>
                                </td>

                                <td className="py-8 px-6">
                                    <p className="text-xs text-gray-600 max-w-sm line-clamp-3 leading-relaxed">
                                      {r.title && <span className="font-bold text-black block mb-1">{r.title}</span>}
                                      {r.comment}
                                    </p>
                                </td>

                                <td className="py-8 px-10 text-right">
                                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-4 transition-all duration-500">
                                        <button 
                                            onClick={() => handleDelete(r._id)}
                                            className="p-3 bg-white text-gray-300 hover:text-red-500 hover:bg-red-50 border border-gray-100 rounded-2xl transition-all shadow-sm flex items-center gap-2"
                                            title="Delete Review"
                                        >
                                            <Trash2 size={16} /> 
                                            <span className="text-[9px] uppercase font-bold tracking-wider">Remove</span>
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
    </div>
  );
}


