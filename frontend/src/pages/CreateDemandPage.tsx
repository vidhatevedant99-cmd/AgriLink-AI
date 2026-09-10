import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { marketplaceApi } from "../services/marketplaceApi";
import { BuyerDemand, ProduceLot } from "../types";
import { ShoppingBag, Sparkles, ArrowRight, Package, CheckCircle2 } from "lucide-react";
import { formatCurrency, formatWeight } from "../utils/formatters";

interface CreateDemandPageProps {
  onSuccess: (demand: BuyerDemand) => void;
  onCancel: () => void;
  onOfferMade: (offerId: string) => void;
}

export const CreateDemandPage: React.FC<CreateDemandPageProps> = ({ onSuccess, onCancel, onOfferMade }) => {
  const { user } = useAuth();

  const [commodity, setCommodity] = useState("Onion");
  const [qualityRequired, setQualityRequired] = useState("Grade A");
  const [quantityRequired, setQuantityRequired] = useState<number>(2000);
  const [unit, setUnit] = useState("kg");
  const [maxPrice, setMaxPrice] = useState<number>(27);
  const [deliveryLocation, setDeliveryLocation] = useState("Marketyard, Pune");
  const [requiredDate, setRequiredDate] = useState("2026-09-08");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submittedDemand, setSubmittedDemand] = useState<BuyerDemand | null>(null);
  const [matchingLots, setMatchingLots] = useState<ProduceLot[]>([]);
  const [offeredLotIds, setOfferedLotIds] = useState<string[]>([]);

  const handlePreFillDemo = () => {
    setCommodity("Onion");
    setQualityRequired("Grade A");
    setQuantityRequired(2000);
    setUnit("kg");
    setMaxPrice(27);
    setDeliveryLocation("Marketyard, Pune");
    setRequiredDate("2026-09-08");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const created = await marketplaceApi.createDemand({
        buyer_id: user.id,
        buyer_name: user.name,
        buyer_type: "Wholesale Distributor",
        commodity,
        quality_required: qualityRequired,
        quantity_required: quantityRequired,
        unit,
        max_price: maxPrice,
        delivery_location: deliveryLocation,
        latitude: 18.5204,
        longitude: 73.8567,
        required_date: requiredDate
      });
      setSubmittedDemand(created);

      // Load matching farmer lots
      const lots = await marketplaceApi.getLots(commodity);
      setMatchingLots(lots);
      onSuccess(created);
    } catch (err) {
      console.error("Error creating demand:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMakeOffer = async (lot: ProduceLot) => {
    try {
      const offer = await marketplaceApi.createOffer({
        lot_id: lot.id,
        buyer_id: user.id,
        buyer_name: user.name,
        farmer_id: lot.farmer_id,
        farmer_name: lot.farmer_name,
        commodity: lot.commodity,
        offered_price: 26,
        quantity: lot.quantity,
        unit: lot.unit,
        distance_km: 185,
        logistics_cost: 1800,
        estimated_net_earning: 11200,
        mandi_reference_price: 22,
        mandi_net_realization: 11000
      });
      setOfferedLotIds((prev) => [...prev, lot.id]);
      onOfferMade(offer.id);
    } catch (e) {
      console.error("Error making offer:", e);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      {/* Create Demand Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-lg">
        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-100 text-blue-700">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">Create Procurement Demand</h2>
              <p className="text-xs text-slate-500">
                Broadcast purchase orders to farmer FPOs and independent producers
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePreFillDemo}
            className="flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer"
            title="Auto-fills: 2,000 kg Grade A Onion at max ₹27/kg delivered to Pune"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Pre-fill Demo Demand</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Commodity</label>
              <select
                value={commodity}
                onChange={(e) => setCommodity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:bg-white"
              >
                <option value="Onion">Onion (कांदा)</option>
                <option value="Tomato">Tomato (टोमॅटो)</option>
                <option value="Potato">Potato (बटाटा)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Required Quality Grade</label>
              <select
                value={qualityRequired}
                onChange={(e) => setQualityRequired(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:bg-white"
              >
                <option value="Grade A">Grade A (Premium / Export)</option>
                <option value="Grade B">Grade B (Standard Market)</option>
                <option value="FAQ">FAQ (Fair Average Quality)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Procurement Quantity</label>
              <input
                type="number"
                min="50"
                value={quantityRequired}
                onChange={(e) => setQuantityRequired(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:bg-white"
              >
                <option value="kg">kg</option>
                <option value="quintal">Quintal</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Maximum Budget Price (₹ per kg)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  step="0.5"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-blue-800 focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Required Delivery Date</label>
              <input
                type="date"
                value={requiredDate}
                onChange={(e) => setRequiredDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Destination / Warehouse</label>
            <input
              type="text"
              value={deliveryLocation}
              onChange={(e) => setDeliveryLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors shadow-md shadow-blue-700/20 cursor-pointer"
            >
              <span>{isSubmitting ? "Broadcasting..." : "Broadcast Demand & Find Matching Lots"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Matching Farmer Lots (Shown After Submitting Demand) */}
      {submittedDemand && (
        <section className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-600" />
              <h3 className="text-xl font-bold text-slate-900">
                Matching Farmer Lots for Your Demand
              </h3>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">
              {matchingLots.length} Lots Available
            </span>
          </div>

          <div className="space-y-4">
            {matchingLots.map((lot) => {
              const isOffered = offeredLotIds.includes(lot.id);
              return (
                <div key={lot.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-slate-900 text-base">{lot.farmer_name}</h4>
                      <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded">
                        {lot.pickup_location}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {lot.commodity} • {lot.variety} • Quality: <strong className="text-slate-700">{lot.quality}</strong>
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs">
                      <div>Available: <strong className="text-slate-800">{formatWeight(lot.quantity, lot.unit)}</strong></div>
                      <div>Farmer Expected: <strong className="text-emerald-700">₹{lot.expected_price}/kg</strong></div>
                      <div>Distance: <strong className="text-slate-700">185 km</strong></div>
                    </div>
                  </div>

                  <div>
                    {isOffered ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-xl">
                        <CheckCircle2 className="w-4 h-4" /> Offer Sent (₹26/kg)
                      </span>
                    ) : (
                      <button
                        onClick={() => handleMakeOffer(lot)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Make Offer (₹26/kg)</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
