import React from "react";
import { Sparkles, TrendingUp, AlertCircle, BarChart3 } from "lucide-react";

interface DemandForecastCardProps {
  commodity?: string;
}

export const DemandForecastCard: React.FC<DemandForecastCardProps> = ({ commodity = "Onion" }) => {
  const forecastDays = [
    { label: "Today", value: 12000, pct: "+0%", date: "Sep 03" },
    { label: "Tomorrow", value: 13500, pct: "+12.5%", date: "Sep 04" },
    { label: "+2 Days", value: 14200, pct: "+5.1%", date: "Sep 05" },
    { label: "+3 Days", value: 15000, pct: "+5.6%", date: "Sep 06" }
  ];

  const maxVal = 16000;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-100 text-amber-800">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">{commodity} Regional Demand Forecast</h3>
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider">
                <Sparkles className="w-3 h-3" /> AI Demand Forecast
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Projected buyer procurement volumes across Western Maharashtra corridors
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 inline-flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> High Regional Demand
          </span>
        </div>
      </div>

      {/* Demand Bars */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
        {forecastDays.map((item, idx) => {
          const heightPct = Math.round((item.value / maxVal) * 100);
          return (
            <div key={idx} className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-700">{item.label}</span>
                <span>{item.date}</span>
              </div>

              <div className="my-3">
                <div className="text-xl font-extrabold text-slate-900">
                  {item.value.toLocaleString("en-IN")} <span className="text-xs font-normal text-slate-500">kg</span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-600">
                  {item.pct !== "+0%" ? `Growth ${item.pct}` : "Base Baseline"}
                </span>
              </div>

              {/* Visual Progress Bar */}
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${heightPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Prototype Disclaimer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-400">
        <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
        <span>
          <strong>Prototype Disclaimer:</strong> Forecast values are simulated estimates based on regional procurement patterns. Not real-world financial transaction commitments.
        </span>
      </div>
    </div>
  );
};
