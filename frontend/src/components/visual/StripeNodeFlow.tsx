import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Cpu, 
  Database, 
  ArrowRight,
  CheckCircle,
  CurrencyInr,
  Clock,
  Code,
  Broadcast
} from "@phosphor-icons/react";

interface PipelineStage {
  id: string;
  step: string;
  title: string;
  badge: string;
  latency: string;
  status: "ONLINE" | "GATED" | "ACTIVE";
  summary: string;
  dataPoints: { label: string; value: string; pass?: boolean }[];
  technicalNote: string;
}

export const StripeNodeFlow: React.FC = () => {
  const [activeStageId, setActiveStageId] = useState<string>("stage-2");

  const stages: PipelineStage[] = [
    {
      id: "stage-1",
      step: "01",
      title: "Decline Webhook Ingestion",
      badge: "NPCI RAIL",
      latency: "2ms",
      status: "ONLINE",
      summary: "Captures initial AutoPay debit decline payload directly from bank acquiring gateway.",
      dataPoints: [
        { label: "Decline Code", value: "U30 (Insufficient Balance)" },
        { label: "Bank Reference (RRN)", value: "329849201948" },
        { label: "Cycle Day Elapsed", value: "Day 5 of 30" },
        { label: "Initial Debit Time", value: "09:14:22 IST" }
      ],
      technicalNote: "Stores immutable transaction state before routing to statutory gating. Preserves original mandate audit history."
    },
    {
      id: "stage-2",
      step: "02",
      title: "Deterministic Statutory Shield",
      badge: "RBI DPSS/2021-22/68",
      latency: "1ms",
      status: "GATED",
      summary: "Hard-coded central bank compliance checks that can never be overridden by machine learning.",
      dataPoints: [
        { label: "24h Pre-Debit Notice", value: "26.4h Lead Time", pass: true },
        { label: "AFA ?15,000 Threshold", value: "?1,499.00 (Exempt/Below)", pass: true },
        { label: "Anti-Harassment Cap", value: "Attempt 2 of 4 Allowed", pass: true },
        { label: "Revocation Registry", value: "Active Mandate (No Churn)", pass: true }
      ],
      technicalNote: "Strict short-circuit evaluation: if notice lead < 24h or attempts >= 4, retry is immediately halted or rescheduled."
    },
    {
      id: "stage-3",
      step: "03",
      title: "Neural Liquidity Timing Engine",
      badge: "LIGHTGBM REGRESSOR",
      latency: "11ms",
      status: "ACTIVE",
      summary: "8-feature calibrated gradient boosting calculates the exact cycle day customer has positive cash headroom.",
      dataPoints: [
        { label: "Burn-Adjusted Headroom", value: "+?14,200 (85.8% wt)" },
        { label: "Salary Day Proximity", value: "0 days (Day 5 Inflow Peak)" },
        { label: "Amount-to-Inflow Ratio", value: "0.032 (Low Friction)" },
        { label: "Predicted Clearance", value: "P = 98.7% (High Confidence)" }
      ],
      technicalNote: "Evaluates discrete probability distribution across all 30 cycle days, picking the earliest day where P(Success) ? 75%."
    },
    {
      id: "stage-4",
      step: "04",
      title: "AutoPay Settlement Dispatch",
      badge: "SETTLEMENT SWITCH",
      latency: "140ms",
      status: "ONLINE",
      summary: "Dispatches automated retry debit request through payment gateway switch directly during the liquidity window.",
      dataPoints: [
        { label: "Scheduled Dispatch", value: "Day 5, 14:00 IST" },
        { label: "Acquiring Settlement", value: "HDFC0000060 -> Settled" },
        { label: "Net Financial Recovery", value: "+?2,92,732 (Portfolio)" },
        { label: "Customer Bounce Fees", value: "?0.00 (Avoided)" }
      ],
      technicalNote: "Returns real-time WebSocket recovery event to the merchant dashboard and issues settled receipt to subscriber."
    }
  ];

  const activeStage = stages.find(s => s.id === activeStageId) || stages[1];

  return (
    <div className="bg-white border border-[#DDD8CC] p-6 shadow-card mb-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-[#DDD8CC] mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold text-[#2B4C7E] tracking-widest uppercase">
              AUTONOMOUS RECOVERY PIPELINE // SYSTEM ARCHITECTURE
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#0F6B5C]" />
            <span className="text-[10px] font-mono text-[#0F6B5C] font-semibold">ALL GATES ACTIVE</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#1B1B18] tracking-tight">
            End-to-End Decision Architecture &amp; Execution Rails
          </h2>
          <p className="text-[13px] text-[#6B6558] font-sans mt-0.5 max-w-2xl">
            Real-time synchronization between bank decline webhook ingestion, deterministic RBI statutory gating, and 8-feature calibrated liquidity timing.
          </p>
        </div>

        <div className="text-right font-mono text-xs text-[#6B6558] bg-[#F6F4EE] px-3 py-1.5 border border-[#DDD8CC]">
          <div>TOTAL PIPELINE LATENCY</div>
          <div className="text-[#0F6B5C] font-bold text-sm">14ms End-to-End</div>
        </div>
      </div>

      {/* 4 Connected Pipeline Stages (Light, Architectural, Human-Engineered) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stages.map((st) => {
          const isSelected = activeStageId === st.id;
          return (
            <button
              key={st.id}
              onClick={() => setActiveStageId(st.id)}
              className={`p-4 border text-left transition-all relative ${
                isSelected
                  ? "bg-[#F6F4EE] border-[#2B4C7E] shadow-sm ring-1 ring-[#2B4C7E]"
                  : "bg-white border-[#DDD8CC] hover:border-[#6B6558] hover:bg-[#FAF9F5]"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold text-[#2B4C7E]">
                  STAGE {st.step}
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 bg-[#EDEAE2] text-[#1B1B18] font-semibold">
                  {st.latency}
                </span>
              </div>

              <div className="font-sans font-bold text-[13px] text-[#1B1B18] leading-snug mb-1">
                {st.title}
              </div>

              <div className="text-[10px] font-mono text-[#6B6558]">
                {st.badge}
              </div>

              {isSelected && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#2B4C7E] rotate-45" />
              )}
            </button>
          );
        })}
      </div>

      {/* Deep Subsystem Telemetry Inspector (Light, Crisp, High-Craft) */}
      <motion.div
        key={activeStage.id}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        className="p-5 bg-[#FAF9F5] border border-[#DDD8CC]"
      >
        <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#DDD8CC] mb-4 gap-2">
          <div>
            <div className="text-[10px] font-mono font-bold text-[#2B4C7E] uppercase">
              Subsystem Inspector // Stage {activeStage.step}
            </div>
            <div className="text-base font-serif font-bold text-[#1B1B18] mt-0.5">
              {activeStage.title}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-[#6B6558]">STATUS:</span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#0F6B5C]/10 text-[#0F6B5C] border border-[#0F6B5C]/30">
              {activeStage.status} ({activeStage.latency})
            </span>
          </div>
        </div>

        {/* Real Data Points Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {activeStage.dataPoints.map((dp, idx) => (
            <div key={idx} className="p-3 bg-white border border-[#DDD8CC]">
              <div className="text-[10px] font-mono text-[#6B6558] mb-0.5">{dp.label}</div>
              <div className="font-mono text-[12px] font-bold text-[#1B1B18] flex items-center gap-1">
                {dp.pass && <CheckCircle size={13} className="text-[#0F6B5C]" weight="fill" />}
                <span>{dp.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Technical Rationale */}
        <div className="flex items-start gap-2 text-[12px] text-[#6B6558] font-sans pt-2 border-t border-[#DDD8CC]/60">
          <Code size={15} className="text-[#2B4C7E] shrink-0 mt-0.5" />
          <span><strong>Engineering Note:</strong> {activeStage.technicalNote}</span>
        </div>
      </motion.div>
    </div>
  );
};
