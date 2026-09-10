import { Market, MarketPrice, MarketForecast, User, ProduceLot, BuyerDemand, Match, Offer, Order, LogisticsInfo } from "../types";

export const MOCK_MARKETS: Market[] = [
  {
    "SR.NO": 1,
    Market: "Yeola APMC",
    District: "Nashik",
    State: "Maharashtra",
    "State/UT": "Maharashtra",
    Lattitude: "20.0422",
    Longitude: "74.4878",
    latitude: 20.0422,
    longitude: 74.4878
  },
  {
    "SR.NO": 2,
    Market: "Lasalgaon APMC",
    District: "Nashik",
    State: "Maharashtra",
    "State/UT": "Maharashtra",
    Lattitude: "20.1472",
    Longitude: "74.2269",
    latitude: 20.1472,
    longitude: 74.2269
  },
  {
    "SR.NO": 3,
    Market: "Pimpalgaon Baswant APMC",
    District: "Nashik",
    State: "Maharashtra",
    "State/UT": "Maharashtra",
    Lattitude: "20.1700",
    Longitude: "73.9800",
    latitude: 20.1700,
    longitude: 73.9800
  },
  {
    "SR.NO": 4,
    Market: "Pune APMC",
    District: "Pune",
    State: "Maharashtra",
    "State/UT": "Maharashtra",
    Lattitude: "18.5204",
    Longitude: "73.8567",
    latitude: 18.5204,
    longitude: 73.8567
  },
  {
    "SR.NO": 5,
    Market: "Mumbai-Onion & Potato Market APMC",
    District: "Mumbai",
    State: "Maharashtra",
    "State/UT": "Maharashtra",
    Lattitude: "19.0760",
    Longitude: "72.9980",
    latitude: 19.0760,
    longitude: 72.9980
  },
  {
    "SR.NO": 6,
    Market: "Nagpur APMC",
    District: "Nagpur",
    State: "Maharashtra",
    "State/UT": "Maharashtra",
    Lattitude: "21.1458",
    Longitude: "79.0882",
    latitude: 21.1458,
    longitude: 79.0882
  },
  {
    "SR.NO": 7,
    Market: "Satana APMC",
    District: "Nashik",
    State: "Maharashtra",
    "State/UT": "Maharashtra",
    Lattitude: "20.5937",
    Longitude: "74.2045",
    latitude: 20.5937,
    longitude: 74.2045
  },
  {
    "SR.NO": 8,
    Market: "Umrane APMC",
    District: "Nashik",
    State: "Maharashtra",
    "State/UT": "Maharashtra",
    Lattitude: "20.4639",
    Longitude: "74.3167",
    latitude: 20.4639,
    longitude: 74.3167
  },
  {
    "SR.NO": 9,
    Market: "Chattrapati Sambhajinagar APMC",
    District: "Chattrapati Sambhajinagar",
    State: "Maharashtra",
    "State/UT": "Maharashtra",
    Lattitude: "19.8762",
    Longitude: "75.3433",
    latitude: 19.8762,
    longitude: 75.3433
  },
  {
    "SR.NO": 10,
    Market: "Khed(Chakan) APMC",
    District: "Pune",
    State: "Maharashtra",
    "State/UT": "Maharashtra",
    Lattitude: "18.7565",
    Longitude: "73.8584",
    latitude: 18.7565,
    longitude: 73.8584
  }
];

export const MOCK_PRICES: Record<string, MarketPrice> = {
  "Yeola APMC": {
    State: "Maharashtra",
    District: "Nashik",
    Market: "Yeola APMC",
    Commodity: "Onion",
    Variety: "Garva / Red Onion",
    Grade: "Grade A",
    "Min Price": 2200,
    "Max Price": 2600,
    "Modal Price": 2450,
    "Price Unit": "Rs./Quintal",
    "Arrival Quantity": 3850,
    "Arrival Unit": "Metric Tonnes",
    "Arrival Date": "2026-09-03"
  },
  "Lasalgaon APMC": {
    State: "Maharashtra",
    District: "Nashik",
    Market: "Lasalgaon APMC",
    Commodity: "Onion",
    Variety: "Red Onion",
    Grade: "Grade A",
    "Min Price": 2150,
    "Max Price": 2580,
    "Modal Price": 2420,
    "Price Unit": "Rs./Quintal",
    "Arrival Quantity": 5200,
    "Arrival Unit": "Metric Tonnes",
    "Arrival Date": "2026-09-03"
  },
  "Pimpalgaon Baswant APMC": {
    State: "Maharashtra",
    District: "Nashik",
    Market: "Pimpalgaon Baswant APMC",
    Commodity: "Onion",
    Variety: "Garva",
    Grade: "Grade A",
    "Min Price": 2100,
    "Max Price": 2500,
    "Modal Price": 2380,
    "Price Unit": "Rs./Quintal",
    "Arrival Quantity": 4100,
    "Arrival Unit": "Metric Tonnes",
    "Arrival Date": "2026-09-03"
  },
  "Pune APMC": {
    State: "Maharashtra",
    District: "Pune",
    Market: "Pune APMC",
    Commodity: "Onion",
    Variety: "Red",
    Grade: "Grade A",
    "Min Price": 2400,
    "Max Price": 2800,
    "Modal Price": 2650,
    "Price Unit": "Rs./Quintal",
    "Arrival Quantity": 2900,
    "Arrival Unit": "Metric Tonnes",
    "Arrival Date": "2026-09-03"
  }
};

