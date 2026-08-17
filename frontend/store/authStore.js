import { create } from "zustand";

const STORAGE_TOKEN = "token";
const STORAGE_USER = "user";

function setCookie(name, value, days = 7) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const secure = typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax${secure}`;
}

function removeCookie(name) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isHydrated: false,

  // ✅ Store user + token & synchronize cookies for server middleware
  setAuth: (user, token) => {
    set({ user, token });
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_TOKEN, token);
      localStorage.setItem(STORAGE_USER, JSON.stringify(user));

      setCookie("token", token);
      if (user?.role === "admin") {
        setCookie("chic_admin_token", token);
        setCookie("user_role", "admin");
      } else {
        removeCookie("chic_admin_token");
        removeCookie("user_role");
      }
    }
  },

  // ✅ Hydrate store on page load
  loadAuth: () => {
    if (typeof window === "undefined") return;

    let token = localStorage.getItem(STORAGE_TOKEN);
    let userRaw = localStorage.getItem(STORAGE_USER);

    // Clean up bad state
    if (token === "undefined" || token === "null") {
      localStorage.removeItem(STORAGE_TOKEN);
      token = null;
    }
    if (userRaw === "undefined" || userRaw === "null") {
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
      // Keep cookies synced
      setCookie("token", token);
      if (user.role === "admin") {
        setCookie("chic_admin_token", token);
        setCookie("user_role", "admin");
      }
    } else {
      set({ user: null, token: null, isHydrated: true });
    }
  },

  // ✅ Login helper
  login: async (loginApiFunc, payload) => {
    const res = await loginApiFunc(payload);
    if (res.success && res.data?.token) {
      const user = res.data.user;
      const token = res.data.token;
      get().setAuth(user, token);
    }
    return res;
  },

  // ✅ Logout & purge all traces of credentials/cookies
  logout: () => {
    set({ user: null, token: null });
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_TOKEN);
      localStorage.removeItem(STORAGE_USER);
      removeCookie("token");
      removeCookie("chic_admin_token");
      removeCookie("user_role");
      removeCookie("accessToken");
    }
  },

  // ✅ Helper to get token in frontend
  getToken: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(STORAGE_TOKEN);
  },
}));

