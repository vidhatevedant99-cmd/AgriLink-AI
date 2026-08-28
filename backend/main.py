from fastapi import FastAPI, Query
from datetime import date
import pandas as pd

app = FastAPI(
    title="AgriLink AI API",
    description="Backend for AgriLink AI",
    version="1.0.0"
)

# Load agricultural market data
DATA_PATH = "data/processed/onion_cleanned.csv"
df = pd.read_csv(DATA_PATH)


@app.get("/")
def home():
    return {
        "message": "Welcome to AgriLink AI",
        "status": "running"
    }


@app.get("/health")
def get_health():
    return {
        "status": "Healthy"
    }


@app.get("/api/markets")
def get_markets(
    district: str | None = None,
    commodity: str | None = None,
    market: str | None = None,
    limit: int = Query(default=20, ge=1, le=100)
):
    markets = df[
        [
            "Market",
            "District",
            "Commodity",
            "Modal Price",
            "Min Price",
            "Max Price",
            "Arrival Quantity",
            "Arrival Date"
        ]
    ].copy()

    # Filter by district
    if district:
        markets = markets[
            markets["District"].str.contains(
                district, case=False, na=False
            )
        ]

    # Filter by commodity
    if commodity:
        markets = markets[
            markets["Commodity"].str.contains(
                commodity, case=False, na=False
            )
        ]

    # Filter by market
    if market:
        markets = markets[
            markets["Market"].str.contains(
                market, case=False, na=False
            )
        ]

    # Limit number of results
    markets = markets.head(limit)

    return markets.to_dict(orient="records")

@app.get("/api/price-histroy")
def get_price_history(
    crop : str,
    market : str,
    district : str |None = None,
    from_date : date | None = None,
    to_date : date |None  = None
):
    history = df[[
        "Market",
        "District",
        "Commodity",
        "Modal Price",
        "Arrival Date"
    ]].copy()

    #Filter by crop
    histroy = history[
        history["Commodity"].str.contains(
            crop, case = False, na = False
        )
    ]

    #Filter by market
    history = history[
        histroy ["Market"].str.contains(
                market, case = False, na = False
            )
            ]

    #Filter by District
    if district:
        history = history[
            history ["District"].str.contains(
                district, case = False, na = False
            )
        ]

    #Convert arrival date to datetime  
    history["Arrival Date"] = pd.to_datetime(
        histroy["Arrival Date"],
        errors = "coerce"
    )  

    #Filter by starting date
    if from_date:
        history = history[
            history["Arrival Date"] >= pd.Timestamp(from_date)
        ]

    #Filter by end date
    if to_date:
        histroy = history[
            history["Arrival Date"] <= pd.Timestamp(to_date)
        ]    

    #Select a response field
    history = history[
        ["Arrival Date", "Modal Price"]
    ].copy()

    #Rename field according to api contract
    history = history.rename(
        columns = {
            "Arrival Date" :"date",
            "Modal Price" : "modal_price"
        }
    )

    #Remove rows with invalid date
    history = history.dropna(subset = ["date"])

    #Convert date to string
    history["date"] = history["date"].dt.strftime("%Y-%m-%d")

    return history.to_dict(orient = "records" )