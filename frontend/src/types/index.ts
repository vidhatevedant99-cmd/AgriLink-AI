export interface Market {
  "SR.NO"?: number;
  Market: string;
  District: string;
  "State/UT"?: string;
  State?: string;
  Lattitude?: string | number;
  Longitude?: string | number;
  latitude: number;
  longitude: number;
}

export interface MarketPrice {
  State?: string;
  District?: string;
  Market: string;
  Commodity: string;
  Variety?: string;
  Grade?: string;
  "Min Price": number;
  "Max Price": number;
  "Modal Price": number;
  "Price Unit": string;
  "Arrival Quantity": number;
  "Arrival Unit": string;
  "Arrival Date": string;
}

export interface DailyPriceForecast {
  day: string;
  date: string;
  price: number;
}

export interface DemandForecast {
  commodity: string;
  unit: string;
  today: number;
  tomorrow: number;
  plus_2_days: number;
  plus_3_days: number;
  label: string;
  disclaimer: string;
}

export interface MarketForecast {
  market: string;
  commodity: string;
  current_modal_price: number;
  forecast_modal_price: number;
  unit: string;
  trend: "Increasing" | "Decreasing" | "Stable";
  trend_percentage: string;
  confidence: number;
  explanation: string;
  forecast_horizon_days: number;
  daily_forecast: DailyPriceForecast[];
  demand_forecast: DemandForecast;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  role: "farmer" | "buyer";
  location: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  verification_status: "verified" | "pending";
}

export interface ProduceLot {
  id: string;
  farmer_id: string;
  farmer_name: string;
  farmer_phone?: string;
  commodity: string;
  variety: string;
  quality: string;
  quantity: number;
  unit: string;
  expected_price: number;
  market: string;
  pickup_location: string;
  latitude: number;
  longitude: number;
  available_date: string;
  status: "available" | "matched" | "sold";
  created_at: string;
}

export interface BuyerDemand {
  id: string;
  buyer_id: string;
  buyer_name: string;
  buyer_type: string;
  commodity: string;
  quality_required: string;
  quantity_required: number;
  unit: string;
  max_price: number;
  delivery_location: string;
  latitude: number;
  longitude: number;
  required_date: string;
  status: "open" | "fulfilled" | "closed";
  created_at: string;
}

export interface Match {
  id: string;
  lot_id: string;
  demand_id: string;
  buyer_id: string;
  buyer_name: string;
  buyer_type: string;
  delivery_location: string;
  required_quantity: number;
  offered_price: number;
  unit: string;
  distance_km: number;
  estimated_travel_time: string;
  logistics_cost: number;
  gross_earning: number;
  farmer_net_earning: number;
  mandi_reference_price: number;
  mandi_net_realization: number;
  benefit_gain: number;
  match_score: number;
  badge: "Best Match" | "High Match" | "Good Match";
  status: "ready" | "offered" | "accepted";
}

export interface Offer {
  id: string;
  match_id?: string;
  lot_id: string;
  buyer_id: string;
  buyer_name: string;
  farmer_id: string;
  farmer_name: string;
  commodity: string;
  offered_price: number;
  quantity: number;
  unit: string;
  distance_km: number;
  logistics_cost: number;
  estimated_net_earning: number;
  mandi_reference_price: number;
  mandi_net_realization: number;
  status: "pending" | "accepted" | "rejected" | "countered";
  created_at: string;
}

export interface Order {
  id: string;
  offer_id: string;
  lot_id?: string;
  buyer_id: string;
  buyer_name: string;
  farmer_id: string;
  farmer_name: string;
  commodity: string;
  quantity: number;
  unit: string;
  agreed_price: number;
  gross_amount: number;
  logistics_cost: number;
  net_earning: number;
  pickup_location: string;
  delivery_location: string;
  status: "confirmed" | "in_transit" | "delivered" | "completed";
  created_at: string;
  estimated_delivery: string;
}

export interface RouteWaypoint {
  step: number;
  location: string;
  instruction: string;
  km_mark: number;
}

export interface LogisticsInfo {
  match_id: string;
  origin: string;
  destination: string;
  origin_coordinates: { latitude: number; longitude: number };
  destination_coordinates: { latitude: number; longitude: number };
  distance_km: number;
  estimated_duration: string;
  recommended_vehicle: string;
  fuel_estimate_litres: number;
  toll_charges: number;
  driver_allowance: number;
  freight_base: number;
  total_estimated_logistics_cost: number;
  route_waypoints: RouteWaypoint[];
  route_optimization_factor: string;
}
