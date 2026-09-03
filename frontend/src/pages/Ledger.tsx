import React, { useEffect, useState } from "react";
import { useStore } from "../store/useStore";
import { api } from "../api/client";
import { Mandate } from "../types";
import { HeroMetric } from "../components/ledger/HeroMetric";
import { CategoryBreakdownCard } from "../components/ledger/CategoryBreakdownCard";
import { DemoScenarioBar } from "../components/ledger/DemoScenarioBar";
import { BaselineComparisonSection } from "../components/eval/BaselineComparisonSection";
import { LedgerTable } from "../components/ledger/LedgerTable";
import { MandateDetailDrawer } from "../components/detail/MandateDetailDrawer";
import { io } from "socket.io-client";
import { motion } from "framer-motion";
import { FlowArrow, ArrowRight } from "@phosphor-icons/react";

export const Ledger: React.FC = () => {
  const { metrics, evalComparison, setMetrics, setEvalComparison, setActiveNav } = useStore();
  const [mandates, setMandates] = useState<Mandate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = async () => {
    try {
      const mandateData = await api.getMandates({ limit: 100 });
      setMandates(mandateData.mandates);
      if (mandateData.metrics) {
        setMetrics(mandateData.metrics);
      }
      const evalData = await api.getLatestEval();
      setEvalComparison(evalData);
    } catch (err) {
      console.error("Failed to fetch ledger data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Setup Socket.io live retry updates
    const socket = io();
    socket.on("mandate:update", () => {
      loadData();
    });
    socket.on("mandate:recovered", () => {
      loadData();
    });
    socket.on("retry:scheduled", () => {
      loadData();
    });

    // Fallback 4s polling
    const interval = setInterval(() => {
      loadData();
    }, 4000);

    return () => {
      socket.disconnect();
      clearInterval(interval);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="p-8 max-w-7xl mx-auto space-y-6"
    >
      {/* Walkthrough Scenarios Bar for Part 9 & Demo Protocol */}
      <DemoScenarioBar />

      {/* System Architecture Callout Bar */}
      <div className="bg-white border border-[#DDD8CC] p-4 shadow-card flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#2B4C7E]/10 text-[#2B4C7E] flex items-center justify-center font-bold">
            <FlowArrow size={18} />
          </div>
          <div>
            <div className="text-[13px] font-bold text-[#1B1B18] font-sans">
              System Architecture &amp; Decision Flow Blueprints
            </div>
            <div className="text-[11px] text-[#6B6558] font-sans">
              Inspect the end-to-end payment orchestration node map and the Linear-style core engineering pillars.
            </div>
          </div>
        </div>

        <button
          onClick={() => setActiveNav("architecture")}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2B4C7E] hover:bg-[#233F69] text-white text-[11px] font-mono font-medium transition-colors shadow-sm"
        >
          <span>Open Architecture Deck</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Row 1 & 2: Hero Metric + Stat Quad */}
      <HeroMetric metrics={metrics} evalComparison={evalComparison} />

      {/* Sectoral Breakdown Card */}
      <CategoryBreakdownCard />

      {/* Row 3: Folded Baseline vs Model Comparison Section */}
      <BaselineComparisonSection comparison={evalComparison} />

      {/* Row 4: High Density Ledger Table */}
      <LedgerTable mandates={mandates} onRefresh={loadData} />

      {/* 480px Slide-over Mandate Detail Drawer */}
      <MandateDetailDrawer onRefreshLedger={loadData} />
    </motion.div>
  );
};
