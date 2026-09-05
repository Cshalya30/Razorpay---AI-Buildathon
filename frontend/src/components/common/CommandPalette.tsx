import React, { useEffect, useState, useRef } from "react";
import { useStore } from "../../store/useStore";
import { api, downloadAuditCsv } from "../../api/client";
import { Mandate } from "../../types";
import { 
  MagnifyingGlass, 
  Play, 
  ShieldCheck, 
  ChartBar, 
  ClockCountdown, 
  DownloadSimple, 
  ArrowRight,
  Command,
  X
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

export const CommandPalette: React.FC = () => {
  const { 
    commandPaletteOpen, 
    setCommandPaletteOpen, 
    setSelectedMandate, 
    setActiveNav,
    addToast 
  } = useStore();

  const [query, setQuery] = useState<string>("");
  const [mandates, setMandates] = useState<Mandate[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      } else if (e.key === "Escape" && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [commandPaletteOpen]);

  useEffect(() => {
    if (commandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      api.getMandates({ limit: 100 }).then(data => {
        setMandates(data.mandates);
      }).catch(() => {});
    } else {
      setQuery("");
    }
  }, [commandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const filteredMandates = mandates.filter(m => {
    if (!query.trim()) return false;
    const q = query.toLowerCase();
    return (
      m.id.toLowerCase().includes(q) ||
      (m.customer_name ? m.customer_name.toLowerCase().includes(q) : false) ||
      m.merchant_name.toLowerCase().includes(q) ||
      (m.upi_handle ? m.upi_handle.toLowerCase().includes(q) : false)
    );
  }).slice(0, 5);

  const demoScenarios = [
    { id: "MDT-1001", title: "Scenario 1: Core Win", desc: "Netflix ₹499 ? Day 5 Salary Match" },
    { id: "MDT-1002", title: "Scenario 2: AFA Gate", desc: "AWS ₹18,000 ? Stopped (>₹15k non-exempt)" },
    { id: "MDT-1003", title: "Scenario 3: Honest Limit", desc: "Cult.fit ₹1,199 ? Retried & Failed Again" },
    { id: "MDT-1004", title: "Scenario 4: Retry Cap", desc: "Spotify ₹119 ? Escalated (4/4 limit)" },
    { id: "MDT-1005", title: "Scenario 5: Churn Respect", desc: "Amazon Prime ₹1,499 ? Revoked Stopped" },
  ];

  const handleSelectMandate = (id: string) => {
    setSelectedMandate(id);
    setCommandPaletteOpen(false);
    addToast(`Opened Mandate ${id} in detail drawer`, "info");
  };

  const handleAction = async (action: string) => {
    setCommandPaletteOpen(false);
    if (action === "batch") {
      setActiveNav("retries");
      const res = await api.batchExecuteRetries();
      addToast(`Batch executed: ${res.recoveredCount}/${res.totalExecuted} recovered (+₹${res.recoveredAmount.toLocaleString('en-IN')})`, "success");
    } else if (action === "export") {
      downloadAuditCsv();
      addToast("Downloaded RBI statutory audit CSV directly!", "success");
    } else if (action === "eval") {
      setActiveNav("eval");
      addToast("Switched to Evaluation & Benchmark Report", "info");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setCommandPaletteOpen(false)}
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px]"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.98 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="relative w-full max-w-xl bg-white border border-[#DDD8CC] shadow-modal overflow-hidden z-10"
      >
        {/* Search Header */}
        <div className="p-3.5 border-b border-[#DDD8CC] flex items-center gap-3 bg-[#EDEAE2]/30">
          <MagnifyingGlass size={18} className="text-[#6B6558] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a mandate ID, merchant, customer, or action..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-[13px] text-[#1B1B18] placeholder-[#A39C8D] focus:outline-none font-sans"
          />
          <div className="flex items-center gap-1 text-[11px] font-mono text-[#6B6558] bg-white px-1.5 py-0.5 border border-[#DDD8CC] rounded-sm">
            <span>ESC</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-[#DDD8CC]/50 text-[12px]">
          {/* Query Results */}
          {filteredMandates.length > 0 && (
            <div className="py-2">
              <div className="px-3 pb-1 text-[10px] font-mono text-[#6B6558] uppercase">
                Matching Mandates
              </div>
              {filteredMandates.map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleSelectMandate(m.id)}
                  className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#EDEAE2]/60 rounded-sm transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-[#1B1B18]">{m.id}</span>
                    <span className="text-[#6B6558]">{m.customer_name}</span>
                    <span className="text-[11px] font-mono text-[#A39C8D]">? {m.merchant_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-[#1B1B18]">₹{m.mandate_amount.toLocaleString("en-IN")}</span>
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 text-[#2B4C7E] transition-opacity" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Quick Demo Scenarios */}
          <div className="py-2">
            <div className="px-3 pb-1 text-[10px] font-mono text-[#6B6558] uppercase">
              Core Demo Scenarios (PRD Part 9)
            </div>
            {demoScenarios.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSelectMandate(s.id)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-left hover:bg-[#EDEAE2]/60 rounded-sm transition-colors group"
              >
                <div className="flex items-center gap-2.5 font-mono">
                  <span className="px-1.5 py-0.5 bg-[#1B1B18] text-white text-[10px] font-bold">{s.id}</span>
                  <span className="font-sans font-medium text-[#1B1B18]">{s.title}</span>
                  <span className="text-[#6B6558] text-[11px]">({s.desc})</span>
                </div>
                <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 text-[#2B4C7E] transition-opacity" />
              </button>
            ))}
          </div>

          {/* Fast Actions */}
          <div className="py-2">
            <div className="px-3 pb-1 text-[10px] font-mono text-[#6B6558] uppercase">
              Operator Actions
            </div>
            <button
              onClick={() => handleAction("batch")}
              className="w-full flex items-center justify-between px-3 py-1.5 text-left hover:bg-[#EDEAE2]/60 rounded-sm transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Play size={14} className="text-[#0F6B5C]" weight="fill" />
                <span className="font-medium text-[#1B1B18]">Simulate Batch Debits for Queue</span>
              </div>
              <span className="text-[10px] font-mono text-[#0F6B5C]">Run Model Debit</span>
            </button>

            <button
              onClick={() => handleAction("export")}
              className="w-full flex items-center justify-between px-3 py-1.5 text-left hover:bg-[#EDEAE2]/60 rounded-sm transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <DownloadSimple size={14} className="text-[#1B1B18]" />
                <span className="font-medium text-[#1B1B18]">Download RBI Statutory Audit Trail</span>
              </div>
              <span className="text-[10px] font-mono text-[#6B6558]">CSV File</span>
            </button>

            <button
              onClick={() => handleAction("eval")}
              className="w-full flex items-center justify-between px-3 py-1.5 text-left hover:bg-[#EDEAE2]/60 rounded-sm transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <ChartBar size={14} className="text-[#2B4C7E]" />
                <span className="font-medium text-[#1B1B18]">View Full Policy Benchmark &amp; Telemetry</span>
              </div>
              <span className="text-[10px] font-mono text-[#2B4C7E]">ROC-AUC 0.9969</span>
            </button>
          </div>
        </div>

        {/* Footer Shortcut Hints */}
        <div className="p-2.5 bg-[#EDEAE2]/40 border-t border-[#DDD8CC] flex items-center justify-between text-[11px] font-mono text-[#6B6558]">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <div>REBOUND AGENT • OPERATOR PALETTE</div>
        </div>
      </motion.div>
    </div>
  );
};
