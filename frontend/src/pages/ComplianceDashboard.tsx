import React, { useEffect, useState } from "react";
import { api, ComplianceSummary } from "../api/client";
import { 
  ShieldCheck, 
  WarningCircle, 
  CheckCircle, 
  DownloadSimple, 
  FileText,
  Clock,
  Prohibit
} from "@phosphor-icons/react";

export const ComplianceDashboard: React.FC = () => {
  const [data, setData] = useState<ComplianceSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");

  const loadCompliance = async () => {
    try {
      setLoading(true);
      const res = await api.getComplianceSummary();
      setData(res);
    } catch (err) {
      console.error("Failed to load compliance summary:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompliance();
  }, []);

  const handleExportCsv = () => {
    window.open("/api/v1/compliance/export?format=csv", "_blank");
  };

  const scorecard = data?.scorecard;
  const recentNotices = (data?.recentNotices || []).filter(n => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      n.mandate_id.toLowerCase().includes(q) ||
      n.merchant_name.toLowerCase().includes(q) ||
      n.reason.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-[28px] font-bold text-[#1B1B18] tracking-tight">
            RBI Statutory Compliance &amp; Audit Registry
          </h1>
          <p className="text-[13px] text-[#6B6558] mt-1 font-sans">
            Enforces RBI circulars on UPI AutoPay: 24h pre-debit notices, AFA threshold limits, and retry stopping rules.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="flex items-center gap-2 px-3 py-2 bg-white border border-[#DDD8CC] text-[#1B1B18] text-[12px] font-mono hover:bg-[#EDEAE2] transition-colors shadow-card"
        >
          <DownloadSimple size={14} />
          <span>Export Statutory Audit (CSV)</span>
        </button>
      </div>

      {/* 4 Compliance Pillars Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {/* Pillar 1: 24h Pre-debit Notice */}
        <div className="bg-white border border-[#DDD8CC] p-4 shadow-card">
          <div className="flex items-center justify-between text-[#6B6558] mb-1">
            <span className="text-[11px] font-mono uppercase">24H PRE-DEBIT NOTICE</span>
            <Clock size={16} className="text-[#0F6B5C]" />
          </div>
          <div className="text-[24px] font-mono font-bold text-[#1B1B18] mt-1">
            {scorecard?.complianceRate ?? 0}%
          </div>
          <div className="text-[11px] text-[#0F6B5C] font-mono mt-1 flex items-center gap-1">
            <span>{scorecard?.compliantNotices ?? 0} compliant / {scorecard?.totalNotices ?? 0}</span>
          </div>
          <div className="text-[10px] text-[#A6323B] font-mono mt-0.5">
            {scorecard?.nonCompliantNotices ?? 0} non-compliant (&lt;24h) caught &amp; held
          </div>
        </div>

        {/* Pillar 2: AFA Threshold Gating */}
        <div className="bg-white border border-[#DDD8CC] p-4 shadow-card">
          <div className="flex items-center justify-between text-[#6B6558] mb-1">
            <span className="text-[11px] font-mono uppercase">AFA ?15,000 THRESHOLD</span>
            <ShieldCheck size={16} className="text-[#A6323B]" />
          </div>
          <div className="text-[24px] font-mono font-bold text-[#A6323B] mt-1">
            {scorecard?.afaStops ?? 0}
          </div>
          <div className="text-[11px] text-[#6B6558] font-mono mt-1">
            Mandates halted for AFA auth
          </div>
          <div className="text-[10px] text-[#A39C8D] font-mono mt-0.5">
            Non-exempt subscriptions &gt; ?15k gated
          </div>
        </div>

        {/* Pillar 3: Retry Cap */}
        <div className="bg-white border border-[#DDD8CC] p-4 shadow-card">
          <div className="flex items-center justify-between text-[#6B6558] mb-1">
            <span className="text-[11px] font-mono uppercase">RETRY CAP (4 ATTEMPTS)</span>
            <WarningCircle size={16} className="text-[#B4790E]" />
          </div>
          <div className="text-[24px] font-mono font-bold text-[#1B1B18] mt-1">
            {scorecard?.capStops ?? 0}
          </div>
          <div className="text-[11px] text-[#6B6558] font-mono mt-1">
            Escalated to merchant ops
          </div>
          <div className="text-[10px] text-[#A39C8D] font-mono mt-0.5">
            Stops infinite retry bounce loops
          </div>
        </div>

        {/* Pillar 4: Churn Revocation */}
        <div className="bg-white border border-[#DDD8CC] p-4 shadow-card">
          <div className="flex items-center justify-between text-[#6B6558] mb-1">
            <span className="text-[11px] font-mono uppercase">REVOCATION REGISTRY</span>
            <Prohibit size={16} className="text-[#7C7568]" />
          </div>
          <div className="text-[24px] font-mono font-bold text-[#7C7568] mt-1">
            {scorecard?.revokeStops ?? 0}
          </div>
          <div className="text-[11px] text-[#6B6558] font-mono mt-1">
            Churned mandates halted
          </div>
          <div className="text-[10px] text-[#A39C8D] font-mono mt-0.5">
            Rule engine respects user cancellations
          </div>
        </div>
      </div>

      {/* Statutory Rules Explanation Banner */}
      <div className="bg-[#EDEAE2]/60 border border-[#DDD8CC] p-4 mb-6 text-[12px] font-mono text-[#6B6558] space-y-1">
        <div className="font-bold text-[#1B1B18] uppercase tracking-wider mb-2">
          Statutory Gating Specifications Implemented:
        </div>
        <div>? <strong>RBI/DPSS/2021-22/68</strong>: Pre-debit alerts must be sent via SMS/Email at least 24 hours prior to actual debit. Non-compliant alerts are automatically rejected by the rule engine and a new 26-hour advance alert is dispatched.</div>
        <div>? <strong>Master Direction Section 5.3</strong>: E-mandates exceeding ?15,000 require AFA re-authentication unless classified under insurance, mutual fund SIPs, or credit card bills. Subscriptions are strictly non-exempt.</div>
        <div>? <strong>Anti-Harassment Directive</strong>: Mandates failing 4 consecutive debit attempts are terminated from automated retries and escalated for human intervention.</div>
      </div>

      {/* Notifications Table */}
      <div className="bg-white border border-[#DDD8CC] shadow-card">
        <div className="p-3 border-b border-[#DDD8CC] flex items-center justify-between">
          <span className="text-[12px] font-semibold text-[#1B1B18] tracking-tight">
            Pre-Debit Notice Dispatch Log &amp; Timing Verification
          </span>

          <input
            type="text"
            placeholder="Search mandate, merchant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1 bg-[#EDEAE2]/50 border border-[#DDD8CC] text-[12px] text-[#1B1B18] placeholder-[#A39C8D] focus:outline-none focus:border-[#2B4C7E] w-64 font-sans"
          />
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#DDD8CC] bg-[#EDEAE2]/30 text-[11px] font-mono text-[#6B6558] uppercase">
              <th className="py-2 px-4">Mandate Ref</th>
              <th className="py-2 px-4">Merchant &amp; Category</th>
              <th className="py-2 px-4 text-right">Amount (?)</th>
              <th className="py-2 px-4">Scheduled Debit</th>
              <th className="py-2 px-4">Notice Dispatch Time</th>
              <th className="py-2 px-4">Lead Time</th>
              <th className="py-2 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DDD8CC] text-[12px] font-mono">
            {recentNotices.map((n) => {
              const isCompliant = n.compliant === 1 && n.notice_hours_before_debit >= 24;
              return (
                <tr key={n.id} className="hover:bg-[#F7F5F0]">
                  <td className="py-2.5 px-4 font-bold text-[#1B1B18]">
                    {n.mandate_id}
                  </td>
                  <td className="py-2.5 px-4 font-sans">
                    <div className="font-medium text-[#1B1B18]">{n.merchant_name}</div>
                    <div className="text-[10px] font-mono text-[#6B6558] capitalize">{n.category}</div>
                  </td>
                  <td className="py-2.5 px-4 text-right font-bold text-[#1B1B18]">
                    ?{n.amount.toLocaleString("en-IN")}
                  </td>
                  <td className="py-2.5 px-4 text-[#6B6558]">
                    {new Date(n.scheduled_debit_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="py-2.5 px-4 text-[#6B6558]">
                    {new Date(n.sent_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="py-2.5 px-4 font-bold">
                    <span className={isCompliant ? "text-[#0F6B5C]" : "text-[#A6323B]"}>
                      {n.notice_hours_before_debit}h
                    </span>
                  </td>
                  <td className="py-2.5 px-4">
                    <span className={`px-2 py-0.5 text-[10px] font-bold ${
                      isCompliant 
                        ? "bg-[#0F6B5C]/15 text-[#0F6B5C]" 
                        : "bg-[#A6323B]/15 text-[#A6323B]"
                    }`}>
                      {isCompliant ? "COMPLIANT" : "FLAGGED (<24H)"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
