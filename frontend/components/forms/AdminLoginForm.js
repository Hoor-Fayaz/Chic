"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { loginUser } from "@/lib/api";
import { Loader2, Lock, Mail, ShieldCheck } from "lucide-react";

export default function AdminLoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { setAuth } = useAuthStore();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginUser(form);
      
      if (res.data.user.role !== "admin") {
        setError("Access Denied: Admin credentials required.");
        setLoading(false);
        return;
      }

      setAuth(res.data.user, res.data.token);
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 flex flex-col gap-8 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
          <ShieldCheck size={120} />
        </div>

        <div className="space-y-2 text-center relative">
          <h2 className="text-2xl font-display font-bold text-gray-900">Atelier Access</h2>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Secure Admin Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={18} />
              <input
                name="email"
                placeholder="Admin Email"
                value={form.email}
                onChange={handleChange}
                type="email"
                required
                className="w-full bg-gray-50 border border-gray-100 px-12 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-black/5 focus:bg-white transition-all text-sm"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={18} />
              <input
                name="password"
                placeholder="Security Code"
                value={form.password}
                onChange={handleChange}
                type="password"
                required
                className="w-full bg-gray-50 border border-gray-100 px-12 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-black/5 focus:bg-white transition-all text-sm"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 p-4 rounded-xl">
              <p className="text-red-600 text-[11px] font-medium text-center leading-relaxed">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gray-800 disabled:opacity-50 transition-all shadow-lg shadow-black/10 flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Authorize Access"
            )}
          </button>
        </form>

        <div className="mt-4 pt-8 border-t border-gray-50 text-center">
          <p className="text-[10px] text-gray-300 uppercase tracking-widest leading-relaxed">
            Encrypted connection active.<br />
            Unauthorized access is strictly monitored.
          </p>
        </div>
      </div>
    </div>
  );
}
