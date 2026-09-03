import React from "react";

export const LinearIsometricCards: React.FC = () => {
  const figures = [
    {
      fig: "FIG 0.1",
      title: "Deterministic Gating Shield",
      subtitle: "RBI DPSS/2021-22/68",
      desc: "Hard-coded central bank compliance rules that can never be overridden by machine learning. Enforces the 24-hour pre-debit alert lead time, the ?15,000 AFA exemption threshold, and the 4-attempt anti-harassment stopping rule.",
      svg: (
        <svg className="w-48 h-36 mx-auto" viewBox="0 0 160 120" fill="none" stroke="currentColor">
          {/* Isometric stacked plates */}
          <path d="M 80 15 L 140 45 L 80 75 L 20 45 Z" stroke="#6888C8" strokeWidth="1.2" fill="#182136" />
          <path d="M 20 45 L 20 52 L 80 82 L 140 52 L 140 45" stroke="#4E71BA" strokeWidth="1.2" />
          <path d="M 20 56 L 20 63 L 80 93 L 140 63 L 140 56" stroke="#3A4D7A" strokeWidth="1.2" />
          <path d="M 20 67 L 20 74 L 80 104 L 140 74 L 140 67" stroke="#2B3A5C" strokeWidth="1.2" />
          {/* Center circular emblem */}
          <ellipse cx="80" cy="45" rx="24" ry="12" stroke="#10B981" strokeWidth="1.2" />
          <circle cx="80" cy="45" r="3" fill="#10B981" />
        </svg>
      )
    },
    {
      fig: "FIG 0.2",
      title: "Inferred Liquidity Engine",
      subtitle: "8-Feature Calibrated GBDT",
      desc: "Gradient-boosted decision trees calibrated with sigmoid probabilities evaluate salary cycle proximity, 2-day daily burn headroom, and inflow ratios to schedule debit attempts precisely when customer liquidity is positive.",
      svg: (
        <svg className="w-48 h-36 mx-auto" viewBox="0 0 160 120" fill="none" stroke="currentColor">
          {/* Isometric clustered cubes */}
          {/* Cube 1 (Back Top) */}
          <path d="M 80 12 L 105 26 L 80 40 L 55 26 Z" stroke="#6888C8" strokeWidth="1.2" fill="#182136" />
          <path d="M 55 26 L 55 45 L 80 59 L 105 45 L 105 26" stroke="#4E71BA" strokeWidth="1.2" />
          <path d="M 80 40 L 80 59" stroke="#4E71BA" strokeWidth="1.2" />
          
          {/* Cube 2 (Front Left) */}
          <path d="M 45 40 L 70 54 L 45 68 L 20 54 Z" stroke="#38BDF8" strokeWidth="1.2" fill="#142033" />
          <path d="M 20 54 L 20 78 L 45 92 L 70 78 L 70 54" stroke="#0284C7" strokeWidth="1.2" />
          <path d="M 45 68 L 45 92" stroke="#0284C7" strokeWidth="1.2" />

          {/* Cube 3 (Front Right) */}
          <path d="M 115 45 L 140 59 L 115 73 L 90 59 Z" stroke="#818CF8" strokeWidth="1.2" fill="#181E36" />
          <path d="M 90 59 L 90 83 L 115 97 L 140 83 L 140 59" stroke="#4F46E5" strokeWidth="1.2" />
          <path d="M 115 73 L 115 97" stroke="#4F46E5" strokeWidth="1.2" />
        </svg>
      )
    },
    {
      fig: "FIG 0.3",
      title: "Zero-Harassment Execution",
      subtitle: "4-Attempt Ceiling Gating",
      desc: "Strict adherence to anti-harassment stopping rules. Mandates failing 4 consecutive debit cycles are terminated from automated retries and escalated with immutable audit records stamped by actor.",
      svg: (
        <svg className="w-48 h-36 mx-auto" viewBox="0 0 160 120" fill="none" stroke="currentColor">
          {/* Stepped fins */}
          {[0, 1, 2, 3, 4, 5, 6].map((i) => {
            const h = 25 + i * 11;
            const x = 30 + i * 14;
            const y = 95 - h;
            return (
              <g key={i}>
                <rect x={x} y={y} width="8" height={h} stroke="#6888C8" strokeWidth="1.2" fill="#182136" />
                <line x1={x} y1={y} x2={x + 4} y2={y - 4} stroke="#4E71BA" strokeWidth="1.2" />
              </g>
            );
          })}
        </svg>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {figures.map((fig) => (
        <div
          key={fig.fig}
          className="bg-[#101524] text-white p-6 rounded-xl border border-[#DDD8CC]/30 shadow-card flex flex-col justify-between hover:border-indigo-500/50 transition-all group"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono text-slate-400 tracking-widest uppercase">
                {fig.fig}
              </span>
              <span className="text-[9px] font-mono text-sky-400 font-semibold px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20">
                {fig.subtitle}
              </span>
            </div>

            <div className="py-2 mb-4 text-slate-300 group-hover:text-white transition-colors">
              {fig.svg}
            </div>

            <h3 className="text-base font-bold text-white font-sans tracking-tight mb-2">
              {fig.title}
            </h3>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {fig.desc}
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>SPECIFICATION</span>
            <span className="text-emerald-400 font-semibold">VERIFIED</span>
          </div>
        </div>
      ))}
    </div>
  );
};
