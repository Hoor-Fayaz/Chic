"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc"; // Google icon
import { FaFacebookF } from "react-icons/fa"; // Facebook icon
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { loginUser } from "@/lib/api";
import { API_BASE_URL } from "@/lib/config";

export default function LoginForm() {
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
      setAuth(res.data.user, res.data.token);
      
      if (res.data.user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/"); 
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    window.location.href = `${API_BASE_URL}/auth/${provider.toLowerCase()}`;
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f8f5f2]">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-xl shadow-md w-[400px] flex flex-col gap-4"
      >
        {/* Social login icons horizontal */}
        <div className="flex justify-center gap-4 my-2">
          <button
            type="button"
            onClick={() => handleSocialLogin("Google")}
            className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition"
          >
            <FcGoogle size={28} />
          </button>
          <button
            type="button"
            onClick={() => handleSocialLogin("Facebook")}
            className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition"
          >
            <FaFacebookF size={28} className="text-blue-600" />
          </button>
        </div>

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          type="email"
          required
          className="border border-gray-300 p-3 rounded-md focus:outline-none focus:border-black"
        />

        <div className="relative">
          <input
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            type="password"
            required
            className="border border-gray-300 p-3 rounded-md focus:outline-none focus:border-black w-full"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white py-3 rounded-full hover:bg-gray-800 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-gray-600 text-sm mt-2">
          Don't have an account?
        </p>
        <button
          type="button"
          onClick={() => router.push("/auth/register")}
          className="border border-black py-2 rounded-full hover:bg-black hover:text-white transition"
        >
          Create Account
        </button>
      </form>
    </div>
  );
} 
