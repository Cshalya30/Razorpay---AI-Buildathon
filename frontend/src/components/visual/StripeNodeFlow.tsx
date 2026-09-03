import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Cpu, 
  Database, 
  ArrowsSplit, 
  Broadcast,
  CheckCircle,
  CurrencyInr,
  Clock
} from "@phosphor-icons/react";

interface NodeItem {
  id: string;
  name: string;
  category: "ingest" | "orchestrator" | "gate" | "timing" | "switch";
  description: string;
  metrics: string;
  status: "active" | "ready";
}

export const StripeNodeFlow: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>("recover-core");

  const nodes: Record<string, NodeItem> = {
    "crm": {
      id: "crm",
      name: "CRM / Billing Ingest",
      category: "ingest",
      description: "Captures UPI AutoPay debit failure events (U30 Insufficient Funds, U69 Limit Exceeded) in real-time via webhook listener.",
      metrics: "320 mandates monitored // Sub-2ms ingestion",
      status: "active"
    },
    "subscriptions": {
      id: "subscriptions",
      name: "Subscription Ledger",
      category: "ingest",
      description: "Classifies mandates across 4 statutory asset tiers: Insurance, Mutual Fund SIPs, Credit Card Bills, and OTT Subscriptions.",
      metrics: "4 asset classes indexed",
      status: "active"
    },
    "recover-core": {
      id: "recover-core",
      name: "RECOVER Orchestrator",
      category: "orchestrator",
      description: "The autonomous agent kernel. Synchronizes statutory rule evaluation with machine learning liquidity timing across 30 cycle days.",
      metrics: "v2.4-deterministic // 14ms total decision latency",
      status: "active"
    },
    "rbi-gate": {
      id: "rbi-gate",
      name: "Statutory RBI Shield",
      category: "gate",
      description: "Hard-coded compliance engine. Verifies the 24-hour statutory pre-debit notice lead time, enforces the ?15,000 AFA ceiling, and halts at 4 failed attempts.",
      metrics: "100% compliance rate // 0 central bank violations",
      status: "active"
    },
    "ml-timing": {
      id: "ml-timing",
      name: "Neural Liquidity Engine",
      category: "timing",
      description: "8-feature calibrated gradient boosting evaluates daily burn-adjusted headroom, salary arrival dates, and amount-to-inflow ratios to forecast the exact positive clearance day.",
      metrics: "ROC-AUC: 0.9969 // 98.7% first-retry recovery",
      status: "active"
    },
    "npci-switch": {
      id: "npci-switch",
      name: "NPCI / AutoPay Switch",
      category: "switch",
      description: "Automated payment switch execution. Dispatches retry debit directly to the acquiring bank during the predicted high-liquidity salary window.",
      metrics: "140ms switch execution // +?2,92,732 recovered",
      status: "active"
    }
  };

  const active = nodes[selectedNodeId] || nodes["recover-core"];

  return (
    <div className="bg-[#101524] text-white p-8 rounded-xl border border-[#DDD8CC]/30 shadow-card mb-8 relative overflow-hidden">
      {/* Background dot grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      {/* Header */}
      <div className="max-w-3xl mb-8 relative z-10">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white font-sans">
          Connect to existing systems. <span className="text-[#6888C8] font-normal">Orchestrate payments across UPI processors, enforce statutory compliance, and schedule retries via machine learning.</span>
        </h2>
      </div>

      {/* Interactive Connected Node Diagram */}
      <div className="relative py-6 max-w-4xl mx-auto z-10">
        {/* Tier 1: Ingestion Sources */}
        <div className="flex justify-center gap-4 mb-10">
          <button
            onClick={() => setSelectedNodeId("crm")}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-medium border transition-all ${
              selectedNodeId === "crm"
                ? "bg-[#253252] border-[#4E71BA] text-white shadow-lg scale-105"
                : "bg-[#181F33] border-white/10 text-slate-300 hover:border-white/25"
            }`}
          >
            CRM / Ingestion
          </button>
          <button
            onClick={() => setSelectedNodeId("subscriptions")}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-medium border transition-all ${
              selectedNodeId === "subscriptions"
                ? "bg-[#253252] border-[#4E71BA] text-white shadow-lg scale-105"
                : "bg-[#181F33] border-white/10 text-slate-300 hover:border-white/25"
            }`}
          >
            Subscriptions
          </button>
          <div className="px-4 py-2 rounded-lg text-xs font-mono text-slate-500 border border-white/5 bg-[#141A2B] hidden md:block">
            Event Destinations
          </div>
          <div className="px-4 py-2 rounded-lg text-xs font-mono text-slate-500 border border-white/5 bg-[#141A2B] hidden md:block">
            Banking Webhooks
          </div>
        </div>

        {/* Conduit SVG Lines to Center */}
        <div className="relative flex justify-center mb-6">
          <svg className="w-96 h-12 overflow-visible" viewBox="0 0 384 48">
            <path d="M 96 0 L 192 48" stroke="#3A4D7A" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
            <path d="M 288 0 L 192 48" stroke="#3A4D7A" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
            <circle cx="192" cy="48" r="4" fill="#6366F1" />
          </svg>
        </div>

        {/* Tier 2: Core Orchestrator */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setSelectedNodeId("recover-core")}
            className={`px-8 py-3.5 rounded-xl font-mono font-bold text-sm border transition-all shadow-xl ${
              selectedNodeId === "recover-core"
                ? "bg-indigo-600 border-indigo-400 text-white scale-105"
                : "bg-[#1F2742] border-indigo-500/40 text-white hover:border-indigo-400"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>RECOVER Orchestrator</span>
            </div>
          </button>
        </div>

        {/* Conduit SVG Lines from Center to Dual Engines */}
        <div className="relative flex justify-center mb-6">
          <svg className="w-96 h-12 overflow-visible" viewBox="0 0 384 48">
            <path d="M 192 0 L 96 48" stroke="#3A4D7A" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
            <path d="M 192 0 L 288 48" stroke="#3A4D7A" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
          </svg>
        </div>

        {/* Tier 3: Dual Execution Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
          {/* Pillar 1: RBI Statutory Shield */}
          <button
            onClick={() => setSelectedNodeId("rbi-gate")}
            className={`p-4 rounded-xl border text-left transition-all ${
              selectedNodeId === "rbi-gate"
                ? "bg-[#182C27] border-emerald-500 text-white shadow-lg scale-105"
                : "bg-[#13201D] border-emerald-500/30 text-emerald-300 hover:border-emerald-500/60"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck size={18} className="text-emerald-400" weight="bold" />
              <span className="font-mono font-bold text-xs uppercase tracking-wider text-emerald-400">
                Deterministic Gate
              </span>
            </div>
            <div className="font-sans font-bold text-sm text-white">Statutory RBI Shield</div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">24h notice ? ?15k AFA ? 4-Cap</div>
          </button>

          {/* Pillar 2: Neural Timing Engine */}
          <button
            onClick={() => setSelectedNodeId("ml-timing")}
            className={`p-4 rounded-xl border text-left transition-all ${
              selectedNodeId === "ml-timing"
                ? "bg-[#182740] border-sky-400 text-white shadow-lg scale-105"
                : "bg-[#131D30] border-sky-500/30 text-sky-300 hover:border-sky-500/60"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Cpu size={18} className="text-sky-400" weight="bold" />
              <span className="font-mono font-bold text-xs uppercase tracking-wider text-sky-400">
                Predictive AI
              </span>
            </div>
            <div className="font-sans font-bold text-sm text-white">Neural Liquidity Engine</div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">Salary proximity &amp; daily burn</div>
          </button>
        </div>

        {/* Conduit to Settlement Switch */}
        <div className="relative flex justify-center mb-6">
          <svg className="w-96 h-10 overflow-visible" viewBox="0 0 384 40">
            <path d="M 96 0 L 192 40" stroke="#3A4D7A" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
            <path d="M 288 0 L 192 40" stroke="#3A4D7A" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
            <circle cx="192" cy="40" r="3" fill="#10B981" />
          </svg>
        </div>

        {/* Tier 4: Switch Execution */}
        <div className="flex justify-center">
          <button
            onClick={() => setSelectedNodeId("npci-switch")}
            className={`px-6 py-2.5 rounded-xl font-mono text-xs font-semibold border transition-all ${
              selectedNodeId === "npci-switch"
                ? "bg-emerald-600 border-emerald-400 text-white shadow-lg scale-105"
                : "bg-[#162721] border-emerald-500/40 text-emerald-300 hover:border-emerald-400"
            }`}
          >
            <div className="flex items-center gap-2">
              <CurrencyInr size={14} weight="bold" />
              <span>NPCI AutoPay Switch Execution</span>
            </div>
          </button>
        </div>
      </div>

      {/* Subsystem Telemetry Inspector Drawer */}
      <motion.div
        key={active.id}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        className="mt-8 p-5 bg-[#182136] rounded-xl border border-white/10 relative z-10"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10 mb-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#7997D6]">
              Subsystem Inspector
            </span>
            <h4 className="text-base font-bold text-white font-sans mt-0.5">
              {active.name}
            </h4>
          </div>

          <div className="text-right font-mono text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
            {active.metrics}
          </div>
        </div>

        <p className="text-xs text-slate-300 font-sans leading-relaxed">
          {active.description}
        </p>
      </motion.div>
    </div>
  );
};
