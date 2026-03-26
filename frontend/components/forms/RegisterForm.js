"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { signupUser } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { API_BASE_URL } from "@/lib/config";

export default function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
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
      const res = await signupUser(form);
      setAuth(res.data.user, res.data.token);
      router.push("/");
    } catch (err) {
      setError(err.message || "Registration failed");
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
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Create Account
        </h2>

        {/* Social login icons horizontal */}
        <div className="flex justify-center gap-4 my-2">
          <button
            type="button"
            onClick={() => handleSocialLogin("Google")}
            className="p-3 rounded-full border border-gray-300 hover:bg-gray-100 transition"
          >
            <FcGoogle size={28} />
          </button>
          <button
            type="button"
            onClick={() => handleSocialLogin("Facebook")}
            className="p-3 rounded-full border border-gray-300 hover:bg-gray-100 transition"
          >
            <FaFacebookF size={28} className="text-blue-600" />
          </button>
        </div>

        <input
          name="name"
          placeholder="Full Name *"
          value={form.name}
          onChange={handleChange}
          required
          className="border border-gray-300 p-3 rounded-md focus:outline-none focus:border-black"
        />
        <input
          name="email"
          placeholder="Email *"
          value={form.email}
          onChange={handleChange}
          type="email"
          required
          className="border border-gray-300 p-3 rounded-md focus:outline-none focus:border-black"
        />

        {/* Password field with show/hide */}
        <div className="relative">
          <input
            name="password"
            placeholder="Password *"
            value={form.password}
            onChange={handleChange}
            type="password"
            required
            className="border border-gray-300 p-3 rounded-md focus:outline-none focus:border-black w-full"
          />
        </div>

        {/* Confirm Password field with show/hide */}
        <div className="relative">
          <input
            name="confirmPassword"
            placeholder="Confirm Password *"
            value={form.confirmPassword}
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
          {loading ? "Creating..." : "Create Account"}
        </button>

        <p className="text-xs text-gray-500 mt-2">
          By clicking "Sign Up" you agree to the{" "}
          <a href="/terms" className="underline hover:text-black">
            JannahChic Terms and Conditions
          </a>
          . To see how we may use your information, take a look at our{" "}
          <a href="/privacy" className="underline hover:text-black">
            Privacy Policy
          </a>
          .
        </p>

        <p className="text-center text-gray-600 text-sm mt-2">
          Already have an account?
        </p>
        <button
          type="button"
          onClick={() => router.push("/auth/login")}
          className="border border-black py-2 rounded-full hover:bg-black hover:text-white transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}