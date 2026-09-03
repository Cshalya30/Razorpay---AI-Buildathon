import os
import sys
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any

sys.path.append(os.path.dirname(__file__))
from models.retry_predictor import predictor
from utils.feature_engineering import infer_salary_day, FEATURE_DESCRIPTIONS

app = FastAPI(
    title="RECOVER ML Service",
    description="Statistical Timing Predictor for UPI AutoPay Retries (Strictly Prediction Only)"
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
    daily_burn: Optional[float] = 0.0
    balance_curve: Dict[int, float] = Field(default_factory=dict)

# STRICT Checkpoint 2 / PRD Part 13.3 Response Schema
# Absolutely NO status, decision, action, or escalation fields permitted!
class CandidateDay(BaseModel):
    day: int
    prob: float
    confidence_tier: Optional[str] = "moderate"
    projected_balance: Optional[float] = 0.0

class PredictResponse(BaseModel):
    best_day: int
    predicted_success_prob: float
    candidate_days: List[CandidateDay]
    feature_importances: Dict[str, float]
    local_explanation: str

class BenchmarkMetricsResponse(BaseModel):
    metrics: Dict[str, Any]
    feature_importances: Dict[str, float]
    feature_descriptions: Dict[str, str]

@app.on_event("startup")
def startup_event():
    seeds_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "generator", "seeds"))
    print(f"Loading or training model using seeds from {seeds_dir}...")
    metrics, importances = predictor.train_from_seeds(seeds_dir)
    print(f"Model ready! Test ROC-AUC: {metrics.get('roc_auc', 0):.4f}, PR-AUC: {metrics.get('pr_auc', 0):.4f}")

@app.get("/health")
def health():
    return {"status": "ok", "service": "recover-ml"}

@app.get("/model/benchmark", response_model=BenchmarkMetricsResponse)
def get_benchmark():
    if predictor.model is None and not predictor.load():
        raise HTTPException(status_code=500, detail="Model is not trained")
    return {
        "metrics": predictor.metrics,
        "feature_importances": predictor.feature_importances,
        "feature_descriptions": FEATURE_DESCRIPTIONS
    }

@app.post("/predict", response_model=PredictResponse)
def predict(req: MandatePredictRequest):
    """
    Predicts probability of recovery for candidate days.
    Strictly predictions, probabilities, and explainability only.
    No decision or mandate lifecycle status fields.
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
        current_due_day=req.due_day,
        credit_days_str=req.credit_days or "",
        daily_burn=req.daily_burn or 0.0
    )

    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
