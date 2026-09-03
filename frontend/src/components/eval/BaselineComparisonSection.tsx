import React from "react";
import { EvalComparison } from "../../types";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from "recharts";

interface Props {
  comparison: EvalComparison | null;
}

export const BaselineComparisonSection: React.FC<Props> = ({ comparison }) => {
  if (!comparison) return null;

  const chartData = [
    {
      name: "Naive Baseline (fixed +1/+3/+7)",
      policy: "baseline",
      recoveryRate: comparison.baseline.recoveryRate,
      recoveredAmount: comparison.baseline.totalRecovered,
      color: "#7C7568"
    },
    {
      name: "Predictive Agent (Model Timing)",
      policy: "model",
      recoveryRate: comparison.model.recoveryRate,
      recoveredAmount: comparison.model.totalRecovered,
      color: "#0F6B5C"
    }
  ];

  return (
    <div className="bg-white border border-[#DDD8CC] p-4 shadow-card mb-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-[13px] font-semibold text-[#1B1B18] tracking-tight">
            Policy Evaluation: Naive Retry vs. Predictive Agent
          </span>
          <span className="text-[12px] font-mono text-[#6B6558] ml-3">
            N = 316 failed mandates evaluated
          </span>
        </div>
        <div className="flex items-center gap-4 text-[12px] font-mono">
          <span className="text-[#0F6B5C] font-semibold">
            Delta: +{comparison.deltaRecoveryRate.toFixed(1)}pt (+?{comparison.deltaRecoveredAmount.toLocaleString('en-IN')})
          </span>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="h-32 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 40, left: 160, bottom: 5 }}
          >
            <XAxis
              type="number"
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono', fill: '#6B6558' }}
              axisLine={{ stroke: '#DDD8CC' }}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 12, fontFamily: 'IBM Plex Sans', fill: '#1B1B18' }}
              axisLine={{ stroke: '#DDD8CC' }}
              width={160}
            />
            <Tooltip
              formatter={(value: any, name: any, item: any) => [
                `${value}% (?${item.payload.recoveredAmount.toLocaleString('en-IN')} recovered)`,
                "Recovery Rate"
              ]}
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #DDD8CC',
                borderRadius: '4px',
                fontFamily: 'IBM Plex Mono',
                fontSize: '12px'
              }}
            />
            <Bar dataKey="recoveryRate" barSize={18}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Honest Synthetic Limitation Disclaimer */}
      <div className="mt-2 pt-2 border-t border-[#DDD8CC] text-[11px] font-mono text-[#6B6558] flex items-center justify-between">
        <span>
          Evaluated on synthetic dataset with realistic statistical texture (income sync gaps, irregular gig-worker patterns).
        </span>
        <span className="text-[#2B4C7E]">
          Reproducible via POST /api/v1/eval/run
        </span>
      </div>
    </div>
  );
};
