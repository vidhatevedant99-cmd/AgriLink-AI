import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { MarketProvider } from "./context/MarketContext";
import { MainLayout } from "./layouts/MainLayout";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { FarmerDashboard } from "./pages/FarmerDashboard";
import { BuyerDashboard } from "./pages/BuyerDashboard";
import { MarketPricesPage } from "./pages/MarketPricesPage";
import { CreateLotPage } from "./pages/CreateLotPage";
import { FindBuyersPage } from "./pages/FindBuyersPage";
import { CreateDemandPage } from "./pages/CreateDemandPage";
import { OffersPage } from "./pages/OffersPage";
import { OrdersPage } from "./pages/OrdersPage";
import { ProduceLot } from "./types";

const AppContent: React.FC = () => {
  const { user, isFarmer } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>("landing");
  const [selectedLotForBuyers, setSelectedLotForBuyers] = useState<ProduceLot | null>(null);

  const handleSelectLotForBuyers = (lot: ProduceLot) => {
    setSelectedLotForBuyers(lot);
    setCurrentTab("find-buyers");
  };

  const handleOrderCreated = (orderId: string) => {
    setCurrentTab("orders");
  };

  return (
    <MainLayout currentTab={currentTab} onSelectTab={setCurrentTab}>
      {currentTab === "landing" && (
        <LandingPage onNavigate={setCurrentTab} />
      )}

      {currentTab === "login" && (
        <LoginPage onSuccess={() => setCurrentTab("dashboard")} />
      )}

      {currentTab === "dashboard" && (
        isFarmer ? (
          <FarmerDashboard
            onNavigate={setCurrentTab}
            onSelectLotForBuyers={handleSelectLotForBuyers}
          />
        ) : (
          <BuyerDashboard
            onNavigate={setCurrentTab}
            onMakeOfferForLot={(lot) => {
              setSelectedLotForBuyers(lot);
              setCurrentTab("create-demand");
            }}
          />
        )
      )}

      {currentTab === "market-prices" && (
        <MarketPricesPage />
      )}

      {/* Farmer Specific Pages */}
      {currentTab === "my-lots" && (
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900">My Produce Lots</h2>
            <button
              onClick={() => setCurrentTab("create-lot")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs"
            >
              + Create New Lot
            </button>
          </div>
          <FarmerDashboard
            onNavigate={setCurrentTab}
            onSelectLotForBuyers={handleSelectLotForBuyers}
          />
        </div>
      )}

      {currentTab === "create-lot" && (
        <CreateLotPage
          onSuccess={(newLot) => {
            setSelectedLotForBuyers(newLot);
            setCurrentTab("find-buyers");
          }}
          onCancel={() => setCurrentTab("dashboard")}
        />
      )}

      {currentTab === "find-buyers" && (
        <FindBuyersPage
          selectedLot={selectedLotForBuyers}
          onBack={() => setCurrentTab("dashboard")}
          onOrderCreated={handleOrderCreated}
        />
      )}

      {/* Buyer Specific Pages */}
      {currentTab === "find-produce" && (
        <BuyerDashboard
          onNavigate={setCurrentTab}
          onMakeOfferForLot={(lot) => {
            setSelectedLotForBuyers(lot);
            setCurrentTab("create-demand");
          }}
        />
      )}

      {currentTab === "my-demands" && (
        <BuyerDashboard
          onNavigate={setCurrentTab}
          onMakeOfferForLot={(lot) => {
            setSelectedLotForBuyers(lot);
            setCurrentTab("create-demand");
          }}
        />
      )}

      {currentTab === "create-demand" && (
        <CreateDemandPage
          onSuccess={() => {}}
          onCancel={() => setCurrentTab("dashboard")}
          onOfferMade={() => setCurrentTab("offers")}
        />
      )}

      {/* Common Pages */}
      {currentTab === "offers" && (
        <OffersPage onOrderCreated={handleOrderCreated} />
      )}

      {currentTab === "orders" && (
        <OrdersPage />
      )}
    </MainLayout>
  );
};

export function App() {
  return (
    <AuthProvider>
      <MarketProvider>
        <AppContent />
      </MarketProvider>
    </AuthProvider>
  );
}

export default App;
