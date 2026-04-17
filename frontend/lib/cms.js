import { API_BASE_URL } from "./config";

/**
 * Lightweight CMS fetcher safe for Server Components.
 * Does NOT import client-side stores or hooks.
 */
export async function fetchPage(slug) {
  const base = (API_BASE_URL || "").replace(/\/$/, "");
  const url = `${base}/pages/${slug}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Ensure we always get fresh content from CMS
    });

    if (!res.ok) {
      if (res.status === 404) return { success: false, data: null };
      throw new Error(`Failed to fetch page: ${res.statusText}`);
    }

    return await res.json();
  } catch (err) {
    console.error(`CMS Fetch Error (${slug}):`, err);
    return { success: false, data: null };
  }
}
