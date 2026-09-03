import { create } from "zustand";
import { LedgerMetrics, EvalComparison } from "../types";

export interface ToastItem {
  id: string;
  type: "success" | "info" | "warning";
  message: string;
}

interface AppState {
  activeNav: "ledger" | "retries" | "compliance" | "eval";
  setActiveNav: (nav: "ledger" | "retries" | "compliance" | "eval") => void;

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

  metrics: null,
  setMetrics: (metrics) => set({ metrics }),

  evalComparison: null,
  setEvalComparison: (comp) => set({ evalComparison: comp }),

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
