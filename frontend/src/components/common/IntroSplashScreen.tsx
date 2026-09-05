import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { ArrowUp, X, Play, Pause } from "@phosphor-icons/react";
import { useStore } from "../../store/useStore";

interface TrailerScene {
  id: string;
  step: string;
  tag: string;
  headline: string;
  detail: string;
  stat: string;
  accent: string;
}

const TRAILER_SCENES: TrailerScene[] = [
  {
    id: "bounce",
    step: "01",
    tag: "THE BOUNCE",
    headline: "Subscription mandate bounces on Day 1",
    detail: "Stateless retries blindly debit empty customer balances, burning authorizations and incurring bank penalties.",
    stat: "45.3% NAIVE RETRY CEILING",
    accent: "#F59E0B"
  },
  {
    id: "timing",
    step: "02",
    tag: "THE CALIBRATION",
    headline: "GBDT identifies customer liquidity window",
    detail: "8 behavioral telemetry vectors infer verified payroll surplus on Day 5 with statutory pre-debit notice gating.",
    stat: "ROC-AUC 0.9982 CALIBRATED",
    accent: "#38BDF8"
  },
  {
    id: "rebound",
    step: "03",
    tag: "THE REBOUND",
    headline: "Autonomous re-debit executes & settles",
    detail: "Mandate is recovered at peak liquidity. Subscription preserved with zero merchant churn and complete RBI audit trail.",
    stat: "+₹96,048 RECOVERED (70.1% LIFT)",
    accent: "#10B981"
  }
];

export const IntroSplashScreen: React.FC = () => {
  const { splashOpen, setSplashOpen } = useStore();
  const [activeScene, setActiveScene] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragY = useMotionValue(0);

  // Dynamic opacity fade as the user pulls up
  const curtainOpacity = useTransform(dragY, [0, -300], [1, 0.3]);

  // Trailer auto-advance timer (every 3.8s)
  useEffect(() => {
    if (!splashOpen || isPaused) return;

    const timer = setInterval(() => {
      setActiveScene((prev) => (prev + 1) % TRAILER_SCENES.length);
    }, 3800);

    return () => clearInterval(timer);
  }, [splashOpen, isPaused]);

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

  const scene = TRAILER_SCENES[activeScene];

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
          className={`fixed inset-0 z-[9999] bg-black text-white select-none overflow-hidden font-sans flex flex-col justify-between p-6 sm:p-10 md:p-14 ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          {/* Subtle Inset Frame with Viewfinder Corner Ticks */}
          <div className="absolute inset-4 sm:inset-6 md:inset-8 border border-white/[0.08] pointer-events-none">
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

          {/* Centerpiece: Kinetic Brand Glyph, Fraunces Title & Animated Trailer Reel */}
          <div className="relative z-10 my-auto flex flex-col items-center text-center max-w-2xl mx-auto w-full">
            {/* Animated Kinetic Rebound Mark */}
            <motion.div 
              onClick={handleDismiss}
              className="relative w-16 h-16 sm:w-20 sm:h-20 mb-3 flex items-center justify-center cursor-pointer group"
              animate={
                activeScene === 0 
                  ? { y: [0, 4, 0] } // The Bounce
                  : activeScene === 1 
                  ? { scale: [1, 1.05, 1] } // The Calibration Pulse
                  : { y: [0, -6, 0] } // The Upward Rebound
              }
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg 
                width="56" 
                height="56" 
                viewBox="0 0 32 32" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="transition-transform group-hover:scale-105"
              >
                {/* Mandate Spine */}
                <path
                  d="M 9 6 L 9 26"
                  stroke={scene.accent}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="transition-colors duration-500"
                />
                {/* Cyclic Mandate Rhythm Loop */}
                <path
                  d="M 9 6 H 17 C 20.5 6 23 8.2 23 11.5 C 23 14.8 20.5 17 17 17 H 9"
                  stroke={scene.accent}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-colors duration-500"
                />
                {/* Dynamic Rebound Spring Leg */}
                <motion.path
                  d="M 14.5 17 Q 17.5 24 24 24"
                  stroke="#34D399"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Kinetic Launch Arrow */}
                <motion.path
                  d="M 20.5 20.5 L 24 24 L 20.5 27.5"
                  stroke="#34D399"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>

            {/* Giant Editorial Serif Title */}
            <h1 className="font-serif italic text-6xl sm:text-8xl md:text-[110px] text-white tracking-tight leading-none select-none">
              Rebound
            </h1>

            {/* The Animated "Trailer Reel" Story Component */}
            <div className="w-full mt-6 bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 sm:p-5 backdrop-blur-sm text-left">
              {/* 3-Act Segmented Trailer Progress Bars */}
              <div className="grid grid-cols-3 gap-2 pb-3 mb-3 border-b border-white/[0.06]">
                {TRAILER_SCENES.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveScene(idx)}
                    className="group text-left cursor-pointer transition-opacity"
                  >
                    {/* Hairline Segment Progress Bar */}
                    <div className="h-0.5 w-full bg-white/10 rounded-full overflow-hidden mb-1.5">
                      <motion.div 
                        className="h-full"
                        style={{ backgroundColor: s.accent }}
                        animate={{ 
                          width: activeScene === idx ? "100%" : activeScene > idx ? "100%" : "0%" 
                        }}
                        transition={activeScene === idx ? { duration: 3.8, ease: "linear" } : { duration: 0.2 }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className={activeScene === idx ? "text-white font-medium" : "text-zinc-600 group-hover:text-zinc-400"}>
                        {s.step} {s.tag}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Dynamic Animated Scene Narrative */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={scene.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span 
                      className="font-mono text-[11px] font-semibold tracking-wider uppercase"
                      style={{ color: scene.accent }}
                    >
                      ● SCENE {scene.step} : {scene.tag}
                    </span>
                    <span className="font-mono text-[10px] text-zinc-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                      {scene.stat}
                    </span>
                  </div>

                  <h2 className="text-base sm:text-lg font-medium text-white tracking-tight font-sans">
                    {scene.headline}
                  </h2>

                  <p className="text-xs sm:text-sm text-zinc-400 font-normal leading-relaxed">
                    {scene.detail}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom Row: Interactive Drag Handle & Presentation Hint */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-zinc-500">
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>TRAILER REEL ACTIVE</span>
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
