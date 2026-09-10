import React, { useState, useEffect } from "react";
import { marketplaceApi } from "../services/marketplaceApi";
import { Order } from "../types";
import { formatCurrency, formatWeight, formatDate } from "../utils/formatters";
import { LogisticsModal } from "../components/logistics/LogisticsModal";
import { ShoppingBag, Truck, MapPin, CheckCircle, Clock, ShieldCheck, ArrowUpRight } from "lucide-react";

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLogisticsMatchId, setActiveLogisticsMatchId] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      try {
        const list = await marketplaceApi.getOrders();
        setOrders(list);
      } catch (err) {
        console.error("Error loading orders:", err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Direct Purchase Orders</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Confirmed agricultural supply chain shipments and escrow delivery milestones
          </p>
        </div>
      </div>

      {loading ? (
        <div className="bg-white p-12 text-center text-slate-400 rounded-2xl border border-slate-200">
          Loading orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white p-12 text-center text-slate-500 rounded-2xl border border-slate-200">
          No orders created yet. Accept a buyer match offer to generate your first order.
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs hover:border-emerald-300 transition-all space-y-4"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-sm font-extrabold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {order.id}
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {order.status === "confirmed" ? "Confirmed (Escrow Funded)" : "In Transit"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Booked on: {formatDate(order.created_at)} • Est. Delivery: <strong className="text-slate-800">{order.estimated_delivery}</strong>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400 font-semibold uppercase">Farmer Net Realization</span>
                  <div className="text-2xl font-black text-emerald-800">
                    {formatCurrency(order.net_earning)}
                  </div>
                  <span className="text-[10px] text-slate-500">Gross: {formatCurrency(order.gross_amount)}</span>
                </div>
              </div>

              {/* Stakeholders & Commodity Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-slate-400 font-semibold uppercase text-[10px]">Farmer / Producer</span>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{order.farmer_name}</div>
                  <div className="text-slate-500 text-[11px] mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-600" />
                    <span>Pickup: {order.pickup_location}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-slate-400 font-semibold uppercase text-[10px]">Bulk Buyer / Consignee</span>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{order.buyer_name}</div>
                  <div className="text-slate-500 text-[11px] mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-blue-600" />
                    <span>Delivery: {order.delivery_location}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-slate-400 font-semibold uppercase text-[10px]">Produce & Contract Rate</span>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">
                    {formatWeight(order.quantity, order.unit)} • {order.commodity}
                  </div>
                  <div className="text-emerald-700 font-bold text-[11px] mt-1">
                    Agreed Rate: ₹{order.agreed_price}/kg
                  </div>
                </div>
              </div>

              {/* Order Footer & Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-slate-100 gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Shared logistics cost deducted: <strong>{formatCurrency(order.logistics_cost)}</strong></span>
                </div>

                <button
                  onClick={() => setActiveLogisticsMatchId(order.offer_id || "match-lot-1-demand-1")}
                  className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  <Truck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>View Route & Waypoint Information</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Logistics Details Modal */}
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
