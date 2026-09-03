import React, { useState } from "react";
import { useStore } from "../../store/useStore";
import { api } from "../../api/client";
import { ArrowsClockwise, CheckCircle } from "@phosphor-icons/react";

export const TopBar: React.FC = () => {
  const { setEvalComparison, setMetrics } = useStore();
  const [isRunningEval, setIsRunningEval] = useState(false);

  const handleRunEvalLive = async () => {
    try {
      setIsRunningEval(true);
      const evalData = await api.runEvaluation();
      setEvalComparison(evalData);
      const metricsData = await api.getMetrics();
      setMetrics(metricsData);
    } catch (err) {
      console.error("Failed to run evaluation:", err);
    } finally {
      setIsRunningEval(false);
    }
  };

  return (
    <header className="h-14 border-b border-[#DDD8CC] bg-[#EDEAE2] px-8 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <span className="text-[13px] font-semibold text-[#1B1B18] tracking-tight">
          Recovery Register
        </span>
        <span className="text-[#DDD8CC] font-mono">/</span>
        <span className="text-[12px] text-[#6B6558] font-mono">
          SEPTEMBER 2026 CYCLE
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Live Feed Marker */}
        <div className="flex items-center gap-1.5 px-2 py-1 bg-white/70 border border-[#DDD8CC] text-[11px] font-mono text-[#6B6558]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0F6B5C] animate-pulse" />
          <span>AGENT LIVE</span>
        </div>

        {/* Re-run Eval Live Button */}
        <button
          onClick={handleRunEvalLive}
          disabled={isRunningEval}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2B4C7E] text-white text-[12px] font-medium hover:bg-[#233F69] disabled:opacity-50 transition-colors shadow-sm"
          title="Re-runs both baseline and model policies live"
        >
          <ArrowsClockwise size={13} className={isRunningEval ? "animate-spin" : ""} />
          <span>{isRunningEval ? "Evaluating..." : "Re-run Eval Live"}</span>
        </button>
      </div>
    </header>
  );
};
