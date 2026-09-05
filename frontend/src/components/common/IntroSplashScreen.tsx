import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { 
  ArrowUp, 
  CaretUp, 
  X, 
  ShieldCheck, 
  TrendUp, 
  CurrencyInr, 
  Cpu,
  ArrowsClockwise
} from "@phosphor-icons/react";
import { useStore } from "../../store/useStore";

export const IntroSplashScreen: React.FC = () => {
  const { splashOpen, setSplashOpen } = useStore();
  const [isDragging, setIsDragging] = useState(false);
  const dragY = useMotionValue(0);

  // Dynamic opacity fade as the user drags up
  const curtainOpacity = useTransform(dragY, [0, -350], [1, 0.4]);

  // Keyboard shortcut listener to dismiss (Space, Enter, Esc)
  useEffect(() => {
    if (!splashOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter" || e.code === "Escape") {
        e.preventDefault();
        handleDismiss();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [splashOpen]);

  const handleDismiss = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("rebound_splash_dismissed", "true");
    }
    setSplashOpen(false);
  };

  return (
    <AnimatePresence>
      {splashOpen && (
        <motion.div
          key="rebound-splash-rolling-curtain"
          style={{ y: dragY, opacity: curtainOpacity }}
          drag="y"
          dragConstraints={{ top: -1200, bottom: 0 }}
          dragElastic={{ top: 0.15, bottom: 0 }}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={(_e, info) => {
            setIsDragging(false);
            // If dragged up by more than 80px or flicked upward with velocity, dismiss!
            if (info.offset.y < -80 || info.velocity.y < -300) {
              handleDismiss();
            } else {
              dragY.set(0);
            }
          }}
          initial={{ y: 0, opacity: 1 }}
          exit={{ 
            y: "-100%", 
            opacity: 1,
            transition: { 
              duration: 0.6, 
              ease: [0.32, 0.72, 0, 1] 
            } 
          }}
          className={`fixed inset-0 z-[9999] bg-[#05070B] text-white flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden font-sans ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          {/* Subtle Ambient Studio Vignette & Fine Architectural Grid */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage: "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
              backgroundSize: "48px 48px"
            }}
          />

          {/* Deep Emerald Diffused Backlight */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#10B981]/[0.08] rounded-full blur-[120px] pointer-events-none" />

          {/* Top Bar: Buildathon Context & Quick Dismiss */}
          <div className="relative z-10 flex items-center justify-between border-b border-white/[0.08] pb-4 max-w-6xl mx-auto w-full">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 font-mono text-[11px] text-zinc-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold tracking-wide">RAZORPAY AI BUILDATHON</span>
              </div>
              <span className="hidden sm:inline font-mono text-[11px] text-zinc-500">
                TRACK 3 : AUTONOMOUS REVENUE RECOVERY
              </span>
            </div>

            <button
              onClick={handleDismiss}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-zinc-400 hover:text-white text-xs font-mono transition-colors cursor-pointer"
            >
              <span>Dismiss</span>
              <X size={12} />
            </button>
          </div>

          {/* Center Stage: Sculptural Emblem & Cinematic Title */}
          <div className="relative z-10 max-w-3xl mx-auto w-full my-auto flex flex-col items-center text-center">
            {/* Sculptural Rebound Kinetic Crest */}
            <motion.div 
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative mb-6 group cursor-pointer"
              onClick={handleDismiss}
            >
              {/* Outer Frosted Glass Ring */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-b from-[#1E2638]/60 via-[#0F141F]/80 to-[#0A0D14] border-2 border-emerald-500/30 shadow-[0_20px_50px_rgba(16,185,129,0.2)] flex items-center justify-center relative backdrop-blur-xl group-hover:border-emerald-400/60 transition-colors">
                {/* Radial Glow Highlight */}
                <div className="absolute inset-0 bg-emerald-500/10 rounded-3xl blur-md pointer-events-none" />

                {/* SVG Precision Kinetic Emblem */}
                <svg 
                  width="60" 
                  height="60" 
                  viewBox="0 0 32 32" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="relative z-10 drop-shadow-[0_4px_12px_rgba(16,185,129,0.6)]"
                >
                  <defs>
                    <linearGradient id="crest-rebound-grad" x1="8" y1="7" x2="24" y2="25" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#34D399" />
                      <stop offset="60%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#047857" />
                    </linearGradient>
                    <linearGradient id="crest-accent" x1="14" y1="18" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#6EE7B7" />
                      <stop offset="100%" stopColor="#34D399" />
                    </linearGradient>
                  </defs>

                  {/* Vertical Mandate Spine */}
                  <path
                    d="M 9 7.5 L 9 24.5"
                    stroke="url(#crest-rebound-grad)"
                    strokeWidth="2.75"
                    strokeLinecap="round"
                  />

                  {/* Mandate Periodic Rhythm Loop */}
                  <path
                    d="M 9 7.5 H 16.5 C 19.8 7.5 22 9.5 22 12.5 C 22 15.5 19.8 17.5 16.5 17.5 H 9"
                    stroke="url(#crest-rebound-grad)"
                    strokeWidth="2.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Kinetic Dynamic Spring Curve */}
                  <path
                    d="M 14.5 17.5 Q 16.5 24 23.5 24"
                    stroke="url(#crest-accent)"
                    strokeWidth="2.75"
                    strokeLinecap="round"
                  />

                  {/* High-Velocity Rebound Arrow Head */}
                  <path
                    d="M 20.5 21 L 24 24 L 20.5 27"
                    stroke="#6EE7B7"
                    strokeWidth="2.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* AI Liquidity Timing Dot */}
                  <circle 
                    cx="14.5" 
                    cy="12.5" 
                    r="2" 
                    fill="#6EE7B7" 
                  />
                </svg>
              </div>
            </motion.div>

            {/* Typography */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[11px] font-medium tracking-widest uppercase">
                <span>Autonomous Mandate Recovery</span>
              </div>

              <h1 className="text-5xl sm:text-7xl font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-500 font-sans">
                REBOUND
              </h1>

              <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
                Stateless retries burn mandate authorizations. <strong className="text-zinc-200 font-medium">Rebound</strong> times recurring payment re-debits to inferred customer liquidity and payroll surplus windows.
              </p>
            </div>

            {/* Interactive "MOVE IT" Drag & Slide Reveal Handle */}
            <div className="mt-8 flex flex-col items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleDismiss}
                className="group px-8 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-semibold text-sm tracking-wide shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.5)] transition-all flex items-center gap-3 cursor-pointer"
              >
                <span>SLIDE UP TO REVEAL TERMINAL</span>
                <motion.div
                  animate={{ y: [-2, -6, -2] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowUp size={16} weight="bold" />
                </motion.div>
              </motion.button>

              <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
                <span>Drag anywhere up with mouse</span>
                <span>•</span>
                <span>or press <kbd className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-300">Space</kbd></span>
              </div>
            </div>
          </div>

          {/* Bottom Rail: High-Density Audited Financial HUD Strip */}
          <div className="relative z-10 max-w-4xl mx-auto w-full border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl rounded-2xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono">
            <div className="flex flex-col items-center justify-center p-2">
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">PORTFOLIO RECOVERY</div>
              <div className="text-xl sm:text-2xl font-bold text-white mt-1">70.1%</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">82 of 117 at-risk mandates</div>
            </div>

            <div className="flex flex-col items-center justify-center p-2 border-l border-white/[0.06]">
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">NET ML LIFT</div>
              <div className="text-xl sm:text-2xl font-bold text-emerald-400 mt-1">+24.8 pt</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">vs 45.3% naive baseline</div>
            </div>

            <div className="flex flex-col items-center justify-center p-2 border-l border-white/[0.06]">
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">CAPITAL RECOVERED</div>
              <div className="text-xl sm:text-2xl font-bold text-emerald-300 mt-1">+₹96,048</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">₹3,23,531 total settled</div>
            </div>

            <div className="flex flex-col items-center justify-center p-2 border-l border-white/[0.06]">
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">STATUTORY SHIELD</div>
              <div className="text-xl sm:text-2xl font-bold text-sky-400 mt-1">100% Gated</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">RBI Master Direction Sec 5.3</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
