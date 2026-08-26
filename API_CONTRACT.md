# AgriLink AI — API Contract

## Base URL

http://127.0.0.1:8000

---

## 1. Market API

### GET /api/markets

Returns market information and current price data.

### Query Parameters

- crop — required
- district — optional
- market — optional

### Example Request

GET /api/markets?crop=Onion&district=Nashik

### Example Response
#2. Price History API
```json
[
  {
    "market": "Lasalgaon APMC",
    "district": "Nashik",
    "commodity": "Onion",
    "modal_price": 3400,
    "min_price": 3000,
    "max_price": 3600,
    "arrival_quantity": 120,
    "arrival_date": "2026-08-26"
  }
]
#Price History API
[
  {
    "date": "2026-08-24",
    "modal_price": 3460
  },
  {
    "date": "2026-08-25",
    "modal_price": 3475
  },
  {
    "date": "2026-08-26",
    "modal_price": 3400
  }
]
#3. Market Recommendation API
#Request Body
{
  "crop": "Onion",
  "variety": "Red",
  "district": "Nashik",
  "quantity": 50
}
#Example response
{
  "recommended_market": "Lasalgaon APMC",
  "predicted_price": 3450,
  "expected_realization": 165000,
  "confidence": 0.82
}
#4. Expected Market Realization API
#REquest Body
{
  "crop": "Onion",
  "quantity": 50,
  "market": "Lasalgaon APMC",
  "price": 3400,
  "transport_cost": 5000,
  "other_cost": 2000
}
#Exxample Response
{
  "gross_value": 170000,
  "transport_cost": 5000,
  "other_cost": 2000,
  "estimated_net_realization": 163000
}
#5. Buyer API
#Example Reasponse
[
  {
    "buyer_id": 1,
    "name": "Example Buyer",
    "location": "Nashik",
    "crop": "Onion",
    "verified": true
  }
]#6. Lot API
#Request Body
{
  "farmer_id": 1,
  "crop": "Onion",
  "variety": "Red",
  "quantity": 50,
  "grade": "FAQ",
  "expected_price": 3400
}
#Example Response
{
  "lot_id": 101,
  "status": "active"
}
#7. Offer API
#Request Body
{
  "lot_id": 101,
  "buyer_id": 5,
  "offered_price": 3500
}
#Example Response
{
  "offer_id": 501,
  "status": "pending"
}
#8. Transaction API
#Request Body
{
  "lot_id": 101,
  "offer_id": 501
}
#Example Response
{
  "transaction_id": 1001,
  "status": "confirmed"
}
