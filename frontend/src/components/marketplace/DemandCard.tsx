import React from "react";
import { BuyerDemand } from "../../types";
import { formatCurrency, formatWeight, formatDate } from "../../utils/formatters";
import { ShoppingBag, MapPin, Calendar, Tag, ArrowRight } from "lucide-react";

interface DemandCardProps {
  demand: BuyerDemand;
  onMakeOffer?: (demand: BuyerDemand) => void;
  showAction?: boolean;
}

export const DemandCard: React.FC<DemandCardProps> = ({
  demand,
  onMakeOffer,
  showAction = true
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-emerald-300 transition-all">
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-base">{demand.commodity}</h4>
            <p className="text-xs text-slate-500">{demand.buyer_name} • {demand.buyer_type}</p>
          </div>
        </div>

        <span className="bg-blue-100 text-blue-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          {demand.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 py-3.5 text-xs">
        <div>
          <span className="text-slate-400 font-medium">Required Volume</span>
          <div className="text-base font-extrabold text-slate-800 mt-0.5">
            {formatWeight(demand.quantity_required, demand.unit)}
          </div>
        </div>

        <div>
          <span className="text-slate-400 font-medium">Max Buying Price</span>
          <div className="text-base font-extrabold text-blue-700 mt-0.5">
            ₹{demand.max_price}/kg
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-slate-600 col-span-2">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <span>Delivery: {demand.delivery_location}</span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-500 col-span-2">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Needed by: {formatDate(demand.required_date)}</span>
        </div>
      </div>

      {showAction && onMakeOffer && (
        <div className="pt-3 border-t border-slate-100">
          <button
            onClick={() => onMakeOffer(demand)}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
          >
            <span>Supply to this Buyer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
