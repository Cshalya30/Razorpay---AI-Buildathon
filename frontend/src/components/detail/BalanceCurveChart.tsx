import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer
} from "recharts";
import { Mandate, BalancePoint } from "../../types";

interface Props {
  mandate: Mandate;
  balanceCurve: BalancePoint[];
}

export const BalanceCurveChart: React.FC<Props> = ({ mandate, balanceCurve }) => {
  const chartData = balanceCurve.map((pt) => ({
    day: pt.day,
    balance: pt.balance,
    amount: mandate.mandate_amount,
    surplus: pt.balance - mandate.mandate_amount
  }));

  const maxBalance = Math.max(...chartData.map((d) => d.balance), mandate.mandate_amount * 1.5, 5000);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isSufficient = data.balance >= mandate.mandate_amount;
      const surplus = data.balance - mandate.mandate_amount;

      return (
        <div className="bg-[#1B1B18] text-[#EDEAE2] p-2.5 shadow-modal border border-[#2C2C28] text-[11px] font-mono">
          <div className="text-[#A39C8D] mb-1">Cycle Day {label}</div>
          <div className="font-bold text-[13px] text-white">
            Balance: ₹{data.balance.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-[#A39C8D] mt-0.5">
            Mandate Amount: ₹{mandate.mandate_amount.toLocaleString("en-IN")}
          </div>
          <div className={`mt-1 font-semibold ${isSufficient ? "text-[#0F6B5C]" : "text-[#A6323B]"}`}>
            {isSufficient 
              ? `+?${surplus.toLocaleString("en-IN")} Surplus (Clearance OK)` 
              : `-?${Math.abs(surplus).toLocaleString("en-IN")} Deficit (Will Bounce)`}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-[#DDD8CC] p-4 shadow-card mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[12px] font-semibold text-[#1B1B18] tracking-tight">
          30-Day Liquidity Trajectory &amp; Timing Window
        </span>
        <div className="flex items-center gap-3 text-[10px] font-mono text-[#6B6558]">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-0.5 bg-[#A6323B] inline-block" />
            <span>Debit ₹{mandate.mandate_amount.toLocaleString("en-IN")}</span>
          </div>
          {mandate.next_retry_day && (
            <div className="flex items-center gap-1 text-[#2B4C7E] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#2B4C7E] inline-block" />
              <span>Retry Day {mandate.next_retry_day}</span>
            </div>
          )}
        </div>
      </div>

      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2B4C7E" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#2B4C7E" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={{ stroke: "#DDD8CC" }}
              tick={{ fontSize: 10, fontFamily: "IBM Plex Mono", fill: "#6B6558" }}
              interval={2}
            />

            <YAxis
              domain={[0, Math.ceil(maxBalance * 1.1)]}
              tickLine={false}
              axisLine={{ stroke: "#DDD8CC" }}
              tick={{ fontSize: 10, fontFamily: "IBM Plex Mono", fill: "#6B6558" }}
              tickFormatter={(val) => `?${(val / 1000).toFixed(0)}k`}
              width={42}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Mandate Amount Threshold Line */}
            <ReferenceLine
              y={mandate.mandate_amount}
              stroke="#A6323B"
              strokeDasharray="3 3"
              strokeWidth={1.5}
            />

            {/* Next Retry Day Marker */}
            {mandate.next_retry_day && (
              <ReferenceLine
                x={mandate.next_retry_day}
                stroke="#2B4C7E"
                strokeWidth={2}
                strokeDasharray="2 2"
              />
            )}

            {/* Original Due Day Marker */}
            <ReferenceLine
              x={mandate.due_day}
              stroke="#7C7568"
              strokeWidth={1}
              strokeDasharray="2 2"
            />

            <Area
              type="monotone"
              dataKey="balance"
              stroke="#2B4C7E"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#balanceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[10px] font-mono text-[#6B6558] mt-2 pt-2 border-t border-[#DDD8CC]">
        <span>Original Failed Due Day: Day {mandate.due_day}</span>
        {mandate.next_retry_day && (
          <span className="text-[#2B4C7E] font-semibold">
            Optimal Retry Target: Day {mandate.next_retry_day} (Post-Salary Surplus)
          </span>
        )}
      </div>
    </div>
  );
};
