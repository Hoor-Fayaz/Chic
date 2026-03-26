"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useToastStore } from "@/store/toastStore";
import { Search, Package, Truck, CheckCircle, Clock, Loader2, MapPin } from "lucide-react";

function TrackContent() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get("id") || "");
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const { showToast } = useToastStore();

  useEffect(() => {
    if (searchParams.get("id") && searchParams.get("email")) {
        triggerTrack(searchParams.get("id"), searchParams.get("email"));
    }
  }, [searchParams]);

  const triggerTrack = async (oid, eml) => {
    setLoading(true);
    try {
      const res = await apiFetch(`/orders/track/${oid}?email=${encodeURIComponent(eml)}`);
      if (res.success) {
        setOrder(res.data.order);
      }
    } catch (err) {
      showToast(err.message || "Order not found", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId || !email) {
      showToast("Please enter both Order ID and Email", "info");
      return;
    }
    triggerTrack(orderId, email);
  };

  const statusSteps = [
    { key: "pending", label: "Order Placed", icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
    { key: "processing", label: "Processing", icon: Package, color: "text-blue-500", bg: "bg-blue-50" },
    { key: "shipped", label: "In Transit", icon: Truck, color: "text-purple-500", bg: "bg-purple-50" },
    { key: "delivered", label: "Delivered", icon: CheckCircle, color: "text-green-500", bg: "bg-green-50" },
  ];

  const currentStatusIndex = statusSteps.findIndex(s => s.key === order?.status);

  return (
    <div className="min-h-screen bg-gray-50/50 pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 tracking-tight">Track Your Order</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Real-time Shipment Monitoring</p>
        </div>

        {/* Search Box */}
        <div className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-xl border border-gray-100 max-w-2xl mx-auto">
            <form onSubmit={handleTrack} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block ml-1">Order ID</label>
                        <input 
                            placeholder="#65fa..." 
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            className="w-full bg-gray-50 border border-transparent focus:border-black focus:bg-white px-6 py-4 rounded-2xl text-sm font-medium transition-all outline-none" 
                        />
                    </div>
                    <div className="relative">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block ml-1">Email Address</label>
                        <input 
                            type="email"
                            placeholder="customer@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-50 border border-transparent focus:border-black focus:bg-white px-6 py-4 rounded-2xl text-sm font-medium transition-all outline-none" 
                        />
                    </div>
                </div>
                <button 
                    disabled={loading}
                    className="w-full bg-black text-white py-5 rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-gray-900 transition-all shadow-xl shadow-black/10 active:scale-95 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
                    {loading ? "Searching..." : "Track My Package"}
                </button>
            </form>
        </div>

        {/* Results */}
        {order && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
                {/* Visual Timeline */}
                <div className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-xl border border-gray-100">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-12">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-3 inline-block">Order Found</span>
                            <h2 className="text-2xl font-bold">Status: <span className="capitalize">{order.status}</span></h2>
                        </div>
                        {order.trackingNumber && (
                             <div className="text-right">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Tracking ID</p>
                                <p className="text-lg font-mono font-bold text-gray-900">{order.trackingNumber}</p>
                            </div>
                        )}
                    </div>

                    <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-0">
                        {/* Connecting Lines (Desktop) */}
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 hidden md:block" />
                        
                        {statusSteps.map((step, i) => {
                            const isPast = i < currentStatusIndex;
                            const isCurrent = i === currentStatusIndex;
                            const Icon = step.icon;

                            return (
                                <div key={step.key} className="relative z-10 flex items-center gap-4 md:flex-col md:text-center md:flex-1">
                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg ${isPast ? 'bg-black text-white' : isCurrent ? `${step.bg} ${step.color} ring-4 ring-white` : 'bg-gray-100 text-gray-300'}`}>
                                        <Icon size={24} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className={`text-xs font-bold uppercase tracking-widest ${isPast || isCurrent ? 'text-gray-900' : 'text-gray-300'}`}>
                                            {step.label}
                                        </p>
                                        <p className="text-[10px] text-gray-400 font-medium">
                                            {isPast ? "Completed" : isCurrent ? "Current Step" : "Coming Soon"}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Details Footer */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                     <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400"><MapPin size={20}/></div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Shipping To</p>
                            <p className="text-sm font-bold text-gray-900">{order.shippingAddress.fullName}</p>
                        </div>
                    </div>
                    <div className="bg-black text-white p-8 rounded-[2.5rem] shadow-xl flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">Est. Delivery</p>
                            <p className="text-sm font-bold">Within 3-5 Working Days</p>
                        </div>
                        <Truck size={32} className="opacity-20 translate-x-4 rotate-12" />
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>}>
            <TrackContent />
        </Suspense>
    );
}
