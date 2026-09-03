import React from "react";
import { Sidebar } from "./components/layout/Sidebar";
import { TopBar } from "./components/layout/TopBar";
import { Ledger } from "./pages/Ledger";
import { useStore } from "./store/useStore";

export const App: React.FC = () => {
  const { activeNav } = useStore();

  return (
    <div className="flex min-h-screen bg-paper text-ink">
      {/* 220px Fixed Ink Sidebar */}
      <Sidebar />

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          {/* Main Must-Ship Ledger View */}
          <Ledger />
        </main>
      </div>
    </div>
  );
};
