import { create } from "zustand";

export const useToastStore = create((set) => ({
  toasts: [],

  /**
   * Show a toast message
   * @param {string} message - The text to display
   * @param {'success' | 'error' | 'info'} type - Toast style
   * @param {number} duration - Auto-dismiss time (ms)
   */
  showToast: (message, type = "info", duration = 3000) => {
    const id = Date.now();
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }]
    }));

    // Auto-remove after duration
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id)
      }));
    }, duration);
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    }));
  }
}));
