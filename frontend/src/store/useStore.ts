import { create } from "zustand";
import { LedgerMetrics, EvalComparison, NavTab } from "../types";

export interface ToastItem {
  id: string;
  type: "success" | "info" | "warning";
  message: string;
}

interface AppState {
  activeNav: NavTab;
  setActiveNav: (nav: NavTab) => void;

  selectedMandateId: string | null;
  setSelectedMandate: (id: string | null) => void;

  detailDrawerOpen: boolean;
  setDetailDrawerOpen: (open: boolean) => void;

  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;

  metrics: LedgerMetrics | null;
  setMetrics: (metrics: LedgerMetrics) => void;

  evalComparison: EvalComparison | null;
  setEvalComparison: (comp: EvalComparison) => void;

  toasts: ToastItem[];
  addToast: (message: string, type?: "success" | "info" | "warning") => void;
  removeToast: (id: string) => void;

  isDarkMode: boolean;
  toggleDarkMode: () => void;

  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;

  liveSyncActive: boolean;
  toggleLiveSync: () => void;

  splashOpen: boolean;
  setSplashOpen: (open: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  activeNav: "ledger",
  setActiveNav: (nav) => set({ activeNav: nav }),

  selectedMandateId: null,
  setSelectedMandate: (id) => set({ selectedMandateId: id, detailDrawerOpen: !!id }),

  detailDrawerOpen: false,
  setDetailDrawerOpen: (open) => set({ detailDrawerOpen: open }),

  commandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

  mobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

  liveSyncActive: true,
  toggleLiveSync: () => set((state) => ({ liveSyncActive: !state.liveSyncActive })),

  splashOpen: typeof window !== "undefined" ? !sessionStorage.getItem("rebound_splash_dismissed") : false,
  setSplashOpen: (open) => set({ splashOpen: open }),

  metrics: null,
  setMetrics: (metrics) => set({ metrics }),

  evalComparison: null,
  setEvalComparison: (comp) => set({ evalComparison: comp }),

  isDarkMode: typeof window !== "undefined" ? localStorage.getItem("recover_theme") === "dark" : false,
  toggleDarkMode: () => set((state) => {
    const next = !state.isDarkMode;
    if (typeof window !== "undefined") {
      localStorage.setItem("recover_theme", next ? "dark" : "light");
      if (next) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
    return { isDarkMode: next };
  }),

  toasts: [],
  addToast: (message, type = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { id, type, message }]
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id)
      }));
    }, 4000);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    }))
}));
