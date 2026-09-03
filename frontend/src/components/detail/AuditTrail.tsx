import React from "react";
import { AuditLogEntry } from "../../types";

interface Props {
  auditLog: AuditLogEntry[];
}

export const AuditTrail: React.FC<Props> = ({ auditLog }) => {
  return (
    <div className="bg-white border border-[#DDD8CC] p-4 shadow-card">
      <div className="text-[11px] font-mono text-[#6B6558] uppercase tracking-wider mb-3">
        Immutable Decision Trail (AI vs. Rule Engine)
      </div>

      {auditLog.length === 0 ? (
        <div className="text-[#A39C8D] font-mono text-[11px] py-2">
          No audit log entries recorded.
        </div>
      ) : (
        <div className="space-y-3">
          {auditLog.map((entry) => {
            const isModel = entry.actor === "model";
            return (
              <div
                key={entry.id}
                className="border-l-2 pl-3 py-1 text-[12px]"
                style={{
                  borderColor: isModel ? "#2B4C7E" : "#7C7568"
                }}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        isModel
                          ? "bg-[#2B4C7E] text-white"
                          : "bg-[#7C7568] text-white"
                      }`}
                    >
                      {isModel ? "AI Model" : "Rule Engine"}
                    </span>
                    <span className="font-semibold text-[#1B1B18] uppercase">
                      {entry.event.replace(/_/g, " ")}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#6B6558]">
                    {entry.timestamp}
                  </span>
                </div>
                <p className="text-[12px] text-[#1B1B18] mt-1 font-sans leading-relaxed">
                  {entry.reason}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
