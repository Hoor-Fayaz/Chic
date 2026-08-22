"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useCurrencyStore } from "@/store/currencyStore";

export default function AuthHydrator() {
  const loadAuth = useAuthStore((state) => state.loadAuth);
  const initCurrency = useCurrencyStore((state) => state.initCurrency);

  useEffect(() => {
    loadAuth();
    initCurrency();
  }, []);

  return null;
}

