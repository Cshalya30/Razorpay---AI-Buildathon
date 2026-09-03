import React from "react";
import { useStore } from "../../store/useStore";
import { CheckCircle, WarningCircle, Info, X } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const isSuccess = toast.type === "success";
          const isWarning = toast.type === "warning";

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`pointer-events-auto p-3.5 bg-white border shadow-modal flex items-start justify-between gap-3 ${
                isSuccess
                  ? "border-[#0F6B5C] text-[#0F6B5C]"
                  : isWarning
                  ? "border-[#B4790E] text-[#B4790E]"
                  : "border-[#2B4C7E] text-[#1B1B18]"
              }`}
            >
              <div className="flex items-start gap-2.5">
                {isSuccess ? (
                  <CheckCircle size={18} className="text-[#0F6B5C] shrink-0 mt-0.5" />
                ) : isWarning ? (
                  <WarningCircle size={18} className="text-[#B4790E] shrink-0 mt-0.5" />
                ) : (
                  <Info size={18} className="text-[#2B4C7E] shrink-0 mt-0.5" />
                )}
                <div className="text-[12px] font-mono text-[#1B1B18] leading-relaxed">
                  {toast.message}
                </div>
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="text-[#6B6558] hover:text-[#1B1B18] transition-colors p-0.5"
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
