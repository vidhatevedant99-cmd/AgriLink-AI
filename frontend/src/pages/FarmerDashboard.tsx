import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useMarket } from "../context/MarketContext";
import { MarketSearchBar } from "../components/market/MarketSearchBar";
import { PriceHistoryChart } from "../components/charts/PriceHistoryChart";
import { DemandForecastCard } from "../components/charts/DemandForecastCard";
import { NetEarningComparisonCard } from "../components/marketplace/NetEarningComparisonCard";
import { ProduceLotCard } from "../components/marketplace/ProduceLotCard";
import { SmartMatchCard } from "../components/marketplace/SmartMatchCard";
import { LogisticsModal } from "../components/logistics/LogisticsModal";
import { marketplaceApi } from "../services/marketplaceApi";
import { ProduceLot, Match, Order } from "../types";
import { PlusCircle, Package, Users, ShoppingBag, ArrowRight, CheckCircle2 } from "lucide-react";

interface FarmerDashboardProps {
  onNavigate: (tab: string) => void;
  onSelectLotForBuyers: (lot: ProduceLot) => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({ onNavigate, onSelectLotForBuyers }) => {
  const { user } = useAuth();
  const { selectedMarket } = useMarket();

  const [lots, setLots] = useState<ProduceLot[]>([]);
  const [recommendedMatches, setRecommendedMatches] = useState<Match[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeLogisticsMatchId, setActiveLogisticsMatchId] = useState<string | null>(null);
  const [acceptedMatchIds, setAcceptedMatchIds] = useState<string[]>([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [lotsData, matchesData, ordersData] = await Promise.all([
          marketplaceApi.getLots(),
          marketplaceApi.getMatchesForLot("lot-1"),
          marketplaceApi.getOrders()
        ]);
        setLots(lotsData);
        setRecommendedMatches(matchesData);
        setOrders(ordersData);
      } catch (err) {
        console.error("Error loading farmer dashboard data:", err);
      }
    }
    loadDashboardData();
  }, []);

  const handleAcceptOffer = async (match: Match) => {
    try {
      await marketplaceApi.createOrder({
        offer_id: match.id,
        lot_id: match.lot_id,
        buyer_id: match.buyer_id,
        buyer_name: match.buyer_name,
        farmer_id: user.id,
        farmer_name: user.name,
        commodity: "Onion",
        quantity: match.required_quantity,
        agreed_price: match.offered_price,
        gross_amount: match.gross_earning,
        logistics_cost: match.logistics_cost,
        net_earning: match.farmer_net_earning,
        pickup_location: "Yeola, Nashik",
        delivery_location: match.delivery_location
      });
      setAcceptedMatchIds((prev) => [...prev, match.id]);
      // Refresh orders
      const updatedOrders = await marketplaceApi.getOrders();
      setOrders(updatedOrders);
    } catch (e) {
      console.error("Failed to accept offer:", e);
    }
  };

  return (
    <div className="space-y-10 py-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Welcome back, {user.name} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            FPO Member • Yeola Taluka, Nashik District • Active APMC: <strong className="text-emerald-700">{selectedMarket.Market}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate("create-lot")}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Create Produce Lot</span>
          </button>
        </div>
      </div>

      {/* 1. Market Search & Price Intelligence Card */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Agricultural Market Intelligence</h2>
          <button
            onClick={() => onNavigate("market-prices")}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Explore All Mandis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <MarketSearchBar />
      </section>

      {/* 2. Core Farmer Benefit: Net Earning Comparison */}
      <section>
        <NetEarningComparisonCard
          commodity="Onion (Grade A)"
          quantity={500}
          buyerPrice={26}
          mandiRate={22}
          logisticsCost={1800}
          buyerName="Pune Wholesale"
        />
      </section>

      {/* 3. Price History Chart & Demand Forecast Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PriceHistoryChart />
        </div>
        <div className="lg:col-span-1">
          <DemandForecastCard commodity="Onion" />
        </div>
      </div>

      {/* 4. Active Produce Lots */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900">My Active Produce Lots</h2>
          </div>
          <button
            onClick={() => onNavigate("create-lot")}
            className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
          >
            + Add New Lot
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {lots.map((lot) => (
            <ProduceLotCard
              key={lot.id}
              lot={lot}
              onFindBuyers={(selectedLot) => {
                onSelectLotForBuyers(selectedLot);
                onNavigate("find-buyers");
              }}
            />
          ))}
        </div>
      </section>

      {/* 5. Recommended Buyers (Smart Match) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900">Recommended Buyers for Your Produce</h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">Ranked by Smart Match Score</span>
        </div>

        <div className="space-y-4">
          {recommendedMatches.slice(0, 2).map((match) => (
            <SmartMatchCard
              key={match.id}
              match={match}
              isAccepted={acceptedMatchIds.includes(match.id)}
              onAcceptOffer={handleAcceptOffer}
              onViewLogistics={(m) => setActiveLogisticsMatchId(m.id)}
            />
          ))}
        </div>
      </section>

      {/* 6. Recent Orders */}
      {orders.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-900">Recent Transactions & Orders</h2>
            </div>
            <button
              onClick={() => onNavigate("orders")}
              className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
            >
              View All Orders
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Order ID</th>
                    <th className="px-4 py-3">Buyer</th>
                    <th className="px-4 py-3">Produce</th>
                    <th className="px-4 py-3">Quantity</th>
                    <th className="px-4 py-3">Agreed Rate</th>
                    <th className="px-4 py-3">Farmer Net Earning</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50/80">
                      <td className="px-4 py-3.5 font-bold text-slate-900">{o.id}</td>
                      <td className="px-4 py-3.5 font-medium text-slate-800">{o.buyer_name}</td>
                      <td className="px-4 py-3.5 text-slate-600">{o.commodity}</td>
                      <td className="px-4 py-3.5 font-semibold text-slate-800">{o.quantity} {o.unit}</td>
                      <td className="px-4 py-3.5 text-emerald-700 font-bold">₹{o.agreed_price}/kg</td>
                      <td className="px-4 py-3.5 text-slate-900 font-extrabold">₹{o.net_earning.toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3.5">
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Logistics Modal */}
      {activeLogisticsMatchId && (
        <LogisticsModal
          matchId={activeLogisticsMatchId}
          isOpen={!!activeLogisticsMatchId}
          onClose={() => setActiveLogisticsMatchId(null)}
        />
      )}
    </div>
  );
};
