import { API_BASE_URL } from "@/lib/config";
import { useAuthStore } from "@/store/authStore"; // ✅ read token from authStore

/* ------------------------- Core Fetch Wrapper ------------------------- */
export async function apiFetch(path, options = {}) {
  const base = (API_BASE_URL || "").replace(/\/$/, "");
  const url = `${base}${path.startsWith("/") ? path : "/" + path}`;

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // ✅ Use token safely from authStore on client side
  let token = null;
  if (typeof window !== "undefined") {
    token = useAuthStore.getState().getToken?.();
  }
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    const res = await fetch(url, {
      method: options.method || "GET",
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) {
      let msg = `Request failed with status ${res.status}`;
      try {
        const body = await res.json();
        msg = body.message || msg;
      } catch {}
      throw new Error(msg);
    }

    return await res.json(); // ✅ full response as before
  } catch (err) {
    console.error("API Fetch Error:", err);
    throw err;
  }
}

/* ------------------------- Wishlist APIs ------------------------- */
export async function getWishlistAPI() {
  const res = await apiFetch("/wishlist");
  return res.data; // keep original behavior
}

export async function toggleWishlistAPI(productId) {
  const res = await apiFetch("/wishlist/toggle", {
    method: "POST",
    body: { productId },
  });
  return res.data; // keep original behavior
}

/* ------------------------- Product APIs ------------------------- */
export async function fetchProducts(params = {}) {
  const searchParams = new URLSearchParams(params);
  return apiFetch(`/products?${searchParams.toString()}`); // keep original
}

export async function fetchFeaturedProducts() {
  const res = await fetchProducts({ isFeatured: "true", limit: 8 });
  return res; // keep original
}

export async function fetchNewArrivals() {
  const res = await fetchProducts({ isNewArrival: "true", limit: 8 });
  return res; // keep original
}

/* ------------------------- Category APIs ------------------------- */
export async function fetchCategories() {
  return apiFetch("/categories"); // keep original
}

/* ------------------------- Auth APIs ------------------------- */
export async function signupUser(payload) {
  return apiFetch("/auth/register", { method: "POST", body: payload });
}

export async function loginUser(payload) {
  return apiFetch("/auth/login", { method: "POST", body: payload });
}

export async function changePasswordAPI(payload) {
  return apiFetch("/auth/password", { method: "POST", body: payload });
}

export async function logoutUser() {
  return apiFetch("/auth/logout", { method: "POST" });
}

export async function fetchCurrentUser() {
  return apiFetch("/auth/me");
}

/* ------------------------- Cart APIs ------------------------- */
export async function fetchCart() {
  return apiFetch("/cart"); // keep original
}

export async function addToCart(payload) {
  return apiFetch("/cart", { method: "POST", body: payload });
}

export async function updateCartItem(index, quantity) {
  return apiFetch(`/cart/${index}`, { method: "PATCH", body: { quantity } });
}

export async function removeCartItem(index) {
  return apiFetch(`/cart/${index}`, { method: "DELETE" });
}

export async function clearCart() {
  return apiFetch("/cart", { method: "DELETE" });
}



export async function fetchProductBySlug(slug) {
  const res = await fetch(`${API_BASE_URL}/products/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data.data.product; // ✅ FIXED
}

/* ------------------------- Admin APIs ------------------------- */
export async function createProduct(payload) {
  return apiFetch("/products", { method: "POST", body: payload });
}

export async function updateProduct(id, payload) {
  return apiFetch(`/products/${id}`, { method: "PATCH", body: payload });
}

export async function deleteProduct(id) {
  return apiFetch(`/products/${id}`, { method: "DELETE" });
}

export async function createCategoryAPI(payload) {
  return apiFetch("/categories", { method: "POST", body: payload });
}

export async function updateCategoryAPI(id, payload) {
  return apiFetch(`/categories/${id}`, { method: "PATCH", body: payload });
}

export async function deleteCategoryAPI(id) {
  return apiFetch(`/categories/${id}`, { method: "DELETE" });
}

export async function fetchAdminStats() {
  return apiFetch("/admin/stats");
}

export async function fetchUsers() {
  return apiFetch("/admin/users");
}

export async function updateUserStatus(id, payload) {
  return apiFetch(`/admin/users/${id}`, {
    method: "PATCH",
    body: payload
  });
}

export async function fetchPublicSettings() {
  return apiFetch("/settings/homepage");
}

export async function fetchSettings() {
  return apiFetch("/admin/settings");
}

export async function updateSettings(payload) {
  return apiFetch("/admin/settings", {
    method: "PATCH",
    body: payload
  });
}




/* ------------------------- Order APIs ------------------------- */
export async function fetchMyOrders() {
  return apiFetch("/orders/my");
}

export async function placeOrder(payload) {
  return apiFetch("/orders", { method: "POST", body: payload });
}

/* ------------------------- Review APIs ------------------------- */
export async function fetchProductReviews(productId, params = {}) {
  const searchParams = new URLSearchParams(params);
  return apiFetch(`/reviews/product/${productId}?${searchParams.toString()}`);
}

export async function createProductReview(productId, payload) {
  return apiFetch(`/reviews/product/${productId}`, {
    method: "POST",
    body: payload,
  });
}

export async function deleteReviewAPI(reviewId) {
  return apiFetch(`/reviews/${reviewId}`, { method: "DELETE" });
}
