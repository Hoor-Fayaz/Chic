import { create } from "zustand";

const STORAGE_TOKEN = "token";
const STORAGE_USER = "user";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isHydrated: false,

  // ✅ Store user + token
  setAuth: (user, token) => {
    set({ user, token });
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_TOKEN, token);
      localStorage.setItem(STORAGE_USER, JSON.stringify(user));
    }
  },

  // ✅ Hydrate store on page load
  loadAuth: () => {
    if (typeof window === "undefined") return;

    let token = localStorage.getItem(STORAGE_TOKEN);
    let userRaw = localStorage.getItem(STORAGE_USER);

    // Clean up bad state from previous bug
    if (token === "undefined") {
      localStorage.removeItem(STORAGE_TOKEN);
      token = null;
    }
    if (userRaw === "undefined") {
      localStorage.removeItem(STORAGE_USER);
      userRaw = null;
    }

    let user = null;
    try {
      user = userRaw ? JSON.parse(userRaw) : null;
    } catch (e) {
      user = null;
    }

    if (token && user) {
      set({ user, token, isHydrated: true });
    } else {
      set({ isHydrated: true });
    }
  },

  // ✅ Login helper
  login: async (loginApiFunc, payload) => {
    const res = await loginApiFunc(payload);
    if (res.success) {
      set({ user: res.data.user, token: res.data.token });
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_TOKEN, res.data.token);
        localStorage.setItem(STORAGE_USER, JSON.stringify(res.data.user));
      }
    }
    return res;
  },

  // ✅ Logout
  logout: () => {
    set({ user: null, token: null });
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_TOKEN);
      localStorage.removeItem(STORAGE_USER);
    }
  },

  // ✅ Helper to get token in frontend
  getToken: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(STORAGE_TOKEN);
  },
}));
