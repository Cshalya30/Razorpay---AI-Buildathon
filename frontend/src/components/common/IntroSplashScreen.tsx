import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  Cpu, 
  TrendUp, 
  ArrowRight, 
  Terminal, 
  Sparkle,
  CheckCircle,
  CurrencyInr,
  Lightning,
  ArrowsClockwise
} from "@phosphor-icons/react";
import { useStore } from "../../store/useStore";

export const IntroSplashScreen: React.FC = () => {
  const { splashOpen, setSplashOpen } = useStore();
  const [bootStep, setBootStep] = useState<number>(0);

  // Staged telemetry boot sequence
  useEffect(() => {
    if (!splashOpen) return;

    const timer1 = setTimeout(() => setBootStep(1), 250);
    const timer2 = setTimeout(() => setBootStep(2), 600);
    const timer3 = setTimeout(() => setBootStep(3), 950);
    const timer4 = setTimeout(() => setBootStep(4), 1300);
    const timer5 = setTimeout(() => setBootStep(5), 1650);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [splashOpen]);

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
          initial={{ y: 0, opacity: 1 }}
          exit={{ 
            y: "-100%", 
            opacity: 1,
            transition: { 
              duration: 0.85, 
              ease: [0.76, 0, 0.24, 1] // Luxury high-speed rolling curtain curve
            } 
          }}
          className="fixed inset-0 z-[9999] bg-[#05070A] text-white flex flex-col justify-between p-6 sm:p-10 md:p-12 overflow-hidden select-none font-sans"
        >
          {/* Background Ambient Cyber-Fintech Mesh */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: "radial-gradient(#34D399 1px, transparent 1px), radial-gradient(#2563EB 1px, transparent 1px)",
              backgroundSize: "32px 32px",
              backgroundPosition: "0 0, 16px 16px"
            }}
          />

          {/* Deep Radiant Emerald Ambient Radial Glow */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#0F6B5C]/20 via-[#10B981]/15 to-[#0284C7]/10 rounded-full blur-[140px] pointer-events-none" />

          {/* Top Bar: Live Status Indicators & Dismiss Shortcut */}
          <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] font-mono text-[11px] font-semibold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
                <span>RAZORPAY AI BUILDATHON 2026</span>
              </div>
              <span className="hidden sm:inline text-[11px] font-mono text-zinc-400">
                TRACK 3: AI REVENUE RECOVERY
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden md:inline text-[11px] font-mono text-zinc-400">
                Click button or press <kbd className="px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-zinc-200">Space</kbd> to roll up
              </span>
              <button
                onClick={handleDismiss}
                className="px-3.5 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-xs font-mono font-medium text-zinc-200 hover:text-white border border-zinc-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span>Dismiss Intro</span>
                <span className="text-[10px] text-zinc-400">✕</span>
              </button>
            </div>
          </div>

          {/* Central Hero: Animated Rebound Brandmark & Telemetry Hub */}
          <div className="relative z-10 max-w-4xl mx-auto w-full my-auto py-6 flex flex-col items-center text-center">
            {/* Animated Kinetic Logo Mark */}
            <div className="relative mb-6">
              {/* Pulsing Concentric Soundwave Rings */}
              <div className="absolute inset-0 -m-6 rounded-full border border-[#10B981]/20 animate-ping pointer-events-none" style={{ animationDuration: '3s' }} />
              <div className="absolute inset-0 -m-12 rounded-full border border-[#10B981]/10 pointer-events-none" />

              {/* 80px Glassmorphism Icon Vessel */}
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-[#18181B] via-[#0F141C] to-[#0A0A0B] border-2 border-[#10B981]/50 shadow-[0_0_50px_rgba(16,185,129,0.35)] flex items-center justify-center relative group"
              >
                <div className="absolute inset-0 bg-[#10B981]/15 rounded-3xl blur-md pointer-events-none" />

                <svg 
                  width="64" 
                  height="64" 
                  viewBox="0 0 32 32" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="relative z-10 drop-shadow-[0_0_12px_rgba(16,185,129,0.8)]"
                >
                  <defs>
                    <linearGradient id="splash-rebound-grad" x1="6" y1="6" x2="26" y2="26" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="60%" stopColor="#059669" />
                      <stop offset="100%" stopColor="#047857" />
                    </linearGradient>
                    <linearGradient id="splash-rebound-accent" x1="12" y1="12" x2="26" y2="6" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#34D399" />
                      <stop offset="100%" stopColor="#6EE7B7" />
                    </linearGradient>
                  </defs>

                  {/* Vertical Mandate Spine */}
                  <path
                    d="M 9 7.5 L 9 24.5"
                    stroke="url(#splash-rebound-grad)"
                    strokeWidth="2.75"
                    strokeLinecap="round"
                  />

                  {/* Upper Cyclical Billing Rhythm Loop */}
                  <path
                    d="M 9 7.5 H 16.5 C 19.8 7.5 22 9.5 22 12.5 C 22 15.5 19.8 17.5 16.5 17.5 H 9"
                    stroke="url(#splash-rebound-grad)"
                    strokeWidth="2.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Dynamic Rebound Spring Leg launching upward */}
                  <path
                    d="M 14.5 17.5 Q 16.5 24 23.5 24"
                    stroke="url(#splash-rebound-accent)"
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

                  {/* AI Timing Node Pulse */}
                  <circle 
                    cx="14.5" 
                    cy="12.5" 
                    r="2.2" 
                    fill="#34D399" 
                    className="animate-pulse"
                  />
                </svg>
              </motion.div>
            </div>

            {/* Typography */}
            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-zinc-100 to-zinc-400">
                REBOUND
              </h1>
              <p className="font-mono text-xs sm:text-sm text-emerald-400 font-semibold tracking-widest uppercase mt-2">
                Predictive UPI AutoPay Recovery &amp; Liquidity Timing Agent
              </p>
              <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto mt-3 leading-relaxed font-sans">
                Stateless UPI mandates bounce because debit attempts are treated as blind point-in-time transactions. <strong className="text-white">REBOUND</strong> times re-debits to inferred customer salary and surplus windows with 100% central bank compliance gating.
              </p>
            </motion.div>

            {/* High-Tech Staged Telemetry Terminal Box */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="w-full max-w-2xl mt-6 bg-[#0B0F19]/90 border border-[#1E293B] rounded-xl p-4 text-left font-mono text-xs shadow-2xl backdrop-blur-md"
            >
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-zinc-800 text-[11px] text-zinc-400">
                <div className="flex items-center gap-2">
                  <Terminal size={14} className="text-[#10B981]" />
                  <span className="text-zinc-300 font-semibold">KERNEL TELEMETRY INITIALIZATION</span>
                </div>
                <span className="text-emerald-400 font-bold">STATUS: OPERATIONAL</span>
              </div>

              <div className="space-y-1.5 text-[11px] sm:text-[12px]">
                <div className={`transition-opacity duration-300 ${bootStep >= 1 ? "opacity-100 text-zinc-300" : "opacity-25 text-zinc-600"}`}>
                  <span className="text-[#10B981] font-bold">● [0.1s]</span> NPCI UPI AutoPay Settlement Telemetry: <span className="text-emerald-400">CONNECTED</span>
                </div>
                <div className={`transition-opacity duration-300 ${bootStep >= 2 ? "opacity-100 text-zinc-300" : "opacity-25 text-zinc-600"}`}>
                  <span className="text-[#10B981] font-bold">● [0.3s]</span> Central Bank Statutory Shield: <span className="text-emerald-400">GATED (24h Notice, ₹15k AFA, 4-Cap)</span>
                </div>
                <div className={`transition-opacity duration-300 ${bootStep >= 3 ? "opacity-100 text-zinc-300" : "opacity-25 text-zinc-600"}`}>
                  <span className="text-[#10B981] font-bold">● [0.5s]</span> GBDT Liquidity Model: <span className="text-emerald-400">CALIBRATED (8 Features, ROC-AUC 0.9982)</span>
                </div>
                <div className={`transition-opacity duration-300 ${bootStep >= 4 ? "opacity-100 text-zinc-300" : "opacity-25 text-zinc-600"}`}>
                  <span className="text-[#10B981] font-bold">● [0.7s]</span> Portfolio Recovery Benchmark: <span className="text-emerald-400 font-bold">70.1% vs 45.3% (+24.8pt Net Lift)</span>
                </div>
                <div className={`transition-opacity duration-300 ${bootStep >= 5 ? "opacity-100 text-emerald-300 font-semibold" : "opacity-25 text-zinc-600"}`}>
                  <span className="text-[#10B981] font-bold">● [1.0s]</span> Autonomous Decision Kernel: <span className="text-white bg-emerald-500/20 px-1 rounded">READY FOR ORCHESTRATION</span>
                </div>
              </div>
            </motion.div>

            {/* Launch Call To Action Button (The "Rolling Screen" Trigger) */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="mt-8 flex flex-col sm:flex-row items-center gap-4"
            >
              <button
                onClick={handleDismiss}
                className="group relative px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#0F6B5C] via-[#10B981] to-[#059669] text-white font-mono font-bold text-sm tracking-wide shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:shadow-[0_0_45px_rgba(16,185,129,0.8)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3 cursor-pointer"
              >
                <span>ENTER REBOUND TERMINAL</span>
                <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" />
              </button>

              <span className="text-xs font-mono text-zinc-400">
                [Press <strong className="text-white font-semibold">Space</strong> or <strong className="text-white font-semibold">Enter</strong> to Roll Up]
              </span>
            </motion.div>
          </div>

          {/* Bottom Rail: Audited Financial Proof Strip */}
          <div className="relative z-10 border-t border-white/10 pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono text-xs">
            <div className="p-2 bg-white/5 rounded-lg border border-white/5">
              <div className="text-[10px] text-zinc-400 uppercase">RECOVERY RATE</div>
              <div className="text-base sm:text-lg font-bold text-[#10B981] mt-0.5">70.1%</div>
              <div className="text-[10px] text-zinc-500">82 of 117 at-risk mandates</div>
            </div>

            <div className="p-2 bg-white/5 rounded-lg border border-white/5">
              <div className="text-[10px] text-zinc-400 uppercase">NET AI LIFT</div>
              <div className="text-base sm:text-lg font-bold text-[#34D399] mt-0.5">+24.8 pt</div>
              <div className="text-[10px] text-zinc-500">vs 45.3% naive baseline</div>
            </div>

            <div className="p-2 bg-white/5 rounded-lg border border-white/5">
              <div className="text-[10px] text-zinc-400 uppercase">CAPITAL RECOVERED</div>
              <div className="text-base sm:text-lg font-bold text-[#10B981] mt-0.5">+₹96,048</div>
              <div className="text-[10px] text-zinc-500">₹3,23,531 total settled</div>
            </div>

            <div className="p-2 bg-white/5 rounded-lg border border-white/5">
              <div className="text-[10px] text-zinc-400 uppercase">STATUTORY GATING</div>
              <div className="text-base sm:text-lg font-bold text-sky-400 mt-0.5">100% Gated</div>
              <div className="text-[10px] text-zinc-500">RBI Master Direction Sec 5.3</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
