import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { ArrowUp, X } from "@phosphor-icons/react";
import { useStore } from "../../store/useStore";

export const IntroSplashScreen: React.FC = () => {
  const { splashOpen, setSplashOpen } = useStore();
  const [isDragging, setIsDragging] = useState(false);
  const dragY = useMotionValue(0);

  // Dynamic opacity fade as the user pulls up
  const curtainOpacity = useTransform(dragY, [0, -300], [1, 0.3]);

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
          dragConstraints={{ top: -1000, bottom: 0 }}
          dragElastic={{ top: 0.2, bottom: 0 }}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={(_e, info) => {
            setIsDragging(false);
            if (info.offset.y < -70 || info.velocity.y < -250) {
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
              duration: 0.65, 
              ease: [0.32, 0.72, 0, 1] 
            } 
          }}
          className={`fixed inset-0 z-[9999] bg-black text-white select-none overflow-hidden font-sans flex flex-col justify-between p-8 sm:p-12 md:p-16 ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          {/* Subtle Inset Frame with Viewfinder Corner Ticks */}
          <div className="absolute inset-4 sm:inset-8 md:inset-10 border border-white/[0.08] pointer-events-none">
            <span className="absolute -top-1.5 -left-1.5 text-white/30 font-mono text-[10px] leading-none">+</span>
            <span className="absolute -top-1.5 -right-1.5 text-white/30 font-mono text-[10px] leading-none">+</span>
            <span className="absolute -bottom-1.5 -left-1.5 text-white/30 font-mono text-[10px] leading-none">+</span>
            <span className="absolute -bottom-1.5 -right-1.5 text-white/30 font-mono text-[10px] leading-none">+</span>
          </div>

          {/* Top Row: Understated Studio Metadata */}
          <div className="relative z-10 flex items-center justify-between font-mono text-[11px] tracking-widest text-zinc-500 uppercase">
            <div className="flex items-center gap-3">
              <span className="text-zinc-300 font-medium">01 // REBOUND</span>
              <span className="text-zinc-700">/</span>
              <span>UPI AUTOPAY INTELLIGENCE</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="hidden sm:inline">RAZORPAY AI BUILDATHON 2026</span>
              <button
                onClick={handleDismiss}
                className="text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                title="Dismiss (or drag up)"
              >
                <span>[CLOSE]</span>
                <X size={10} />
              </button>
            </div>
          </div>

          {/* Centerpiece: Bold Editorial Wordmark & Brand Glyph */}
          <div className="relative z-10 my-auto flex flex-col items-center text-center">
            {/* Minimalist Geometric Vector Mark */}
            <div 
              onClick={handleDismiss}
              className="w-14 h-14 sm:w-16 sm:h-16 mb-6 flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
            >
              <svg 
                width="48" 
                height="48" 
                viewBox="0 0 32 32" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Clean emerald stroke */}
                <path
                  d="M 9 6 L 9 26"
                  stroke="#10B981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 9 6 H 17 C 20.5 6 23 8.2 23 11.5 C 23 14.8 20.5 17 17 17 H 9"
                  stroke="#10B981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M 14.5 17 Q 17.5 24 24 24"
                  stroke="#34D399"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 20.5 20.5 L 24 24 L 20.5 27.5"
                  stroke="#34D399"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Giant Editorial Serif Title */}
            <h1 className="font-serif italic text-7xl sm:text-9xl md:text-[140px] text-white tracking-tight leading-none">
              Rebound
            </h1>

            {/* Single Human Subtitle */}
            <p className="font-sans text-sm sm:text-base md:text-lg text-zinc-400 font-light mt-4 tracking-wide max-w-lg">
              Predictive UPI AutoPay Recovery &amp; Liquidity Timing
            </p>
          </div>

          {/* Bottom Row: Interactive Drag Handle & Presentation Hint */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-zinc-500">
            <div className="hidden sm:block">
              TRACK 03 : AUTONOMOUS REVENUE
            </div>

            {/* Tactile Pull-Up Pill */}
            <button
              onClick={handleDismiss}
              className="flex items-center gap-2.5 px-6 py-2 rounded-full border border-white/20 hover:border-white/40 bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white transition-all cursor-pointer group shadow-sm active:scale-95"
            >
              <span>Pull up or click to reveal</span>
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowUp size={13} className="text-[#10B981]" />
              </motion.div>
            </button>

            <div className="text-zinc-500">
              PRESS <kbd className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-300 text-[10px]">SPACE</kbd> TO ENTER
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
