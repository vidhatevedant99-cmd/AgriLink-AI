# ml/train_xgboost.py

# ml/train_xgboost.py

import os
import joblib
import numpy as np
import pandas as pd

from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error


# ============================================================
# CONFIG
# ============================================================

DATA_PATH = "data/processed/onion_cleanned.csv"
MODEL_PATH = "ml/agrilink_xgboost.pkl"

TARGET = "Modal Price"


# ============================================================
# LOAD DATA
# ============================================================

df = pd.read_csv(DATA_PATH)

print("=" * 60)
print(" AGRILINK AI - XGBOOST PRICE FORECASTING")
print("=" * 60)

print(f"Original rows: {len(df)}")


# ============================================================
# CLEAN DATA
# ============================================================

df["Arrival Date"] = pd.to_datetime(
    df["Arrival Date"],
    errors="coerce"
)

df[TARGET] = pd.to_numeric(
    df[TARGET],
    errors="coerce"
)

df = df.dropna(
    subset=["Market", "Arrival Date", TARGET]
)

# Keep only useful columns
df = df[
    [
        "Market",
        "District",
        "Commodity",
        "Variety",
        "Grade",
        "Arrival Date",
        TARGET
    ]
].copy()

# Sort by market and date
df = df.sort_values(
    ["Market", "Arrival Date"]
).reset_index(drop=True)


# ============================================================
# TIME FEATURES
# ============================================================

df["year"] = df["Arrival Date"].dt.year
df["month"] = df["Arrival Date"].dt.month
df["day"] = df["Arrival Date"].dt.day
df["day_of_week"] = df["Arrival Date"].dt.dayofweek
df["day_of_year"] = df["Arrival Date"].dt.dayofyear


# ============================================================
# MARKET-SPECIFIC LAG FEATURES
# ============================================================

group = df.groupby("Market")[TARGET]

df["price_lag_1"] = group.shift(1)
df["price_lag_2"] = group.shift(2)
df["price_lag_3"] = group.shift(3)
df["price_lag_7"] = group.shift(7)
df["price_lag_14"] = group.shift(14)
df["price_lag_30"] = group.shift(30)


# ============================================================
# MARKET-SPECIFIC ROLLING FEATURES
# ============================================================

df["price_ma_3"] = (
    df.groupby("Market")[TARGET]
    .transform(lambda x: x.shift(1).rolling(3).mean())
)

df["price_ma_7"] = (
    df.groupby("Market")[TARGET]
    .transform(lambda x: x.shift(1).rolling(7).mean())
)

df["price_ma_14"] = (
    df.groupby("Market")[TARGET]
    .transform(lambda x: x.shift(1).rolling(14).mean())
)

df["price_ma_30"] = (
    df.groupby("Market")[TARGET]
    .transform(lambda x: x.shift(1).rolling(30).mean())
)


# ============================================================
# CATEGORICAL FEATURES
# ============================================================

categorical_columns = [
    "Market",
    "District",
    "Commodity",
    "Variety",
    "Grade"
]

category_maps = {}

for col in categorical_columns:

    df[col] = (
        df[col]
        .fillna("Unknown")
        .astype(str)
    )

    categories = sorted(
        df[col].unique()
    )

    category_maps[col] = {
        value: index
        for index, value in enumerate(categories)
    }

    df[col] = df[col].map(
        category_maps[col]
    )


# ============================================================
# FEATURES
# ============================================================

features = [
    "year",
    "month",
    "day",
    "day_of_week",
    "day_of_year",

    "price_lag_1",
    "price_lag_2",
    "price_lag_3",
    "price_lag_7",
    "price_lag_14",
    "price_lag_30",

    "price_ma_3",
    "price_ma_7",
    "price_ma_14",
    "price_ma_30",

    "Market",
    "District",
    "Commodity",
    "Variety",
    "Grade"
]


# ============================================================
# REMOVE ROWS WITHOUT ENOUGH HISTORY
# ============================================================

df = df.dropna(
    subset=features + [TARGET]
).reset_index(drop=True)

print(f"Usable rows: {len(df)}")
print(f"Features: {len(features)}")


# ============================================================
# TIME-BASED TRAIN / TEST SPLIT
# ============================================================

# IMPORTANT:
# Split using date, not row order.

unique_dates = sorted(
    df["Arrival Date"].unique()
)

split_date = unique_dates[
    int(len(unique_dates) * 0.80)
]

train = df[
    df["Arrival Date"] < split_date
]

test = df[
    df["Arrival Date"] >= split_date
]

X_train = train[features]
y_train = train[TARGET]

X_test = test[features]
y_test = test[TARGET]


print()
print("TRAIN / TEST")
print("-" * 60)
print(f"Train rows : {len(train)}")
print(f"Test rows  : {len(test)}")
print(f"Train end  : {train['Arrival Date'].max()}")
print(f"Test start : {test['Arrival Date'].min()}")


# ============================================================
# TRAIN XGBOOST
# ============================================================

model = XGBRegressor(
    n_estimators=500,
    learning_rate=0.03,
    max_depth=6,
    subsample=0.8,
    colsample_bytree=0.8,
    objective="reg:squarederror",
    random_state=42,
    n_jobs=-1
)

print()
print("Training XGBoost...")

model.fit(
    X_train,
    y_train
)


# ============================================================
# EVALUATION
# ============================================================

predictions = model.predict(X_test)

mae = mean_absolute_error(
    y_test,
    predictions
)

rmse = np.sqrt(
    mean_squared_error(
        y_test,
        predictions
    )
)

mask = y_test != 0

mape = (
    np.mean(
        np.abs(
            (y_test[mask] - predictions[mask])
            / y_test[mask]
        )
    ) * 100
)


print()
print("=" * 60)
print(" MODEL RESULTS")
print("=" * 60)

print(f"MAE  : ₹ {mae:,.2f}")
print(f"RMSE : ₹ {rmse:,.2f}")
print(f"MAPE : {mape:.2f}%")

print("=" * 60)


# ============================================================
# RETRAIN ON ENTIRE DATASET
# ============================================================

print()
print("Retraining final model on FULL dataset...")

final_model = XGBRegressor(
    n_estimators=500,
    learning_rate=0.03,
    max_depth=6,
    subsample=0.8,
    colsample_bytree=0.8,
    objective="reg:squarederror",
    random_state=42,
    n_jobs=-1
)

final_model.fit(
    df[features],
    df[TARGET]
)


# ============================================================
# SAVE MODEL
# ============================================================

os.makedirs(
    os.path.dirname(MODEL_PATH),
    exist_ok=True
)

joblib.dump(
    {
        "model": final_model,
        "features": features,
        "category_maps": category_maps
    },
    MODEL_PATH
)


print()
print("Final model saved:")
print(MODEL_PATH)

print()
print("DONE.")