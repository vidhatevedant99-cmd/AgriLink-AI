#  AgriLink AI — Smart Market Linkage & Price Discovery

**Sell Direct. Buy Smarter.**

AgriLink AI is an AI-powered agricultural marketplace designed to help farmers find better selling opportunities by connecting them directly with buyers and providing useful market price information.

Our goal is to reduce dependence on intermediaries, improve price transparency, and help farmers make better selling decisions.

##  Problem Statement

Farmers often face challenges such as:

* Lack of accurate and accessible market price information.
* Dependence on multiple intermediaries.
* Difficulty finding suitable buyers.
* Transportation costs that reduce their final earnings.
* Uncertainty about when and where to sell their crops.

##  Our Solution

AgriLink AI aims to bring farmers and buyers closer through a single platform.

Key features include:

* **Market Price Information:** View agricultural commodity prices across supported markets.
* **Price Trend Analysis:** Understand how prices change over time.
* **AI-Based Price Forecasting:** Experiment with machine learning models to estimate future crop prices.
* **Direct Farmer–Buyer Connections:** Help farmers find potential buyers.
* **Smart Market Selection:** Support better selling decisions by considering prices and transportation costs.
* **Logistics Support:** Help farmers explore transportation options for delivering their produce.

*Note: Features are being developed progressively. Availability depends on the current prototype and backend integration.*

##  Machine Learning

The current forecasting experiment focuses on **onion prices at Yeola APMC, Maharashtra**.

The model uses historical market data to estimate the next day's modal price.

### Models Tested

* Naive Forecasting
* Moving Average
* Random Forest Regressor
* XGBoost Regressor

### Current Results

| Model          | MAE (₹) | RMSE (₹) |   MAPE |
| -------------- | ------: | -------: | -----: |
| Naive          |  194.12 |   301.28 |  7.62% |
| Moving Average |  288.66 |   467.83 |  9.92% |
| Random Forest  |  465.63 |   782.02 | 15.54% |
| XGBoost        |  604.75 |   891.43 | 21.58% |

**Current finding:** Naive forecasting performs best overall on the tested data, while Random Forest performs best among the two machine learning models.

These results are preliminary and are based on a test set of 34 samples. Further testing with more historical data is needed before relying on forecasts for real selling decisions.

##  Technologies Used

* **Python** — Data processing and machine learning
* **FastAPI** — Backend API development
* **Pandas & NumPy** — Data cleaning and processing
* **Scikit-learn** — Machine learning and model evaluation
* **XGBoost** — Gradient boosting model
* **Supabase / PostgreSQL** — Database and data storage
* **React / TypeScript** — Frontend prototype, where applicable
* **Git & GitHub** — Version control and project collaboration

##  Dataset

The current experiment uses historical agricultural market data for onion prices in Maharashtra.

The dataset contains information such as:

* State and district
* Market name
* Commodity and variety
* Minimum, maximum, and modal prices
* Arrival quantity
* Arrival date

The dataset is used for preprocessing, price trend analysis, and forecasting experiments.

##  Project Structure

```text
AgriLink-AI/
├── backend/
│   ├── main.py
│   └── supabase_client.py
├── ML_model/
│   └── train.py
├── ml/
│   └── models/
│       └── onion_price_model.pkl
├── data/
│   └── processed/
│       └── onion_cleanned.csv
├── requirements.txt
└── README.md
```

*Your actual folder structure may differ as development continues.*

##  Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/vidhatevedant99-cmd/AgriLink-AI.git
cd AgriLink-AI
```

### 2. Create a virtual environment

```bash
python -m venv .venv
```

Activate it on Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

### 3. Install dependencies

```bash
python -m pip install -r requirements.txt
```

If XGBoost is not included in `requirements.txt`, install it using:

```bash
python -m pip install xgboost
```

### 4. Train the forecasting model

Run the training script from the project root:

```bash
python ML_model/train.py
```

The script trains and evaluates the forecasting models and saves the selected machine learning model, provided the required dataset and dependencies are available.

### 5. Run the backend

If your FastAPI application is located at `backend/main.py`, run:

```bash
uvicorn backend.main:app --reload
```

Open the interactive API documentation at:

`http://127.0.0.1:8000/docs`

##  Project Goals

* Improve access to agricultural market information.
* Help farmers discover potential buyers.
* Explore data-driven crop price forecasting.
* Encourage more transparent agricultural trading.
* Reduce avoidable transportation costs and intermediary dependence.

##  Future Improvements

* Include more historical data and additional markets.
* Improve and validate forecasting models.
* Add market comparisons and location-based recommendations.
* Integrate buyer demand and farmer listings.
* Connect logistics providers and estimate delivery costs.
* Improve multilingual accessibility.
* Complete frontend–backend integration and deployment.

##  Contributing

Contributions, suggestions, and feedback are welcome!

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Submit a pull request.

##  Disclaimer

AgriLink AI is a developing project and its price forecasts are experimental. Predictions are not guaranteed future market prices and should not be treated as financial advice.

##  Developed For

**Smart India Hackathon (SIH) 2026**

**AgriLink AI — Sell Direct. Buy Smarter.**
