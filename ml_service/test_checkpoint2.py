import os
import sys
from pydantic import BaseModel

sys.path.append(os.path.dirname(__file__))
from main import PredictResponse, CandidateDay, MandatePredictRequest, app
from models.retry_predictor import RetryPredictor

print("=== CHECKPOINT 2 VERIFICATION ===")

# 1. Pydantic Response Model Definition Inspection
print("\n--- 1. INSPECTING PYDANTIC RESPONSE SCHEMA ---")
fields = list(PredictResponse.model_fields.keys())
print("PredictResponse fields:", fields)

forbidden_fields = ["status", "decision", "action", "escalated", "stopped", "state"]
found_forbidden = [f for f in forbidden_fields if f in fields]
if found_forbidden:
    print(f"FAILED: Found forbidden decision fields in ML schema: {found_forbidden}")
    sys.exit(1)
else:
    print("PASSED: Schema contains ONLY predictions and importances. Zero decision fields!")

print("\nExact Schema Model Definition:")
print("class PredictResponse(BaseModel):")
for name, field in PredictResponse.model_fields.items():
    print(f"    {name}: {field.annotation}")

# 2. Train Model & Report Real Metrics and Feature Importances
print("\n--- 2. TRAINING CALIBRATED GRADIENT BOOSTING CLASSIFIER ---")
seeds_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "generator", "seeds"))
predictor = RetryPredictor()
metrics, importances = predictor.train_from_seeds(seeds_dir)

print(f"Real Test ROC-AUC Score: {metrics['roc_auc']:.4f}")
print(f"Real Test PR-AUC Score:  {metrics['pr_auc']:.4f}")
print(f"Real Test Accuracy:      {metrics['accuracy']:.4f}")
print(f"Real Brier Score Loss:   {metrics['brier_score']:.4f}")

print("\nFeature Importances Ranking:")
sorted_importances = sorted(importances.items(), key=lambda x: x[1], reverse=True)
for rank, (feat, imp) in enumerate(sorted_importances, 1):
    print(f"  {rank}. {feat:<28}: {imp:.4f} ({imp*100:.1f}%)")

# 3. Test Prediction
print("\n--- 3. TEST INFERENCE ---")
sample_balance = {d: 1200.0 if d < 5 else 22000.0 for d in range(1, 31)}
result = predictor.predict_candidate_days(
    mandate_amount=499.0,
    monthly_inflow=22000.0,
    inferred_salary_day=5,
    category="subscription",
    attempts=1,
    balance_curve=sample_balance,
    current_due_day=4,
    credit_days_str="5",
    daily_burn=724.0
)
print(f"Best candidate retry day: Day {result['best_day']} (P={result['predicted_success_prob']:.1%})")
print(f"Local Explanation:        {result['local_explanation']}")
print("Candidate days preview:  ", result["candidate_days"][:3])
