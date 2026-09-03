import { create } from "zustand";
import { LedgerMetrics, EvalComparison } from "../types";

interface AppState {
  selectedMandateId: string | null;
  detailDrawerOpen: boolean;
  activeNav: 'ledger' | 'retries' | 'compliance' | 'eval';
  metrics: LedgerMetrics | null;
  evalComparison: EvalComparison | null;
  isSimulating: boolean;

  setSelectedMandate: (id: string | null) => void;
  setDetailDrawerOpen: (open: boolean) => void;
  setActiveNav: (nav: 'ledger' | 'retries' | 'compliance' | 'eval') => void;
  setMetrics: (metrics: LedgerMetrics) => void;
  setEvalComparison: (comp: EvalComparison) => void;
  setIsSimulating: (val: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  selectedMandateId: null,
  detailDrawerOpen: false,
  activeNav: 'ledger',
  metrics: null,
  evalComparison: null,
  isSimulating: false,

  setSelectedMandate: (id) => set({ selectedMandateId: id, detailDrawerOpen: !!id }),
  setDetailDrawerOpen: (open) => set((state) => ({ detailDrawerOpen: open, selectedMandateId: open ? state.selectedMandateId : null })),
  setActiveNav: (nav) => set({ activeNav: nav }),
  setMetrics: (metrics) => set({ metrics }),
  setEvalComparison: (evalComparison) => set({ evalComparison }),
  setIsSimulating: (isSimulating) => set({ isSimulating })
}));
