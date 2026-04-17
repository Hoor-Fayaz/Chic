import { API_BASE_URL } from "./config";

/**
 * Lightweight CMS fetcher safe for Server Components.
 * Does NOT import client-side stores or hooks.
 */
export async function fetchPage(slug) {
  const base = (API_BASE_URL || "").replace(/\/$/, "");
  
  // Safety check for build-time environments without a live API link
  if (!base || base.includes("localhost:5000")) {
    console.warn(`⚠️ Skipping live CMS fetch for [${slug}] - API URL not set or points to localhost.`);
    return { success: false, data: null };
  }

  const url = `${base}/pages/${slug}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", 
    });

    if (!res.ok) {
      if (res.status === 404) return { success: false, data: null };
      return { success: false, data: null, error: `Status ${res.status}` };
    }

    const json = await res.json();
    return json || { success: false, data: null };
  } catch (err) {
    console.error(`❌ CMS Fetch Fatal Error [${slug}]:`, err.message);
    return { success: false, data: null };
  }
}
