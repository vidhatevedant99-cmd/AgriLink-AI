import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { marketplaceApi } from "../services/marketplaceApi";
import { Offer } from "../types";
import { formatCurrency, formatWeight, formatDate } from "../utils/formatters";
import { Tag, CheckCircle2, XCircle, ArrowRight, ShieldCheck } from "lucide-react";

interface OffersPageProps {
  onOrderCreated: (orderId: string) => void;
}

export const OffersPage: React.FC<OffersPageProps> = ({ onOrderCreated }) => {
  const { isFarmer, user } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOffers() {
      setLoading(true);
      try {
        const data = await marketplaceApi.getOffers();
        setOffers(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadOffers();
  }, []);

  const handleAcceptOffer = async (offer: Offer) => {
    try {
      const order = await marketplaceApi.createOrder({
        offer_id: offer.id,
        lot_id: offer.lot_id,
        buyer_id: offer.buyer_id,
        buyer_name: offer.buyer_name,
        farmer_id: offer.farmer_id,
        farmer_name: offer.farmer_name,
        commodity: offer.commodity,
        quantity: offer.quantity,
        unit: offer.unit,
        agreed_price: offer.offered_price,
        gross_amount: offer.offered_price * offer.quantity,
        logistics_cost: offer.logistics_cost,
        net_earning: offer.estimated_net_earning,
        pickup_location: "Yeola, Nashik",
        delivery_location: "Marketyard, Pune"
      });

      // Update offer status locally
      setOffers((prev) =>
        prev.map((o) => (o.id === offer.id ? { ...o, status: "accepted" } : o))
      );

      onOrderCreated(order.id);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            {isFarmer ? "Offers from Verified Buyers" : "Outbound Procurement Offers"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Negotiate and accept direct purchase commitments with transparent logistics
          </p>
        </div>
      </div>

      {loading ? (
        <div className="bg-white p-12 text-center text-slate-400 rounded-2xl border border-slate-200">
          Loading offers...
        </div>
      ) : offers.length === 0 ? (
        <div className="bg-white p-12 text-center text-slate-500 rounded-2xl border border-slate-200">
          No offers currently available.
        </div>
      ) : (
        <div className="space-y-4">
          {offers.map((offer) => {
            const gross = offer.offered_price * offer.quantity;
            return (
              <div
                key={offer.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:border-emerald-300 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-lg">
                        {isFarmer ? offer.buyer_name : `Farmer: ${offer.farmer_name}`}
                      </span>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                        offer.status === "accepted"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        {offer.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Commodity: <strong className="text-slate-700">{offer.commodity}</strong> • Submitted: {formatDate(offer.created_at)}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 font-medium">Offered Purchase Rate</span>
                    <div className="text-2xl font-black text-emerald-800">
                      ₹{offer.offered_price} <span className="text-xs font-normal text-slate-500">/ {offer.unit}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl">
                    <span className="text-slate-500">Lot Quantity</span>
                    <div className="text-sm font-bold text-slate-900 mt-0.5">
                      {formatWeight(offer.quantity, offer.unit)}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl">
                    <span className="text-slate-500">Gross Contract Value</span>
                    <div className="text-sm font-bold text-slate-900 mt-0.5">
                      {formatCurrency(gross)}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl">
                    <span className="text-slate-500">Logistics (185 km)</span>
                    <div className="text-sm font-bold text-slate-900 mt-0.5">
                      -{formatCurrency(offer.logistics_cost)}
                    </div>
                  </div>

                  <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                    <span className="text-emerald-800 font-bold uppercase text-[10px]">Farmer Net Earning</span>
                    <div className="text-base font-black text-emerald-900 mt-0.5">
                      {formatCurrency(offer.estimated_net_earning)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-xs text-slate-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Guaranteed escrow settlement on delivery
                  </span>

                  {isFarmer && offer.status !== "accepted" && (
                    <button
                      onClick={() => handleAcceptOffer(offer)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl text-xs transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Accept Offer</span>
                    </button>
                  )}
                  {offer.status === "accepted" && (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Accepted
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
