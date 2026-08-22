import { create } from "zustand";

export const useCurrencyStore = create(
  (set, get) => ({
    currency: "PKR", // 'PKR' | 'USD'
    isDetected: false,
    country: null,

    // Initialize / auto-detect user's country on every visit
    initCurrency: async () => {
      const state = get();
      // If already detected during this session, skip
      if (state.isDetected) return;

      try {
        // Fast lightweight IP geo detection
        const res = await fetch("https://api.country.is/", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          const userCountry = data?.country || "PK";
          const detectedCurrency = userCountry === "PK" ? "PKR" : "USD";
          set({
            country: userCountry,
            currency: detectedCurrency,
            isDetected: true,
          });
          return;
        }
      } catch (err) {
        // Fallback to secondary geo endpoint
        try {
          const res2 = await fetch("https://ipapi.co/json/", { cache: "no-store" });
          if (res2.ok) {
            const data2 = await res2.json();
            const userCountry = data2?.country_code || "PK";
            const detectedCurrency = userCountry === "PK" ? "PKR" : "USD";
            set({
              country: userCountry,
              currency: detectedCurrency,
              isDetected: true,
            });
            return;
          }
        } catch (e) {
          console.warn("Geo detection unavailable, defaulting to PKR", e);
        }
      }

      // Default fallback
      set({ currency: "PKR", country: "PK", isDetected: true });
    },

    // Helper to format price for a given product or numerical price
    formatPrice: (productOrPrice, isOriginal = false) => {
      const { currency } = get();
      if (!productOrPrice && productOrPrice !== 0) return "";

      // If a number was directly passed
      if (typeof productOrPrice === "number") {
        if (currency === "USD") {
          return `$${productOrPrice.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
        }
        return `PKR ${productOrPrice.toLocaleString()}`;
      }

      // If a product object was passed
      const product = productOrPrice;
      if (currency === "USD") {
        const val = isOriginal
          ? product.originalPriceUSD || (product.originalPrice ? Math.round(product.originalPrice / 280) : undefined)
          : (product.priceUSD || (product.price ? Math.round(product.price / 280) : 0));
        return val !== undefined ? `$${Number(val).toLocaleString()}` : "";
      } else {
        const val = isOriginal ? product.originalPrice : product.price;
        return val !== undefined ? `PKR ${Number(val).toLocaleString()}` : "";
      }
    },

    // Get raw numeric price based on active currency
    getNumericPrice: (product, isOriginal = false) => {
      const { currency } = get();
      if (!product) return 0;
      if (currency === "USD") {
        if (isOriginal) {
          return product.originalPriceUSD || (product.originalPrice ? Math.round(product.originalPrice / 280) : 0);
        }
        return product.priceUSD || (product.price ? Math.round(product.price / 280) : 0);
      } else {
        return isOriginal ? (product.originalPrice || 0) : (product.price || 0);
      }
    }
  })
);
