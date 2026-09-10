import React, { createContext, useContext, useState, useEffect } from "react";
import { Market } from "../types";
import { MOCK_MARKETS } from "../data/mockData";

interface MarketContextType {
  selectedMarket: Market;
  setSelectedMarket: (market: Market) => void;
  selectMarketByName: (name: string) => void;
}

const MARKET_STORAGE_KEY = "agrilink_selected_market";

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export const MarketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedMarket, setSelectedMarketState] = useState<Market>(() => {
    const saved = localStorage.getItem(MARKET_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved) as Market;
      } catch (e) {}
    }
    // Default to Yeola APMC
    return MOCK_MARKETS[0];
  });

  const setSelectedMarket = (market: Market) => {
    setSelectedMarketState(market);
    localStorage.setItem(MARKET_STORAGE_KEY, JSON.stringify(market));
  };

  const selectMarketByName = (name: string) => {
    const found = MOCK_MARKETS.find(
      (m) => m.Market.toLowerCase() === name.toLowerCase()
    );
    if (found) {
      setSelectedMarket(found);
    } else {
      setSelectedMarket({
        Market: name,
        District: "Nashik",
        State: "Maharashtra",
        latitude: 20.0422,
        longitude: 74.4878
      });
    }
  };

  return (
    <MarketContext.Provider
      value={{
        selectedMarket,
        setSelectedMarket,
        selectMarketByName
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = () => {
  const context = useContext(MarketContext);
  if (!context) throw new Error("useMarket must be used within a MarketProvider");
  return context;
};
