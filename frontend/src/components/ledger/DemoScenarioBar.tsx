import React from "react";
import { useStore } from "../../store/useStore";

interface DemoScenario {
  id: string;
  name: string;
  badge: string;
  expectedOutcome: string;
  color: string;
}

export const DemoScenarioBar: React.FC = () => {
  const { setSelectedMandate, selectedMandateId } = useStore();

  const scenarios: DemoScenario[] = [
    {
      id: "MDT-1001",
      name: "1. Predictable Salary",
      badge: "Core Win",
      expectedOutcome: "Model retries day 5 -> Recovers",
      color: "border-[#0F6B5C] text-[#0F6B5C]"
    },
    {
      id: "MDT-1002",
      name: "2. AFA Threshold (>₹15k)",
      badge: "Compliance",
      expectedOutcome: "Stopped -> AFA required",
      color: "border-[#A6323B] text-[#A6323B]"
    },
    {
      id: "MDT-1003",
      name: "3. Erratic Low Signal",
      badge: "Honest Limit",
      expectedOutcome: "Model retries -> Fails again",
      color: "border-[#B4790E] text-[#B4790E]"
    },
    {
      id: "MDT-1004",
      name: "4. Max Retries Hit (4/4)",
      badge: "Stopping Rule",
      expectedOutcome: "Escalated -> Cap reached",
      color: "border-[#A6323B] text-[#A6323B]"
    },
    {
      id: "MDT-1005",
      name: "5. User Revoked",
      badge: "Churn Respect",
      expectedOutcome: "Stopped -> Auth revoked",
      color: "border-[#7C7568] text-[#7C7568]"
    }
  ];

  return (
    <div className="bg-white border border-[#DDD8CC] px-4 py-3 shadow-card mb-6">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[12px] font-semibold text-[#1B1B18] tracking-tight flex items-center gap-2">
          <span>Walkthrough Scenarios (Part 9 Verification)</span>
          <span className="text-[11px] font-mono text-[#6B6558] font-normal">
            Click to load scenario
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
        {scenarios.map((sc) => {
          const isSelected = selectedMandateId === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => setSelectedMandate(sc.id)}
              className={`p-2 text-left border transition-all ${
                isSelected 
                  ? "bg-[#EDEAE2] border-[#2B4C7E] ring-1 ring-[#2B4C7E]" 
                  : "bg-white border-[#DDD8CC] hover:bg-[#F7F5F0]"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[11px] font-bold text-[#1B1B18]">
                  {sc.id}
                </span>
                <span className={`text-[10px] font-mono px-1 border ${sc.color}`}>
                  {sc.badge}
                </span>
              </div>
              <div className="text-[12px] font-medium text-[#1B1B18] truncate">
                {sc.name}
              </div>
              <div className="text-[11px] text-[#6B6558] truncate mt-0.5 font-mono">
                {sc.expectedOutcome}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
