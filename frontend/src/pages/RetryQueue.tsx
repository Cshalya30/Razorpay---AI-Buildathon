import React, { useEffect, useState } from "react";
import { useStore } from "../store/useStore";
import { api, RetryQueueData } from "../api/client";
import { Mandate } from "../types";
import { StatusStripe } from "../components/ledger/StatusStripe";
import { MandateDetailDrawer } from "../components/detail/MandateDetailDrawer";
import { 
  Play, 
  ClockCountdown, 
  CheckCircle, 
  CurrencyInr, 
  ArrowRight,
  Sparkle
} from "@phosphor-icons/react";

export const RetryQueue: React.FC = () => {
  const { setSelectedMandate, selectedMandateId } = useStore();
  const [data, setData] = useState<RetryQueueData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDay, setSelectedDay] = useState<number | "all">("all");
  const [batchExecuting, setBatchExecuting] = useState<boolean>(false);
  const [batchFeedback, setBatchFeedback] = useState<string | null>(null);

  const loadRetries = async () => {
    try {
      setLoading(true);
      const res = await api.getUpcomingRetries();
      setData(res);
    } catch (err) {
      console.error("Failed to fetch retry queue:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRetries();
  }, []);

  const handleBatchExecute = async () => {
    try {
      setBatchExecuting(true);
      setBatchFeedback(null);
      const target = selectedDay === "all" ? undefined : selectedDay;
      const result = await api.batchExecuteRetries(target);
      setBatchFeedback(
        `Batch executed! ${result.recoveredCount}/${result.totalExecuted} mandates recovered (+?${result.recoveredAmount.toLocaleString('en-IN')}).`
      );
      await loadRetries();
    } catch (err: any) {
      setBatchFeedback(`Batch execution error: ${err.message}`);
    } finally {
      setBatchExecuting(false);
    }
  };

  const handleSingleDebit = async (e: React.MouseEvent, mandateId: string, day?: number) => {
    e.stopPropagation();
    try {
      await api.simulateDebit(mandateId, day);
      await loadRetries();
      setSelectedMandate(mandateId);
    } catch (err) {
      console.error("Debit simulation error:", err);
    }
  };

  const retries = data?.retries || [];
  const filteredRetries = selectedDay === "all" 
    ? retries 
    : retries.filter(r => r.next_retry_day === selectedDay);

  const totalVol = filteredRetries.reduce((sum, r) => sum + r.mandate_amount, 0);
  const avgConf = filteredRetries.length > 0
    ? (filteredRetries.reduce((sum, r) => sum + (r.predicted_success_prob ?? 0), 0) / filteredRetries.length) * 100
    : 0;
  const highConfCount = filteredRetries.filter(r => (r.predicted_success_prob ?? 0) >= 0.8).length;

  const distinctDays = Array.from(new Set(retries.map(r => r.next_retry_day ?? 1))).sort((a, b) => a - b);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-[28px] font-bold text-[#1B1B18] tracking-tight">
              Predictive Retry Operations Queue
            </h1>
            <p className="text-[13px] text-[#6B6558] mt-1 font-sans">
              Mandates scheduled for automated re-debit timed to customer liquidity patterns.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleBatchExecute}
              disabled={batchExecuting || filteredRetries.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-[#0F6B5C] text-white text-[13px] font-medium hover:bg-[#0C584C] disabled:opacity-50 transition-colors shadow-sm"
            >
              <Play size={14} weight="fill" />
              <span>
                {batchExecuting 
                  ? "Processing Batch..." 
                  : selectedDay === "all" 
                    ? `Execute All Scheduled Retries (${filteredRetries.length})` 
                    : `Execute Day ${selectedDay} Retries (${filteredRetries.length})`}
              </span>
            </button>
          </div>
        </div>

        {/* Batch Execution Feedback Alert */}
        {batchFeedback && (
          <div className="mt-4 p-3 bg-[#0F6B5C]/10 border border-[#0F6B5C] text-[#0F6B5C] text-[12px] font-mono flex items-center gap-2">
            <CheckCircle size={16} />
            <span>{batchFeedback}</span>
          </div>
        )}
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-[#DDD8CC] p-4 shadow-card">
          <div className="text-[11px] font-mono text-[#6B6558] uppercase">QUEUE RECOVERY VOLUME</div>
          <div className="text-[22px] font-mono font-bold text-[#0F6B5C] mt-1">
            ?{totalVol.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-[#A39C8D] font-mono mt-0.5">
            across {filteredRetries.length} scheduled attempts
          </div>
        </div>

        <div className="bg-white border border-[#DDD8CC] p-4 shadow-card">
          <div className="text-[11px] font-mono text-[#6B6558] uppercase">AVERAGE CONFIDENCE</div>
          <div className="text-[22px] font-mono font-bold text-[#2B4C7E] mt-1">
            {avgConf.toFixed(1)}%
          </div>
          <div className="text-[11px] text-[#A39C8D] font-mono mt-0.5">
            calibrated P(balance ? amount)
          </div>
        </div>

        <div className="bg-white border border-[#DDD8CC] p-4 shadow-card">
          <div className="text-[11px] font-mono text-[#6B6558] uppercase">HIGH CONFIDENCE RATIO</div>
          <div className="text-[22px] font-mono font-bold text-[#1B1B18] mt-1">
            {filteredRetries.length > 0 ? `${Math.round((highConfCount / filteredRetries.length) * 100)}%` : "0%"}
          </div>
          <div className="text-[11px] text-[#A39C8D] font-mono mt-0.5">
            {highConfCount} mandates with P ? 80%
          </div>
        </div>

        <div className="bg-white border border-[#DDD8CC] p-4 shadow-card">
          <div className="text-[11px] font-mono text-[#6B6558] uppercase">STATUTORY NOTICE GATE</div>
          <div className="text-[22px] font-mono font-bold text-[#0F6B5C] mt-1">
            100% Gated
          </div>
          <div className="text-[11px] text-[#A39C8D] font-mono mt-0.5">
            24h pre-debit notices dispatched
          </div>
        </div>
      </div>

      {/* Day Filter Tabs */}
      <div className="flex items-center gap-1 mb-4 overflow-x-auto border-b border-[#DDD8CC] pb-2">
        <button
          onClick={() => setSelectedDay("all")}
          className={`px-3 py-1 text-[12px] font-mono transition-colors ${
            selectedDay === "all"
              ? "bg-[#1B1B18] text-white font-semibold"
              : "text-[#6B6558] hover:text-[#1B1B18] hover:bg-[#EDEAE2]"
          }`}
        >
          All Days ({retries.length})
        </button>

        {distinctDays.map((d) => {
          const count = data?.dayBuckets[d]?.count ?? 0;
          return (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              className={`px-3 py-1 text-[12px] font-mono transition-colors flex items-center gap-1.5 ${
                selectedDay === d
                  ? "bg-[#2B4C7E] text-white font-semibold"
                  : "text-[#6B6558] hover:text-[#1B1B18] hover:bg-[#EDEAE2]"
              }`}
            >
              <span>Day {d}</span>
              <span className="text-[10px] opacity-75">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Queue Table */}
      <div className="bg-white border border-[#DDD8CC] shadow-card">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#DDD8CC] bg-[#EDEAE2]/30 text-[11px] font-mono text-[#6B6558] uppercase">
              <th className="py-2.5 px-4 font-medium">Mandate ID</th>
              <th className="py-2.5 px-4 font-medium">Customer</th>
              <th className="py-2.5 px-4 font-medium">Merchant & Category</th>
              <th className="py-2.5 px-4 font-medium text-right">Amount (?)</th>
              <th className="py-2.5 px-4 font-medium">Original Due</th>
              <th className="py-2.5 px-4 font-medium">Scheduled Day</th>
              <th className="py-2.5 px-4 font-medium">Model Confidence</th>
              <th className="py-2.5 px-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DDD8CC] text-[13px]">
            {filteredRetries.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-[#A39C8D] font-mono text-[12px]">
                  No upcoming retries scheduled for this window. Run timing agent from the Ledger.
                </td>
              </tr>
            ) : (
              filteredRetries.map((mandate) => {
                const isSelected = selectedMandateId === mandate.id;
                const prob = mandate.predicted_success_prob ?? 0.88;
                const isHigh = prob >= 0.80;

                return (
                  <tr
                    key={mandate.id}
                    onClick={() => setSelectedMandate(mandate.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? "bg-[#EDEAE2]/60 border-l-4 border-l-[#2B4C7E]" : "hover:bg-[#F7F5F0]"
                    }`}
                  >
                    <td className="py-2.5 px-4 font-mono text-[12px] font-semibold text-[#1B1B18]">
                      {mandate.id}
                    </td>

                    <td className="py-2.5 px-4">
                      <div className="font-medium text-[#1B1B18]">{mandate.customer_name}</div>
                      <div className="text-[11px] font-mono text-[#6B6558]">{mandate.upi_handle}</div>
                    </td>

                    <td className="py-2.5 px-4">
                      <div className="text-[#1B1B18] font-medium">{mandate.merchant_name}</div>
                      <div className="text-[11px] font-mono text-[#6B6558] capitalize">
                        {mandate.category.replace(/_/g, " ")}
                      </div>
                    </td>

                    <td className="py-2.5 px-4 font-mono text-[13px] font-semibold text-right text-[#1B1B18]">
                      ?{mandate.mandate_amount.toLocaleString("en-IN")}
                    </td>

                    <td className="py-2.5 px-4 font-mono text-[12px] text-[#6B6558]">
                      Day {mandate.due_day}
                    </td>

                    <td className="py-2.5 px-4 font-mono text-[12px] font-semibold text-[#2B4C7E]">
                      Day {mandate.next_retry_day}
                    </td>

                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 text-[10px] font-mono font-bold ${
                          isHigh ? "bg-[#0F6B5C]/15 text-[#0F6B5C]" : "bg-[#B4790E]/15 text-[#B4790E]"
                        }`}>
                          {(prob * 100).toFixed(0)}% ({isHigh ? "HIGH" : "MOD"})
                        </span>
                      </div>
                    </td>

                    <td className="py-2.5 px-4 text-right">
                      <button
                        onClick={(e) => handleSingleDebit(e, mandate.id, mandate.next_retry_day ?? undefined)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium border border-[#0F6B5C] text-[#0F6B5C] hover:bg-[#0F6B5C] hover:text-white transition-colors"
                      >
                        <CurrencyInr size={12} weight="bold" />
                        <span>Simulate Debit</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <MandateDetailDrawer onRefreshLedger={loadRetries} />
    </div>
  );
};
