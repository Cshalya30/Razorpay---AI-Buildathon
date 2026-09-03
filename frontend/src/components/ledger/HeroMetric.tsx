import React from "react";
import { LedgerMetrics, EvalComparison } from "../../types";

interface HeroMetricProps {
  metrics: LedgerMetrics | null;
  evalComparison: EvalComparison | null;
}

export const HeroMetric: React.FC<HeroMetricProps> = ({ metrics, evalComparison }) => {
  const modelRate = evalComparison ? evalComparison.model.recoveryRate : (metrics?.recoveryRate ?? 0);
  const baselineRate = evalComparison ? evalComparison.baseline.recoveryRate : 66.1;
  const deltaRate = evalComparison ? evalComparison.deltaRecoveryRate : (modelRate - baselineRate);

  const recoveredAmount = metrics?.recoveredAmount ?? 0;
  const atRiskAmount = metrics?.atRiskAmount ?? 0;
  const escalatedCount = metrics?.escalatedCount ?? 0;
  const stoppedCount = metrics?.stoppedCount ?? 0;

  return (
    <div className="mb-6">
      {/* Row 1: The One Hero Number */}
      <div className="flex items-baseline gap-4 mb-5">
        <div>
          <div className="text-[12px] font-mono text-[#6B6558] uppercase tracking-wider mb-1">
            Recovery Rate Today
          </div>
          <div className="flex items-baseline gap-3">
            <span className="font-serif text-[40px] font-bold text-[#1B1B18] tracking-tight leading-none">
              {modelRate.toFixed(1)}%
            </span>
            <span className="text-[14px] font-mono text-[#0F6B5C] font-semibold">
              ? +{deltaRate.toFixed(1)}pt
            </span>
            <span className="text-[13px] text-[#6B6558] font-sans">
              vs. naive baseline ({baselineRate.toFixed(1)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: Four Plain Stat Pairs Separated by Hairline Rule Verticals */}
      <div className="grid grid-cols-4 border-y border-[#DDD8CC] py-3 bg-white/40">
        <div className="px-4 border-r border-[#DDD8CC]">
          <div className="text-[11px] font-mono text-[#6B6558] uppercase tracking-wide">
            ? RECOVERED
          </div>
          <div className="text-[18px] font-mono font-semibold text-[#0F6B5C] mt-0.5">
            ?{recoveredAmount.toLocaleString("en-IN")}
          </div>
        </div>

        <div className="px-4 border-r border-[#DDD8CC]">
          <div className="text-[11px] font-mono text-[#6B6558] uppercase tracking-wide">
            ? AT RISK (ACTIVE RETRIES)
          </div>
          <div className="text-[18px] font-mono font-semibold text-[#B4790E] mt-0.5">
            ?{atRiskAmount.toLocaleString("en-IN")}
          </div>
        </div>

        <div className="px-4 border-r border-[#DDD8CC]">
          <div className="text-[11px] font-mono text-[#6B6558] uppercase tracking-wide">
            ESCALATED (CAP REACHED)
          </div>
          <div className="text-[18px] font-mono font-semibold text-[#A6323B] mt-0.5">
            {escalatedCount}
          </div>
        </div>

        <div className="px-4">
          <div className="text-[11px] font-mono text-[#6B6558] uppercase tracking-wide">
            STOPPED (AFA / REVOKED)
          </div>
          <div className="text-[18px] font-mono font-semibold text-[#7C7568] mt-0.5">
            {stoppedCount}
          </div>
        </div>
      </div>
    </div>
  );
};
