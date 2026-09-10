import React, { useState, useEffect } from "react";
import { getIsDemoMode, setIsDemoMode } from "../../services/api";
import { Sparkles, Database, Wifi, CheckCircle2, RefreshCw } from "lucide-react";
import { useMarket } from "../../context/MarketContext";
import { useAuth } from "../../context/AuthContext";

export const DemoBanner: React.FC = () => {
  const [demoMode, setDemoModeState] = useState(getIsDemoMode());
  const { selectMarketByName } = useMarket();
  const { login } = useAuth();

  useEffect(() => {
    const handleModeChange = () => setDemoModeState(getIsDemoMode());
    window.addEventListener("agrilink_mode_change", handleModeChange);
    return () => window.removeEventListener("agrilink_mode_change", handleModeChange);
  }, []);

  const toggleMode = () => {
    const next = !demoMode;
    setIsDemoMode(next);
    setDemoModeState(next);
  };

  const handleQuickDemoSetup = () => {
    login("farmer");
    selectMarketByName("Yeola APMC");
  };

  return (
    <div className="bg-emerald-900 text-white text-xs px-4 py-2 border-b border-emerald-800">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-700/80 text-emerald-200 text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-300" />
            SIH 2026 Prototype
          </span>
          <span className="text-emerald-200 hidden sm:inline">
            Direct farmer-buyer marketplace with price intelligence & smart logistics.
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleQuickDemoSetup}
            className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold px-2.5 py-1 rounded transition-colors shadow-sm cursor-pointer"
            title="Sets role to Rajesh Patil (Farmer) and selects Yeola APMC"
          >
            <RefreshCw className="w-3 h-3" />
            Load Demo Scenario (Yeola Onion)
          </button>

          <button
            onClick={toggleMode}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded font-medium border transition-colors cursor-pointer ${
              demoMode
                ? "bg-emerald-800/80 border-emerald-600 text-emerald-100 hover:bg-emerald-700"
                : "bg-blue-900/80 border-blue-500 text-blue-100 hover:bg-blue-800"
            }`}
          >
            {demoMode ? (
              <>
                <Database className="w-3.5 h-3.5 text-amber-300" />
                <span>Mode: <strong>Demo Data (Offline)</strong></span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-300" />
                <span>Mode: <strong>Live FastAPI Backend</strong></span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
