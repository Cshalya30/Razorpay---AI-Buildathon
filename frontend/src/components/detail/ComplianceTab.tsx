import React from "react";
import { Mandate, NotificationRecord } from "../../types";
import { ShieldCheck, WarningCircle, CheckCircle } from "@phosphor-icons/react";

interface Props {
  mandate: Mandate;
  notifications: NotificationRecord[];
}

export const ComplianceTab: React.FC<Props> = ({ mandate, notifications }) => {
  const isAfaRisk = mandate.mandate_amount > 15000 && !["insurance", "mutual_fund_sip", "credit_card_bill"].includes(mandate.category);
  const isRetryCapHit = mandate.attempts >= 4;
  const isRevoked = mandate.status === "stopped" && !isAfaRisk;

  return (
    <div className="space-y-4 text-[12px]">
      {/* Rule Badges */}
      <div className="bg-white border border-[#DDD8CC] p-3 shadow-card">
        <div className="text-[11px] font-mono text-[#6B6558] uppercase tracking-wider mb-2">
          Regulatory Compliance Gates
        </div>
        <div className="space-y-2">
          {/* 1. 24h Notification Rule */}
          <div className="flex items-start gap-2 p-2 bg-[#EDEAE2]/40 border border-[#DDD8CC]">
            <CheckCircle size={15} className="text-[#0F6B5C] shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-[#1B1B18]">
                24-Hour Pre-Debit Notice (RBI Rule 2021/68)
              </div>
              <div className="text-[11px] text-[#6B6558] font-mono mt-0.5">
                Statutory requirement: mandates must issue customer alert ?24h prior to any debit execution.
              </div>
            </div>
          </div>

          {/* 2. AFA Threshold Rule */}
          <div className={`flex items-start gap-2 p-2 border ${
            isAfaRisk 
              ? "bg-[#A6323B]/10 border-[#A6323B] text-[#A6323B]" 
              : "bg-[#EDEAE2]/40 border-[#DDD8CC] text-[#1B1B18]"
          }`}>
            {isAfaRisk ? (
              <WarningCircle size={15} className="text-[#A6323B] shrink-0 mt-0.5" />
            ) : (
              <CheckCircle size={15} className="text-[#0F6B5C] shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-semibold">
                AFA Threshold Gating (?15,000 Cap)
              </div>
              <div className="text-[11px] text-[#6B6558] font-mono mt-0.5">
                {isAfaRisk
                  ? "VIOLATION STOP: Amount exceeds ?15,000 without insurance/SIP exemption. Auto-retry halted."
                  : "Exempt category or amount ? ?15,000. Auto-retry authorized."}
              </div>
            </div>
          </div>

          {/* 3. Retry Cap Rule */}
          <div className={`flex items-start gap-2 p-2 border ${
            isRetryCapHit
              ? "bg-[#A6323B]/10 border-[#A6323B] text-[#A6323B]"
              : "bg-[#EDEAE2]/40 border-[#DDD8CC] text-[#1B1B18]"
          }`}>
            {isRetryCapHit ? (
              <WarningCircle size={15} className="text-[#A6323B] shrink-0 mt-0.5" />
            ) : (
              <CheckCircle size={15} className="text-[#0F6B5C] shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-semibold">
                Maximum Retry Cap (4 Attempts Limit)
              </div>
              <div className="text-[11px] text-[#6B6558] font-mono mt-0.5">
                {isRetryCapHit
                  ? "LIMIT REACHED: 4 attempts exhausted. Mandatory merchant ops escalation."
                  : `Attempts: ${mandate.attempts}/4. Within acceptable retry limits.`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Timeline */}
      <div className="bg-white border border-[#DDD8CC] p-3 shadow-card">
        <div className="text-[11px] font-mono text-[#6B6558] uppercase tracking-wider mb-2">
          Notification Dispatch Audit Log
        </div>
        {notifications.length === 0 ? (
          <div className="text-[#A39C8D] font-mono text-[11px] py-2">
            No pre-debit notifications recorded for this mandate.
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((n) => {
              const isCompliant = n.compliant === 1 && n.notice_hours_before_debit >= 24;
              return (
                <div
                  key={n.id}
                  className="p-2 border border-[#DDD8CC] bg-[#EDEAE2]/20 font-mono text-[11px]"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-[#1B1B18]">
                      {n.merchant_name} ? ?{n.amount.toLocaleString("en-IN")}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-bold ${
                        isCompliant
                          ? "bg-[#0F6B5C]/15 text-[#0F6B5C]"
                          : "bg-[#A6323B]/15 text-[#A6323B]"
                      }`}
                    >
                      {n.notice_hours_before_debit}h Notice ({isCompliant ? "COMPLIANT" : "NON-COMPLIANT"})
                    </span>
                  </div>
                  <div className="text-[#6B6558] text-[10px]">
                    Scheduled: {new Date(n.scheduled_debit_at).toLocaleString("en-IN")}
                  </div>
                  <div className="text-[#6B6558] text-[10px]">
                    Sent At: {new Date(n.sent_at).toLocaleString("en-IN")}
                  </div>
                  <div className="text-[#1B1B18] mt-1 text-[10px] italic">
                    {n.reason}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
