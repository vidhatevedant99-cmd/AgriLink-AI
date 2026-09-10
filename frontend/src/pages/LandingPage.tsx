import React from "react";
import { useAuth } from "../context/AuthContext";
import { useMarket } from "../context/MarketContext";
import { Sprout, ArrowRight, ShieldCheck, TrendingUp, Truck, Users, Sparkles, CheckCircle2, ChevronRight } from "lucide-react";

interface LandingPageProps {
  onNavigate: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const { selectMarketByName } = useMarket();

  const handleStartSelling = () => {
    login("farmer");
    selectMarketByName("Yeola APMC");
    onNavigate("dashboard");
  };

  const handleFindProduce = () => {
    login("buyer");
    onNavigate("dashboard");
  };

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto px-4 space-y-6">
        <div className="inline-flex items-center gap-2 bg-emerald-100/80 text-emerald-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          Smart India Hackathon 2026 Innovation
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight">
          Sell Direct. <span className="text-emerald-600">Buy Smarter.</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
          AgriLink AI connects farmers and buyers directly, combines APMC market intelligence with smart matching, and reduces unnecessary supply-chain costs.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={handleStartSelling}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-6 py-3.5 rounded-2xl shadow-lg shadow-emerald-700/20 text-sm transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Start Selling as Farmer / FPO</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleFindProduce}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3.5 rounded-2xl text-sm transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Find Produce as Bulk Buyer</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="pt-2">
          <span className="text-xs text-slate-400 font-medium">
            Pre-loaded with Maharashtra APMC Mandi Data (Yeola, Lasalgaon, Pune, Nashik)
          </span>
        </div>
      </section>

      {/* Problem vs Solution Supply Chain Visualizer */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-md">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              The Agricultural Supply Chain Revolution
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Eliminating the multi-tiered intermediaries that drain farmer profits and inflate consumer food prices.
            </p>
          </div>

          <div className="space-y-8">
            {/* Traditional Route */}
            <div className="bg-rose-50/50 border border-rose-200 rounded-2xl p-6">
              <div className="flex items-center justify-between pb-4 border-b border-rose-200">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <h3 className="text-base font-bold text-rose-900">The Problem: Traditional Middleman Chain</h3>
                </div>
                <span className="text-xs font-bold text-rose-700 bg-rose-100 px-3 py-1 rounded-full">
                  High Loss • 35-45% Farmer Share
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 mt-4 text-center text-xs">
                {[
                  { name: "Farmer", role: "Hard labor", cut: "Base price" },
                  { name: "Village Trader", role: "Cash advance", cut: "-8% cut" },
                  { name: "Commission Agent", role: "Mandi auction", cut: "-6% adat" },
                  { name: "Wholesaler", role: "Bulk markup", cut: "+15% markup" },
                  { name: "Retailer", role: "Store markup", cut: "+20% markup" },
                  { name: "Consumer", role: "End buyer", cut: "Pays 2x-3x" }
                ].map((node, i) => (
                  <div key={i} className="bg-white border border-rose-200/80 rounded-xl p-3 shadow-xs">
                    <div className="font-bold text-slate-800">{node.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{node.role}</div>
                    <div className="text-[11px] font-bold text-rose-600 mt-1">{node.cut}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* AgriLink AI Route */}
            <div className="bg-emerald-50/70 border-2 border-emerald-500 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-emerald-200">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <h3 className="text-base font-bold text-emerald-950">The AgriLink AI Solution: Direct Smart Flow</h3>
                </div>
                <span className="text-xs font-extrabold text-emerald-800 bg-emerald-200/80 px-3 py-1 rounded-full">
                  Disintermediated • 75-85% Farmer Share
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-center text-xs">
                <div className="bg-white border-2 border-emerald-400 rounded-xl p-4 shadow-xs">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold mx-auto mb-2">
                    1
                  </div>
                  <div className="font-bold text-slate-900 text-sm">Farmer / FPO</div>
                  <p className="text-slate-500 mt-1">Posts produce lot with verified quality & expected price.</p>
                  <div className="mt-2 text-emerald-700 font-bold bg-emerald-50 py-1 rounded">
                    Gets Mandi Price Intelligence & Forecast
                  </div>
                </div>

                <div className="bg-emerald-700 text-white rounded-xl p-4 shadow-md">
                  <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold mx-auto mb-2">
                    AI
                  </div>
                  <div className="font-bold text-white text-sm">AgriLink AI Engine</div>
                  <p className="text-emerald-100 mt-1">Smart Match Score (91%) + Automated Route & Freight Cost Estimation.</p>
                  <div className="mt-2 text-amber-300 font-bold bg-emerald-800/60 py-1 rounded">
                    0% Middlemen Commission
                  </div>
                </div>

                <div className="bg-white border-2 border-emerald-400 rounded-xl p-4 shadow-xs">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold mx-auto mb-2">
                    2
                  </div>
                  <div className="font-bold text-slate-900 text-sm">Bulk Buyer / Retailer</div>
                  <p className="text-slate-500 mt-1">Direct digital procurement at fair, transparent rates.</p>
                  <div className="mt-2 text-emerald-700 font-bold bg-emerald-50 py-1 rounded">
                    Fresh produce & doorstep delivery
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Pillars Grid */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4 font-bold">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Better Farmer Realization</h4>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Direct contracts ensure farmers earn higher net revenue compared to distress sales at overcrowded mandis.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-4 font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Market Intelligence & AI</h4>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Real-time APMC price tracking, 7-day price forecasting, and regional commodity demand predictions.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4 font-bold">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Smart Matching Algorithm</h4>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Matches lots by commodity compatibility, quality grade, volume ratio, price expectations, and transport radius.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center mb-4 font-bold">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Optimized Shared Logistics</h4>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Transparent freight calculation, highway corridor planning, and vehicle capacity allocation.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
