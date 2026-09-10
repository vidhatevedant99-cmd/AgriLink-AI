import React, { useState, useEffect } from "react";
import { marketApi } from "../../services/marketApi";
import { useMarket } from "../../context/MarketContext";
import { formatCurrency } from "../../utils/formatters";
import { Calendar, TrendingUp, Info } from "lucide-react";

export const PriceHistoryChart: React.FC = () => {
  const { selectedMarket } = useMarket();
  const [activeDays, setActiveDays] = useState<number>(30);
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hoveredPoint, setHoveredPoint] = useState<any | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      try {
        const history = await marketApi.getPriceHistory(selectedMarket.Market, activeDays);
        if (isMounted) {
          setData(history);
          setHoveredPoint(history[history.length - 1] || null);
        }
      } catch (e) {
        console.error("Error loading price history:", e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [selectedMarket, activeDays]);

  // Compute scale
  const prices = data.map((d) => d.modal_price);
  const minPrice = prices.length ? Math.min(...prices) * 0.96 : 2000;
  const maxPrice = prices.length ? Math.max(...prices) * 1.04 : 2700;
  const priceRange = maxPrice - minPrice || 1;

  // Chart coordinate math (SVG viewBox 0 0 800 260)
  const chartWidth = 800;
  const chartHeight = 240;
  const paddingX = 40;
  const paddingY = 30;

  const getCoordinates = (index: number, price: number) => {
    const x = paddingX + (index / Math.max(data.length - 1, 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - ((price - minPrice) / priceRange) * (chartHeight - paddingY * 2);
    return { x, y };
  };

  const points = data.map((d, i) => getCoordinates(i, d.modal_price));
  const pathD = points.length > 0
    ? points.reduce((acc, curr, idx) => `${acc} ${idx === 0 ? "M" : "L"} ${curr.x} ${curr.y}`, "")
    : "";

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`
    : "";

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900">Modal Price Trend Analysis</h3>
            <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded font-medium">
              {selectedMarket.Market}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Daily APMC auction modal settlement prices (₹ per Quintal)
          </p>
        </div>

        {/* 7d / 30d / 90d Filter Buttons */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          {[
            { label: "7 Days", value: 7 },
            { label: "30 Days", value: 30 },
            { label: "90 Days", value: 90 }
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveDays(tab.value)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeDays === tab.value
                  ? "bg-white text-emerald-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active Point Card Details */}
      {hoveredPoint && (
        <div className="flex items-center justify-between bg-emerald-50/60 border border-emerald-100 rounded-xl p-3 my-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-semibold text-slate-700">Date: {hoveredPoint.date}</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div>
              <span className="text-slate-500">Modal Price: </span>
              <strong className="text-emerald-800 text-sm">{formatCurrency(hoveredPoint.modal_price)}/qtl</strong>
            </div>
            {hoveredPoint.min_price && (
              <div className="hidden sm:block text-slate-500">
                Range: {formatCurrency(hoveredPoint.min_price)} – {formatCurrency(hoveredPoint.max_price)}
              </div>
            )}
            {hoveredPoint.arrival && (
              <div className="hidden sm:block text-slate-500">
                Arrivals: {hoveredPoint.arrival} MT
              </div>
            )}
          </div>
        </div>
      )}

      {/* Interactive Line Chart SVG */}
      <div className="relative w-full h-64 mt-2">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center text-sm text-slate-400">
            Loading historical market prices...
          </div>
        ) : data.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-sm text-slate-400">
            No historical records found for this period.
          </div>
        ) : (
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
              const yVal = chartHeight - paddingY - pct * (chartHeight - paddingY * 2);
              const priceLabel = Math.round(minPrice + pct * priceRange);
              return (
                <g key={i}>
                  <line
                    x1={paddingX}
                    y1={yVal}
                    x2={chartWidth - paddingX}
                    y2={yVal}
                    stroke="#f1f5f9"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={paddingX - 8}
                    y={yVal + 3}
                    textAnchor="end"
                    fontSize="10"
                    fill="#94a3b8"
                    fontWeight="500"
                  >
                    ₹{priceLabel}
                  </text>
                </g>
              );
            })}

            {/* Shaded Area Under Curve */}
            <path d={areaD} fill="url(#priceGradient)" />

            {/* Line Graph */}
            <path
              d={pathD}
              fill="none"
              stroke="#059669"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Points on Line */}
            {points.map((pt, idx) => {
              const item = data[idx];
              const isSelected = hoveredPoint?.date === item.date;
              return (
                <g
                  key={idx}
                  onMouseEnter={() => setHoveredPoint(item)}
                  className="cursor-pointer group"
                >
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isSelected ? "6" : "4"}
                    fill={isSelected ? "#047857" : "#ffffff"}
                    stroke="#059669"
                    strokeWidth={isSelected ? "3" : "2"}
                    className="transition-all"
                  />
                  <text
                    x={pt.x}
                    y={chartHeight - 8}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#64748b"
                  >
                    {item.date}
                  </text>
                </g>
              );
            })}
          </svg>
        )}
      </div>

      <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-3">
        <Info className="w-3.5 h-3.5" />
        <span>Hover over data points to inspect date, modal rate and arrival figures.</span>
      </div>
    </div>
  );
};
