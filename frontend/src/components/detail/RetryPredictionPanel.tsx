import React from "react";
import { Mandate } from "../../types";

interface Props {
  mandate: Mandate;
  candidateDays?: { day: number; prob: number }[];
  featureImportances?: Record<string, number>;
}

export const RetryPredictionPanel: React.FC<Props> = ({
  mandate,
  candidateDays,
  featureImportances
}) => {
  // Generate candidate days if not passed in
  const defaultCandidateDays = candidateDays || [
    { day: ((mandate.due_day + 1) % 30) + 1, prob: 0.45 },
    { day: ((mandate.due_day + 2) % 30) + 1, prob: 0.62 },
    { day: mandate.next_retry_day ?? (((mandate.due_day + 3) % 30) + 1), prob: mandate.predicted_success_prob ?? 0.88 },
    { day: ((mandate.due_day + 4) % 30) + 1, prob: 0.74 },
    { day: ((mandate.due_day + 5) % 30) + 1, prob: 0.69 },
  ].sort((a, b) => a.day - b.day);

  const bestDay = mandate.next_retry_day ?? (defaultCandidateDays.reduce((prev, curr) => curr.prob > prev.prob ? curr : prev).day);

  const importances = featureImportances || {
    "historical_balance": 0.878,
    "amount_to_inflow_ratio": 0.109,
    "days_since_inferred_salary": 0.002,
    "day_of_month": 0.003
  };

  return (
    <div className="bg-white border border-[#DDD8CC] p-4 shadow-card mb-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-[12px] font-semibold text-[#1B1B18] tracking-tight">
            Predictive Model Scheduling (P(Success))
          </span>
          <div className="text-[11px] font-mono text-[#6B6558]">
            Gradient-boosted tree ? chosen for explainability on small structured data
          </div>
        </div>
        {mandate.next_retry_day && (
          <span className="px-2 py-0.5 bg-[#2B4C7E] text-white font-mono text-[11px] font-semibold">
            Chosen Day {mandate.next_retry_day} ({((mandate.predicted_success_prob ?? 0.88) * 100).toFixed(0)}%)
          </span>
        )}
      </div>

      {/* Discrete Candidate Days Probability Bars */}
      <div className="space-y-2 mb-4">
        {defaultCandidateDays.slice(0, 6).map((cand) => {
          const isChosen = cand.day === bestDay;
          const percentage = Math.round(cand.prob * 100);

          return (
            <div key={cand.day} className="flex items-center text-[11px] font-mono gap-3">
              <span className={`w-14 shrink-0 ${isChosen ? "font-bold text-[#2B4C7E]" : "text-[#6B6558]"}`}>
                Day {cand.day} {isChosen ? "?" : ""}
              </span>
              <div className="flex-1 h-3.5 bg-[#EDEAE2] rounded-none overflow-hidden relative">
                <div
                  className={`h-full transition-all duration-300 ${
                    isChosen ? "bg-[#2B4C7E]" : "bg-[#DDD8CC]"
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className={`w-12 text-right shrink-0 ${isChosen ? "font-bold text-[#2B4C7E]" : "text-[#6B6558]"}`}>
                {percentage}%
              </span>
            </div>
          );
        })}
      </div>

      {/* Feature Importances Plain Bar List (PRD Part 5 explainability artifact) */}
      <div className="border-t border-[#DDD8CC] pt-3">
        <div className="text-[11px] font-mono text-[#6B6558] uppercase tracking-wider mb-2">
          Feature Importance Attribution
        </div>
        <div className="space-y-1.5">
          {Object.entries(importances).map(([feat, imp]) => (
            <div key={feat} className="flex items-center text-[10px] font-mono gap-2">
              <span className="w-36 text-[#1B1B18] truncate">
                {feat.replace(/_/g, " ")}
              </span>
              <div className="flex-1 h-1.5 bg-[#EDEAE2] overflow-hidden">
                <div
                  className="h-full bg-[#6B6558]"
                  style={{ width: `${imp * 100}%` }}
                />
              </div>
              <span className="w-10 text-right text-[#6B6558]">
                {(imp * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
