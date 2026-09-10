import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useMarket } from "../../context/MarketContext";
import { Sprout, MapPin, UserCheck, ArrowLeftRight, LogOut, Menu, X, ShoppingBag } from "lucide-react";

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab }) => {
  const { user, isFarmer, login, logout } = useAuth();
  const { selectedMarket } = useMarket();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const farmerNavItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "market-prices", label: "Market Prices" },
    { id: "my-lots", label: "My Lots" },
    { id: "find-buyers", label: "Find Buyers" },
    { id: "orders", label: "Orders" }
  ];

  const buyerNavItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "find-produce", label: "Find Produce" },
    { id: "my-demands", label: "My Demands" },
    { id: "offers", label: "Offers" },
    { id: "orders", label: "Orders" }
  ];

  const navItems = isFarmer ? farmerNavItems : buyerNavItems;

  const handleRoleToggle = () => {
    if (isFarmer) {
      login("buyer");
    } else {
      login("farmer");
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectTab("dashboard")}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900">AgriLink</span>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-1.5 py-0.5 rounded">AI</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Direct Agricultural Marketplace</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    active
                      ? "bg-emerald-50 text-emerald-700 font-bold border-b-2 border-emerald-600"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Active Market Pill */}
            <button
              onClick={() => onSelectTab("market-prices")}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border border-slate-200 cursor-pointer"
              title="Click to view full market price trend"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-semibold text-slate-900">{selectedMarket.Market}</span>
              <span className="text-slate-500 font-normal">({selectedMarket.District})</span>
            </button>

            {/* Current User & Role Switcher */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="text-right">
                <div className="text-xs font-bold text-slate-900 flex items-center justify-end gap-1">
                  <span>{user.name}</span>
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded inline-block">
                  {user.role === "farmer" ? "Farmer / FPO" : "Bulk Buyer"}
                </div>
              </div>

              <button
                onClick={handleRoleToggle}
                className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                title={`Switch to ${isFarmer ? "Buyer" : "Farmer"} mode`}
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSelectTab("login")}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="Switch User / Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                {user.name.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{user.name}</p>
                <p className="text-[10px] text-emerald-600 font-semibold uppercase">{user.role}</p>
              </div>
            </div>
            <button
              onClick={handleRoleToggle}
              className="text-xs bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-slate-700 font-medium"
            >
              Switch Role
            </button>
          </div>

          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-semibold ${
                  currentTab === item.id
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                onSelectTab("login");
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-xs text-rose-600 font-medium flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out / Change Account
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
