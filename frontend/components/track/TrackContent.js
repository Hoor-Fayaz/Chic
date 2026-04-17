"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useToastStore } from "@/store/toastStore";
import { Search, Package, Truck, CheckCircle, Clock, Loader2, MapPin } from "lucide-react";

export default function TrackContent() {
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
    { key: "pending", label: "Order Placed", icon: Clock },
    { key: "processing", label: "Processing", icon: Package },
    { key: "shipped", label: "In Transit", icon: Truck },
    { key: "delivered", label: "Delivered", icon: CheckCircle },
  ];

  const currentStatusIndex = statusSteps.findIndex(s => s.key === order?.status);

  return (
    <div className="space-y-16">
        {/* Search Box */}
        <div className="bg-gray-50 p-8 md:p-12 border border-gray-100">
            <form onSubmit={handleTrack} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="relative border-b border-gray-300 focus-within:border-black transition-colors pb-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2 block">Order ID</label>
                        <input 
                            placeholder="e.g. #65fa..." 
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            className="w-full bg-transparent text-[15px] font-medium transition-all outline-none placeholder:text-gray-400" 
                        />
                    </div>
                    <div className="relative border-b border-gray-300 focus-within:border-black transition-colors pb-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2 block">Billing Email</label>
                        <input 
                            type="email"
                            placeholder="Registered Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-transparent text-[15px] font-medium transition-all outline-none placeholder:text-gray-400" 
                        />
                    </div>
                </div>
                <button 
                    disabled={loading}
                    className="bg-black text-white px-10 py-4 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-gray-800 transition-colors disabled:opacity-50 w-full md:w-auto"
                >
                    {loading ? <Loader2 className="animate-spin" size={14} /> : <Search size={14} />}
                    {loading ? "Tracking..." : "Track Shipment"}
                </button>
            </form>
        </div>

        {/* Results */}
        {order && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-16 pt-8 border-t border-gray-200">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row items-baseline justify-between gap-4">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Current Status</p>
                        <h2 className="text-3xl font-display font-medium text-gray-900 capitalize">{order.status}</h2>
                    </div>
                    {order.trackingNumber && (
                        <div className="text-left md:text-right">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">AWB Tracking</p>
                            <p className="text-lg font-mono text-black">{order.trackingNumber}</p>
                        </div>
                    )}
                </div>

                {/* Minimal Timeline */}
                <div className="relative pt-8">
                    <div className="absolute top-12 left-0 w-full h-[1px] bg-gray-200 hidden md:block" />
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 md:gap-0">
                        {statusSteps.map((step, i) => {
                            const isPast = i < currentStatusIndex;
                            const isCurrent = i === currentStatusIndex;
                            const isFuture = i > currentStatusIndex;
                            const Icon = step.icon;

                            return (
                                <div key={step.key} className="relative z-10 flex md:flex-col items-center gap-6 md:gap-4 md:text-center flex-1 w-full md:w-auto">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all bg-white border-2 ${
                                        isPast ? 'border-black text-black' : isCurrent ? 'border-black text-black ring-4 ring-gray-100' : 'border-gray-200 text-gray-300'
                                    }`}>
                                        <Icon size={16} strokeWidth={isPast || isCurrent ? 2 : 1.5} />
                                    </div>
                                    <div className="flex-1 md:flex-none">
                                        <p className={`text-[10px] font-bold uppercase tracking-widest ${isPast || isCurrent ? 'text-gray-900' : 'text-gray-400'}`}>
                                            {step.label}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-gray-200">
                     <div className="space-y-4">
                        <div className="flex items-center gap-3 text-gray-400 mb-6">
                            <MapPin size={18} />
                            <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-900">Dispatch Address</h3>
                        </div>
                        <p className="text-[15px] font-display font-medium text-gray-900">{order.shippingAddress.fullName}</p>
                        <p className="text-[14px] text-gray-600 leading-relaxed">{order.shippingAddress.address}<br/>{order.shippingAddress.city}</p>
                    </div>
                    
                    <div className="space-y-4 bg-gray-50 p-8 border border-gray-100">
                        <div className="flex items-center gap-3 text-gray-400 mb-6">
                            <Truck size={18} />
                            <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-900">Logistics Partner</h3>
                        </div>
                        <p className="text-[14px] text-gray-600 leading-relaxed">
                            <span className="font-medium text-black">Courier:</span> Leopard / TCS <br/>
                            <span className="font-medium text-black">Arrival:</span> Usually 3-5 Working Days
                        </p>
                    </div>
                </div>

            </div>
        )}
    </div>
  );
}
