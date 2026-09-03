import React, { useEffect, useState } from "react";
import { useStore } from "../../store/useStore";
import { api } from "../../api/client";
import { Mandate, Customer, BalancePoint, AuditLogEntry, NotificationRecord } from "../../types";
import { StatusStripe } from "../ledger/StatusStripe";
import { BalanceCurveChart } from "./BalanceCurveChart";
import { RetryPredictionPanel } from "./RetryPredictionPanel";
import { ComplianceTab } from "./ComplianceTab";
import { AuditTrail } from "./AuditTrail";
import { X, Play, CurrencyInr } from "@phosphor-icons/react";

interface Props {
  onRefreshLedger: () => void;
}

export const MandateDetailDrawer: React.FC<Props> = ({ onRefreshLedger }) => {
  const { selectedMandateId, detailDrawerOpen, setDetailDrawerOpen } = useStore();

  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<{
    mandate: Mandate;
    customer: Customer;
    balanceCurve: BalancePoint[];
    auditLog: AuditLogEntry[];
    notifications: NotificationRecord[];
  } | null>(null);

  const [activeTab, setActiveTab] = useState<"model" | "compliance" | "audit">("model");
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  const fetchDetail = async (id: string) => {
    try {
      setLoading(true);
      const res = await api.getMandateDetail(id);
      setData(res);
    } catch (err) {
      console.error("Failed to load mandate detail:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedMandateId) {
      fetchDetail(selectedMandateId);
    }
  }, [selectedMandateId]);

  if (!detailDrawerOpen || !selectedMandateId) return null;

  const handleSimulateFailure = async () => {
    if (!selectedMandateId) return;
    try {
      setActionLoading(true);
      await api.simulateFailure(selectedMandateId);
      await fetchDetail(selectedMandateId);
      onRefreshLedger();
    } catch (err) {
      console.error("Simulate failure error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSimulateDebit = async () => {
    if (!selectedMandateId) return;
    try {
      setActionLoading(true);
      await api.simulateDebit(selectedMandateId);
      await fetchDetail(selectedMandateId);
      onRefreshLedger();
    } catch (err) {
      console.error("Simulate debit error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const mandate = data?.mandate;
  const customer = data?.customer;

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex">
      {/* Backdrop */}
      <div
        onClick={() => setDetailDrawerOpen(false)}
        className="fixed inset-0 bg-black/30 backdrop-blur-[1px] transition-opacity"
      />

      {/* 480px Slide-over Drawer */}
      <div className="relative w-[480px] bg-[#EDEAE2] h-full shadow-drawer border-l border-[#DDD8CC] flex flex-col z-10">
        {/* Drawer Header */}
        <div className="p-4 bg-white border-b border-[#DDD8CC] flex items-start justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[14px] font-bold text-[#1B1B18]">
                {mandate?.id || selectedMandateId}
              </span>
              {mandate && <StatusStripe status={mandate.status} />}
            </div>
            <div className="text-[12px] text-[#6B6558] font-sans">
              {mandate?.merchant_name} ? <span className="capitalize">{mandate?.category.replace(/_/g, " ")}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[16px] font-bold text-[#1B1B18]">
              ?{mandate?.mandate_amount.toLocaleString("en-IN")}
            </span>
            <button
              onClick={() => setDetailDrawerOpen(false)}
              className="p-1 hover:bg-[#EDEAE2] text-[#6B6558] transition-colors ml-2"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Customer Mini Summary */}
        {customer && (
          <div className="px-4 py-2 bg-white/70 border-b border-[#DDD8CC] flex items-center justify-between text-[11px] font-mono text-[#6B6558]">
            <div>
              <span className="text-[#1B1B18] font-medium">{customer.name}</span> ({customer.upi_handle})
            </div>
            <div>
              {customer.salary_day ? `Salary: Day ${customer.salary_day}` : "Irregular Inflow"}
            </div>
          </div>
        )}

        {/* Interactive Action Bar */}
        {mandate && mandate.status !== "recovered" && mandate.status !== "stopped" && (
          <div className="p-3 bg-white/50 border-b border-[#DDD8CC] flex items-center gap-2 shrink-0">
            <button
              onClick={handleSimulateFailure}
              disabled={actionLoading}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-[#2B4C7E] text-white text-[12px] font-medium hover:bg-[#233F69] disabled:opacity-50 transition-colors shadow-sm"
            >
              <Play size={12} weight="fill" />
              <span>{actionLoading ? "Processing..." : "Run Timing Model"}</span>
            </button>

            {mandate.next_retry_day && (
              <button
                onClick={handleSimulateDebit}
                disabled={actionLoading}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-[#0F6B5C] text-white text-[12px] font-medium hover:bg-[#0C584C] disabled:opacity-50 transition-colors shadow-sm"
              >
                <CurrencyInr size={14} weight="bold" />
                <span>Simulate Debit (D{mandate.next_retry_day})</span>
              </button>
            )}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#DDD8CC] bg-white text-[12px] font-medium shrink-0">
          {[
            { id: "model", label: "Model & Curve" },
            { id: "compliance", label: "Compliance Gates" },
            { id: "audit", label: `Audit Log (${data?.auditLog.length ?? 0})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2.5 text-center transition-colors border-b-2 ${
                activeTab === tab.id
                  ? "border-[#2B4C7E] text-[#1B1B18] font-semibold bg-[#EDEAE2]/30"
                  : "border-transparent text-[#6B6558] hover:text-[#1B1B18]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading && !data ? (
            <div className="text-center py-12 text-[#A39C8D] font-mono text-[12px]">
              Loading mandate ledger data...
            </div>
          ) : data ? (
            <>
              {activeTab === "model" && (
                <div>
                  <RetryPredictionPanel mandate={data.mandate} />
                  <BalanceCurveChart mandate={data.mandate} balanceCurve={data.balanceCurve} />
                </div>
              )}

              {activeTab === "compliance" && (
                <ComplianceTab mandate={data.mandate} notifications={data.notifications} />
              )}

              {activeTab === "audit" && (
                <AuditTrail auditLog={data.auditLog} />
              )}
            </>
          ) : (
            <div className="text-center py-12 text-[#A6323B] font-mono text-[12px]">
              Failed to load mandate details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
