import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { DemandCard } from "../components/marketplace/DemandCard";
import { ProduceLotCard } from "../components/marketplace/ProduceLotCard";
import { marketplaceApi } from "../services/marketplaceApi";
import { BuyerDemand, ProduceLot, Offer, Order } from "../types";
import { ShoppingBag, Package, PlusCircle, ArrowRight, TrendingUp, Sparkles, CheckCircle2 } from "lucide-react";

interface BuyerDashboardProps {
  onNavigate: (tab: string) => void;
  onMakeOfferForLot: (lot: ProduceLot) => void;
}

export const BuyerDashboard: React.FC<BuyerDashboardProps> = ({ onNavigate, onMakeOfferForLot }) => {
  const { user } = useAuth();
  const [demands, setDemands] = useState<BuyerDemand[]>([]);
  const [availableLots, setAvailableLots] = useState<ProduceLot[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function loadBuyerData() {
      try {
        const [dList, lotsList, offersList, ordersList] = await Promise.all([
          marketplaceApi.getDemands(),
          marketplaceApi.getLots(),
          marketplaceApi.getOffers(),
          marketplaceApi.getOrders()
        ]);
        setDemands(dList);
        setAvailableLots(lotsList);
        setOffers(offersList);
        setOrders(ordersList);
      } catch (err) {
        console.error("Error loading buyer dashboard data:", err);
      }
    }
    loadBuyerData();
  }, []);

  return (
    <div className="space-y-10 py-6">
      {/* Welcome & CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Welcome, {user.name} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Verified Wholesale Buyer • Base: {user.location} • Direct Procurement Portal
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate("create-demand")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Create Demand Request</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Active Demands</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{demands.length}</div>
          <span className="text-[11px] text-blue-600 font-medium">Open for farmer offers</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Available Farm Lots</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{availableLots.length}</div>
          <span className="text-[11px] text-emerald-600 font-medium">Verified crop lots</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Pending Offers</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{offers.length}</div>
          <span className="text-[11px] text-amber-600 font-medium">Awaiting farmer approval</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Confirmed Orders</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{orders.length}</div>
          <span className="text-[11px] text-emerald-700 font-medium">In transit & completed</span>
        </div>
      </div>

      {/* 1. Active Demands */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">My Active Procurement Demands</h2>
          </div>
          <button
            onClick={() => onNavigate("create-demand")}
            className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
          >
            + Post New Demand
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {demands.map((demand) => (
            <DemandCard
              key={demand.id}
              demand={demand}
              showAction={false}
            />
          ))}
        </div>
      </section>

      {/* 2. Available Produce Lots (Direct from Farmers) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900">Fresh Produce Lots Available Directly From Farmers</h2>
          </div>
          <span className="text-xs text-slate-500">Zero intermediary markup • Direct farm dispatch</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {availableLots.map((lot) => (
            <div key={lot.id} className="relative">
              <ProduceLotCard
                lot={lot}
                showFindBuyersAction={false}
              />
              <div className="mt-2 text-right">
                <button
                  onClick={() => onMakeOfferForLot(lot)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-xl text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Make Direct Procurement Offer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
