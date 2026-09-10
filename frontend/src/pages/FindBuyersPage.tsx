import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { ProduceLot, Match } from "../types";
import { marketplaceApi } from "../services/marketplaceApi";
import { SmartMatchCard } from "../components/marketplace/SmartMatchCard";
import { NetEarningComparisonCard } from "../components/marketplace/NetEarningComparisonCard";
import { LogisticsModal } from "../components/logistics/LogisticsModal";
import { Sparkles, ArrowLeft, Users, CheckCircle2, ShieldCheck } from "lucide-react";

interface FindBuyersPageProps {
  selectedLot: ProduceLot | null;
  onBack: () => void;
  onOrderCreated: (orderId: string) => void;
}

export const FindBuyersPage: React.FC<FindBuyersPageProps> = ({ selectedLot, onBack, onOrderCreated }) => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeLogisticsMatchId, setActiveLogisticsMatchId] = useState<string | null>(null);
  const [acceptedMatchId, setAcceptedMatchId] = useState<string | null>(null);

  const currentLot = selectedLot || {
    id: "lot-1",
    farmer_id: user.id,
    farmer_name: user.name,
    commodity: "Onion",
    variety: "Garva / Red Onion",
    quality: "Grade A",
    quantity: 500,
    unit: "kg",
    expected_price: 25,
    market: "Yeola APMC",
    pickup_location: "Yeola, Nashik",
    latitude: 20.0422,
    longitude: 74.4878,
    available_date: "2026-09-05",
    status: "available" as const,
    created_at: new Date().toISOString()
  };

  useEffect(() => {
    async function loadMatches() {
      setLoading(true);
      try {
        const results = await marketplaceApi.getMatchesForLot(currentLot.id);
        setMatches(results);
      } catch (err) {
        console.error("Error matching buyers:", err);
      } finally {
        setLoading(false);
      }
    }
    loadMatches();
  }, [currentLot.id]);

  const handleAcceptOffer = async (match: Match) => {
    try {
      const order = await marketplaceApi.createOrder({
        offer_id: match.id,
        lot_id: currentLot.id,
        buyer_id: match.buyer_id,
        buyer_name: match.buyer_name,
        farmer_id: user.id,
        farmer_name: user.name,
        commodity: currentLot.commodity,
        quantity: match.required_quantity,
        agreed_price: match.offered_price,
        gross_amount: match.gross_earning,
        logistics_cost: match.logistics_cost,
        net_earning: match.farmer_net_earning,
        pickup_location: currentLot.pickup_location,
        delivery_location: match.delivery_location
      });
      setAcceptedMatchId(match.id);
      onOrderCreated(order.id);
    } catch (e) {
      console.error("Error creating order:", e);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-8">
      {/* Header & Lot Meta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Best Buyer Matches
            </h1>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase">
              Smart Match Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Produce Lot: <strong>{currentLot.commodity} ({currentLot.quality})</strong> • {currentLot.quantity} {currentLot.unit} • Expected Rate: ₹{currentLot.expected_price}/kg • Pickup: {currentLot.pickup_location}
          </p>
        </div>

        <div className="bg-slate-100 px-4 py-2 rounded-2xl text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400">Matching Criteria</span>
          <div className="text-xs font-bold text-slate-700">Commodity + Quantity + Price + Logistics</div>
        </div>
      </div>

      {/* Prominent Farmer Realization Metric */}
      <section>
        <NetEarningComparisonCard
          commodity={`${currentLot.commodity} (${currentLot.quality})`}
          quantity={currentLot.quantity}
          buyerPrice={matches[0]?.offered_price || 26}
          mandiRate={22}
          logisticsCost={matches[0]?.logistics_cost || 1800}
          buyerName={matches[0]?.buyer_name || "Pune Wholesale"}
        />
      </section>

      {/* Ranked Buyer Matches List */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-bold text-slate-900">
              Ranked Buyer Recommendations ({matches.length})
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Sorted by highest Smart Match score & farmer net realization
          </span>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl p-12 text-center text-slate-400 border border-slate-200">
            Scanning regional buyer demands and calculating transport corridors...
          </div>
        ) : matches.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-slate-500 border border-slate-200">
            No active buyer demands matched this specific lot yet. Try adjusting expected price or check back soon.
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => (
              <SmartMatchCard
                key={match.id}
                match={match}
                isAccepted={acceptedMatchId === match.id}
                onAcceptOffer={handleAcceptOffer}
                onViewLogistics={(m) => setActiveLogisticsMatchId(m.id)}
              />
            ))}
          </div>
        )}
      </section>

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
