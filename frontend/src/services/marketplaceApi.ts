import { ProduceLot, BuyerDemand, Match, Offer, Order } from "../types";
import { apiFetch, getIsDemoMode } from "./api";
import { MOCK_PRODUCE_LOTS, MOCK_BUYER_DEMANDS, MOCK_MATCHES_LOT_1, MOCK_OFFERS, MOCK_ORDERS } from "../data/mockData";

// In-memory frontend state for demo mode
let localLots = [...MOCK_PRODUCE_LOTS];
let localDemands = [...MOCK_BUYER_DEMANDS];
let localOffers = [...MOCK_OFFERS];
let localOrders = [...MOCK_ORDERS];

export const marketplaceApi = {
  // Produce Lots
  async getLots(commodity?: string): Promise<ProduceLot[]> {
    if (!getIsDemoMode()) {
      try {
        const query = commodity ? `?commodity=${encodeURIComponent(commodity)}` : "";
        return await apiFetch<ProduceLot[]>(`/api/lots${query}`);
      } catch (e) {}
    }
    if (commodity) {
      return localLots.filter((l) => l.commodity.toLowerCase() === commodity.toLowerCase());
    }
    return localLots;
  },

  async getLot(lotId: string): Promise<ProduceLot | null> {
    if (!getIsDemoMode()) {
      try {
        return await apiFetch<ProduceLot>(`/api/lots/${lotId}`);
      } catch (e) {}
    }
    return localLots.find((l) => l.id === lotId) || localLots[0] || null;
  },

  async createLot(lot: Partial<ProduceLot>): Promise<ProduceLot> {
    const newLot: ProduceLot = {
      id: `lot-${Date.now()}`,
      farmer_id: lot.farmer_id || "farmer-1",
      farmer_name: lot.farmer_name || "Rajesh Patil",
      farmer_phone: lot.farmer_phone || "+91 98220 12345",
      commodity: lot.commodity || "Onion",
      variety: lot.variety || "Garva / Red Onion",
      quality: lot.quality || "Grade A",
      quantity: Number(lot.quantity) || 500,
      unit: lot.unit || "kg",
      expected_price: Number(lot.expected_price) || 25,
      market: lot.market || "Yeola APMC",
      pickup_location: lot.pickup_location || "Yeola, Nashik",
      latitude: lot.latitude || 20.0422,
      longitude: lot.longitude || 74.4878,
      available_date: lot.available_date || new Date().toISOString().split("T")[0],
      status: "available",
      created_at: new Date().toISOString()
    };

    if (!getIsDemoMode()) {
      try {
        const res = await apiFetch<{ lot: ProduceLot; lot_id: string }>("/api/lots", {
          method: "POST",
          body: JSON.stringify(newLot)
        });
        if (res && res.lot) {
          localLots.unshift(res.lot);
          return res.lot;
        }
      } catch (e) {}
    }

    localLots.unshift(newLot);
    return newLot;
  },

  // Buyer Demands
  async getDemands(commodity?: string): Promise<BuyerDemand[]> {
    if (!getIsDemoMode()) {
      try {
        const query = commodity ? `?commodity=${encodeURIComponent(commodity)}` : "";
        return await apiFetch<BuyerDemand[]>(`/api/demands${query}`);
      } catch (e) {}
    }
    if (commodity) {
      return localDemands.filter((d) => d.commodity.toLowerCase() === commodity.toLowerCase());
    }
    return localDemands;
  },

  async createDemand(demand: Partial<BuyerDemand>): Promise<BuyerDemand> {
    const newDemand: BuyerDemand = {
      id: `demand-${Date.now()}`,
      buyer_id: demand.buyer_id || "buyer-1",
      buyer_name: demand.buyer_name || "Pune Wholesale Agri-Trade",
      buyer_type: demand.buyer_type || "Wholesale Distributor",
      commodity: demand.commodity || "Onion",
      quality_required: demand.quality_required || "Grade A",
      quantity_required: Number(demand.quantity_required) || 2000,
      unit: demand.unit || "kg",
      max_price: Number(demand.max_price) || 27,
      delivery_location: demand.delivery_location || "Marketyard, Pune",
      latitude: demand.latitude || 18.5204,
      longitude: demand.longitude || 73.8567,
      required_date: demand.required_date || new Date().toISOString().split("T")[0],
      status: "open",
      created_at: new Date().toISOString()
    };

    if (!getIsDemoMode()) {
      try {
        const res = await apiFetch<{ demand: BuyerDemand; demand_id: string }>("/api/demands", {
          method: "POST",
          body: JSON.stringify(newDemand)
        });
        if (res && res.demand) {
          localDemands.unshift(res.demand);
          return res.demand;
        }
      } catch (e) {}
    }

    localDemands.unshift(newDemand);
    return newDemand;
  },

  // Smart Matching for Farmer Lot
  async getMatchesForLot(lotId: string): Promise<Match[]> {
    if (!getIsDemoMode()) {
      try {
        const matches = await apiFetch<Match[]>(`/api/matches/${lotId}`);
        if (matches && matches.length > 0) return matches;
      } catch (e) {}
    }
    return MOCK_MATCHES_LOT_1;
  },

  // Offers
  async getOffers(): Promise<Offer[]> {
    if (!getIsDemoMode()) {
      try {
        return await apiFetch<Offer[]>("/api/offers");
      } catch (e) {}
    }
    return localOffers;
  },

  async createOffer(offer: Partial<Offer>): Promise<Offer> {
    const newOffer: Offer = {
      id: `offer-${Date.now()}`,
      match_id: offer.match_id || "match-lot-1-demand-1",
      lot_id: offer.lot_id || "lot-1",
      buyer_id: offer.buyer_id || "buyer-1",
      buyer_name: offer.buyer_name || "Pune Wholesale",
      farmer_id: offer.farmer_id || "farmer-1",
      farmer_name: offer.farmer_name || "Rajesh Patil",
      commodity: offer.commodity || "Onion",
      offered_price: Number(offer.offered_price) || 26,
      quantity: Number(offer.quantity) || 500,
      unit: offer.unit || "kg",
      distance_km: offer.distance_km || 185,
      logistics_cost: offer.logistics_cost || 1800,
      estimated_net_earning: offer.estimated_net_earning || 11200,
      mandi_reference_price: offer.mandi_reference_price || 22,
      mandi_net_realization: offer.mandi_net_realization || 11000,
      status: "pending",
      created_at: new Date().toISOString()
    };

    if (!getIsDemoMode()) {
      try {
        const res = await apiFetch<{ offer: Offer; offer_id: string }>("/api/offers", {
          method: "POST",
          body: JSON.stringify(newOffer)
        });
        if (res && res.offer) {
          localOffers.unshift(res.offer);
          return res.offer;
        }
      } catch (e) {}
    }

    localOffers.unshift(newOffer);
    return newOffer;
  },

  async updateOffer(offerId: string, status: "accepted" | "rejected" | "countered"): Promise<Offer> {
    if (!getIsDemoMode()) {
      try {
        const res = await apiFetch<{ offer: Offer }>(`/api/offers/${offerId}`, {
          method: "PUT",
          body: JSON.stringify({ status })
        });
        if (res && res.offer) {
          const idx = localOffers.findIndex((o) => o.id === offerId);
          if (idx !== -1) localOffers[idx] = res.offer;
          return res.offer;
        }
      } catch (e) {}
    }

    const offer = localOffers.find((o) => o.id === offerId);
    if (offer) {
      offer.status = status;
      return offer;
    }
    throw new Error("Offer not found");
  },

  // Orders
  async getOrders(): Promise<Order[]> {
    if (!getIsDemoMode()) {
      try {
        return await apiFetch<Order[]>("/api/orders");
      } catch (e) {}
    }
    return localOrders;
  },

  async getOrder(orderId: string): Promise<Order | null> {
    if (!getIsDemoMode()) {
      try {
        return await apiFetch<Order>(`/api/orders/${orderId}`);
      } catch (e) {}
    }
    return localOrders.find((o) => o.id === orderId) || localOrders[0] || null;
  },

  async createOrder(order: Partial<Order>): Promise<Order> {
    const newOrder: Order = {
      id: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      offer_id: order.offer_id || "offer-1",
      lot_id: order.lot_id || "lot-1",
      buyer_id: order.buyer_id || "buyer-1",
      buyer_name: order.buyer_name || "Pune Wholesale",
      farmer_id: order.farmer_id || "farmer-1",
      farmer_name: order.farmer_name || "Rajesh Patil",
      commodity: order.commodity || "Onion",
      quantity: Number(order.quantity) || 500,
      unit: order.unit || "kg",
      agreed_price: Number(order.agreed_price) || 26,
      gross_amount: Number(order.gross_amount) || 13000,
      logistics_cost: Number(order.logistics_cost) || 1800,
      net_earning: Number(order.net_earning) || 11200,
      pickup_location: order.pickup_location || "Yeola, Nashik",
      delivery_location: order.delivery_location || "Marketyard, Pune",
      status: "confirmed",
      created_at: new Date().toISOString(),
      estimated_delivery: "Within 48 Hours"
    };

    if (!getIsDemoMode()) {
      try {
        const res = await apiFetch<{ order: Order; order_id: string }>("/api/orders", {
          method: "POST",
          body: JSON.stringify(newOrder)
        });
        if (res && res.order) {
          localOrders.unshift(res.order);
          return res.order;
        }
      } catch (e) {}
    }

    localOrders.unshift(newOrder);
    return newOrder;
  }
};
