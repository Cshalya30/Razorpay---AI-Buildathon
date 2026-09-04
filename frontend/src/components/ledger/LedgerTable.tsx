import React, { useState } from "react";
import { Mandate } from "../../types";
import { StatusStripe } from "./StatusStripe";
import { useStore } from "../../store/useStore";
import { api } from "../../api/client";
import { MagnifyingGlass, Play } from "@phosphor-icons/react";

interface LedgerTableProps {
  mandates: Mandate[];
  onRefresh: () => void;
}

export const LedgerTable: React.FC<LedgerTableProps> = ({ mandates, onRefresh }) => {
  const { setSelectedMandate, selectedMandateId, addToast } = useStore();
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);
  const [pipelineStage, setPipelineStage] = useState<{ mandateId: string; step: number } | null>(null);

  const filteredMandates = mandates.filter((m) => {
    if (filterStatus !== "all" && m.status !== filterStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchId = m.id.toLowerCase().includes(q);
      const matchMerchant = m.merchant_name.toLowerCase().includes(q);
      const matchCust = m.customer_name?.toLowerCase().includes(q);
      if (!matchId && !matchMerchant && !matchCust) return false;
    }
    return true;
  });

  const handleSimulate = async (e: React.MouseEvent, mandateId: string) => {
    e.stopPropagation();
    try {
      setLoadingActionId(mandateId);
      // Priority 2.4: Sequential live pipeline animation (finishes in ~1.3s)
      setPipelineStage({ mandateId, step: 1 }); // Statutory Shield check
      await new Promise((r) => setTimeout(r, 380));
      setPipelineStage({ mandateId, step: 2 }); // Neural Pipeline scoring
      await new Promise((r) => setTimeout(r, 450));
      setPipelineStage({ mandateId, step: 3 }); // Orchestration Switch
      await new Promise((r) => setTimeout(r, 350));

      const res = await api.simulateFailure(mandateId);
      setPipelineStage({ mandateId, step: 4 }); // Decision Finalized
      await new Promise((r) => setTimeout(r, 220));
      setPipelineStage(null);

      setSelectedMandate(mandateId);
      onRefresh();
      addToast(`RECOVER Agent executed for ${mandateId}: Scheduled optimal re-debit timing!`, "success");
    } catch (err) {
      console.error("Simulation error:", err);
      setPipelineStage(null);
    } finally {
      setLoadingActionId(null);
    }
  };

  return (
    <div className="bg-white border border-[#DDD8CC] shadow-card">
      {/* Table Header Controls */}
      <div className="p-3 border-b border-[#DDD8CC] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white/60">
        {/* Status Filters */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none whitespace-nowrap">
          {[
            { id: "all", label: "All Line Items" },
            { id: "retry_scheduled", label: "Retry Scheduled" },
            { id: "recovered", label: "Recovered" },
            { id: "escalated", label: "Escalated" },
            { id: "stopped", label: "Stopped" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-2.5 py-1 text-[12px] font-medium transition-colors shrink-0 ${
                filterStatus === tab.id
                  ? "bg-[#1B1B18] text-white"
                  : "text-[#6B6558] hover:text-[#1B1B18] hover:bg-[#EDEAE2]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative w-full sm:w-64">
          <MagnifyingGlass size={14} className="absolute left-2.5 top-2.5 text-[#A39C8D]" />
          <input
            type="text"
            placeholder="Search ID, customer, merchant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1 bg-[#EDEAE2]/50 border border-[#DDD8CC] text-[12px] text-[#1B1B18] placeholder-[#A39C8D] focus:outline-none focus:border-[#2B4C7E]"
          />
        </div>
      </div>

      {/* Ledger Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#DDD8CC] bg-[#EDEAE2]/30 text-[11px] font-mono text-[#6B6558] uppercase tracking-wider">
              <th className="py-2.5 px-4 font-medium">Mandate ID</th>
              <th className="py-2.5 px-4 font-medium">Customer / Handle</th>
              <th className="py-2.5 px-4 font-medium">Merchant & Category</th>
              <th className="py-2.5 px-4 font-medium text-right">Amount (₹)</th>
              <th className="py-2.5 px-4 font-medium">Due Day</th>
              <th className="py-2.5 px-4 font-medium">Status</th>
              <th className="py-2.5 px-4 font-medium text-right">Agent Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DDD8CC] text-[13px]">
            {filteredMandates.map((mandate) => {
              const isSelected = selectedMandateId === mandate.id;
              const isLoading = loadingActionId === mandate.id;

              return (
                <tr
                  key={mandate.id}
                  onClick={() => setSelectedMandate(mandate.id)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-[#EDEAE2]/60 border-l-4 border-l-[#2B4C7E]"
                      : "hover:bg-[#F7F5F0]"
                  }`}
                >
                  {/* Mandate ID */}
                  <td className="py-2.5 px-4 font-mono text-[12px] font-semibold text-[#1B1B18]">
                    {mandate.id}
                  </td>

                  {/* Customer */}
                  <td className="py-2.5 px-4">
                    <div className="font-medium text-[#1B1B18]">
                      {mandate.customer_name || mandate.customer_id}
                    </div>
                    <div className="text-[11px] font-mono text-[#6B6558]">
                      {mandate.upi_handle}
                    </div>
                  </td>

                  {/* Merchant & Category */}
                  <td className="py-2.5 px-4">
                    <div className="text-[#1B1B18] font-medium">
                      {mandate.merchant_name}
                    </div>
                    <div className="text-[11px] font-mono text-[#6B6558] capitalize">
                      {mandate.category.replace(/_/g, " ")}
                    </div>
                  </td>

                  {/* Right-aligned Tabular Currency Amount */}
                  <td className="py-2.5 px-4 font-mono text-[13px] font-semibold text-right text-[#1B1B18]">
                    ₹{mandate.mandate_amount.toLocaleString("en-IN")}
                  </td>

                  {/* Due Day */}
                  <td className="py-2.5 px-4 font-mono text-[12px] text-[#6B6558]">
                    Day {mandate.due_day}
                  </td>

                  {/* Status */}
                  <td className="py-2.5 px-4">
                    <StatusStripe status={mandate.status} />
                    {mandate.next_retry_day && mandate.status === "retry_scheduled" && (
                      <div className="text-[11px] font-mono text-[#B4790E] mt-0.5">
                        Scheduled: Day {mandate.next_retry_day} ({((mandate.predicted_success_prob ?? 0) * 100).toFixed(0)}%)
                      </div>
                    )}
                  </td>

                  {/* Action */}
                  <td className="py-2.5 px-4 text-right">
                    {mandate.status !== "recovered" && mandate.status !== "stopped" && (
                      <button
                        onClick={(e) => handleSimulate(e, mandate.id)}
                        disabled={isLoading}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium border border-[#2B4C7E] text-[#2B4C7E] hover:bg-[#2B4C7E] hover:text-white transition-colors"
                      >
                        <Play size={10} weight="fill" />
                        <span>{isLoading ? "Running..." : "Run Agent"}</span>
                      </button>
                    )}
                    {mandate.status === "recovered" && (
                      <span className="text-[11px] font-mono text-[#0F6B5C]">
                        Settled
                      </span>
                    )}
                    {mandate.status === "stopped" && (
                      <span className="text-[11px] font-mono text-[#7C7568]">
                        Archived
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Priority 2.4 #1: Live Decision Pipeline Visual Animation */}
      {pipelineStage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1B1B18] text-[#EDEAE2] p-4 rounded-sm shadow-2xl border border-[#0F6B5C] max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-[#2C2C28] text-[11px] font-mono">
            <span className="text-[#0F6B5C] font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0F6B5C] animate-ping" />
              RECOVER AGENT PIPELINE // {pipelineStage.mandateId}
            </span>
            <span className="text-[#A39C8D]">NODE {pipelineStage.step} OF 3</span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 text-[11px] font-mono text-center">
            <div className={`p-2 border transition-all duration-200 ${pipelineStage.step >= 1 ? "bg-[#0F6B5C]/20 border-[#0F6B5C] text-emerald-300 font-bold" : "border-[#333] text-gray-500 opacity-40"}`}>
              <div className="text-[12px]">🛡️ SHIELD</div>
              <div className="text-[9px] mt-0.5 opacity-80">24h &amp; AFA Check</div>
            </div>
            <div className={`p-2 border transition-all duration-200 ${pipelineStage.step >= 2 ? "bg-cyan-950/50 border-cyan-400 text-cyan-300 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]" : "border-[#333] text-gray-500 opacity-40"}`}>
              <div className="text-[12px]">🧠 NEURAL</div>
              <div className="text-[9px] mt-0.5 opacity-80">Gradient Scoring</div>
            </div>
            <div className={`p-2 border transition-all duration-200 ${pipelineStage.step >= 3 ? "bg-amber-950/50 border-amber-400 text-amber-300 font-bold shadow-[0_0_12px_rgba(245,158,11,0.4)]" : "border-[#333] text-gray-500 opacity-40"}`}>
              <div className="text-[12px]">⚡ SWITCH</div>
              <div className="text-[9px] mt-0.5 opacity-80">NPCI Routing</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
