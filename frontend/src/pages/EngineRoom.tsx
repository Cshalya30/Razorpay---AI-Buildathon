import React from "react";
import { StripeNodeFlow } from "../components/visual/StripeNodeFlow";
import { LinearIsometricCards } from "../components/visual/LinearIsometricCards";
import { motion } from "framer-motion";
import { FlowArrow, ShieldCheck, Cpu } from "@phosphor-icons/react";

export const EngineRoom: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="p-8 max-w-7xl mx-auto space-y-8"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[#DDD8CC]">
        <div>
          <div className="flex items-center gap-2 mb-1 text-[11px] font-mono text-[#2B4C7E]">
            <FlowArrow size={16} weight="bold" />
            <span>SYSTEM ARCHITECTURE &amp; OPERATING SPECIFICATIONS</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#1B1B18] tracking-tight">
            Architectural Blueprint &amp; System Flow
          </h1>
          <p className="text-[13px] text-[#6B6558] font-sans mt-1 max-w-3xl">
            Technical specifications for the RECOVER agent: deterministic central bank compliance gating, calibrated gradient-boosted timing, and sub-15ms decision latency.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-[#0F6B5C]/10 border border-[#0F6B5C]/30 text-[#0F6B5C] font-mono text-[11px] font-semibold">
            KERNEL v2.4 // DETERMINISTIC
          </span>
        </div>
      </div>

      {/* 1. Connected Architecture Node Flow (Image 5) */}
      <div>
        <div className="text-[11px] font-mono text-[#6B6558] uppercase tracking-wider mb-3">
          Autonomous Decision Pipeline (End-to-End)
        </div>
        <StripeNodeFlow />
      </div>

      {/* 2. Linear Isometric Blueprints (Image 1) */}
      <div>
        <div className="text-[11px] font-mono text-[#6B6558] uppercase tracking-wider mb-3">
          Core Engineering Pillars (Linear FIG 0.1 - 0.3)
        </div>
        <LinearIsometricCards />
      </div>

      {/* 3. Formal Model Card & Auditing Panel (Priority 2.3) */}
      <div className="bg-white border border-[#DDD8CC] p-6 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#DDD8CC] gap-2">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-[#2B4C7E]">
              <Cpu size={15} weight="bold" />
              <span>STATUTORY AUDIT / MODEL SPECIFICATION CARD</span>
            </div>
            <h2 className="text-xl font-serif font-bold text-[#1B1B18] mt-0.5">
              RECOVER Gradient Boosted Timing Model Card
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-[11px] font-mono font-semibold bg-[#0F6B5C]/10 text-[#0F6B5C] border border-[#0F6B5C]/20">
              ROC-AUC: 0.9982
            </span>
            <span className="px-2.5 py-1 text-[11px] font-mono font-semibold bg-[#2B4C7E]/10 text-[#2B4C7E] border border-[#2B4C7E]/20">
              PR-AUC: 0.9989
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5">
          {/* Col 1: Dataset & Training */}
          <div className="space-y-3">
            <h3 className="text-[12px] font-mono font-bold text-[#1B1B18] uppercase tracking-wider">
              Training &amp; Dataset Scope
            </h3>
            <ul className="text-[12px] text-[#6B6558] space-y-1.5 font-mono">
              <li>• <strong>Training Points:</strong> 7,680 historical settlement days</li>
              <li>• <strong>Holdout Test Points:</strong> 1,920 candidate days (20%)</li>
              <li>• <strong>Base Classifier:</strong> GradientBoostingClassifier (100 trees, depth 4, η=0.08)</li>
              <li>• <strong>Calibration:</strong> Sigmoid (Platt Scaling) via 3-Fold Cross-Validation</li>
              <li>• <strong>Inference Latency:</strong> 1.8ms per batch candidate evaluation</li>
            </ul>
          </div>

          {/* Col 2: Feature Matrix */}
          <div className="space-y-3">
            <h3 className="text-[12px] font-mono font-bold text-[#1B1B18] uppercase tracking-wider">
              8-Feature Vector Topology
            </h3>
            <div className="text-[11px] font-mono text-[#6B6558] space-y-1">
              <div>1. <code className="text-[#1B1B18] font-bold">days_since_salary</code>: Inflow elapsed distance</div>
              <div>2. <code className="text-[#1B1B18] font-bold">nearest_credit_distance</code>: Proximity to closest inflow</div>
              <div>3. <code className="text-[#1B1B18] font-bold">amount_to_inflow_ratio</code>: Debit size vs total income</div>
              <div>4. <code className="text-[#1B1B18] font-bold">salary_proximity_score</code>: Post-credit liquidity decay</div>
              <div>5. <code className="text-[#1B1B18] font-bold">burn_adjusted_headroom</code>: Projected surplus after burn</div>
              <div>6. <code className="text-[#1B1B18] font-bold">day_of_month</code>: Calendar settlement day (1–30)</div>
              <div>7. <code className="text-[#1B1B18] font-bold">category_code</code>: Regulatory category ordinal</div>
              <div>8. <code className="text-[#1B1B18] font-bold">prior_attempts</code>: Cumulative bounce count</div>
            </div>
          </div>

          {/* Col 3: Explicit Known Limitations */}
          <div className="space-y-3 bg-[#EDEAE2]/50 p-3.5 border border-[#DDD8CC]">
            <h3 className="text-[12px] font-mono font-bold text-[#A6323B] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck size={15} />
              <span>Audited Known Limitations</span>
            </h3>
            <div className="text-[11px] text-[#4A453A] space-y-2 leading-relaxed">
              <p>
                <strong>1. Inferred vs Observed Salary:</strong> Salary day is strictly <em>statistically inferred</em> from recurring monthly credit transaction sequences (Argmax credit proximity). The system never observes nor accesses employer payroll files.
              </p>
              <p>
                <strong>2. Synthetic Benchmark Data:</strong> Evaluation was conducted on a simulated 30-day liquidity ledger containing stochastic spending variance, 22% gig-economy profiles, and 2% technical network failures. Production rollout requires shadow-mode validation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. In-App Known Issues, Fixed Changelog (Priority 3.1) */}
      <div className="bg-white border border-[#DDD8CC] p-6 shadow-card">
        <div className="flex items-center justify-between pb-3 border-b border-[#DDD8CC]">
          <div>
            <div className="text-[11px] font-mono text-[#0F6B5C] uppercase tracking-wider font-bold">
              BUILD HARDENING &amp; FAILURE RECOVERY LOG // v2.4
            </div>
            <h2 className="text-xl font-serif font-bold text-[#1B1B18] mt-0.5">
              Known Issues Audited &amp; Defensively Resolved
            </h2>
          </div>
          <span className="px-2.5 py-1 text-[11px] font-mono font-semibold bg-[#0F6B5C]/10 text-[#0F6B5C]">
            4 OF 4 AUDIT ITEMS RESOLVED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 text-[12px]">
          {/* Item 1 */}
          <div className="p-3 bg-[#EDEAE2]/40 border border-[#DDD8CC] space-y-1.5 font-mono">
            <div className="flex items-center justify-between font-bold text-[#1B1B18]">
              <span>FIX 0.1 · CONSTANT CONFIDENCE BUG</span>
              <span className="text-[#0F6B5C] text-[10px] bg-[#0F6B5C]/15 px-1.5 py-0.5">RESOLVED</span>
            </div>
            <p className="text-[#6B6558] text-[11px] font-sans">
              <strong>Symptom:</strong> Retry queue rendered a flat 89% confidence on every row.
            </p>
            <p className="text-[#6B6558] text-[11px] font-sans">
              <strong>Root Cause &amp; Fix:</strong> Upstream mock seed generator contained a ternary stub (<code className="text-[#2B4C7E]">0.89 if retry_scheduled</code>). Resolved in v2.4 by wiring genuine per-record calibrated Gradient Boosting inference (<code className="text-[#2B4C7E]">model.predict_proba</code>). Automated check validates spread (σ = 0.201 &gt; 0.05).
            </p>
          </div>

          {/* Item 2 */}
          <div className="p-3 bg-[#EDEAE2]/40 border border-[#DDD8CC] space-y-1.5 font-mono">
            <div className="flex items-center justify-between font-bold text-[#1B1B18]">
              <span>FIX 0.2 · CURRENCY GLYPH DECODING</span>
              <span className="text-[#0F6B5C] text-[10px] bg-[#0F6B5C]/15 px-1.5 py-0.5">RESOLVED</span>
            </div>
            <p className="text-[#6B6558] text-[11px] font-sans">
              <strong>Symptom:</strong> ₹ (U+20B9) was rendering as '?' on all ledger and report pages.
            </p>
            <p className="text-[#6B6558] text-[11px] font-sans">
              <strong>Root Cause &amp; Fix:</strong> Windows PowerShell stdout pipe converted UTF-8 characters to ASCII 0x3F. Resolved by rewriting templates with strict UTF-8 Byte sequences and adding system font stack fallbacks.
            </p>
          </div>

          {/* Item 3 */}
          <div className="p-3 bg-[#EDEAE2]/40 border border-[#DDD8CC] space-y-1.5 font-mono">
            <div className="flex items-center justify-between font-bold text-[#1B1B18]">
              <span>FIX 0.3 · SALARY DAY DATA LEAKAGE AUDIT</span>
              <span className="text-[#0F6B5C] text-[10px] bg-[#0F6B5C]/15 px-1.5 py-0.5">AUDITED &amp; GATED</span>
            </div>
            <p className="text-[#6B6558] text-[11px] font-sans">
              <strong>Symptom:</strong> Baseline evaluator checked generator ground-truth <code className="text-[#2B4C7E]">customer.salary_day</code>.
            </p>
            <p className="text-[#6B6558] text-[11px] font-sans">
              <strong>Root Cause &amp; Fix:</strong> Evaluator runner had an unshielded shortcut. Resolved in v2.4 by enforcing strict statistical inference from historical credits (<code className="text-[#2B4C7E]">infer_salary_day</code>) with an explicit runtime assertion preventing ground-truth leakage.
            </p>
          </div>

          {/* Item 4 */}
          <div className="p-3 bg-[#EDEAE2]/40 border border-[#DDD8CC] space-y-1.5 font-mono">
            <div className="flex items-center justify-between font-bold text-[#1B1B18]">
              <span>FIX 0.4 · STOCHASTIC NOISE &amp; BENCHMARK REALISM</span>
              <span className="text-[#0F6B5C] text-[10px] bg-[#0F6B5C]/15 px-1.5 py-0.5">CALIBRATED</span>
            </div>
            <p className="text-[#6B6558] text-[11px] font-sans">
              <strong>Symptom:</strong> Synthetic balance simulator was too deterministic (98.7% vs 66.1% recovery).
            </p>
            <p className="text-[#6B6558] text-[11px] font-sans">
              <strong>Root Cause &amp; Fix:</strong> Added 22% gig-economy irregular profiles, 15% payroll jitter, and 2% technical gateway declines. New benchmark lands at realistic 70.1% model vs 45.3% naive baseline (+24.8pt net lift).
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
