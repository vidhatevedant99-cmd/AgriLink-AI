import React from "react";
import { ProduceLot } from "../../types";
import { formatCurrency, formatWeight, formatDate } from "../../utils/formatters";
import { Package, MapPin, Calendar, Tag, ArrowRight } from "lucide-react";

interface ProduceLotCardProps {
  lot: ProduceLot;
  onFindBuyers?: (lot: ProduceLot) => void;
  showFindBuyersAction?: boolean;
}

export const ProduceLotCard: React.FC<ProduceLotCardProps> = ({
  lot,
  onFindBuyers,
  showFindBuyersAction = true
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-emerald-300 transition-all">
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-base">{lot.commodity}</h4>
            <p className="text-xs text-slate-500">{lot.variety} • {lot.quality}</p>
          </div>
        </div>

        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          {lot.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 py-3.5 text-xs">
        <div>
          <span className="text-slate-400 font-medium">Quantity</span>
          <div className="text-base font-extrabold text-slate-800 mt-0.5">
            {formatWeight(lot.quantity, lot.unit)}
          </div>
        </div>

        <div>
          <span className="text-slate-400 font-medium">Expected Price</span>
          <div className="text-base font-extrabold text-emerald-700 mt-0.5">
            ₹{lot.expected_price}/kg
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-slate-600 col-span-2">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <span>{lot.pickup_location} ({lot.market})</span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-500 col-span-2">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Available From: {formatDate(lot.available_date)}</span>
        </div>
      </div>

      {showFindBuyersAction && onFindBuyers && (
        <div className="pt-3 border-t border-slate-100">
          <button
            onClick={() => onFindBuyers(lot)}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
          >
            <span>Find Best Buyers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
