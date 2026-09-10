import React from "react";
import { Navbar } from "../components/common/Navbar";
import { DemoBanner } from "../components/common/DemoBanner";
import { Sprout, Heart } from "lucide-react";

interface MainLayoutProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ currentTab, onSelectTab, children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* SIH Prototype Banner */}
      <DemoBanner />

      {/* Main App Navigation */}
      <Navbar currentTab={currentTab} onSelectTab={onSelectTab} />

      {/* Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Sprout className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-800">AgriLink AI</span>
            <span>• Smart India Hackathon (SIH) 2026 Prototype</span>
          </div>

          <div className="text-center sm:text-right text-[11px] text-slate-400">
            Connecting Farmers directly to Buyers • Disintermediation & Route Optimization
          </div>
        </div>
      </footer>
    </div>
  );
};
