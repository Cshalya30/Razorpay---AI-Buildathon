import React from "react";

export const LinearIsometricCards: React.FC = () => {
  const figures = [
    {
      fig: "FIG 0.1",
      title: "Deterministic Gating Shield",
      subtitle: "RBI DPSS/2021-22/68",
      desc: "Hard-coded central bank compliance rules that can never be overridden by machine learning. Enforces the 24-hour pre-debit alert lead time, the ?15,000 AFA exemption threshold, and the 4-attempt anti-harassment stopping rule.",
      svg: (
        <svg className="w-48 h-32 mx-auto" viewBox="0 0 160 110" fill="none" stroke="currentColor">
          {/* Isometric stacked plates in clean slate/ink lines */}
          <path d="M 80 15 L 140 45 L 80 75 L 20 45 Z" stroke="#2B4C7E" strokeWidth="1.5" fill="#F6F4EE" />
          <path d="M 20 45 L 20 52 L 80 82 L 140 52 L 140 45" stroke="#2B4C7E" strokeWidth="1.2" />
          <path d="M 20 56 L 20 63 L 80 93 L 140 63 L 140 56" stroke="#6B6558" strokeWidth="1.2" />
          <path d="M 20 67 L 20 74 L 80 104 L 140 74 L 140 67" stroke="#A39C8D" strokeWidth="1.2" />
          {/* Center circular emblem */}
          <ellipse cx="80" cy="45" rx="22" ry="11" stroke="#0F6B5C" strokeWidth="1.5" fill="#0F6B5C/10" />
          <circle cx="80" cy="45" r="3.5" fill="#0F6B5C" />
        </svg>
      )
    },
    {
      fig: "FIG 0.2",
      title: "Inferred Liquidity Engine",
      subtitle: "8-Feature Calibrated GBDT",
      desc: "Gradient-boosted decision trees calibrated with sigmoid probabilities evaluate salary cycle proximity, 2-day daily burn headroom, and inflow ratios to schedule debit attempts precisely when customer liquidity is positive.",
      svg: (
        <svg className="w-48 h-32 mx-auto" viewBox="0 0 160 110" fill="none" stroke="currentColor">
          {/* Isometric clustered cubes in crisp editorial ink */}
          {/* Cube 1 (Back Top) */}
          <path d="M 80 12 L 105 26 L 80 40 L 55 26 Z" stroke="#2B4C7E" strokeWidth="1.5" fill="#F6F4EE" />
          <path d="M 55 26 L 55 45 L 80 59 L 105 45 L 105 26" stroke="#2B4C7E" strokeWidth="1.2" />
          <path d="M 80 40 L 80 59" stroke="#2B4C7E" strokeWidth="1.2" />
          
          {/* Cube 2 (Front Left) */}
          <path d="M 45 40 L 70 54 L 45 68 L 20 54 Z" stroke="#0F6B5C" strokeWidth="1.5" fill="#E8F4F1" />
          <path d="M 20 54 L 20 78 L 45 92 L 70 78 L 70 54" stroke="#0F6B5C" strokeWidth="1.2" />
          <path d="M 45 68 L 45 92" stroke="#0F6B5C" strokeWidth="1.2" />

          {/* Cube 3 (Front Right) */}
          <path d="M 115 45 L 140 59 L 115 73 L 90 59 Z" stroke="#B4790E" strokeWidth="1.5" fill="#FAF5EB" />
          <path d="M 90 59 L 90 83 L 115 97 L 140 83 L 140 59" stroke="#B4790E" strokeWidth="1.2" />
          <path d="M 115 73 L 115 97" stroke="#B4790E" strokeWidth="1.2" />
        </svg>
      )
    },
    {
      fig: "FIG 0.3",
      title: "Zero-Harassment Execution",
      subtitle: "4-Attempt Ceiling Gating",
      desc: "Strict adherence to anti-harassment stopping rules. Mandates failing 4 consecutive debit cycles are terminated from automated retries and escalated with immutable audit records stamped by actor.",
      svg: (
        <svg className="w-48 h-32 mx-auto" viewBox="0 0 160 110" fill="none" stroke="currentColor">
          {/* Stepped fins */}
          {[0, 1, 2, 3, 4, 5, 6].map((i) => {
            const h = 22 + i * 10;
            const x = 32 + i * 14;
            const y = 92 - h;
            return (
              <g key={i}>
                <rect x={x} y={y} width="8" height={h} stroke="#2B4C7E" strokeWidth="1.2" fill="#F6F4EE" />
                <line x1={x} y1={y} x2={x + 4} y2={y - 4} stroke="#2B4C7E" strokeWidth="1.2" />
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
          className="bg-white border border-[#DDD8CC] p-6 shadow-card flex flex-col justify-between hover:border-[#2B4C7E] transition-all group"
        >
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#DDD8CC]/60">
              <span className="text-[10px] font-mono text-[#6B6558] tracking-widest uppercase font-bold">
                {fig.fig}
              </span>
              <span className="text-[9px] font-mono text-[#2B4C7E] font-semibold px-2 py-0.5 bg-[#2B4C7E]/10 border border-[#2B4C7E]/20">
                {fig.subtitle}
              </span>
            </div>

            <div className="py-2 mb-3 text-[#1B1B18]">
              {fig.svg}
            </div>

            <h3 className="text-base font-serif font-bold text-[#1B1B18] tracking-tight mb-2">
              {fig.title}
            </h3>

            <p className="text-[12px] text-[#6B6558] font-sans leading-relaxed">
              {fig.desc}
            </p>
          </div>

          <div className="pt-3 mt-4 border-t border-[#DDD8CC]/60 flex items-center justify-between text-[10px] font-mono text-[#6B6558]">
            <span>STATUTORY RULESET</span>
            <span className="text-[#0F6B5C] font-bold">VERIFIED</span>
          </div>
        </div>
      ))}
    </div>
  );
};
