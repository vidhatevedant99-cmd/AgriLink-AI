import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useMarket } from "../context/MarketContext";
import { Sprout, User, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";

interface LoginPageProps {
  onSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const { login } = useAuth();
  const { selectMarketByName } = useMarket();
  const [selectedRole, setSelectedRole] = useState<"farmer" | "buyer">("farmer");
  const [phone, setPhone] = useState("+91 98220 12345");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedRole);
    if (selectedRole === "farmer") {
      selectMarketByName("Yeola APMC");
    }
    onSuccess();
  };

  const handleQuickLogin = (role: "farmer" | "buyer") => {
    login(role);
    if (role === "farmer") {
      selectMarketByName("Yeola APMC");
    }
    onSuccess();
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-emerald-700/20">
            <Sprout className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Sign in to AgriLink AI</h2>
          <p className="text-xs text-slate-500 mt-1">
            Access transparent farm-to-buyer agricultural marketplace
          </p>
        </div>

        {/* Role Toggle Tabs */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => { setSelectedRole("farmer"); setPhone("+91 98220 12345"); }}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedRole === "farmer"
                ? "bg-white text-emerald-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Farmer / FPO</span>
          </button>

          <button
            type="button"
            onClick={() => { setSelectedRole("buyer"); setPhone("+91 98230 45678"); }}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedRole === "buyer"
                ? "bg-white text-blue-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Bulk Buyer</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Registered Mobile Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              placeholder="+91 98XXX XXXXX"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition-colors shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Continue to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Logins */}
        <div className="mt-8 pt-6 border-t border-slate-100 space-y-2.5">
          <span className="block text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Quick 1-Click Demo Profiles
          </span>

          <button
            type="button"
            onClick={() => handleQuickLogin("farmer")}
            className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold py-2.5 px-3 rounded-xl border border-emerald-200 transition-colors flex items-center justify-between cursor-pointer"
          >
            <div className="text-left">
              <div>Rajesh Patil (Farmer)</div>
              <div className="text-[10px] text-emerald-600 font-normal">Yeola, Nashik • Onion Lot Producer</div>
            </div>
            <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-bold">Use</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin("buyer")}
            className="w-full bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold py-2.5 px-3 rounded-xl border border-blue-200 transition-colors flex items-center justify-between cursor-pointer"
          >
            <div className="text-left">
              <div>Pune Wholesale (Buyer)</div>
              <div className="text-[10px] text-blue-600 font-normal">Marketyard, Pune • Procurement Demand</div>
            </div>
            <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded font-bold">Use</span>
          </button>
        </div>
      </div>
    </div>
  );
};
