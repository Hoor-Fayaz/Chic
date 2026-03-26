"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export default function AuthHydrator() {
  const loadAuth = useAuthStore((state) => state.loadAuth);

  useEffect(() => {
    console.log("Hydrating auth...");
    loadAuth();
  }, []);

  return null;
}