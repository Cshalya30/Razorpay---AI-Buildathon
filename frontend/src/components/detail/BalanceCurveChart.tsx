import React from "react";
import { BalancePoint, Mandate } from "../../types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer
} from "recharts";

interface Props {
  mandate: Mandate;
  balanceCurve: BalancePoint[];
}

export const BalanceCurveChart: React.FC<Props> = ({ mandate, balanceCurve }) => {
  const chartData = balanceCurve.map((point) => ({
    day: point.day,
    balance: point.balance,
    mandateAmount: mandate.mandate_amount
  }));

  return (
    <div className="bg-white border border-[#DDD8CC] p-4 shadow-card mb-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-[12px] font-semibold text-[#1B1B18] tracking-tight">
            Customer Balance Trajectory (30 Days)
          </span>
          <div className="text-[11px] font-mono text-[#6B6558]">
            Debit threshold: ?{mandate.mandate_amount.toLocaleString("en-IN")}
          </div>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-mono">
          <span className="flex items-center gap-1 text-[#2B4C7E]">
            <span className="w-2.5 h-0.5 bg-[#2B4C7E] inline-block" />
            Balance
          </span>
          <span className="flex items-center gap-1 text-[#A6323B]">
            <span className="w-2.5 h-0.5 bg-[#A6323B] border-dashed inline-block" />
            Mandate Amount
          </span>
        </div>
      </div>

      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <XAxis
              dataKey="day"
              tickFormatter={(d) => `D${d}`}
              tick={{ fontSize: 10, fontFamily: "IBM Plex Mono", fill: "#6B6558" }}
              axisLine={{ stroke: "#DDD8CC" }}
            />
            <YAxis
              tickFormatter={(v) => `?${(v / 1000).toFixed(0)}k`}
              tick={{ fontSize: 10, fontFamily: "IBM Plex Mono", fill: "#6B6558" }}
              axisLine={{ stroke: "#DDD8CC" }}
              width={40}
            />
            <Tooltip
              formatter={(value: any) => [`?${Number(value).toLocaleString("en-IN")}`, "Balance"]}
              labelFormatter={(label) => `Day ${label} of Month`}
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #DDD8CC",
                fontSize: "11px",
                fontFamily: "IBM Plex Mono"
              }}
            />
            {/* Flat mandate amount reference line */}
            <ReferenceLine
              y={mandate.mandate_amount}
              stroke="#A6323B"
              strokeDasharray="3 3"
              label={{
                value: `?${mandate.mandate_amount}`,
                position: "insideTopRight",
                fontSize: 9,
                fontFamily: "IBM Plex Mono",
                fill: "#A6323B"
              }}
            />
            {/* Due Day vertical marker */}
            <ReferenceLine
              x={mandate.due_day}
              stroke="#A6323B"
              strokeWidth={1.5}
              label={{
                value: `Due D${mandate.due_day}`,
                position: "top",
                fontSize: 9,
                fontFamily: "IBM Plex Mono",
                fill: "#A6323B"
              }}
            />
            {/* Scheduled Retry Day vertical marker */}
            {mandate.next_retry_day && (
              <ReferenceLine
                x={mandate.next_retry_day}
                stroke="#0F6B5C"
                strokeWidth={2}
                label={{
                  value: `Retry D${mandate.next_retry_day}`,
                  position: "top",
                  fontSize: 9,
                  fontFamily: "IBM Plex Mono",
                  fill: "#0F6B5C"
                }}
              />
            )}
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#2B4C7E"
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 4, fill: "#2B4C7E" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
