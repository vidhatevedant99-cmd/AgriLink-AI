import React from "react";
import { MarketSearchBar } from "../components/market/MarketSearchBar";
import { PriceHistoryChart } from "../components/charts/PriceHistoryChart";
import { DemandForecastCard } from "../components/charts/DemandForecastCard";
import { useMarket } from "../context/MarketContext";
import { TrendingUp, BarChart2, ShieldAlert } from "lucide-react";

export const MarketPricesPage: React.FC = () => {
  const { selectedMarket } = useMarket();

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">APMC Mandi Price Intelligence</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Grounded with real-time arrival quantities and modal prices across Maharashtra APMC markets.
        </p>
      </div>

      {/* Market Selector & Key Metrics */}
      <MarketSearchBar />

      {/* Price History & Demand Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PriceHistoryChart />
        </div>
        <div className="lg:col-span-1">
          <DemandForecastCard commodity="Onion" />
        </div>
      </div>
    </div>
  );
};
