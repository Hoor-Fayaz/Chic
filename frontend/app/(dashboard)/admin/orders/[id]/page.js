"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { 
    ChevronLeft, 
    Package, 
    Truck, 
    MapPin, 
    User, 
    Phone, 
    Calendar,
    CheckCircle2,
    Clock,
    AlertCircle,
    Copy
} from "lucide-react";

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const res = await apiFetch(`/orders/${id}`);
      if (res.success && res.data?.order) {
        setOrder(res.data.order);
      }
    } catch (error) {
      console.error("Failed to load order", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status) => {
    setUpdating(true);
    try {
      await apiFetch(`/orders/${id}`, {
        method: "PATCH",
        body: { status }
      });
      setOrder({ ...order, status });
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard");
  };

  if (loading) return (
    <div className="p-20 flex flex-col items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-gray-100 border-t-black rounded-full animate-spin mb-4" />
        <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Loading Order Details...</p>
    </div>
  );

  if (!order) return <div className="p-20 text-center uppercase tracking-widest font-bold text-gray-400">Order Not Found</div>;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      
      {/* Action Bar */}
      <div className="flex justify-between items-center mb-10">
        <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition"
        >
            <ChevronLeft size={16} /> Back to Orders
        </button>
        <div className="flex gap-3">
            <button className="bg-white border border-gray-100 px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 transition shadow-sm">
                Print Invoice
            </button>
            <button className="bg-black text-white px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-gray-900 transition shadow-xl shadow-black/10">
                Ship Item
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: Order Summary & Status */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* Main Header Card */}
            <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-gray-400 mb-2">Order Identification</p>
                            <h2 className="text-3xl font-display tracking-tight text-gray-900">#{order._id.slice(-12).toUpperCase()}</h2>
                        </div>
                        <div className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                            order.status === 'delivered' ? 'bg-green-600 text-white' :
                            order.status === 'cancelled' ? 'bg-red-600 text-white' :
                            'bg-yellow-500 text-white'
                        }`}>
                            {order.status}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-gray-50">
                        <div className="space-y-1">
                            <p className="text-[9px] uppercase font-bold text-gray-400 tracking-widest">Order Placed</p>
                            <p className="text-xs font-bold text-gray-900 uppercase tracking-tight">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[9px] uppercase font-bold text-gray-400 tracking-widest">Payment Method</p>
                            <p className="text-xs font-bold text-gray-900 uppercase tracking-tight">{order.paymentMethod?.toUpperCase()}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[9px] uppercase font-bold text-gray-400 tracking-widest">Items Count</p>
                            <p className="text-xs font-bold text-gray-900 uppercase tracking-tight">{order.items?.length} items in bag</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Fulfillment Card */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-8 flex items-center gap-3">
                    <Truck size={16} /> Fulfillment lifecycle
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                        <button
                            key={s}
                            onClick={() => handleStatusUpdate(s)}
                            disabled={updating || order.status === s}
                            className={`py-3 px-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${
                                order.status === s 
                                    ? 'bg-black text-white' 
                                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-black'
                            }`}
                        >
                            {updating && order.status !== s ? '...' : s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Order Items Table */}
            <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm overflow-hidden">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-8">Cart Breakdown</h3>
                <div className="space-y-6 divide-y divide-gray-50">
                    {order.items?.map((item, idx) => (
                        <div key={idx} className="flex gap-8 pt-6 first:pt-0 group">
                            <div className="w-24 aspect-[2/3] bg-gray-50 rounded-2xl overflow-hidden shrink-0 border border-gray-100">
                                <img src={item.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            <div className="flex-1 flex flex-col justify-center gap-1">
                                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-tight">{item.name}</h4>
                                <div className="flex items-center gap-4 mt-2">
                                    {item.size && <span className="text-[10px] font-bold bg-gray-50 px-3 py-1 rounded-full uppercase tracking-widest text-gray-400">Size: {item.size}</span>}
                                    {item.color && <span className="text-[10px] font-bold bg-gray-50 px-3 py-1 rounded-full uppercase tracking-widest text-gray-400">Color: {item.color}</span>}
                                    <span className="text-[10px] font-bold bg-gray-50 px-3 py-1 rounded-full uppercase tracking-widest text-gray-400">Qty: {item.quantity}</span>
                                </div>
                                <div className="mt-auto pt-4 flex justify-between items-end border-t border-gray-50/50">
                                    <div className="space-y-0.5">
                                        <p className="text-[9px] uppercase font-bold text-gray-400 tracking-[0.2em]">Unit Price</p>
                                        <p className="text-xs font-bold text-gray-900">PKR {item.unitPrice?.toLocaleString()}</p>
                                    </div>
                                    <div className="text-right space-y-0.5">
                                        <p className="text-[9px] uppercase font-bold text-gray-400 tracking-[0.2em]">Subtotal</p>
                                        <p className="text-sm font-bold text-gray-900">PKR {item.totalPrice?.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 bg-gray-50/50 rounded-[2rem] p-8 border border-gray-50">
                    <div className="space-y-3">
                        <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                            <span>Subtotal</span>
                            <span>PKR {order.subtotal?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                            <span>Tax (15%)</span>
                            <span>PKR {order.tax?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                            <span>Shipping</span>
                            <span>PKR {order.shippingFee?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-lg font-display text-gray-900 border-t border-gray-200 pt-4 mt-2">
                            <span className="uppercase tracking-[0.1em]">Grand Total</span>
                            <span className="font-bold underline underline-offset-8 decoration-1 decoration-gray-200">PKR {order.total?.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* RIGHT: Customer & Logistics Info */}
        <div className="lg:col-span-1 space-y-8">
            
            {/* Customer Details */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-8 flex items-center gap-3">
                    <User size={16} /> Customer Profile
                </h3>
                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 font-bold uppercase text-[10px]">
                            {order.user?.name ? order.user.name[0] : 'G'}
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-900 uppercase tracking-tight">{order.user?.name || 'Walk-in Guest'}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5 select-all" title="Click to copy">{order.user?.email || 'No email provided'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-gray-400">
                        <Phone size={14} />
                        <span className="text-[11px] font-bold text-gray-900 tracking-widest">{order.shippingAddress?.phone || 'No phone recorded'}</span>
                        <button onClick={() => copyToClipboard(order.shippingAddress?.phone)} className="hover:text-black transition">
                            <Copy size={12} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm relative overflow-hidden group">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-8 flex items-center gap-3">
                    <MapPin size={16} /> Delivery address
                </h3>
                <div className="space-y-4 text-xs leading-relaxed font-medium text-gray-700">
                    <p className="font-bold text-gray-900 uppercase tracking-tight">{order.shippingAddress?.fullName}</p>
                    <p className="opacity-80 leading-relaxed uppercase tracking-tighter">
                        {order.shippingAddress?.street},<br />
                        {order.shippingAddress?.city}, {order.shippingAddress?.state}<br />
                        {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
                    </p>
                    <button className="text-[9px] font-bold uppercase tracking-[0.2em] text-black underline mt-4 flex items-center gap-2 group-hover:gap-4 transition-all">
                        Open on Maps <ArrowUpRight size={14} />
                    </button>
                </div>
                <div className="absolute -bottom-12 -right-12 opacity-5 text-gray-900 group-hover:scale-110 transition-transform duration-700">
                    <MapPin size={140} />
                </div>
            </div>

            {/* Fulfillment Note */}
            <div className="bg-indigo-50/50 rounded-[2.5rem] p-10 border border-indigo-100/50 relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4 text-indigo-600">
                        <AlertCircle size={16} />
                        <h4 className="text-[10px] font-bold uppercase tracking-widest">Internal Memo</h4>
                    </div>
                    <p className="text-[11px] text-indigo-900/60 leading-relaxed italic font-medium">
                        "{order.notes || 'Please verify product fabric quality before shipment. Ensure the item is gift-wrapped as per boutique standards.'}"
                    </p>
                </div>
            </div>
            
        </div>

      </div>
    </div>
  );
}