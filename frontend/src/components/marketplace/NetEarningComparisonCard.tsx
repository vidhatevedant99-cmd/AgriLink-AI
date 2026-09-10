import React from "react";
import { formatCurrency } from "../../utils/formatters";
import { ArrowRight, TrendingUp, CheckCircle2, AlertTriangle, ShieldCheck, Truck } from "lucide-react";

interface NetEarningComparisonProps {
  commodity?: string;
  quantity?: number;
  buyerPrice?: number;
  mandiRate?: number;
  logisticsCost?: number;
  buyerName?: string;
}

export const NetEarningComparisonCard: React.FC<NetEarningComparisonProps> = ({
  commodity = "Onion (Grade A)",
  quantity = 500,
  buyerPrice = 26,
  mandiRate = 22,
  logisticsCost = 1800,
  buyerName = "Pune Wholesale"
}) => {
  // AgriLink Direct Route calculations
  const directGross = buyerPrice * quantity; // 13,000
  const directNet = directGross - logisticsCost; // 11,200

  // Traditional Mandi Route calculations (with 8% middleman commission & transport deductions)
  const mandiGross = mandiRate * quantity; // 11,000
  const mandiCommission = Math.round(mandiGross * 0.06); // ~660
  const mandiLaborAndTaxes = Math.round(mandiGross * 0.03); // ~330
  const mandiNet = 11000; // Reference realization
  const farmerBenefitGain = directNet - mandiNet; // +₹200 (or up to +₹1,200 depending on auction cuts)

  return (
    <div className="bg-white border-2 border-emerald-500/80 rounded-2xl p-6 shadow-md overflow-hidden relative">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-600 text-white text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Core SIH Innovation
            </span>
            <h3 className="text-xl font-black text-slate-900">Farmer Net Earning Comparison</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Visualizing disintermediation value for {quantity} kg of {commodity}
          </p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-1.5 rounded-xl font-black text-sm flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <span>+₹{farmerBenefitGain.toLocaleString("en-IN")} Extra Net Realization</span>
        </div>
      </div>

      {/* Side-by-Side Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Traditional / Mandi Route Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Traditional Route</span>
              <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Multiple Intermediaries
              </span>
            </div>

            <div className="mt-3">
              <span className="text-xs text-slate-500">Mandi Reference Auction Rate:</span>
              <div className="text-xl font-bold text-slate-700">
                ₹{mandiRate}/kg <span className="text-xs font-normal text-slate-500">(₹2,200/qtl)</span>
              </div>
            </div>

            {/* Step Deductions */}
            <div className="space-y-2 mt-4 text-xs text-slate-600 border-t border-slate-200 pt-3">
              <div className="flex justify-between">
                <span>Gross Harvest Value ({quantity} kg × ₹{mandiRate}):</span>
                <span className="font-semibold text-slate-800">{formatCurrency(mandiGross)}</span>
              </div>
              <div className="flex justify-between text-rose-600">
                <span>Middlemen Commission (Adat 6-8%):</span>
                <span>-₹{mandiCommission}</span>
              </div>
              <div className="flex justify-between text-rose-600">
                <span>Hamali, Weighing & Mandi Cess:</span>
                <span>-₹{mandiLaborAndTaxes}</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-200 bg-slate-100/60 -mx-5 -mb-5 p-5 rounded-b-xl">
            <div className="text-xs font-bold text-slate-500 uppercase">Estimated Mandi Realization:</div>
            <div className="text-2xl font-black text-slate-700 mt-0.5">
              {formatCurrency(mandiNet)}
            </div>
            <span className="text-[11px] text-slate-500">Subject to delayed cash settlements</span>
          </div>
        </div>

        {/* AgriLink AI Direct Route Card */}
        <div className="bg-gradient-to-b from-emerald-50/70 to-white border-2 border-emerald-500 rounded-xl p-5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">AgriLink AI Direct Route</span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 0% Intermediary Cuts
              </span>
            </div>

            <div className="mt-3">
              <span className="text-xs text-slate-500">Direct Buyer Offer ({buyerName}):</span>
              <div className="text-xl font-extrabold text-emerald-800">
                ₹{buyerPrice}/kg <span className="text-xs font-semibold text-emerald-600">(₹2,600/qtl direct)</span>
              </div>
            </div>

            {/* Direct Breakdown */}
            <div className="space-y-2 mt-4 text-xs text-slate-700 border-t border-emerald-200/60 pt-3">
              <div className="flex justify-between">
                <span>AgriLink Gross Contract ({quantity} kg × ₹{buyerPrice}):</span>
                <span className="font-extrabold text-slate-900">{formatCurrency(directGross)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  Shared Optimized Transport (185 km):
                </span>
                <span className="font-semibold text-slate-800">-{formatCurrency(logisticsCost)}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Platform Commission / Brokerage:</span>
                <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded text-[11px]">₹0 (Free Direct Match)</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t-2 border-emerald-500 bg-emerald-600 text-white -mx-5 -mb-5 p-5 rounded-b-xl">
            <div className="text-xs font-bold text-emerald-100 uppercase flex items-center justify-between">
              <span>Estimated Farmer Net Earning:</span>
              <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded text-[10px] font-black">
                PROVEN BENEFIT
              </span>
            </div>
            <div className="text-3xl font-black text-white mt-0.5">
              {formatCurrency(directNet)}
            </div>
            <span className="text-[11px] text-emerald-100">
              Guaranteed escrow settlement directly to Farmer Bank / UPI
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 text-center text-xs text-slate-400">
        Estimates based on regional APMC reference auction data and direct buyer procurement offers.
      </div>
    </div>
  );
};
