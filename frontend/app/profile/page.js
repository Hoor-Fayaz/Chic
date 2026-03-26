"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch, fetchMyOrders } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Package, ChevronRight, CheckCircle2, ExternalLink, Loader2 } from "lucide-react";

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  
  const { user: storeUser } = useAuthStore();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (!useAuthStore.getState().getToken?.()) {
      router.push("/auth/login");
      return;
    }

    // Fetch user data
    apiFetch("/auth/me")
      .then((res) => {
        if (res.success && res.data?.user) {
          setUser(res.data.user);
        } else {
          router.push("/auth/login");
        }
      })
      .catch(() => router.push("/auth/login"))
      .finally(() => setLoading(false));

    // Fetch order history
    fetchMyOrders()
      .then((res) => {
        if (res.success && res.data?.items) {
          setOrders(res.data.items);
        }
      })
      .catch((err) => console.error("Orders fetch error:", err))
      .finally(() => setLoadingOrders(false));
  }, [router]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }

    setUpdating(true);
    try {
      const res = await apiFetch("/auth/password", {
        method: "POST",
        body: { currentPassword, newPassword },
      });

      if (res.success) {
        setMessage({ type: "success", text: "Password updated successfully!" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to update password" });
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="bg-gray-50 flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="mx-auto max-w-5xl px-4 py-12">
        
        {/* Order Success Header */}
        {orderId && (
            <div className="mb-10 bg-green-600 text-white p-8 rounded-[3rem] shadow-2xl shadow-green-200 border border-green-500/20 flex flex-col md:flex-row items-center gap-6 animate-in zoom-in-95 duration-700">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                    <CheckCircle2 size={32} />
                </div>
                <div className="text-center md:text-left">
                    <h2 className="text-2xl font-display font-bold tracking-tight">Order Placed Successfully!</h2>
                    <p className="text-green-50 text-sm font-medium mt-1 tracking-wide uppercase">Order ID: #{orderId.slice(-8).toUpperCase()}</p>
                    <p className="text-green-100 text-xs mt-3 leading-relaxed opacity-80 font-medium">Thank you for shopping with Jannah Chic. A confirmation email has been sent to your inbox.</p>
                </div>
            </div>
        )}

        <div className="flex justify-between items-end mb-10">
            <div>
                <h1 className="text-4xl font-display font-bold tracking-tight text-gray-900">Dashboard</h1>
                <p className="text-xs uppercase tracking-[0.3em] font-bold text-gray-400 mt-2">Welcome back, {user.name.split(' ')[0]}</p>
            </div>
            <button 
                onClick={() => { useAuthStore.getState().logout?.(); router.push("/"); }}
                className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-600 transition"
            >
                Logout
            </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          
          <div className="lg:col-span-1 space-y-8">
             {/* User Profile Card */}
            <div className="rounded-[2.5rem] bg-white p-8 shadow-sm border border-gray-100">
                <h2 className="mb-6 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                Member Info
                </h2>
                <div className="space-y-4">
                <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-tighter">Full Name</p>
                    <p className="text-sm font-bold text-gray-900">{user.name}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-tighter">Email Address</p>
                    <p className="text-sm font-bold text-gray-900">{user.email}</p>
                </div>
                </div>
            </div>

            {/* Change Password Card */}
            <div className="rounded-[2.5rem] bg-white p-8 shadow-sm border border-gray-100">
                <h2 className="mb-6 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                Security
                </h2>
                <form onSubmit={handlePasswordChange} className="space-y-5">
                {message.text && (
                    <p className={`text-[10px] font-bold uppercase tracking-widest p-4 rounded-2xl ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    {message.text}
                    </p>
                )}
                
                <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400 tracking-tighter">New Password</label>
                    <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm font-medium focus:border-black focus:bg-white focus:outline-none transition-all"
                    placeholder="Min. 6 characters"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400 tracking-tighter">Confirm New Password</label>
                    <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm font-medium focus:border-black focus:bg-white focus:outline-none transition-all"
                    />
                </div>

                <button
                    type="submit"
                    disabled={updating}
                    className="w-full rounded-full bg-black py-4 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-gray-900 transition-all shadow-xl shadow-black/10 disabled:opacity-50"
                >
                    {updating ? "Updating..." : "Change Password"}
                </button>
                </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-[3rem] bg-white p-10 shadow-sm border border-gray-100 min-h-[600px]">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-3">
                        <Package size={16} /> My Order History
                    </h2>
                    <span className="text-[10px] font-bold bg-gray-50 px-4 py-1.5 rounded-full text-gray-400">{orders.length} Orders</span>
                </div>
                
                {loadingOrders ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-50 animate-pulse rounded-2xl" />)}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-100">
                        <Package className="mx-auto text-gray-200 mb-4" size={48} />
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No orders yet</p>
                        <button 
                            onClick={() => router.push("/shop")}
                            className="text-[10px] font-bold text-black underline uppercase tracking-widest mt-4"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order._id} className="group relative bg-white border border-gray-100 p-6 rounded-[2rem] hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 cursor-pointer">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Order #{order._id.slice(-8).toUpperCase()}</p>
                                        <p className="text-sm font-bold text-gray-900">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <div className="text-right">
                                            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Amount</p>
                                            <p className="text-sm font-bold text-gray-900">PKR {order.total.toLocaleString()}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <div className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                                                order.status === 'delivered' ? 'bg-green-50 text-green-700' :
                                                order.status === 'shipped' ? 'bg-purple-50 text-purple-700' :
                                                order.status === 'processing' ? 'bg-blue-50 text-blue-700' :
                                                'bg-amber-50 text-amber-700'
                                            }`}>
                                                {order.status}
                                            </div>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/track?id=${order._id}&email=${user.email}`);
                                                }}
                                                className="text-[9px] font-bold uppercase tracking-widest text-black underline flex items-center gap-1"
                                            >
                                                Track Status <ExternalLink size={10} />
                                            </button>
                                        </div>
                                        <ChevronRight size={18} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                                
                                {/* Item Thumbnails */}
                                <div className="mt-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                    {order.items.map((item, i) => (
                                        <div key={i} className="w-12 h-16 rounded-lg bg-gray-50 overflow-hidden border border-gray-50 shrink-0">
                                            <img src={item.imageUrl} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>}>
            <ProfileContent />
        </Suspense>
    );
}
