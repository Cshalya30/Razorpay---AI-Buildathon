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
  const { setSelectedMandate, selectedMandateId } = useStore();
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);

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
      await api.simulateFailure(mandateId);
      setSelectedMandate(mandateId);
      onRefresh();
    } catch (err) {
      console.error("Simulation error:", err);
    } finally {
      setLoadingActionId(null);
    }
  };

  return (
    <div className="bg-white border border-[#DDD8CC] shadow-card">
      {/* Table Header Controls */}
      <div className="p-3 border-b border-[#DDD8CC] flex items-center justify-between gap-4 bg-white/60">
        {/* Status Filters */}
        <div className="flex items-center gap-1">
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
              className={`px-2.5 py-1 text-[12px] font-medium transition-colors ${
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
        <div className="relative w-64">
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
              <th className="py-2.5 px-4 font-medium text-right">Amount (?)</th>
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
                    ?{mandate.mandate_amount.toLocaleString("en-IN")}
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

      {/* Footer Row Count */}
      <div className="p-3 border-t border-[#DDD8CC] text-[11px] font-mono text-[#6B6558] flex justify-between bg-white/40">
        <span>Showing {filteredMandates.length} of {mandates.length} ledger items</span>
        <span>Click any row to inspect mandate balance curve, audit trail, and compliance record</span>
      </div>
    </div>
  );
};
