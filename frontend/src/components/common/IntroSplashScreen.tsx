import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "@phosphor-icons/react";
import { useStore } from "../../store/useStore";

export const IntroSplashScreen: React.FC = () => {
  const { splashOpen, setSplashOpen } = useStore();

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
              duration: 0.75, 
              ease: [0.76, 0, 0.24, 1] // Luxury high-speed curtain roll
            } 
          }}
          className="fixed inset-0 z-[9999] bg-[#09090B] text-zinc-100 flex flex-col justify-between p-6 sm:p-12 select-none font-sans"
        >
          {/* Subtle ambient spotlight */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-96 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

          {/* Top Bar: Clean, minimal meta */}
          <div className="relative z-10 flex items-center justify-between border-b border-zinc-800/80 pb-5 max-w-5xl mx-auto w-full">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-zinc-400 tracking-wider uppercase">
                Razorpay AI Buildathon 2026
              </span>
              <span className="text-zinc-700 font-mono text-[10px]">•</span>
              <span className="text-[11px] font-mono text-zinc-500">
                Track 3: Autonomous Recovery
              </span>
            </div>

            <button
              onClick={handleDismiss}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 rounded-md transition-colors cursor-pointer bg-zinc-900/50"
            >
              <span>Skip Intro</span>
              <X size={12} />
            </button>
          </div>

          {/* Central Hero: Clean, confident, human editorial typography */}
          <div className="relative z-10 max-w-2xl mx-auto w-full my-auto py-8 flex flex-col items-center text-center">
            {/* Minimal Brandmark */}
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-8 shadow-sm">
              <svg 
                width="32" 
                height="32" 
                viewBox="0 0 32 32" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="intro-rebound-grad" x1="9" y1="7" x2="24" y2="25" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#34D399" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
                <path
                  d="M 9 7.5 L 9 24.5"
                  stroke="url(#intro-rebound-grad)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 9 7.5 H 16 C 19.2 7.5 21.5 9.5 21.5 12.5 C 21.5 15.5 19.2 17.5 16 17.5 H 9"
                  stroke="url(#intro-rebound-grad)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M 14 17.5 Q 16.5 24 23 24"
                  stroke="#34D399"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 20 21.5 L 23 24 L 20 26.5"
                  stroke="#34D399"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Wordmark & Clean Headline */}
            <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-white font-sans">
              REBOUND
            </h1>

            <p className="text-base sm:text-lg text-zinc-300 font-normal mt-3 max-w-lg leading-snug">
              Predictive UPI AutoPay Recovery Agent
            </p>

            <p className="text-xs sm:text-sm text-zinc-500 mt-3 max-w-md leading-relaxed font-mono">
              Times mandate retries to inferred customer liquidity windows with 100% RBI compliance gating.
            </p>

            {/* Action CTA: Clean tactile white button */}
            <div className="mt-10 flex flex-col items-center gap-3">
              <button
                onClick={handleDismiss}
                className="group px-7 py-3 rounded-full bg-white hover:bg-zinc-200 text-black font-medium text-sm transition-all duration-150 flex items-center gap-2 cursor-pointer shadow-md active:scale-98"
              >
                <span>Enter Terminal</span>
                <ArrowRight size={15} weight="bold" className="group-hover:translate-x-0.5 transition-transform" />
              </button>

              <span className="text-[11px] font-mono text-zinc-500">
                Press <kbd className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-400">Space</kbd> or <kbd className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-400">Enter</kbd> to roll up
              </span>
            </div>
          </div>

          {/* Bottom Strip: 3 Quiet Editorial Metrics */}
          <div className="relative z-10 border-t border-zinc-800/80 pt-6 max-w-4xl mx-auto w-full grid grid-cols-3 gap-6 text-center font-mono">
            <div>
              <div className="text-lg sm:text-xl font-medium text-white">70.1%</div>
              <div className="text-[11px] text-zinc-500 mt-0.5">Recovery Rate</div>
            </div>

            <div>
              <div className="text-lg sm:text-xl font-medium text-emerald-400">+24.8%</div>
              <div className="text-[11px] text-zinc-500 mt-0.5">Net Recovery Lift</div>
            </div>

            <div>
              <div className="text-lg sm:text-xl font-medium text-zinc-300">100% Gated</div>
              <div className="text-[11px] text-zinc-500 mt-0.5">RBI Statutory Shield</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
