
from datetime import date, datetime
from pydantic import BaseModel
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from backend.supabase_client import supabase

import os
import joblib
import pandas as pd
import numpy as np

app = FastAPI(
    title="AgriLink AI API",
    description="Backend for AgriLink AI",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "message": "Welcome to AgriLink AI",
        "status": "running"
    }


@app.get("/health")
def health():
    return {"status": "Healthy"}




# --------------------------------------------------
@app.get("/api/markets/search")
def search_markets(
    search: str = Query(..., min_length=1),
    limit: int = Query(default=10, le=50)
):
    response = (
        supabase
        .table("Market_location")
        .select("*")
        .ilike("Market", f"%{search}%")
        .limit(limit)
        .execute()
    )

    return response.data


@app.get("/api/latest-price")
def get_latest_price(
    market: str = Query(..., min_length=1)
):
    response = (
        supabase
        .table("Market_price")
        .select("*")
        .ilike("Market", f"%{market}%")
        .order("Arrival Date", desc=True)
        .limit(1)
        .execute()
    )

    if not response.data:
        return {
            "message": "No price data found for this market",
            "market": market
        }
    return response.data[0]



# ============================================================
# LOAD ML MODEL
# ============================================================

MODEL_PATH = "ml/agrilink_xgboost.pkl"

try:
    ml_package = joblib.load(MODEL_PATH)

    ml_model = ml_package["model"]
    ml_features = ml_package["features"]
    category_maps = ml_package["category_maps"]

    MODEL_LOADED = True

    print("XGBoost model loaded successfully.")

except Exception as e:

    ml_model = None
    ml_features = []
    category_maps = {}

    MODEL_LOADED = False

    print("ML model not loaded:", e)


# ============================================================
# API Trend
# ============================================================




@app.get("/api/trend")
def get_price_trend(
    market: str = Query(...),
    days: int = Query(30, ge=7, le=365)
):

    try:

        response = (
            supabase
            .table("Market_price")
            .select("*")
            .ilike("Market", f"%{market}%")
            .order("Arrival Date", desc=True)
            .limit(days)
            .execute()
        )

        data = response.data

        if not data:
            return {
                "market": market,
                "days": days,
                "data": []
            }

        trend = []

        for row in reversed(data):

            date_value = (
                row.get("Arrival Date")
                or row.get("Arrival_Date")
            )

            price_value = (
                row.get("Modal Price")
                or row.get("Modal_Price")
            )

            if date_value is None or price_value is None:
                continue

            trend.append({
                "date": date_value,
                "price": float(price_value)
            })

        return {
            "market": market,
            "days": days,
            "data": trend
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


    # ============================================================
# PRICE FORECAST
# ============================================================

@app.get("/api/forecast")
def forecast_price(
    market: str = Query(..., min_length=1)
):

    if not MODEL_LOADED:
        raise HTTPException(
            status_code=500,
            detail="ML model is not loaded."
        )

    try:

        # ----------------------------------------------------
        # Get latest 40 records
        # ----------------------------------------------------

        response = (
            supabase
            .table("Market_price")
            .select("*")
            .ilike("Market", f"%{market}%")
            .order("Arrival Date", desc=True)
            .limit(40)
            .execute()
        )

        data = response.data

        if len(data) < 30:
            raise HTTPException(
                status_code=400,
                detail="Not enough historical data for forecasting."
            )

        # ----------------------------------------------------
        # Convert to DataFrame
        # ----------------------------------------------------

        rows = []

        for row in data:

            date_value = (
                row.get("Arrival Date")
                or row.get("Arrival_Date")
            )

            price_value = (
                row.get("Modal Price")
                or row.get("Modal_Price")
            )

            if date_value is None or price_value is None:
                continue

            rows.append({
                "Market": row.get("Market", market),
                "District": row.get("District", "Unknown"),
                "Commodity": row.get("Commodity", "Onion"),
                "Variety": row.get("Variety", "Unknown"),
                "Grade": row.get("Grade", "Unknown"),
                "Arrival Date": date_value,
                "Modal Price": float(price_value)
            })

        df = pd.DataFrame(rows)

        if len(df) < 30:
            raise HTTPException(
                status_code=400,
                detail="Not enough valid historical prices."
            )

       # Oldest -> newest
        df["Arrival Date"] = pd.to_datetime(
          df["Arrival Date"],
          format="%Y/%d/%m",
          errors="coerce"
           )

        if df["Arrival Date"].isna().any():
         raise HTTPException(
          status_code=400,
            detail="Some Arrival Date values could not be parsed."
        )

        df = df.sort_values(
          "Arrival Date"
         ).reset_index(drop=True)

        # ----------------------------------------------------
        # Create features
        # ----------------------------------------------------

        target = "Modal Price"

        latest_date = df["Arrival Date"].max()

        forecast_date = (
            latest_date + pd.Timedelta(days=1)
        )

        # Historical values
        prices = df[target]

        feature_row = {}

        feature_row["year"] = forecast_date.year
        feature_row["month"] = forecast_date.month
        feature_row["day"] = forecast_date.day
        feature_row["day_of_week"] = forecast_date.dayofweek
        feature_row["day_of_year"] = forecast_date.dayofyear

        feature_row["price_lag_1"] = prices.iloc[-1]
        feature_row["price_lag_2"] = prices.iloc[-2]
        feature_row["price_lag_3"] = prices.iloc[-3]
        feature_row["price_lag_7"] = prices.iloc[-7]
        feature_row["price_lag_14"] = prices.iloc[-14]
        feature_row["price_lag_30"] = prices.iloc[-30]

        feature_row["price_ma_3"] = prices.iloc[-3:].mean()
        feature_row["price_ma_7"] = prices.iloc[-7:].mean()
        feature_row["price_ma_14"] = prices.iloc[-14:].mean()
        feature_row["price_ma_30"] = prices.iloc[-30:].mean()

        # ----------------------------------------------------
        # Categorical features
        # ----------------------------------------------------

        categorical_values = {
            "Market": market,
            "District": df["District"].iloc[-1],
            "Commodity": df["Commodity"].iloc[-1],
            "Variety": df["Variety"].iloc[-1],
            "Grade": df["Grade"].iloc[-1]
        }

        for col, value in categorical_values.items():

            value = str(value)

            mapping = category_maps.get(
                col,
                {}
            )

            # Unknown category fallback
            feature_row[col] = mapping.get(
                value,
                0
            )

        # ----------------------------------------------------
        # Create DataFrame in exact feature order
        # ----------------------------------------------------

        X = pd.DataFrame(
            [feature_row]
        )

        X = X[ml_features]

        # ----------------------------------------------------
        # Prediction
        # ----------------------------------------------------

        prediction = ml_model.predict(X)[0]

        prediction = max(
            0,
            float(prediction)
        )

        return {
            "market": market,
            "last_price": float(prices.iloc[-1]),
            "forecast_date": forecast_date.strftime("%Y-%m-%d"),
            "predicted_price": round(prediction, 2),
            "unit": "₹/quintal"
        }

    except HTTPException:
        raise

    except Exception as e:
     print("FORECAST ERROR:", repr(e))

     raise HTTPException(
        status_code=500,
        detail=str(e)
    )