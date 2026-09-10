import { Market, MarketPrice, MarketForecast } from "../types";
import { apiFetch, getIsDemoMode } from "./api";
import { MOCK_MARKETS, MOCK_PRICES, MOCK_FORECASTS, MOCK_PRICE_HISTORY_SERIES } from "../data/mockData";

export const marketApi = {
  // GET /api/markets/search?search={query}
  async searchMarkets(query: string): Promise<Market[]> {
    if (!query || query.trim().length === 0) return [];

    if (!getIsDemoMode()) {
      try {
        const data = await apiFetch<any[]>(`/api/markets/search?search=${encodeURIComponent(query)}`);
        if (data && data.length > 0) {
          // Normalize responses from Supabase Market_price or Market_location
          return data.map((item, idx) => ({
            "SR.NO": item["SR.NO"] || idx + 1,
            Market: item.Market || item.market || "Unknown Market",
            District: item.District || item.district || "Maharashtra",
            State: item.State || item["State/UT"] || "Maharashtra",
            latitude: parseFloat(item.Lattitude || item.Latitude || item.latitude || "20.0422"),
            longitude: parseFloat(item.Longitude || item.longitude || "74.4878")
          }));
        }
      } catch (err) {
        // Fallback to local mock data
      }
    }

    // Demo Mode fallback
    const q = query.toLowerCase().trim();
    return MOCK_MARKETS.filter(
      (m) =>
        m.Market.toLowerCase().includes(q) ||
        m.District.toLowerCase().includes(q)
    );
  },

  // GET /api/markets/{market}
  async getMarketDetails(marketName: string): Promise<Market> {
    if (!getIsDemoMode()) {
      try {
        const item = await apiFetch<any>(`/api/markets/${encodeURIComponent(marketName)}`);
        if (item && item.Market) {
          return {
            "SR.NO": item["SR.NO"] || 1,
            Market: item.Market,
            District: item.District || "Nashik",
            State: item.State || item["State/UT"] || "Maharashtra",
            latitude: parseFloat(item.latitude || item.Lattitude || item.Latitude || "20.0422"),
            longitude: parseFloat(item.longitude || item.Longitude || "74.4878")
          };
        }
      } catch (err) {
        // Fallback to mock
      }
    }

    const found = MOCK_MARKETS.find(
      (m) => m.Market.toLowerCase() === marketName.toLowerCase()
    );
    return (
      found || {
        "SR.NO": 1,
        Market: marketName,
        District: "Nashik",
        State: "Maharashtra",
        latitude: 20.0422,
        longitude: 74.4878
      }
    );
  },

  // GET /api/markets/{market}/latest-price
  async getLatestPrice(marketName: string): Promise<MarketPrice> {
    if (!getIsDemoMode()) {
      try {
        const data = await apiFetch<any>(`/api/markets/${encodeURIComponent(marketName)}/latest-price`);
        if (data && data["Modal Price"]) {
          return {
            State: data.State || "Maharashtra",
            District: data.District || "Nashik",
            Market: data.Market || marketName,
            Commodity: data.Commodity || "Onion",
            Variety: data.Variety || "Other",
            Grade: data.Grade || "Local",
            "Min Price": data["Min Price"] || 2200,
            "Max Price": data["Max Price"] || 2600,
            "Modal Price": data["Modal Price"] || 2450,
            "Price Unit": data["Price Unit"] || "Rs./Quintal",
            "Arrival Quantity": data["Arrival Quantity"] || 3850,
            "Arrival Unit": data["Arrival Unit"] || "Metric Tonnes",
            "Arrival Date": data["Arrival Date"] || new Date().toISOString().split("T")[0]
          };
        }
      } catch (err) {
        // Fallback to mock
      }
    }

    return (
      MOCK_PRICES[marketName] || {
        State: "Maharashtra",
        District: "Nashik",
        Market: marketName,
        Commodity: "Onion",
        Variety: "Garva / Red Onion",
        Grade: "Grade A",
        "Min Price": 2200,
        "Max Price": 2600,
        "Modal Price": 2450,
        "Price Unit": "Rs./Quintal",
        "Arrival Quantity": 3850,
        "Arrival Unit": "Metric Tonnes",
        "Arrival Date": new Date().toISOString().split("T")[0]
      }
    );
  },

  // GET /api/markets/{market}/price-history
  async getPriceHistory(marketName: string, days: number = 30): Promise<typeof MOCK_PRICE_HISTORY_SERIES> {
    if (!getIsDemoMode()) {
      try {
        const data = await apiFetch<any[]>(`/api/markets/${encodeURIComponent(marketName)}/price-history?limit=${days}`);
        if (data && Array.isArray(data) && data.length > 0) {
          return data.map((d) => ({
            date: d["Arrival Date"] ? d["Arrival Date"].slice(5) : "Recent",
            modal_price: d["Modal Price"] || 2400,
            min_price: d["Min Price"] || 2100,
            max_price: d["Max Price"] || 2550,
            arrival: d["Arrival Quantity"] || 1000
          }));
        }
      } catch (err) {
        // Fallback
      }
    }

    // Filter slice according to days requested
    if (days <= 7) {
      return MOCK_PRICE_HISTORY_SERIES.slice(-4);
    } else if (days <= 30) {
      return MOCK_PRICE_HISTORY_SERIES;
    } else {
      // simulate 90 days with spread
      return [
        { date: "Jun 15", modal_price: 2100, min_price: 1900, max_price: 2250, arrival: 2800 },
        { date: "Jul 01", modal_price: 2180, min_price: 1950, max_price: 2320, arrival: 3100 },
        { date: "Jul 15", modal_price: 2220, min_price: 2000, max_price: 2380, arrival: 3250 },
        ...MOCK_PRICE_HISTORY_SERIES
      ];
    }
  },

  // GET /api/markets/{market}/forecast
  async getMarketForecast(marketName: string): Promise<MarketForecast> {
    if (!getIsDemoMode()) {
      try {
        const forecast = await apiFetch<MarketForecast>(`/api/markets/${encodeURIComponent(marketName)}/forecast`);
        if (forecast && forecast.forecast_modal_price) {
          return forecast;
        }
      } catch (err) {
        // Fallback
      }
    }

    return (
      MOCK_FORECASTS[marketName] || {
        market: marketName,
        commodity: "Onion",
        current_modal_price: 2450,
        forecast_modal_price: 2520,
        unit: "Rs./Quintal",
        trend: "Increasing",
        trend_percentage: "+2.8%",
        confidence: 0.88,
        explanation: "Forecast based on historical market price and arrival patterns.",
        forecast_horizon_days: 7,
        daily_forecast: [
          { day: "Today", date: "Sep 03", price: 2450 },
          { day: "Tomorrow", date: "Sep 04", price: 2470 },
          { day: "+2 Days", date: "Sep 05", price: 2495 },
          { day: "+3 Days", date: "Sep 06", price: 2520 }
        ],
        demand_forecast: {
          commodity: "Onion",
          unit: "kg",
          today: 12000,
          tomorrow: 13500,
          plus_2_days: 14200,
          plus_3_days: 15000,
          label: "AI Demand Forecast",
          disclaimer: "Prototype estimate based on regional procurement patterns. Not real-world transactional data."
        }
      }
    );
  }
};
