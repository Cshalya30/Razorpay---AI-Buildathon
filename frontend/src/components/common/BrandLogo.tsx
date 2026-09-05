import React from "react";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = "md",
  showText = false,
  className = ""
}) => {
  const sizeMap = {
    sm: { box: 24, icon: 20, font: "text-lg", sub: "text-[9px]" },
    md: { box: 32, icon: 26, font: "text-2xl", sub: "text-[10px]" },
    lg: { box: 40, icon: 32, font: "text-3xl", sub: "text-[11px]" },
    xl: { box: 52, icon: 42, font: "text-4xl", sub: "text-[12px]" }
  };

  const config = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Precision Geometric Rebound Mark */}
      <div 
        className="relative shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#18181B] to-[#0A0A0B] border border-[#27272A] shadow-md group transition-all duration-200 hover:border-[#10B981]/50"
        style={{ width: config.box, height: config.box }}
      >
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute inset-0 bg-[#10B981]/10 rounded-xl blur-sm pointer-events-none" />

        <svg 
          width={config.icon} 
          height={config.icon} 
          viewBox="0 0 32 32" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10"
        >
          <defs>
            <linearGradient id="rebound-grad" x1="6" y1="6" x2="26" y2="26" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="60%" stopColor="#059669" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <linearGradient id="rebound-accent" x1="12" y1="12" x2="26" y2="6" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#6EE7B7" />
            </linearGradient>
            <filter id="rebound-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Vertical Mandate Spine */}
          <path
            d="M 9 7.5 L 9 24.5"
            stroke="url(#rebound-grad)"
            strokeWidth="2.75"
            strokeLinecap="round"
          />

          {/* Upper Cyclical Loop (Mandate rhythm) */}
          <path
            d="M 9 7.5 H 16.5 C 19.8 7.5 22 9.5 22 12.5 C 22 15.5 19.8 17.5 16.5 17.5 H 9"
            stroke="url(#rebound-grad)"
            strokeWidth="2.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Dynamic Rebound Spring Leg & Upward Recovery Arrow */}
          <path
            d="M 14.5 17.5 Q 16.5 24 23.5 24"
            stroke="url(#rebound-accent)"
            strokeWidth="2.75"
            strokeLinecap="round"
          />

          {/* Arrowhead launching to liquidity settlement */}
          <path
            d="M 20.5 21 L 24 24 L 20.5 27"
            stroke="#34D399"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* AI Precision Timing Node (Inflection Pulse) */}
          <circle 
            cx="14.5" 
            cy="12.5" 
            r="1.8" 
            fill="#34D399" 
            filter="url(#rebound-glow)"
          />
        </svg>
      </div>

      {/* Optional Wordmark */}
      {showText && (
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className={`font-serif ${config.font} font-bold tracking-tight text-[#EDEAE2] dark:text-white leading-none`}>
              Rebound
            </h1>
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
          </div>
          <p className={`${config.sub} font-mono text-[#A39C8D] mt-1 tracking-widest uppercase`}>
            UPI AUTOPAY AGENT
          </p>
        </div>
      )}
    </div>
  );
};
