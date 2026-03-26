"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { 
    ShoppingBag, 
    Search, 
    ChevronRight, 
    Filter,
    Calendar,
    ArrowUpRight
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await apiFetch("/orders?limit=100");
      if (res.success && res.data?.items) {
        setOrders(res.data.items);
      }
    } catch (error) {
      console.error("Failed to load orders", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
        case 'delivered': return 'bg-green-600 text-white';
        case 'shipped': return 'bg-blue-600 text-white';
        case 'processing': return 'bg-indigo-600 text-white';
        case 'cancelled': return 'bg-red-600 text-white';
        default: return 'bg-yellow-500 text-white';
    }
  };

  const filteredOrders = orders.filter(o => 
    o._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="p-20 flex flex-col items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-gray-100 border-t-black rounded-full animate-spin mb-4" />
        <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Fetching Logistics...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-display tracking-tight text-gray-900">Order Management</h1>
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-gray-400 mt-2">Monitor and fulfill customer requests</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                    placeholder="Search ID or Name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border border-gray-100 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black transition-all"
                />
            </div>
            <button className="bg-white border border-gray-100 p-3 rounded-2xl hover:bg-gray-50 transition shadow-sm">
                <Filter size={18} className="text-gray-400" />
            </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 border-b border-gray-50">
                        <th className="py-6 px-8">Order Summary</th>
                        <th className="py-6 px-4">Placed By</th>
                        <th className="py-6 px-4">Lifecycle</th>
                        <th className="py-6 px-4 text-right">Transaction</th>
                        <th className="py-6 px-8 text-right">Details</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {filteredOrders.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="py-20 text-center">
                                <ShoppingBag size={48} className="mx-auto text-gray-100 mb-4" />
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest font-display">No matching orders found</p>
                            </td>
                        </tr>
                    ) : (
                        filteredOrders.map((order) => (
                            <tr key={order._id} className="group hover:bg-gray-50/50 transition-all duration-500">
                                <td className="py-8 px-8">
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-bold text-gray-900 tracking-widest">#{order._id.slice(-8).toUpperCase()}</span>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <Calendar size={12} className="text-gray-400" />
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                                {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-8 px-4">
                                    <div className="flex flex-col">
                                        <p className="text-xs font-bold text-gray-900 uppercase tracking-tight">{order.user?.name || 'Guest'}</p>
                                        <p className="text-[10px] text-gray-400 font-medium">{order.user?.email || 'Walk-in'}</p>
                                    </div>
                                </td>
                                <td className="py-8 px-4">
                                    <div className="inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] shadow-sm shadow-black/5 ${getStatusColor(order.status)}">
                                        {order.status}
                                    </div>
                                </td>
                                <td className="py-8 px-4 text-right">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-900 tracking-tight">PKR {order.total?.toLocaleString()}</span>
                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{order.items?.length || 0} Items</span>
                                    </div>
                                </td>
                                <td className="py-8 px-8 text-right">
                                    <Link href={`/admin/orders/${order._id}`}>
                                        <button className="bg-gray-50 text-gray-400 w-12 h-12 rounded-2xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-500 shadow-sm border border-gray-100 group-hover:border-black">
                                            <ArrowUpRight size={18} />
                                        </button>
                                    </Link>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>

      <p className="mt-12 text-[9px] text-gray-400 text-center leading-relaxed max-w-lg mx-auto uppercase tracking-tighter opacity-60">
        Showing up to 100 recent transactions. Use search filters for older inventory inquiries. System updates lifecycle in real-time.
      </p>
    </div>
  );
}