// Generate realistic 30-day historical price points for Yeola APMC
export const MOCK_PRICE_HISTORY_SERIES = [
  { date: "Aug 05", modal_price: 2280, min_price: 2050, max_price: 2420, arrival: 3400 },
  { date: "Aug 08", modal_price: 2310, min_price: 2080, max_price: 2450, arrival: 3550 },
  { date: "Aug 11", modal_price: 2290, min_price: 2060, max_price: 2430, arrival: 3600 },
  { date: "Aug 14", modal_price: 2340, min_price: 2100, max_price: 2490, arrival: 3420 },
  { date: "Aug 17", modal_price: 2380, min_price: 2150, max_price: 2520, arrival: 3300 },
  { date: "Aug 20", modal_price: 2360, min_price: 2120, max_price: 2500, arrival: 3500 },
  { date: "Aug 23", modal_price: 2410, min_price: 2180, max_price: 2550, arrival: 3650 },
  { date: "Aug 26", modal_price: 2430, min_price: 2190, max_price: 2570, arrival: 3720 },
  { date: "Aug 29", modal_price: 2420, min_price: 2180, max_price: 2560, arrival: 3800 },
  { date: "Sep 01", modal_price: 2440, min_price: 2200, max_price: 2590, arrival: 3820 },
  { date: "Sep 03", modal_price: 2450, min_price: 2200, max_price: 2600, arrival: 3850 }
];

export const MOCK_FORECASTS: Record<string, MarketForecast> = {
  "Yeola APMC": {
    market: "Yeola APMC",
    commodity: "Onion",
    current_modal_price: 2450,
    forecast_modal_price: 2520,
    unit: "Rs./Quintal",
    trend: "Increasing",
    trend_percentage: "+2.8%",
    confidence: 0.88,
    explanation: "Forecast based on historical market price and arrival patterns.",
    forecast_horizon_days: 7,
    daily_forecast: [
      { day: "Today", date: "Sep 03", price: 2450 },
      { day: "Tomorrow", date: "Sep 04", price: 2470 },
      { day: "+2 Days", date: "Sep 05", price: 2495 },
      { day: "+3 Days", date: "Sep 06", price: 2520 }
    ],
    demand_forecast: {
      commodity: "Onion",
      unit: "kg",
      today: 12000,
      tomorrow: 13500,
      plus_2_days: 14200,
      plus_3_days: 15000,
      label: "AI Demand Forecast",
      disclaimer: "Prototype estimate based on regional procurement patterns. Not real-world transactional data."
    }
  }
};

export const MOCK_USERS: User[] = [
  {
    id: "farmer-1",
    name: "Rajesh Patil",
    phone: "+91 98220 12345",
    role: "farmer",
    location: "Yeola",
    district: "Nashik",
    state: "Maharashtra",
    latitude: 20.0422,
    longitude: 74.4878,
    verification_status: "verified"
  },
  {
    id: "farmer-2",
    name: "Suresh Shinde",
    phone: "+91 98221 67890",
    role: "farmer",
    location: "Lasalgaon",
    district: "Nashik",
    state: "Maharashtra",
    latitude: 20.1472,
    longitude: 74.2269,
    verification_status: "verified"
  },
  {
    id: "buyer-1",
    name: "Pune Wholesale Agri-Trade",
    phone: "+91 98230 45678",
    role: "buyer",
    location: "Marketyard, Pune",
    district: "Pune",
    state: "Maharashtra",
    latitude: 18.5204,
    longitude: 73.8567,
    verification_status: "verified"
  },
  {
    id: "buyer-2",
    name: "Mumbai Fresh Mart",
    phone: "+91 98233 99887",
    role: "buyer",
    location: "Vashi APMC, Navi Mumbai",
    district: "Mumbai",
    state: "Maharashtra",
    latitude: 19.0760,
    longitude: 72.9980,
    verification_status: "verified"
  }
];

