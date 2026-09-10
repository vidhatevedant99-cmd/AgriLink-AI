import React, { useEffect, useState } from "react";
import { LogisticsInfo } from "../../types";
import { logisticsApi } from "../../services/logisticsApi";
import { formatCurrency } from "../../utils/formatters";
import { X, Truck, MapPin, Clock, Fuel, ShieldAlert, CheckCircle2, Navigation, Compass } from "lucide-react";

interface LogisticsModalProps {
  matchId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const LogisticsModal: React.FC<LogisticsModalProps> = ({ matchId, isOpen, onClose }) => {
  const [logistics, setLogistics] = useState<LogisticsInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    async function loadLogistics() {
      setLoading(true);
      try {
        const data = await logisticsApi.getLogisticsForMatch(matchId);
        setLogistics(data);
      } catch (e) {
        console.error("Error loading logistics:", e);
      } finally {
        setLoading(false);
      }
    }
    loadLogistics();
  }, [matchId, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-emerald-800 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-700 text-white">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Optimized Logistics & Transit Route</h3>
              <p className="text-xs text-emerald-200">
                AI Route Optimization Concept • Smart India Hackathon 2026
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-emerald-700 text-emerald-100 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading || !logistics ? (
          <div className="p-12 text-center text-slate-500">Calculating optimal highway corridor...</div>
        ) : (
          <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Origin -> Destination Summary Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center mt-1">
                    <div className="w-3 h-3 rounded-full bg-emerald-600" />
                    <div className="w-0.5 h-10 bg-slate-300 my-1" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Pickup Location</span>
                      <div className="text-sm font-bold text-slate-900">{logistics.origin}</div>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Destination Bay</span>
                      <div className="text-sm font-bold text-slate-900">{logistics.destination}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 text-right sm:min-w-[160px]">
                  <span className="text-[11px] font-semibold text-slate-500">Total Logistics Cost</span>
                  <div className="text-2xl font-black text-emerald-700">
                    {formatCurrency(logistics.total_estimated_logistics_cost)}
                  </div>
                  <span className="text-[10px] text-slate-400">Includes freight, tolls & driver</span>
                </div>
              </div>

              {/* Transit Specs */}
              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-200 text-center">
                <div>
                  <span className="text-slate-400 text-[11px]">Distance</span>
                  <div className="font-extrabold text-slate-800 text-base">{logistics.distance_km} km</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px]">Est. Travel Time</span>
                  <div className="font-extrabold text-slate-800 text-base">{logistics.estimated_duration}</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px]">Fuel Consumption</span>
                  <div className="font-extrabold text-slate-800 text-base">~{logistics.fuel_estimate_litres} L</div>
                </div>
              </div>
            </div>

            {/* Vehicle Recommendation */}
            <div className="flex items-center justify-between bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-900">
              <div className="flex items-center gap-2.5">
                <Truck className="w-5 h-5 text-emerald-700" />
                <div>
                  <span className="font-bold">Recommended Vehicle: </span>
                  <span>{logistics.recommended_vehicle}</span>
                </div>
              </div>
              <span className="bg-emerald-200/80 text-emerald-900 font-bold px-2 py-0.5 rounded text-[10px]">
                OPTIMIZED LOAD
              </span>
            </div>

            {/* Route Waypoint Steps */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Highway Corridors & Waypoints
              </h4>
              <div className="space-y-3">
                {logistics.route_waypoints.map((step) => (
                  <div key={step.step} className="flex items-start gap-3 text-xs">
                    <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-[11px] shrink-0">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">{step.location}</span>
                        <span className="text-slate-400 font-medium">{step.km_mark} km</span>
                      </div>
                      <p className="text-slate-500 mt-0.5">{step.instruction}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Route Optimization Concept Card */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900">
              <div className="flex items-start gap-2">
                <Compass className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Route Optimization Factor:</strong>
                  <span>{logistics.route_optimization_factor}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
