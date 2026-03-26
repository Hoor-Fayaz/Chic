"use client";

import { useToastStore } from "@/store/toastStore";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function Toast() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-24 right-6 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Entrance animation trigger
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const icons = {
    success: <CheckCircle className="text-green-500" size={18} />,
    error: <AlertCircle className="text-red-500" size={18} />,
    info: <Info className="text-blue-500" size={18} />,
  };

  const bgStyles = {
    success: "bg-white/90 border-green-100",
    error: "bg-white/90 border-red-100",
    info: "bg-white/90 border-blue-100",
  };

  return (
    <div
      className={`
        pointer-events-auto flex items-center gap-3 p-4 rounded-2xl border shadow-xl backdrop-blur-md transition-all duration-500 ease-out
        ${bgStyles[toast.type] || "bg-white/90 border-gray-100"}
        ${isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}
      `}
    >
      <div className="flex-shrink-0">{icons[toast.type] || icons.info}</div>
      <div className="flex-1">
        <p className="text-xs font-bold text-gray-900 leading-tight uppercase tracking-wider">
            {toast.type === 'error' ? 'Error' : toast.type === 'success' ? 'Success' : 'Notice'}
        </p>
        <p className="text-[13px] text-gray-600 font-medium mt-0.5">{toast.message}</p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-400"
      >
        <X size={14} />
      </button>
    </div>
  );
}
