// frontend/lib/auth.js
export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token") || null;
}
