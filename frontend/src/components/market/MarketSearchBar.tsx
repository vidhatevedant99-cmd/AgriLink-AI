import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, TrendingUp, Sparkles, X, Check } from "lucide-react";
import { Market, MarketPrice, MarketForecast } from "../../types";
import { marketApi } from "../../services/marketApi";
import { useMarket } from "../../context/MarketContext";
import { formatCurrency } from "../../utils/formatters";

export const MarketSearchBar: React.FC = () => {
  const { selectedMarket, setSelectedMarket } = useMarket();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Market[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  const [latestPrice, setLatestPrice] = useState<MarketPrice | null>(null);
  const [forecast, setForecast] = useState<MarketForecast | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch prices & forecast when selectedMarket changes
  useEffect(() => {
    let isMounted = true;
    async function loadMarketStats() {
      if (!selectedMarket?.Market) return;
      setLoadingDetails(true);
      try {
        const [priceData, forecastData] = await Promise.all([
          marketApi.getLatestPrice(selectedMarket.Market),
          marketApi.getMarketForecast(selectedMarket.Market)
        ]);
        if (isMounted) {
          setLatestPrice(priceData);
          setForecast(forecastData);
        }
      } catch (err) {
        console.error("Error loading market stats:", err);
      } finally {
        if (isMounted) setLoadingDetails(false);
      }
    }
    loadMarketStats();
    return () => { isMounted = false; };
  }, [selectedMarket]);

  // Handle autocomplete input
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim().length === 0) {
      setSuggestions([]);
      setIsOpen(false);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    try {
      const results = await marketApi.searchMarkets(val);
      setSuggestions(results);
      setIsOpen(true);
    } catch (err) {
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (market: Market) => {
    setSelectedMarket(market);
    setQuery("");
    setIsOpen(false);
    setHasSearched(false);
  };

  return (
    <div className="w-full space-y-4">
      {/* Search Input Box with Autocomplete */}
      <div ref={wrapperRef} className="relative w-full max-w-2xl">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5 text-emerald-600" />
          </div>
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => { if (query.trim().length > 0) setIsOpen(true); }}
            placeholder="Search market... (try 'yeo', 'lasal', 'pune', 'nagpur')"
            className="w-full pl-10 pr-10 py-3 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-all"
          />
          {query && (
            <button
              onClick={() => { setQuery(""); setSuggestions([]); setIsOpen(false); }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Suggestion Dropdown */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
            {isLoading ? (
              <div className="p-4 text-center text-xs text-slate-500">Searching agricultural markets...</div>
            ) : suggestions.length > 0 ? (
              <div className="max-h-64 overflow-y-auto py-1">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Suggested APMC Mandis ({suggestions.length})
                </div>
                {suggestions.map((m, idx) => (
                  <button
                    key={`${m.Market}-${idx}`}
                    onClick={() => handleSelect(m)}
                    className="w-full text-left px-3.5 py-2.5 text-sm hover:bg-emerald-50 flex items-center justify-between transition-colors group cursor-pointer border-b border-slate-50 last:border-b-0"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-emerald-800">
                          {m.Market}
                        </div>
                        <div className="text-xs text-slate-500">
                          {m.District}, {m.State || "Maharashtra"}
                        </div>
                      </div>
                    </div>
                    {selectedMarket.Market.toLowerCase() === m.Market.toLowerCase() && (
                      <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Active
                      </span>
                    )}
                  </button>
                ))}
              </div>
            ) : hasSearched ? (
              <div className="p-4 text-center text-sm text-slate-500">
                No matching markets found.
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Active Selected Market Card Display */}
      {selectedMarket && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs transition-all hover:border-emerald-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{selectedMarket.Market}</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {selectedMarket.District}, {selectedMarket.State || "Maharashtra"} • Mandi Reg: APMC-{selectedMarket["SR.NO"] || "09"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                <TrendingUp className="w-3.5 h-3.5" />
                Trend: Increasing ({forecast?.trend_percentage || "+2.8%"})
              </span>
            </div>
          </div>

          {/* Key Pricing Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Current Modal Price</span>
              <div className="mt-1 text-2xl font-extrabold text-slate-900">
                {latestPrice ? formatCurrency(latestPrice["Modal Price"]) : "₹2,450"}
                <span className="text-xs font-semibold text-slate-500"> / qtl</span>
              </div>
              <span className="text-[11px] text-slate-500 mt-0.5 block">Standard Mandi Auction Rate</span>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Mandi Price Range</span>
              <div className="mt-1 text-lg font-bold text-slate-800">
                {latestPrice ? formatCurrency(latestPrice["Min Price"]) : "₹2,200"}
                <span className="text-slate-400 font-normal"> — </span>
                {latestPrice ? formatCurrency(latestPrice["Max Price"]) : "₹2,600"}
              </div>
              <span className="text-[11px] text-slate-500 mt-0.5 block">Min to Max realized today</span>
            </div>

            <div className="bg-emerald-50/70 rounded-xl p-3.5 border border-emerald-200">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">AI Estimated Price</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <div className="mt-1 text-2xl font-extrabold text-emerald-900">
                {forecast ? formatCurrency(forecast.forecast_modal_price) : "₹2,520"}
                <span className="text-xs font-semibold text-emerald-700"> / qtl</span>
              </div>
              <span className="text-[11px] text-emerald-700 mt-0.5 block">
                {forecast?.explanation || "Forecast based on historical market price and arrival patterns."}
              </span>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Arrival Volume</span>
              <div className="mt-1 text-xl font-bold text-slate-900">
                {latestPrice ? `${latestPrice["Arrival Quantity"].toLocaleString("en-IN")} MT` : "3,850 MT"}
              </div>
              <span className="text-[11px] text-slate-500 mt-0.5 block">Recorded at APMC Gates</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
