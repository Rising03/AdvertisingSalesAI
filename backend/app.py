import os
import sys
import uvicorn
import numpy as np
import pandas as pd
import tensorflow as tf
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from sklearn.preprocessing import StandardScaler
from contextlib import asynccontextmanager

# Global variables to hold model and scaler
ml_resources = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Load ML model and Scaler on startup.
    """
    print("🔄 STARTUP: Initializing application...", flush=True)
    
    # 1. Load Model
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    MODEL_PATH = os.path.join(BASE_DIR, "advertising_sales_model.h5")
    CSV_PATH = os.path.join(BASE_DIR, "Advertising Budget and Sales.csv")
    
    print(f"🔍 looking for model at: {MODEL_PATH}", flush=True)
    
    try:
        if os.path.exists(MODEL_PATH):
            # compile=False allows loading models even if custom metrics/losses are incompatible
            ml_resources["model"] = tf.keras.models.load_model(MODEL_PATH, compile=False)
            print("✅ Model loaded successfully.", flush=True)
        else:
            print(f"❌ CRITICAL: Model file not found at {MODEL_PATH}", flush=True)
    except Exception as e:
        print(f"❌ Error loading model: {e}", flush=True)

    # 2. Fit Scaler (Vital for correct predictions)
    print(f"🔍 looking for dataset to fit scaler at: {CSV_PATH}", flush=True)
    try:
        if os.path.exists(CSV_PATH):
            data = pd.read_csv(CSV_PATH)
            # Match the training columns exactly
            X = data[["TV Ad Budget ($)", "Radio Ad Budget ($)", "Newspaper Ad Budget ($)"]]
            scaler = StandardScaler()
            scaler.fit(X)
            ml_resources["scaler"] = scaler
            print("✅ Scaler fitted successfully using provided dataset.", flush=True)
        else:
            print(f"⚠️ Warning: Dataset csv not found at {CSV_PATH}. Predictions will be unscaled (likely incorrect).", flush=True)
    except Exception as e:
        print(f"❌ Error fitting scaler: {e}", flush=True)

    yield
    
    # Clean up resources
    ml_resources.clear()
    print("🛑 SHUTDOWN: Cleaning up resources.", flush=True)

# Initialize FastAPI App with lifespan
app = FastAPI(
    title="Advertising Sales Prediction API",
    description="API for predicting sales based on advertising budgets.",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictionInput(BaseModel):
    tv: float
    radio: float
    newspaper: float

    class Config:
        json_schema_extra = {
            "example": {
                "tv": 150.0,
                "radio": 25.0,
                "newspaper": 10.0
            }
        }

class PredictionOutput(BaseModel):
    predicted_sales: float

@app.get("/")
def home():
    return {"message": "Advertising Sales Prediction API is running."}

@app.post("/predict", response_model=PredictionOutput)
def predict_sales(data: PredictionInput):
    print(f"📥 Received request: {data}", flush=True)
    
    model = ml_resources.get("model")
    scaler = ml_resources.get("scaler")

    if model is None:
        raise HTTPException(status_code=503, detail="Model is not loaded.")
    
    try:
        # Prepare input
        input_data = [[data.tv, data.radio, data.newspaper]]
        
        # Scale input if scaler is available
        if scaler:
            input_scaled = scaler.transform(input_data)
            print(f"   Original: {input_data} -> Scaled: {input_scaled}", flush=True)
        else:
            input_scaled = np.array(input_data)
            print("⚠️ Warning: Using unscaled data.", flush=True)
        
        # Predict
        prediction = model.predict(input_scaled)
        predicted_sales = float(prediction[0][0])
        
        print(f"📤 Prediction: {predicted_sales}", flush=True)
        return {"predicted_sales": predicted_sales}

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    # Reload=False because loading TF model constantly on reload can be memory intensive/buggy
    uvicorn.run(app, host="0.0.0.0", port=port)
