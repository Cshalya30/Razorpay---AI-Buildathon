import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  Cpu, 
  Database, 
  Broadcast,
  CheckCircle,
  CurrencyInr,
  Clock,
  ArrowUpRight,
  HardDrives,
  LockKey
} from "@phosphor-icons/react";

interface SubsystemDetail {
  title: string;
  category: string;
  status: string;
  latency: string;
  description: string;
  stats: { label: string; value: string }[];
}

export const StripeNodeFlow: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string>("recover");

  const subsystemDetails: Record<string, SubsystemDetail> = {
    "recover": {
      title: "RECOVER Autonomous Orchestrator",
      category: "CORE AGENT KERNEL",
      status: "ACTIVE CLUSTER",
      latency: "14ms end-to-end",
      description: "Autonomous decision kernel synchronizing central bank deterministic statutory compliance with 8-feature calibrated machine learning liquidity forecasting.",
      stats: [
        { label: "Portfolio Clearance Rate", value: "98.7%" },
        { label: "Incremental Lift Captured", value: "+?2,92,732" },
        { label: "Monitored Mandates", value: "320 active" },
        { label: "Execution Latency", value: "14ms" }
      ]
    },
    "crm": {
      title: "CRM & Enterprise Ingestion",
      category: "INBOUND STREAM",
      status: "HEALTHY",
      latency: "2ms",
      description: "Real-time webhook listener consuming bank decline events (U30 Insufficient Funds, U69 Limit Exceeded). Prepares stateful audit log.",
      stats: [
        { label: "Event Ingestion Rate", value: "1,240 evt/sec" },
        { label: "Payload Parse Time", value: "1.4ms" },
        { label: "Supported Inbound Rails", value: "Webhooks, Kafka, REST" },
        { label: "Data Integrity", value: "100% SHA-256 verified" }
      ]
    },
    "subscriptions": {
      title: "Recurring Billing / Subscription Ledger",
      category: "ASSET CLASSIFIER",
      status: "ONLINE",
      latency: "1ms",
      description: "Classifies recurring mandates into statutory asset tiers: Insurance Premiums, Mutual Fund SIPs, Credit Card Bills, and OTT Subscriptions.",
      stats: [
        { label: "Indexed Categories", value: "4 asset tiers" },
        { label: "Insurance Clearance", value: "100.0% settled" },
        { label: "SIP Clearance", value: "99.2% settled" },
        { label: "Subscription Clearance", value: "96.4% settled" }
      ]
    },
    "compliance": {
      title: "Statutory RBI Shield (Compliance Hub)",
      category: "DETERMINISTIC GATE",
      status: "ENFORCED",
      latency: "1ms",
      description: "Hard-coded central bank compliance engine. Evaluates 24-hour statutory notice lead time, enforces the ?15,000 AFA ceiling, and terminates retries at 4 attempts.",
      stats: [
        { label: "RBI Circular Compliance", value: "100% Gated" },
        { label: "24h Notice Verification", value: "91.2% compliant" },
        { label: "AFA ?15k Stops", value: "2 mandates held" },
        { label: "Anti-Harassment Cap", value: "1 escalated (4/4)" }
      ]
    },
    "pipeline": {
      title: "Neural Liquidity Timing Engine",
      category: "PREDICTIVE GBDT",
      status: "CALIBRATED",
      latency: "11ms",
      description: "8-feature calibrated gradient boosting evaluates customer cash flow cycles, burn-adjusted headroom, and salary arrival proximity to predict positive clearance day.",
      stats: [
        { label: "Holdout ROC-AUC", value: "0.9969" },
        { label: "PR-AUC Score", value: "0.9976" },
        { label: "Brier Calibration", value: "0.0192" },
        { label: "Target Recovery Window", value: "Day 5 (Salary Peak)" }
      ]
    },
    "switch": {
      title: "NPCI AutoPay Settlement Switch",
      category: "ACQUIRING DISPATCH",
      status: "EXECUTING",
      latency: "140ms",
      description: "Automated payment switch execution. Dispatches retry debit directly to the acquiring bank during the predicted high-liquidity window.",
      stats: [
        { label: "Settlement Success", value: "98.7% first-try" },
        { label: "Average Attempts Saved", value: "1.6 / mandate" },
        { label: "Customer Bounce Fees", value: "?0.00 incurred" },
        { label: "Bank Settlement RRN", value: "329849201948" }
      ]
    }
  };

  const active = subsystemDetails[selectedNode] || subsystemDetails["recover"];

  return (
    <div className="bg-[#070B19] text-white p-8 rounded-2xl border border-indigo-900/40 shadow-2xl mb-8 relative overflow-hidden font-sans">
      {/* Background Dot Matrix Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: "radial-gradient(#6366F1 1px, transparent 1px)",
          backgroundSize: "20px 20px"
        }}
      />

      {/* Ambient Blue Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-indigo-600/10 rounded-full blur-[110px] pointer-events-none" />

      {/* Header (Exact Typography from Stripe reference) */}
      <div className="max-w-3xl mb-8 relative z-10">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white leading-snug">
          Connect to existing systems.{" "}
          <span className="text-[#8E9DBE] font-normal">
            Orchestrate payments across UPI processors, enforce statutory compliance, and schedule retries via machine learning.
          </span>
        </h2>
      </div>

      {/* The Connected Node Diagram Canvas */}
      <div className="relative max-w-4xl mx-auto py-8 z-10">
        {/* SVG Conduit Rails & Traveling Light Particles */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 420" preserveAspectRatio="none">
          <defs>
            <linearGradient id="glowLine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#6366F1" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.4" />
            </linearGradient>

            <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Conduit 1: CRM (top-left) -> RECOVER Center */}
          <path id="path-crm" d="M 290 50 L 290 120 L 400 180" stroke="#3730A3" strokeWidth="2" strokeDasharray="4 6" fill="none" />
          <circle r="3.5" fill="#38BDF8" filter="url(#neonGlow)">
            <animateMotion dur="2.4s" repeatCount="indefinite" path="M 290 50 L 290 120 L 400 180" />
          </circle>

          {/* Conduit 2: Subscriptions (top-center) -> RECOVER Center */}
          <path id="path-sub" d="M 440 50 L 440 120 L 400 180" stroke="#3730A3" strokeWidth="2" strokeDasharray="4 6" fill="none" />
          <circle r="3.5" fill="#818CF8" filter="url(#neonGlow)">
            <animateMotion dur="2.0s" repeatCount="indefinite" path="M 440 50 L 440 120 L 400 180" />
          </circle>

          {/* Conduit 3: Booking System (top-right) -> RECOVER Center */}
          <path id="path-book" d="M 640 50 L 640 130 L 400 180" stroke="#3730A3" strokeWidth="2" strokeDasharray="4 6" fill="none" />
          <circle r="3.5" fill="#38BDF8" filter="url(#neonGlow)">
            <animateMotion dur="3.0s" repeatCount="indefinite" path="M 640 50 L 640 130 L 400 180" />
          </circle>

          {/* Conduit 4: RECOVER Center -> Left Compliance Hub */}
          <path id="path-comp" d="M 400 180 L 250 180" stroke="#3730A3" strokeWidth="2" strokeDasharray="4 6" fill="none" />
          <circle r="3.5" fill="#10B981" filter="url(#neonGlow)">
            <animateMotion dur="1.8s" repeatCount="indefinite" path="M 400 180 L 250 180" />
          </circle>

          {/* Conduit 5: RECOVER Center -> Right Neural Pipeline */}
          <path id="path-pipe" d="M 400 180 L 550 180" stroke="#3730A3" strokeWidth="2" strokeDasharray="4 6" fill="none" />
          <circle r="3.5" fill="#38BDF8" filter="url(#neonGlow)">
            <animateMotion dur="1.9s" repeatCount="indefinite" path="M 400 180 L 550 180" />
          </circle>

          {/* Conduit 6: RECOVER Center -> Down Orchestration -> Switches */}
          <path id="path-switch-l" d="M 400 230 L 400 290 L 370 340" stroke="#3730A3" strokeWidth="2" strokeDasharray="4 6" fill="none" />
          <circle r="3.5" fill="#38BDF8" filter="url(#neonGlow)">
            <animateMotion dur="2.2s" repeatCount="indefinite" path="M 400 230 L 400 290 L 370 340" />
          </circle>

          <path id="path-switch-r" d="M 400 230 L 400 290 L 430 340" stroke="#3730A3" strokeWidth="2" strokeDasharray="4 6" fill="none" />
          <circle r="3.5" fill="#10B981" filter="url(#neonGlow)">
            <animateMotion dur="2.2s" repeatCount="indefinite" path="M 400 230 L 400 290 L 430 340" />
          </circle>
        </svg>

        {/* TOP ROW: Inbound Systems */}
        <div className="flex items-center justify-center gap-3 md:gap-6 mb-16 relative z-10">
          <div className="w-12 h-9 border border-indigo-500/20 border-dashed rounded-lg hidden sm:block" />

          <button
            onClick={() => setSelectedNode("crm")}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all ${
              selectedNode === "crm"
                ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.6)] scale-105 border border-indigo-400"
                : "bg-[#141A33] hover:bg-[#1E254A] text-slate-300 border border-indigo-500/30"
            }`}
          >
            CRM
          </button>

          <button
            onClick={() => setSelectedNode("subscriptions")}
            className={`px-5 py-2 rounded-lg text-xs font-mono font-medium transition-all ${
              selectedNode === "subscriptions"
                ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.6)] scale-105 border border-indigo-400"
                : "bg-[#141A33] hover:bg-[#1E254A] text-slate-300 border border-indigo-500/30"
            }`}
          >
            Subscriptions
          </button>

          <div className="w-12 h-9 border border-indigo-500/20 border-dashed rounded-lg hidden sm:block" />

          <button
            onClick={() => setSelectedNode("crm")}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all ${
              selectedNode === "crm"
                ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.6)] scale-105 border border-indigo-400"
                : "bg-[#141A33] hover:bg-[#1E254A] text-slate-300 border border-indigo-500/30"
            }`}
          >
            Booking system
          </button>
        </div>

        {/* MIDDLE ROW: The Core Hub & Lateral Branches */}
        <div className="flex items-center justify-between relative z-10 px-4 md:px-12 my-6">
          {/* Left Branch: Compliance Hub with 2x2 Logo Grid */}
          <div className="flex items-center gap-3">
            {/* 2x2 Icon Grid */}
            <div className="grid grid-cols-2 gap-1.5 p-2 bg-[#0E1428] border border-indigo-500/30 rounded-xl shadow-lg">
              <div className="w-7 h-7 bg-emerald-500/20 border border-emerald-500/30 rounded flex items-center justify-center text-emerald-400">
                <ShieldCheck size={16} weight="bold" />
              </div>
              <div className="w-7 h-7 bg-sky-500/20 border border-sky-500/30 rounded flex items-center justify-center text-sky-400">
                <Clock size={16} weight="bold" />
              </div>
              <div className="w-7 h-7 bg-indigo-500/20 border border-indigo-500/30 rounded flex items-center justify-center text-indigo-400">
                <CurrencyInr size={16} weight="bold" />
              </div>
              <div className="w-7 h-7 bg-amber-500/20 border border-amber-500/30 rounded flex items-center justify-center text-amber-400">
                <LockKey size={16} weight="bold" />
              </div>
            </div>

            {/* Compliance Hub Pill Button */}
            <button
              onClick={() => setSelectedNode("compliance")}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-all ${
                selectedNode === "compliance"
                  ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.6)] scale-105 border border-indigo-400"
                  : "bg-[#141A33] hover:bg-[#1E254A] text-slate-300 border border-indigo-500/30"
              }`}
            >
              <span>Statutory Shield</span>
              <ArrowUpRight size={13} className="text-emerald-400" />
            </button>
          </div>

          {/* CENTER HUB: RECOVER ORCHESTRATOR */}
          <button
            onClick={() => setSelectedNode("recover")}
            className={`w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 border-2 transition-all flex flex-col items-center justify-center shadow-2xl relative group ${
              selectedNode === "recover"
                ? "border-indigo-300 shadow-[0_0_35px_rgba(99,102,241,0.7)] scale-110"
                : "border-indigo-400/50 hover:border-indigo-300 hover:shadow-[0_0_25px_rgba(99,102,241,0.5)]"
            }`}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping absolute top-2 right-2" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute top-2 right-2" />
            <span className="font-mono font-extrabold text-white text-base tracking-wider uppercase">
              recover
            </span>
            <span className="text-[9px] font-mono text-indigo-200 mt-0.5">
              AGENT v2.4
            </span>
          </button>

          {/* Right Branch: Neural Engine with DB Cylinders */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedNode("pipeline")}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-all ${
                selectedNode === "pipeline"
                  ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.6)] scale-105 border border-indigo-400"
                  : "bg-[#141A33] hover:bg-[#1E254A] text-slate-300 border border-indigo-500/30"
              }`}
            >
              <span>Neural Pipeline</span>
            </button>

            {/* Cylinder Database Icon Container */}
            <div className="w-10 h-10 bg-[#0E1428] border border-indigo-500/30 rounded-xl flex items-center justify-center text-sky-400 shadow-lg">
              <HardDrives size={20} weight="fill" />
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: Orchestration & Switch Execution */}
        <div className="flex flex-col items-center mt-12 relative z-10">
          <button
            onClick={() => setSelectedNode("switch")}
            className={`px-4 py-1.5 rounded-lg text-xs font-mono font-semibold mb-6 transition-all ${
              selectedNode === "switch"
                ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.6)] border border-indigo-400"
                : "bg-[#141A33] hover:bg-[#1E254A] text-slate-300 border border-indigo-500/30"
            }`}
          >
            Orchestration Switch
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedNode("switch")}
              className="px-4 py-1.5 bg-[#0E1428] border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>NPCI AutoPay</span>
            </button>

            <button
              onClick={() => setSelectedNode("switch")}
              className="px-4 py-1.5 bg-[#0E1428] border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Bank Gateway</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Subsystem Telemetry Drawer Below */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active.title}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className="mt-8 p-6 bg-[#0E1428]/90 border border-indigo-500/30 rounded-xl relative z-10 backdrop-blur-md"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-indigo-900/50 mb-3">
            <div>
              <div className="text-[10px] font-mono text-indigo-400 tracking-wider uppercase font-bold">
                {active.category} // TELEMETRY
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5">
                {active.title}
              </h3>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
                {active.status}
              </span>
              <span className="text-slate-400">
                LATENCY: <strong className="text-sky-400">{active.latency}</strong>
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-4 max-w-3xl">
            {active.description}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-indigo-900/40">
            {active.stats.map((st, i) => (
              <div key={i} className="p-2.5 bg-[#090D1C] rounded border border-indigo-950">
                <div className="text-[10px] font-mono text-slate-400">{st.label}</div>
                <div className="text-xs font-mono font-bold text-white mt-0.5">{st.value}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
