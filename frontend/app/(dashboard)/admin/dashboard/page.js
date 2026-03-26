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
  AlertCircle
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
      <div className="p-10 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-gray-100 border-t-black rounded-full animate-spin mb-4" />
        <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Loading Analytics...</p>
      </div>
    );
  }

  const recentOrders = stats?.recentOrders || [];

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-display tracking-tight text-gray-900">Dashboard</h1>
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-gray-400 mt-2">Boutique performance overview</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-full px-6 py-2 flex items-center gap-3 shadow-sm">
            <Clock size={14} className="text-gray-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900">
                {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard 
          title="Total Revenue" 
          value={`PKR ${stats?.totalRevenue?.toLocaleString()}`} 
          icon={TrendingUp} 
          trend={12.5} 
        />
        <StatCard 
          title="Total Orders" 
          value={stats?.totalOrders || 0} 
          icon={ShoppingBag} 
          trend={8.2} 
        />
        <StatCard 
          title="Registered Users" 
          value={stats?.totalUsers || 0} 
          icon={Users} 
        />
        <StatCard 
          title="Active Products" 
          value={stats?.totalProducts || 0} 
          icon={Package} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-10">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Recent Transactions</h3>
                <Link href="/admin/orders" className="text-[10px] font-bold text-black flex items-center gap-2 hover:translate-x-1 transition-transform uppercase tracking-widest">
                    View All <ArrowRight size={14} />
                </Link>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-[10px] uppercase tracking-widest font-bold text-gray-400 border-b border-gray-50">
                            <th className="pb-4 px-2">Order ID</th>
                            <th className="pb-4 px-2">Customer</th>
                            <th className="pb-4 px-2">Status</th>
                            <th className="pb-4 px-2 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {recentOrders.map((order) => (
                            <tr key={order._id} className="group hover:bg-gray-50/50 transition-colors">
                                <td className="py-5 px-2">
                                    <span className="text-[11px] font-bold text-gray-900">#{order._id.slice(-8).toUpperCase()}</span>
                                </td>
                                <td className="py-5 px-2">
                                    <div>
                                        <p className="text-xs font-bold text-gray-900 uppercase tracking-tight">{order.user?.name || 'Guest'}</p>
                                        <p className="text-[10px] text-gray-400">{order.user?.email}</p>
                                    </div>
                                </td>
                                <td className="py-5 px-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${
                                            order.status === 'delivered' ? 'bg-green-500' :
                                            order.status === 'cancelled' ? 'bg-red-500' :
                                            'bg-yellow-500'
                                        }`} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">{order.status}</span>
                                    </div>
                                </td>
                                <td className="py-5 px-2 text-right">
                                    <span className="text-sm font-bold text-gray-900">PKR {order.total?.toLocaleString()}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Quick Actions / System Health */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-black text-white rounded-[2.5rem] p-10 shadow-2xl shadow-black/20 overflow-hidden relative group">
                <div className="relative z-10">
                    <h3 className="text-[11px] font-bold uppercase tracking-widest opacity-60 mb-6">Inventory Health</h3>
                    <div className="flex items-end justify-between mb-4">
                        <p className="text-xs font-bold uppercase tracking-widest">Stock Items</p>
                        <p className="text-4xl font-display">{stats?.totalProducts}</p>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-8">
                        <div className="bg-white h-full transition-all duration-1000" style={{ width: '85%' }}></div>
                    </div>
                    <button className="w-full bg-white text-black py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-100 transition shadow-xl">
                        Manage Inventory
                    </button>
                </div>
                <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                    <Package size={200} />
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-8">Storefront Alerts</h3>
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                            <CheckCircle2 size={18} />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-gray-900 uppercase">System Active</p>
                            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-tighter">API Response: 42ms</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center shrink-0">
                            <AlertCircle size={18} />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-gray-900 uppercase">3 Low Stock Alerts</p>
                            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-tighter italic">Review unstitched category</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}