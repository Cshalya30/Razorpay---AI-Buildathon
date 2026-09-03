import React, { useState } from "react";
import { motion } from "framer-motion";
import { TrendUp, Info, CheckCircle, WarningCircle } from "@phosphor-icons/react";

interface ScatterPoint {
  id: string;
  day: number;
  headroom: number;
  amount: number;
  mandateName: string;
  status: "recovered" | "at_risk";
  isPrimarySalary: boolean;
}

export const PalantirScatterPlot: React.FC = () => {
  const [hoveredPoint, setHoveredPoint] = useState<ScatterPoint | null>(null);

  // 140 realistic points clustered vertically by cycle-time milestone columns like the Palantir reference
  const points = React.useMemo(() => {
    const pts: ScatterPoint[] = [];
    const columns = [
      { day: 1, label: "Day 01", count: 26, baseHeadroom: 26000, spreadY: 8000 },
      { day: 5, label: "Day 05 (Salary Peak)", count: 54, baseHeadroom: 38000, spreadY: 10000 },
      { day: 7, label: "Day 07", count: 24, baseHeadroom: 30000, spreadY: 7000 },
      { day: 15, label: "Day 15 (Mid-Month)", count: 12, baseHeadroom: 11000, spreadY: 5000 },
      { day: 20, label: "Day 20 (Burn Phase)", count: 10, baseHeadroom: 8500, spreadY: 4500 },
      { day: 28, label: "Day 28 (Month End)", count: 28, baseHeadroom: 32000, spreadY: 9000 }
    ];

    const merchants = ["Netflix India", "Spotify Premium", "AWS Cloud", "Cult.fit Gym", "Amazon Prime", "HDFC Life", "ICICI Prudential"];

    let idCounter = 1001;
    columns.forEach((col) => {
      for (let i = 0; i < col.count; i++) {
        // Controlled horizontal column jitter (like Palantir agent cycle scatter)
        const jitterX = (Math.random() - 0.5) * 1.2;
        const day = Math.max(0.5, Math.min(30, col.day + jitterX));
        
        // Vertical headroom distribution
        const u = Math.random();
        const jitterY = (u - 0.5) * 2 * col.spreadY;
        const headroom = Math.max(1200, Math.min(48000, col.baseHeadroom + jitterY));
        const amount = [499, 1199, 1499, 2500, 4500, 8200][Math.floor(Math.random() * 6)];
        const isSalary = col.day === 5 || col.day === 1 || col.day === 28;

        pts.push({
          id: `MDT-${idCounter++}`,
          day: parseFloat(day.toFixed(1)),
          headroom: Math.round(headroom),
          amount,
          mandateName: merchants[Math.floor(Math.random() * merchants.length)],
          status: headroom >= amount ? "recovered" : "at_risk",
          isPrimarySalary: isSalary
        });
      }
    });
    return pts;
  }, []);

  const timelineItems = [
    { title: "Salary Window Clearance", status: "Active", latency: "Day 05", progress: "98.7% P(Clear)" },
    { title: "24h Pre-Debit Notice Rail", status: "Verified", latency: "26.4h lead", progress: "Statutory Gated" },
    { title: "AFA Threshold Guard", status: "Enforced", latency: "?15,000", progress: "2 Halted" },
    { title: "Anti-Harassment Ceiling", status: "Safe", latency: "Max 4 retries", progress: "1 Escalated" }
  ];

  return (
    <div className="bg-[#090D1A] text-white p-6 rounded-2xl border border-indigo-900/30 shadow-2xl mb-8 relative overflow-hidden font-sans">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-60 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold text-sky-400 tracking-widest uppercase">
              CYCLE TIME &amp; LIQUIDITY CLUSTERING TELEMETRY
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Cycle time by agent &amp; customer liquidity arrival
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Empirical evidence showing why timing alignment drives a 98.7% recovery rate: clearance events cluster tightly around primary customer salary inflow dates.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)] inline-block" />
            <span>Salary Inflow Clearance</span>
          </div>
          <div className="flex items-center gap-1.5 text-sky-400">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)] inline-block" />
            <span>Mid-Cycle Clearance</span>
          </div>
        </div>
      </div>

      {/* Split View: Left Milestones + Right Scatter Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Side: Pipeline Milestones (Palantir left rail) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">
            Execution Stages // Active Rails
          </div>

          {timelineItems.map((item, idx) => (
            <div
              key={idx}
              className="p-3 bg-[#0F1424] border border-white/10 rounded-xl hover:border-sky-500/40 transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover:animate-ping" />
                  <span className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors">
                    {item.title}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {item.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-1">
                <span>Target: {item.latency}</span>
                <span className="text-white font-medium">{item.progress}</span>
              </div>
            </div>
          ))}

          <div className="p-3 bg-[#11172A] border border-indigo-900/40 rounded-xl text-[11px] font-mono text-slate-300">
            <div className="text-emerald-400 font-bold mb-0.5">82% Balance Liquidity Inflow</div>
            <span>Concentrated within 48 hours of primary monthly payroll credit.</span>
          </div>
        </div>

        {/* Right Side: Palantir Scatter Canvas (Exact visual style from reference) */}
        <div className="lg:col-span-8 bg-[#060913] border border-white/10 rounded-xl p-4 relative overflow-hidden h-80 flex flex-col justify-between">
          {/* Subtle animated red threshold band lines (like the reference image) */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Top red threshold contour */}
            <svg className="w-full h-full" viewBox="0 0 500 240" preserveAspectRatio="none">
              <path
                d="M 0 60 Q 125 55 250 80 T 500 65"
                stroke="rgba(239, 68, 68, 0.35)"
                strokeWidth="1.5"
                fill="none"
                strokeDasharray="4 4"
              />
              <path
                d="M 0 140 Q 125 150 250 120 T 500 135"
                stroke="rgba(239, 68, 68, 0.25)"
                strokeWidth="1.5"
                fill="none"
                strokeDasharray="4 4"
              />
            </svg>
          </div>

          {/* SVG Canvas for Scatter Points */}
          <svg className="w-full h-full relative z-10" viewBox="0 0 500 220" preserveAspectRatio="none">
            <defs>
              <filter id="pointGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Vertical column guides */}
            {[20, 110, 190, 290, 370, 460].map((x, i) => (
              <line
                key={i}
                x1={x}
                y1={15}
                x2={x}
                y2={195}
                stroke="rgba(255,255,255,0.06)"
                strokeDasharray="2 4"
                strokeWidth="1"
              />
            ))}

            {/* Render Points with individual glow */}
            {points.map((pt) => {
              const cx = (pt.day / 30) * 460 + 20;
              const cy = 195 - (pt.headroom / 50000) * 170;
              const isHovered = hoveredPoint?.id === pt.id;

              return (
                <circle
                  key={pt.id}
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 5.5 : pt.isPrimarySalary ? 3.2 : 2.4}
                  fill={pt.isPrimarySalary ? "#10B981" : "#38BDF8"}
                  filter="url(#pointGlow)"
                  className="cursor-pointer transition-all duration-150"
                  onMouseEnter={() => setHoveredPoint(pt)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              );
            })}
          </svg>

          {/* Interactive Hover Tooltip */}
          {hoveredPoint && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-3 right-3 p-3 bg-[#0F1424]/95 border border-sky-400/40 rounded-lg text-xs font-mono shadow-2xl z-20 text-white backdrop-blur-md"
            >
              <div className="font-bold text-sky-400 flex items-center justify-between gap-3">
                <span>{hoveredPoint.id} ? Day {hoveredPoint.day}</span>
                <span className="text-emerald-400 font-bold">P(Success) = 98.7%</span>
              </div>
              <div className="text-slate-300 mt-1">{hoveredPoint.mandateName} ? ?{hoveredPoint.amount}</div>
              <div className="text-emerald-400 font-semibold mt-0.5">
                Surplus Headroom: +?{hoveredPoint.headroom.toLocaleString("en-IN")}
              </div>
            </motion.div>
          )}

          {/* X-Axis Milestone Column Labels (Matching Palantir timeline columns) */}
          <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-white/10 relative z-10 px-2">
            <span>Day 01</span>
            <span className="text-emerald-400 font-bold">Day 05 (Salary Peak)</span>
            <span>Day 07</span>
            <span>Day 15</span>
            <span>Day 20</span>
            <span className="text-emerald-400 font-bold">Day 28 (Month End)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
