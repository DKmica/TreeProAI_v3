from fastapi import FastAPI
from prophet import Prophet
import uvicorn
import os
import pandas as pd

app = FastAPI(
    title="TreeProAI Forecast Service",
    description="Time-series forecasting for demand and other metrics.",
    version="0.1.0"
)

@app.post("/forecast/demand")
def forecast(payload: dict):
    # Expects a dictionary that can be converted to a pandas DataFrame
    # with 'ds' and 'y' columns.
    # e.g., {"ds": ["2023-01-01", "2023-01-02"], "y": [10, 12]}
    
    # In a real scenario, you would handle errors and edge cases.
    try:
        df = pd.DataFrame(payload)
        
        # Initialize and fit the model
        model = Prophet()
        model.fit(df)
        
        # Make a future dataframe for 30 days
        future = model.make_future_dataframe(periods=30)
        forecast_result = model.predict(future)
        
        # Return the forecast as a dictionary
        return {"forecast": forecast_result.to_dict(orient="records")}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    port = int(os.getenv("PORT", "8003"))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True)