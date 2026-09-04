import React, { useState } from "react";
import { useStore } from "../../store/useStore";
import { api, downloadAuditCsv } from "../../api/client";
import { 
  MagnifyingGlass, 
  ArrowsClockwise, 
  Command,
  FileCsv,
  Moon,
  Sun,
  List
} from "@phosphor-icons/react";

export const TopBar: React.FC = () => {
  const { 
    setEvalComparison, 
    setCommandPaletteOpen, 
    addToast, 
    isDarkMode, 
    toggleDarkMode,
    setMobileMenuOpen,
    liveSyncActive,
    toggleLiveSync
  } = useStore();
  const [evalLoading, setEvalLoading] = useState<boolean>(false);

  const handleRunEval = async () => {
    try {
      setEvalLoading(true);
      const res = await api.runEvaluation();
      setEvalComparison(res);
      addToast(
        `Policy benchmark complete! Recovery Rate: ${res.model.recoveryRate.toFixed(1)}% (+${res.deltaRecoveryRate.toFixed(1)}pt lift)`,
        "success"
      );
    } catch (err) {
      console.error("Failed to run eval:", err);
      addToast("Failed to run evaluation benchmark", "warning");
    } finally {
      setEvalLoading(false);
    }
  };

  const handleExportCsv = () => {
    downloadAuditCsv();
    addToast("Downloaded RBI statutory audit CSV directly!", "success");
  };

  const handleToggleSync = () => {
    toggleLiveSync();
    if (liveSyncActive) {
      addToast("Live Sync Engine: Paused (manual refresh active)", "warning");
    } else {
      addToast("Live Sync Engine: Connected (active polling 1s)", "success");
    }
  };

  return (
    <header className="h-14 bg-white border-b border-[#DDD8CC] px-4 md:px-8 flex items-center justify-between shrink-0 shadow-card">
      {/* Mobile Menu & Search trigger */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden p-1.5 text-[#1B1B18] hover:bg-[#EDEAE2] rounded-sm transition-colors"
          title="Open Navigation"
        >
          <List size={20} weight="bold" />
        </button>

        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-2.5 px-3 py-1.5 bg-[#EDEAE2]/50 hover:bg-[#EDEAE2] border border-[#DDD8CC] text-[#6B6558] hover:text-[#1B1B18] text-[12px] transition-colors rounded-sm group w-44 sm:w-60 md:w-72"
        >
          <MagnifyingGlass size={15} className="text-[#6B6558] group-hover:text-[#1B1B18] shrink-0" />
          <span className="font-sans flex-1 text-left truncate">Search mandates...</span>
          <div className="hidden sm:flex items-center gap-0.5 text-[10px] font-mono bg-white px-1.5 py-0.5 border border-[#DDD8CC] rounded-sm text-[#6B6558]">
            <Command size={10} />
            <span>K</span>
          </div>
        </button>

        {/* Live Socket Status / Interactive Toggle */}
        <button
          onClick={handleToggleSync}
          className="hidden lg:flex items-center gap-2 px-2 py-1 text-[11px] font-mono text-[#6B6558] hover:bg-[#EDEAE2] rounded-sm border border-transparent hover:border-[#DDD8CC] transition-colors cursor-pointer"
          title="Click to toggle real-time synchronization"
        >
          <span className={`w-2 h-2 rounded-full ${liveSyncActive ? "bg-[#0F6B5C] animate-live-pulse" : "bg-[#B4790E]"}`} />
          <span>{liveSyncActive ? "Live Sync Engine" : "Sync: Paused"}</span>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Dark Mode Toggle Button */}
        <button
          onClick={toggleDarkMode}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-mono text-[#1B1B18] hover:bg-[#EDEAE2] border border-[#DDD8CC] transition-colors shadow-sm rounded-sm"
          title="Toggle Dark / Light Mode"
        >
          {isDarkMode ? (
            <>
              <Sun size={15} className="text-amber-400" weight="fill" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon size={15} className="text-[#2B4C7E]" weight="bold" />
              <span>Dark Mode</span>
            </>
          )}
        </button>

        <button
          onClick={handleExportCsv}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-mono text-[#1B1B18] hover:bg-[#EDEAE2] border border-[#DDD8CC] transition-colors shadow-sm rounded-sm"
        >
          <FileCsv size={15} />
          <span>Export Audit</span>
        </button>

        <button
          onClick={handleRunEval}
          disabled={evalLoading}
          className="flex items-center gap-2 px-3.5 py-1.5 bg-[#2B4C7E] text-white text-[12px] font-medium hover:bg-[#233F69] disabled:opacity-50 transition-colors shadow-sm rounded-sm"
        >
          <ArrowsClockwise size={14} className={evalLoading ? "animate-spin" : ""} />
          <span>{evalLoading ? "Benchmarking..." : "Re-run Policy Eval"}</span>
        </button>
      </div>
    </header>
  );
};
