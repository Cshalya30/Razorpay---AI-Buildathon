import React, { useEffect, useState } from "react";
import { useStore } from "../../store/useStore";
import { api } from "../../api/client";
import { 
  BookOpen, 
  ClockCountdown, 
  ShieldCheck, 
  ChartBar,
  Icon
} from "@phosphor-icons/react";

interface NavItem {
  id: "ledger" | "retries" | "compliance" | "eval";
  label: string;
  icon: Icon;
  badge?: string;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const { activeNav, setActiveNav, metrics } = useStore();
  const [retryCount, setRetryCount] = useState<number>(0);
  const [nonCompliantCount, setNonCompliantCount] = useState<number>(28);

  useEffect(() => {
    api.getUpcomingRetries().then(data => {
      setRetryCount(data.totalCount);
    }).catch(() => {});

    api.getComplianceSummary().then(data => {
      setNonCompliantCount(data.scorecard.nonCompliantNotices);
    }).catch(() => {});
  }, [activeNav]);

  const navItems: NavItem[] = [
    { 
      id: "ledger", 
      label: "Ledger", 
      icon: BookOpen,
      badge: metrics?.totalMandates ? `${metrics.totalMandates}` : undefined
    },
    { 
      id: "retries", 
      label: "Retry Queue", 
      icon: ClockCountdown,
      badge: retryCount > 0 ? `${retryCount}` : undefined
    },
    { 
      id: "compliance", 
      label: "Compliance", 
      icon: ShieldCheck,
      badge: nonCompliantCount > 0 ? `${nonCompliantCount}` : undefined,
      badgeColor: "text-[#A6323B] bg-[#A6323B]/20"
    },
    { 
      id: "eval", 
      label: "Eval Report", 
      icon: ChartBar,
      badge: "98.7%"
    }
  ];

  return (
    <aside className="w-[220px] min-h-screen bg-[#1B1B18] text-[#EDEAE2] flex flex-col justify-between py-6 shrink-0 border-r border-[#2C2C28]">
      <div>
        {/* Fraunces Serif Wordmark */}
        <div className="px-6 mb-8">
          <h1 className="font-serif text-2xl font-bold tracking-normal text-[#EDEAE2]">
            Recover
          </h1>
          <p className="text-[11px] font-mono text-[#A39C8D] mt-1 tracking-wide">
            UPI AUTOPAY REGISTER
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const ItemIcon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-[13px] font-medium transition-colors ${
                  isActive
                    ? "bg-[#2A2925] text-white border-l-2 border-[#0F6B5C]"
                    : "text-[#A39C8D] hover:text-[#EDEAE2] hover:bg-[#23221E] border-l-2 border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <ItemIcon size={16} weight={isActive ? "bold" : "regular"} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-sm ${item.badgeColor || 'bg-white/10 text-[#DDD8CC]'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="px-6 pt-4 border-t border-[#2C2C28] text-[11px] text-[#6B6558] font-mono">
        <div>TRACK 3 ? RECOVERY</div>
        <div className="text-[#A39C8D] mt-0.5">RAZORPAY BUILDATHON</div>
      </div>
    </aside>
  );
};
