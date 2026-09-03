import React from "react";
import { MandateStatus } from "../../types";

interface StatusStripeProps {
  status: MandateStatus;
  showText?: boolean;
}

export const StatusStripe: React.FC<StatusStripeProps> = ({ status, showText = true }) => {
  let colorClass = "";
  let label = "";

  switch (status) {
    case "recovered":
      colorClass = "bg-[#0F6B5C] text-[#0F6B5C]";
      label = "Recovered";
      break;
    case "retry_scheduled":
      colorClass = "bg-[#B4790E] text-[#B4790E]";
      label = "Retry scheduled";
      break;
    case "escalated":
      colorClass = "bg-[#A6323B] text-[#A6323B]";
      label = "Escalated";
      break;
    case "stopped":
      colorClass = "bg-[#7C7568] text-[#7C7568]";
      label = "Stopped";
      break;
    case "pending":
    default:
      colorClass = "bg-[#2B4C7E] text-[#2B4C7E]";
      label = "Pending";
      break;
  }

  return (
    <div className="inline-flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${colorClass.split(" ")[0]}`} />
      {showText && (
        <span className="text-[13px] font-medium tracking-tight">
          {label}
        </span>
      )}
    </div>
  );
};