export const MOCK_PRODUCE_LOTS: ProduceLot[] = [
  {
    id: "lot-1",
    farmer_id: "farmer-1",
    farmer_name: "Rajesh Patil",
    farmer_phone: "+91 98220 12345",
    commodity: "Onion",
    variety: "Garva / Red Onion",
    quality: "Grade A",
    quantity: 500,
    unit: "kg",
    expected_price: 25,
    market: "Yeola APMC",
    pickup_location: "Yeola, Nashik",
    latitude: 20.0422,
    longitude: 74.4878,
    available_date: "2026-09-05",
    status: "available",
    created_at: "2026-09-03T10:00:00Z"
  },
  {
    id: "lot-2",
    farmer_id: "farmer-2",
    farmer_name: "Suresh Shinde",
    farmer_phone: "+91 98221 67890",
    commodity: "Onion",
    variety: "Red Onion",
    quality: "Grade A",
    quantity: 1200,
    unit: "kg",
    expected_price: 24.5,
    market: "Lasalgaon APMC",
    pickup_location: "Lasalgaon, Nashik",
    latitude: 20.1472,
    longitude: 74.2269,
    available_date: "2026-09-06",
    status: "available",
    created_at: "2026-09-03T09:30:00Z"
  },
  {
    id: "lot-3",
    farmer_id: "farmer-1",
    farmer_name: "Rajesh Patil",
    farmer_phone: "+91 98220 12345",
    commodity: "Tomato",
    variety: "Hybrid Red",
    quality: "Grade A",
    quantity: 600,
    unit: "kg",
    expected_price: 22,
    market: "Yeola APMC",
    pickup_location: "Yeola, Nashik",
    latitude: 20.0422,
    longitude: 74.4878,
    available_date: "2026-09-04",
    status: "available",
    created_at: "2026-09-02T16:00:00Z"
  }
];

export const MOCK_BUYER_DEMANDS: BuyerDemand[] = [
  {
    id: "demand-1",
    buyer_id: "buyer-1",
    buyer_name: "Pune Wholesale Agri-Trade",
    buyer_type: "Wholesale Distributor",
    commodity: "Onion",
    quality_required: "Grade A",
    quantity_required: 2000,
    unit: "kg",
    max_price: 27,
    delivery_location: "Marketyard, Pune",
    latitude: 18.5204,
    longitude: 73.8567,
    required_date: "2026-09-08",
    status: "open",
    created_at: "2026-09-03T07:00:00Z"
  },
  {
    id: "demand-2",
    buyer_id: "buyer-2",
    buyer_name: "Mumbai Fresh Mart",
    buyer_type: "Supermarket Chain",
    commodity: "Onion",
    quality_required: "Grade A",
    quantity_required: 5000,
    unit: "kg",
    max_price: 28,
    delivery_location: "Vashi APMC, Navi Mumbai",
    latitude: 19.0760,
    longitude: 72.9980,
    required_date: "2026-09-09",
    status: "open",
    created_at: "2026-09-03T06:30:00Z"
  },
  {
    id: "demand-3",
    buyer_id: "buyer-3",
    buyer_name: "Nashik Food Processors Ltd",
    buyer_type: "Food Processing Unit",
    commodity: "Onion",
    quality_required: "Grade B",
    quantity_required: 3000,
    unit: "kg",
    max_price: 23,
    delivery_location: "Ambad MIDC, Nashik",
    latitude: 19.9500,
    longitude: 73.7300,
    required_date: "2026-09-07",
    status: "open",
    created_at: "2026-09-03T06:00:00Z"
  }
];

