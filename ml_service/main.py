import os
import sys
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Optional

sys.path.append(os.path.dirname(__file__))
from models.retry_predictor import predictor
from utils.feature_engineering import infer_salary_day

app = FastAPI(
    title="RECOVER ML Service",
    description="Statistical Timing Predictor for UPI Autopay Retries (Strictly Prediction Only)"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request schema
class MandatePredictRequest(BaseModel):
    mandate_id: str
    mandate_amount: float = Field(..., gt=0)
    category: str
    due_day: int = Field(..., ge=1, le=30)
    attempts: int = Field(default=0, ge=0)
    customer_id: str
    monthly_inflow: float = Field(..., gt=0)
    credit_days: Optional[str] = ""
    credit_amounts: Optional[str] = ""
    balance_curve: Dict[int, float] = Field(default_factory=dict)

# STRICT Checkpoint 2 / PRD Part 13.3 Response Schema
# Absolutely NO status, decision, action, or escalation fields permitted!
class CandidateDay(BaseModel):
    day: int
    prob: float

class PredictResponse(BaseModel):
    best_day: int
    predicted_success_prob: float
    candidate_days: List[CandidateDay]
    feature_importances: Dict[str, float]

class FeatureImportancesResponse(BaseModel):
    feature_importances: Dict[str, float]
    auc_score: float

@app.on_event("startup")
def startup_event():
    seeds_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "generator", "seeds"))
    if not predictor.load():
        print(f"Training model on startup using seeds from {seeds_dir}...")
        auc, importances = predictor.train_from_seeds(seeds_dir)
        print(f"Model trained! Test AUC: {auc:.4f}")
    else:
        print(f"Model loaded from cache! Test AUC: {predictor.auc_score:.4f}")

@app.get("/health")
def health():
    return {"status": "ok", "service": "recover-ml"}

@app.get("/model/feature-importances", response_model=FeatureImportancesResponse)
def get_feature_importances():
    if predictor.model is None and not predictor.load():
        raise HTTPException(status_code=500, detail="Model is not trained")
    return {
        "feature_importances": predictor.feature_importances,
        "auc_score": predictor.auc_score
    }

@app.post("/predict", response_model=PredictResponse)
def predict(req: MandatePredictRequest):
    """
    Predicts probability of recovery for candidate days.
    Does NOT make decisions or determine mandate lifecycle status.
    """
    if predictor.model is None and not predictor.load():
        raise HTTPException(status_code=500, detail="Model is not initialized")

    inferred_salary = infer_salary_day(req.credit_days or "", req.credit_amounts or "")

    result = predictor.predict_candidate_days(
        mandate_amount=req.mandate_amount,
        monthly_inflow=req.monthly_inflow,
        inferred_salary_day=inferred_salary,
        category=req.category,
        attempts=req.attempts,
        balance_curve=req.balance_curve,
        current_due_day=req.due_day
    )

    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
