import React from "react";
import { ShieldCheck, Television, TrendUp, CreditCard } from "@phosphor-icons/react";

export const CategoryBreakdownCard: React.FC = () => {
  const categories = [
    {
      name: "Insurance Premiums",
      category: "insurance",
      icon: ShieldCheck,
      recoveryRate: 100.0,
      recoveredAmount: 284500,
      totalAmount: 284500,
      exempt: true,
      color: "#0F6B5C"
    },
    {
      name: "Mutual Fund SIPs",
      category: "mutual_fund_sip",
      icon: TrendUp,
      recoveryRate: 99.2,
      recoveredAmount: 189200,
      totalAmount: 190700,
      exempt: true,
      color: "#0F6B5C"
    },
    {
      name: "Credit Card Bills",
      category: "credit_card_bill",
      icon: CreditCard,
      recoveryRate: 98.6,
      recoveredAmount: 109187,
      totalAmount: 110734,
      exempt: true,
      color: "#2B4C7E"
    },
    {
      name: "Recurring Subscriptions",
      category: "subscription",
      icon: Television,
      recoveryRate: 96.4,
      recoveredAmount: 142800,
      totalAmount: 148100,
      exempt: false,
      color: "#B4790E"
    }
  ];

  return (
    <div className="bg-white border border-[#DDD8CC] p-5 shadow-card mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[13px] font-semibold text-[#1B1B18] tracking-tight">
            Sectoral Revenue Recovery Breakdown
          </span>
          <p className="text-[11px] font-mono text-[#6B6558] mt-0.5">
            Recovery performance segmented by regulatory category and AFA statutory exemption status.
          </p>
        </div>

        <span className="text-[11px] font-mono text-[#0F6B5C] bg-[#0F6B5C]/10 px-2 py-0.5 font-bold">
          4 Categories Active
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categories.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.category}
              className="p-3.5 bg-[#EDEAE2]/30 border border-[#DDD8CC] hover:bg-[#EDEAE2]/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon size={16} className="text-[#1B1B18]" />
                  <span className="text-[12px] font-medium text-[#1B1B18]">{c.name}</span>
                </div>
                {c.exempt ? (
                  <span className="text-[9px] font-mono px-1.5 py-0.2 bg-[#0F6B5C]/15 text-[#0F6B5C] font-bold">
                    AFA EXEMPT
                  </span>
                ) : (
                  <span className="text-[9px] font-mono px-1.5 py-0.2 bg-[#A6323B]/15 text-[#A6323B] font-bold">
                    AFA CAPPED
                  </span>
                )}
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-[#DDD8CC] overflow-hidden mb-2">
                <div
                  className="h-full transition-all duration-500"
                  style={{ width: `${c.recoveryRate}%`, backgroundColor: c.color }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="font-bold text-[#1B1B18]">{c.recoveryRate.toFixed(1)}% Recovery</span>
                <span className="text-[#6B6558]">
                  ₹{c.recoveredAmount.toLocaleString("en-IN")} / ₹{c.totalAmount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
