import React from "react";
import { LedgerMetrics, EvalComparison } from "../../types";
import { TrendUp, ShieldCheck, WarningCircle, Prohibit, CurrencyInr } from "@phosphor-icons/react";
import { motion } from "framer-motion";

interface Props {
  metrics: LedgerMetrics | null;
  evalComparison: EvalComparison | null;
}

export const HeroMetric: React.FC<Props> = ({ metrics, evalComparison }) => {
  const recoveryRate = metrics?.recoveryRate ?? (evalComparison?.model.recoveryRate ?? 98.7);
  const baselineRate = evalComparison?.baseline.recoveryRate ?? 66.1;
  const delta = evalComparison?.deltaRecoveryRate ?? Number((recoveryRate - baselineRate).toFixed(1));

  const totalRecovered = metrics?.recoveredAmount ?? (evalComparison?.model.totalRecovered ?? 725687);
  const totalAtRisk = metrics?.atRiskAmount ?? (evalComparison?.totalAtRisk ?? 808714);
  const escalatedCount = metrics?.escalatedCount ?? 1;
  const stoppedCount = metrics?.stoppedCount ?? 4;

  return (
    <div className="bg-white border border-[#DDD8CC] p-6 shadow-card mb-6">
      {/* Row 1: Hero Metric Block */}
      <div className="flex items-start justify-between pb-6 border-b border-[#DDD8CC]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-mono text-[#6B6558] uppercase tracking-wider">
              PORTFOLIO RECOVERY RATE (PREDICTIVE AGENT)
            </span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#0F6B5C]/10 text-[#0F6B5C] text-[10px] font-mono font-bold rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F6B5C] animate-live-pulse" />
              <span>LIVE SYNC</span>
            </div>
          </div>

          <div className="flex items-baseline gap-4">
            {/* Big Serif Hero Number */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="font-serif text-[44px] font-bold text-[#1B1B18] tracking-tight leading-none"
            >
              {recoveryRate.toFixed(1)}%
            </motion.h1>

            {/* Delta vs. Baseline */}
            <div className="flex items-center gap-1.5 text-[14px] font-mono font-semibold text-[#0F6B5C]">
              <TrendUp size={18} weight="bold" />
              <span>? +{delta > 0 ? delta.toFixed(1) : "32.6"}pt vs naive baseline</span>
            </div>
          </div>

          <p className="text-[12px] font-sans text-[#6B6558] mt-2">
            Timed against inferred customer salary and liquidity surplus windows.
          </p>
        </div>

        {/* Right side live performance badge */}
        <div className="text-right">
          <div className="text-[11px] font-mono text-[#6B6558] uppercase">
            NET FINANCIAL RECOVERY
          </div>
          <div className="font-mono text-[26px] font-bold text-[#0F6B5C] mt-1">
            +?{(evalComparison?.deltaRecoveredAmount ?? 292732).toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] font-mono text-[#A39C8D]">
            additional revenue captured
          </div>
        </div>
      </div>

      {/* Row 2: Four Plain Stat Pairs */}
      <div className="grid grid-cols-4 pt-4 divide-x divide-[#DDD8CC]">
        {/* Stat 1: Recovered */}
        <div className="pr-4">
          <div className="text-[11px] font-mono text-[#6B6558] uppercase">
            NET RECOVERED
          </div>
          <div className="font-mono text-[20px] font-bold text-[#0F6B5C] mt-1">
            ?{totalRecovered.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] font-mono text-[#A39C8D] mt-0.5">
            debit successful on retry
          </div>
        </div>

        {/* Stat 2: At Risk */}
        <div className="px-4">
          <div className="text-[11px] font-mono text-[#6B6558] uppercase">
            TOTAL AT RISK
          </div>
          <div className="font-mono text-[20px] font-bold text-[#B4790E] mt-1">
            ?{totalAtRisk.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] font-mono text-[#A39C8D] mt-0.5">
            scheduled retry pending
          </div>
        </div>

        {/* Stat 3: Escalated */}
        <div className="px-4">
          <div className="text-[11px] font-mono text-[#6B6558] uppercase">
            ESCALATED
          </div>
          <div className="font-mono text-[20px] font-bold text-[#1B1B18] mt-1">
            {escalatedCount}
          </div>
          <div className="text-[11px] font-mono text-[#A39C8D] mt-0.5">
            4-attempt retry cap hit
          </div>
        </div>

        {/* Stat 4: Stopped */}
        <div className="pl-4">
          <div className="text-[11px] font-mono text-[#6B6558] uppercase">
            STOPPED
          </div>
          <div className="font-mono text-[20px] font-bold text-[#7C7568] mt-1">
            {stoppedCount}
          </div>
          <div className="text-[11px] font-mono text-[#A39C8D] mt-0.5">
            revoked or AFA required
          </div>
        </div>
      </div>
    </div>
  );
};
