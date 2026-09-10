import React from "react";
import { Match } from "../../types";
import { formatCurrency, formatWeight } from "../../utils/formatters";
import { Sparkles, MapPin, Truck, CheckCircle, ArrowRight, ShieldCheck } from "lucide-react";

interface SmartMatchCardProps {
  match: Match;
  onAcceptOffer: (match: Match) => void;
  onViewLogistics: (match: Match) => void;
  isAccepted?: boolean;
}

export const SmartMatchCard: React.FC<SmartMatchCardProps> = ({
  match,
  onAcceptOffer,
  onViewLogistics,
  isAccepted = false
}) => {
  return (
    <div className={`bg-white border rounded-2xl p-5 transition-all shadow-xs hover:shadow-md ${
      match.match_score >= 90
        ? "border-emerald-500 ring-2 ring-emerald-500/20"
        : "border-slate-200"
    }`}>
      {/* Card Header with Smart Match Score */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-lg font-bold text-slate-900">{match.buyer_name}</h4>
            {match.match_score >= 90 && (
              <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                {match.badge}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {match.buyer_type} • Delivery to {match.delivery_location}
          </p>
        </div>

        {/* Match Score Badge */}
        <div className="text-right">
          <div className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1 rounded-xl">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-sm font-black">{match.match_score}%</span>
            <span className="text-[10px] font-semibold text-emerald-700 uppercase">Smart Match</span>
          </div>
        </div>
      </div>

      {/* Contract & Logistics Details Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 text-xs">
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <span className="text-slate-500 font-medium">Offered Price</span>
          <div className="text-base font-extrabold text-slate-900 mt-0.5">
            ₹{match.offered_price}/kg
          </div>
          <span className="text-[10px] text-slate-400">Demand: {formatWeight(match.required_quantity, match.unit)}</span>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <span className="text-slate-500 font-medium">Distance & Time</span>
          <div className="text-base font-bold text-slate-900 mt-0.5">
            {match.distance_km} km
          </div>
          <span className="text-[10px] text-slate-500">Est. {match.estimated_travel_time}</span>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <span className="text-slate-500 font-medium">Logistics Cost</span>
          <div className="text-base font-bold text-slate-900 mt-0.5">
            {formatCurrency(match.logistics_cost)}
          </div>
          <span className="text-[10px] text-slate-500">Pickup to Delivery</span>
        </div>

        <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
          <span className="text-emerald-800 font-bold uppercase text-[10px]">Farmer Net Earning</span>
          <div className="text-lg font-black text-emerald-900 mt-0.5">
            {formatCurrency(match.farmer_net_earning)}
          </div>
          <span className="text-[10px] font-semibold text-emerald-700">
            Gross: {formatCurrency(match.gross_earning)}
          </span>
        </div>
      </div>

      {/* Mandi vs Direct Comparison Snippet */}
      <div className="bg-slate-50/80 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between text-xs gap-2 border border-slate-100">
        <div className="flex items-center gap-2 text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>
            Mandi Realization: <strong className="text-slate-800">{formatCurrency(match.mandi_net_realization)}</strong>
            {" vs "}
            AgriLink Net: <strong className="text-emerald-700">{formatCurrency(match.farmer_net_earning)}</strong>
          </span>
        </div>
        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
          +₹{match.benefit_gain} Net Gain
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-end gap-3 mt-4 pt-3 border-t border-slate-100">
        <button
          onClick={() => onViewLogistics(match)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition-colors cursor-pointer"
        >
          <Truck className="w-3.5 h-3.5 text-emerald-600" />
          Route & Logistics
        </button>

        {isAccepted ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl">
            <CheckCircle className="w-4 h-4" /> Offer Accepted & Order Created
          </span>
        ) : (
          <button
            onClick={() => onAcceptOffer(match)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow cursor-pointer"
          >
            <span>Accept Offer & Create Order</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
