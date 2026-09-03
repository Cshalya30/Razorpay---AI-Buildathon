import React from "react";
import { StripeNodeFlow } from "../components/visual/StripeNodeFlow";
import { LinearIsometricCards } from "../components/visual/LinearIsometricCards";
import { motion } from "framer-motion";
import { FlowArrow, ShieldCheck, Cpu } from "@phosphor-icons/react";

export const EngineRoom: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="p-8 max-w-7xl mx-auto space-y-8"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[#DDD8CC]">
        <div>
          <div className="flex items-center gap-2 mb-1 text-[11px] font-mono text-[#2B4C7E]">
            <FlowArrow size={16} weight="bold" />
            <span>SYSTEM ARCHITECTURE &amp; OPERATING SPECIFICATIONS</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#1B1B18] tracking-tight">
            Architectural Blueprint &amp; System Flow
          </h1>
          <p className="text-[13px] text-[#6B6558] font-sans mt-1 max-w-3xl">
            Technical specifications for the RECOVER agent: deterministic central bank compliance gating, calibrated gradient-boosted timing, and sub-15ms decision latency.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-[#0F6B5C]/10 border border-[#0F6B5C]/30 text-[#0F6B5C] font-mono text-[11px] font-semibold">
            KERNEL v2.4 // DETERMINISTIC
          </span>
        </div>
      </div>

      {/* 1. Connected Architecture Node Flow (Image 5) */}
      <div>
        <div className="text-[11px] font-mono text-[#6B6558] uppercase tracking-wider mb-3">
          Autonomous Decision Pipeline (End-to-End)
        </div>
        <StripeNodeFlow />
      </div>

      {/* 2. Linear Isometric Blueprints (Image 1) */}
      <div>
        <div className="text-[11px] font-mono text-[#6B6558] uppercase tracking-wider mb-3">
          Core Engineering Pillars (Linear FIG 0.1 - 0.3)
        </div>
        <LinearIsometricCards />
      </div>
    </motion.div>
  );
};
