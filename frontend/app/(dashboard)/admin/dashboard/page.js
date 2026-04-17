"use client";

import { useEffect, useState } from "react";
import { fetchAdminStats } from "@/lib/api";
import StatCard from "@/components/admin/StatCard";
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Package, 
  ArrowRight, 
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Zap
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats()
      .then((res) => {
        if (res.success) setStats(res.data);
      })
      .catch((err) => console.error("Stats fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-10 flex flex-col items-center justify-center min-h-[600px]">
        <div className="w-16 h-16 border-4 border-gray-50 border-t-black rounded-full animate-spin mb-8" />
        <p className="text-[10px] uppercase font-bold tracking-[0.4em] text-gray-300 animate-pulse">Initializing Atelier Intelligence...</p>
      </div>
    );
  }

  const recentInquiries = stats?.recentInquiries || [];

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
        <div className="max-w-2xl">
          <p className="text-[10px] uppercase tracking-[0.4em] text-rose-500 font-bold mb-3">Atelier Intelligence</p>
          <h1 className="text-5xl font-display tracking-tight text-gray-900 mb-4">Command Center</h1>
          <p className="text-sm text-gray-400 italic max-w-lg">
            "Overseeing the confluence of architectural design and global commerce in real-time."
          </p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl px-8 py-5 flex items-center gap-4 shadow-sm group hover:shadow-md transition-shadow">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <div className="flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-300 mb-1">Live Session</span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-gray-900">
                    {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <StatCard 
          title="WhatsApp Leads" 
          value={stats?.whatsappLeads || 0} 
          icon={MessageCircle} 
          trend={18.4} 
        />
        <StatCard 
          title="Potential Revenue" 
          value={`PKR ${(stats?.potentialRevenue || 0).toLocaleString()}`} 
          icon={TrendingUp} 
          trend={24.1} 
        />
        <StatCard 
          title="Catalog Items" 
          value={stats?.totalProducts || 0} 
          icon={Package} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* WhatsApp Activity Feed */}
        <div className="lg:col-span-2 bg-white rounded-[3.5rem] p-12 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-100/50 transition-all duration-700">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-900 mb-1">Recent Inquiries</h3>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Live WhatsApp Flow</p>
                </div>
                <div className="flex items-center gap-2 bg-rose-50 text-rose-600 px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest">
                    <Zap size={12} />
                    High Activity
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-[9px] uppercase tracking-[0.3em] font-bold text-gray-300 border-b border-gray-50">
                            <th className="pb-6 px-4">Item</th>
                            <th className="pb-6 px-4">Details</th>
                            <th className="pb-6 px-4">Timestamp</th>
                            <th className="pb-6 px-4 text-right">Value</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50/50">
                        {recentInquiries.length > 0 ? recentInquiries.map((inquiry) => (
                            <tr key={inquiry._id} className="group hover:bg-gray-50/30 transition-all duration-500">
                                <td className="py-6 px-4">
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-12 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 group-hover:scale-105 transition-transform duration-500">
                                            {inquiry.product?.images?.[0]?.url ? (
                                                <img src={inquiry.product.images[0].url} alt="" className="object-cover w-full h-full" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-200">IMG</div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-900 uppercase tracking-tight">{inquiry.product?.name || inquiry.name}</p>
                                            <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-1">ID: {inquiry._id.slice(-6).toUpperCase()}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-6 px-4">
                                    <div className="flex flex-wrap gap-2">
                                        {inquiry.size && <span className="bg-gray-100 text-[8px] font-bold px-2.5 py-1 rounded-md uppercase">Size: {inquiry.size}</span>}
                                        {inquiry.color && <span className="bg-gray-100 text-[8px] font-bold px-2.5 py-1 rounded-md uppercase">Color: {inquiry.color}</span>}
                                    </div>
                                </td>
                                <td className="py-6 px-4">
                                    <span className="text-[10px] text-gray-400 font-medium">{new Date(inquiry.createdAt).toLocaleString(undefined, { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}</span>
                                </td>
                                <td className="py-6 px-4 text-right">
                                    <span className="text-xs font-bold text-gray-900">PKR {inquiry.potentialRevenue?.toLocaleString()}</span>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4" className="py-12 text-center text-gray-300 text-[10px] uppercase tracking-widest italic font-medium">Tracking the first WhatsApp leads...</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Quick Insights & System Health */}
        <div className="lg:col-span-1 space-y-10">
            <div className="bg-black text-white rounded-[3rem] p-12 shadow-2xl shadow-black/30 overflow-hidden relative group">
                <div className="relative z-10">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500 mb-10">Inventory Saturation</h3>
                    <div className="flex items-end justify-between mb-6">
                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">Active Catalog</p>
                            <p className="text-5xl font-display">{stats?.totalProducts}</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                            <Package size={20} className="text-white" />
                        </div>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-10 shadow-inner">
                        <div className="bg-rose-500 h-full transition-all duration-1000 ease-out" style={{ width: '74%' }}></div>
                    </div>
                   <Link href="/admin/products" className="block w-full bg-white text-black py-5 rounded-[1.5rem] text-[10px] font-bold uppercase tracking-[0.3em] text-center hover:bg-gray-100 transition-all hover:scale-[1.02] active:scale-95 shadow-xl">
                        Optimize Catalog
                    </Link>
                </div>
                <div className="absolute -bottom-20 -right-20 opacity-5 group-hover:opacity-10 group-hover:rotate-12 transition-all duration-1000 grayscale group-hover:scale-110">
                    <Zap size={280} />
                </div>
            </div>

            <div className="bg-white rounded-[3rem] p-12 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-700">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-300 mb-10 text-center">Atelier Status</h3>
                <div className="space-y-10">
                    <div className="flex gap-6 items-center">
                        <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center shrink-0 shadow-sm border border-green-100">
                            <CheckCircle2 size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-900 uppercase tracking-widest mb-1">Engine Active</p>
                            <p className="text-[9px] text-gray-400 font-medium uppercase tracking-[0.1em]">Edge Performance: Optimal</p>
                        </div>
                    </div>
                    <div className="flex gap-6 items-center">
                        <div className="w-12 h-12 rounded-2xl bg-yellow-50 text-yellow-600 flex items-center justify-center shrink-0 shadow-sm border border-yellow-100">
                            <AlertCircle size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-900 uppercase tracking-widest mb-1">Stock Vigilance</p>
                            <p className="text-[9px] text-gray-400 font-medium uppercase tracking-[0.1em] italic">2 Items Low in Unstitched</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