export const MOCK_MATCHES_LOT_1: Match[] = [
  {
    id: "match-lot-1-demand-1",
    lot_id: "lot-1",
    demand_id: "demand-1",
    buyer_id: "buyer-1",
    buyer_name: "Pune Wholesale",
    buyer_type: "Wholesale Distributor",
    delivery_location: "Marketyard, Pune",
    required_quantity: 500,
    offered_price: 26,
    unit: "kg",
    distance_km: 185,
    estimated_travel_time: "4h 20m",
    logistics_cost: 1800,
    gross_earning: 13000,
    farmer_net_earning: 11200,
    mandi_reference_price: 22,
    mandi_net_realization: 11000,
    benefit_gain: 200,
    match_score: 91,
    badge: "Best Match",
    status: "ready"
  },
  {
    id: "match-lot-1-demand-2",
    lot_id: "lot-1",
    demand_id: "demand-2",
    buyer_id: "buyer-2",
    buyer_name: "Mumbai Fresh Mart",
    buyer_type: "Supermarket Chain",
    delivery_location: "Vashi APMC, Navi Mumbai",
    required_quantity: 500,
    offered_price: 27,
    unit: "kg",
    distance_km: 245,
    estimated_travel_time: "5h 45m",
    logistics_cost: 2600,
    gross_earning: 13500,
    farmer_net_earning: 10900,
    mandi_reference_price: 22,
    mandi_net_realization: 11000,
    benefit_gain: -100,
    match_score: 84,
    badge: "High Match",
    status: "ready"
  },
  {
    id: "match-lot-1-demand-3",
    lot_id: "lot-1",
    demand_id: "demand-3",
    buyer_id: "buyer-3",
    buyer_name: "Nashik Food Processors",
    buyer_type: "Processing Plant",
    delivery_location: "Ambad MIDC, Nashik",
    required_quantity: 500,
    offered_price: 24,
    unit: "kg",
    distance_km: 78,
    estimated_travel_time: "1h 50m",
    logistics_cost: 1100,
    gross_earning: 12000,
    farmer_net_earning: 10900,
    mandi_reference_price: 22,
    mandi_net_realization: 11000,
    benefit_gain: -100,
    match_score: 79,
    badge: "Good Match",
    status: "ready"
  }
];

export const MOCK_OFFERS: Offer[] = [
  {
    id: "offer-1",
    match_id: "match-lot-1-demand-1",
    lot_id: "lot-1",
    buyer_id: "buyer-1",
    buyer_name: "Pune Wholesale",
    farmer_id: "farmer-1",
    farmer_name: "Rajesh Patil",
    commodity: "Onion",
    offered_price: 26,
    quantity: 500,
    unit: "kg",
    distance_km: 185,
    logistics_cost: 1800,
    estimated_net_earning: 11200,
    mandi_reference_price: 22,
    mandi_net_realization: 11000,
    status: "pending",
    created_at: "2026-09-03T10:30:00Z"
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-2026-0901",
    offer_id: "offer-prev-1",
    farmer_id: "farmer-1",
    farmer_name: "Rajesh Patil",
    buyer_id: "buyer-1",
    buyer_name: "Pune Wholesale",
    commodity: "Onion",
    quantity: 1000,
    unit: "kg",
    agreed_price: 25.5,
    gross_amount: 25500,
    logistics_cost: 2200,
    net_earning: 23300,
    pickup_location: "Yeola, Nashik",
    delivery_location: "Marketyard, Pune",
    status: "in_transit",
    created_at: "2026-09-02T14:20:00Z",
    estimated_delivery: "Tomorrow, 12:00 PM"
  }
];

export const MOCK_LOGISTICS_INFO: LogisticsInfo = {
  match_id: "match-lot-1-demand-1",
  origin: "Yeola APMC, Nashik, Maharashtra",
  destination: "Marketyard, Pune, Maharashtra",
  origin_coordinates: { latitude: 20.0422, longitude: 74.4878 },
  destination_coordinates: { latitude: 18.5204, longitude: 73.8567 },
  distance_km: 185,
  estimated_duration: "4h 20m",
  recommended_vehicle: "Mahindra Bolero Maxi Truck (1.5T payload)",
  fuel_estimate_litres: 19.5,
  toll_charges: 350,
  driver_allowance: 450,
  freight_base: 1000,
  total_estimated_logistics_cost: 1800,
  route_waypoints: [
    { step: 1, location: "Yeola APMC Gate 2", instruction: "Produce pickup and quality check signoff", km_mark: 0 },
    { step: 2, location: "Kopargaon Bypass (SH-10)", instruction: "Proceed south toward Shirdi bypass", km_mark: 28 },
    { step: 3, location: "Sangamner Toll Plaza", instruction: "Merge onto NH-60 (Nashik - Pune Expressway)", km_mark: 82 },
    { step: 4, location: "Narayangaon Checkpost", instruction: "Direct freight transit corridor", km_mark: 135 },
    { step: 5, location: "Marketyard Pune Bay 4", instruction: "Final unloading and digital delivery receipt", km_mark: 185 }
  ],
  route_optimization_factor: "Direct NH-60 route avoiding urban congestion saves 45 minutes & ₹220 in fuel cost."
};
