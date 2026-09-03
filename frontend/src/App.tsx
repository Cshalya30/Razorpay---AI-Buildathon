import React from "react";
import { Sidebar } from "./components/layout/Sidebar";
import { TopBar } from "./components/layout/TopBar";
import { Ledger } from "./pages/Ledger";
import { RetryQueue } from "./pages/RetryQueue";
import { ComplianceDashboard } from "./pages/ComplianceDashboard";
import { EvalReport } from "./pages/EvalReport";
import { EngineRoom } from "./pages/EngineRoom";
import { CommandPalette } from "./components/common/CommandPalette";
import { ToastContainer } from "./components/common/ToastContainer";
import { useStore } from "./store/useStore";

export const App: React.FC = () => {
  const { activeNav } = useStore();

  return (
    <div className="flex min-h-screen bg-[#EDEAE2] text-[#1B1B18] font-sans">
      {/* 220px Fixed Ink Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#EDEAE2]">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          {activeNav === "ledger" && <Ledger />}
          {activeNav === "architecture" && <EngineRoom />}
          {activeNav === "retries" && <RetryQueue />}
          {activeNav === "compliance" && <ComplianceDashboard />}
          {activeNav === "eval" && <EvalReport />}
        </main>
      </div>

      {/* Global Command Palette (?K) */}
      <CommandPalette />

      {/* Global Toast Notification System */}
      <ToastContainer />
    </div>
  );
};
