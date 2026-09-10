import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useMarket } from "../context/MarketContext";
import { marketplaceApi } from "../services/marketplaceApi";
import { ProduceLot } from "../types";
import { Package, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

interface CreateLotPageProps {
  onSuccess: (newLot: ProduceLot) => void;
  onCancel: () => void;
}

export const CreateLotPage: React.FC<CreateLotPageProps> = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  const { selectedMarket } = useMarket();

  const [commodity, setCommodity] = useState("Onion");
  const [variety, setVariety] = useState("Garva / Red Onion");
  const [quality, setQuality] = useState("Grade A");
  const [quantity, setQuantity] = useState<number>(500);
  const [unit, setUnit] = useState("kg");
  const [expectedPrice, setExpectedPrice] = useState<number>(25);
  const [pickupLocation, setPickupLocation] = useState("Yeola, Nashik");
  const [availableDate, setAvailableDate] = useState("2026-09-05");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePreFillDemo = () => {
    setCommodity("Onion");
    setVariety("Garva / Red Onion");
    setQuality("Grade A");
    setQuantity(500);
    setUnit("kg");
    setExpectedPrice(25);
    setPickupLocation("Yeola, Nashik");
    setAvailableDate("2026-09-05");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const created = await marketplaceApi.createLot({
        farmer_id: user.id,
        farmer_name: user.name,
        farmer_phone: user.phone,
        commodity,
        variety,
        quality,
        quantity,
        unit,
        expected_price: expectedPrice,
        market: selectedMarket.Market,
        pickup_location: pickupLocation,
        latitude: selectedMarket.latitude || 20.0422,
        longitude: selectedMarket.longitude || 74.4878,
        available_date: availableDate
      });
      onSuccess(created);
    } catch (err) {
      console.error("Error creating produce lot:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-lg">
        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">List Produce Lot</h2>
              <p className="text-xs text-slate-500">
                Post your harvest directly to verified regional bulk buyers
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePreFillDemo}
            className="flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer"
            title="Auto-fills: 500 kg Grade A Onion at ₹25/kg in Yeola"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Pre-fill SIH Demo Lot</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          {/* Commodity & Variety */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Commodity</label>
              <select
                value={commodity}
                onChange={(e) => setCommodity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              >
                <option value="Onion">Onion (कांदा)</option>
                <option value="Tomato">Tomato (टोमॅटो)</option>
                <option value="Potato">Potato (बटाटा)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Variety</label>
              <input
                type="text"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                placeholder="e.g. Garva / Red Onion"
                required
              />
            </div>
          </div>

          {/* Quality & Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Quality Grade</label>
              <select
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              >
                <option value="Grade A">Grade A (Premium / Export)</option>
                <option value="Grade B">Grade B (Standard Market)</option>
                <option value="FAQ">FAQ (Fair Average Quality)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Quantity</label>
              <input
                type="number"
                min="10"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              >
                <option value="kg">kg (Kilograms)</option>
                <option value="quintal">Quintal (100 kg)</option>
              </select>
            </div>
          </div>

          {/* Expected Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Expected Price (₹ per kg)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  step="0.5"
                  value={expectedPrice}
                  onChange={(e) => setExpectedPrice(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-emerald-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  required
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Equates to ₹{(expectedPrice * 100).toLocaleString("en-IN")}/quintal
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Available Date</label>
              <input
                type="date"
                value={availableDate}
                onChange={(e) => setAvailableDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                required
              />
            </div>
          </div>

          {/* Location & Mandi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Pickup Village / Town</label>
              <input
                type="text"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nearby APMC Reference</label>
              <input
                type="text"
                disabled
                value={selectedMarket.Market}
                className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600"
              />
            </div>
          </div>

          {/* Form Actions */}
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
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors shadow-md shadow-emerald-700/20 cursor-pointer"
            >
              <span>{isSubmitting ? "Creating Lot..." : "Create Lot & Find Buyers"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
