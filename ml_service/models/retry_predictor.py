import os
import joblib
import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import (
    roc_auc_score, 
    average_precision_score, 
    brier_score_loss, 
    accuracy_score,
    precision_score, 
    recall_score
)
from sklearn.model_selection import train_test_split

import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from utils.feature_engineering import (
    extract_features, 
    infer_salary_day, 
    FEATURE_NAMES, 
    FEATURE_DESCRIPTIONS
)

MODEL_PATH = os.path.join(os.path.dirname(__file__), "saved_model.joblib")

class RetryPredictor:
    def __init__(self):
        self.model = None
        self.base_model = None
        self.feature_importances = {}
        self.metrics = {}

    def train_from_seeds(self, seeds_dir: str):
        customers_df = pd.read_csv(os.path.join(seeds_dir, "customers.csv"))
        mandates_df = pd.read_csv(os.path.join(seeds_dir, "mandates.csv"))
        balances_df = pd.read_csv(os.path.join(seeds_dir, "balance_history.csv"))

        # Build balance lookup: (customer_id, day) -> balance
        balance_lookup = {}
        for _, r in balances_df.iterrows():
            balance_lookup[(r["customer_id"], int(r["day"]))] = float(r["balance"])

        # Customer lookup
        customer_lookup = {}
        for _, c in customers_df.iterrows():
            inferred_sal = infer_salary_day(c.get("credit_days", ""), c.get("credit_amounts", ""))
            customer_lookup[c["customer_id"]] = {
                "monthly_inflow": float(c["monthly_inflow"]),
                "inferred_salary_day": inferred_sal,
                "credit_days": str(c.get("credit_days", "")),
                "daily_burn": float(c.get("daily_burn", 0.0))
            }

        X = []
        y = []

        for _, m in mandates_df.iterrows():
            cid = m["customer_id"]
            if cid not in customer_lookup:
                continue
            cust = customer_lookup[cid]
            amount = float(m["mandate_amount"])
            cat = str(m["category"])
            attempts = int(m.get("attempts", 0))

            for day in range(1, 31):
                bal = balance_lookup.get((cid, day))
                if bal is None:
                    prev_days = [balance_lookup.get((cid, d)) for d in range(day - 1, 0, -1) if (cid, d) in balance_lookup]
                    bal = prev_days[0] if prev_days else 0.0

                feats = extract_features(
                    day=day,
                    mandate_amount=amount,
                    monthly_inflow=cust["monthly_inflow"],
                    inferred_salary_day=cust["inferred_salary_day"],
                    category=cat,
                    attempts=attempts,
                    avg_balance_on_day=bal,
                    credit_days_str=cust["credit_days"],
                    daily_burn=cust["daily_burn"]
                )

                label = 1 if bal >= amount else 0
                X.append(feats)
                y.append(label)

        X = np.array(X)
        y = np.array(y)

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.20, random_state=42, stratify=y
        )

        base_clf = GradientBoostingClassifier(
            n_estimators=100,
            learning_rate=0.08,
            max_depth=4,
            subsample=0.85,
            random_state=42
        )
        base_clf.fit(X_train, y_train)

        # Calibrated model via 3-fold cross-validation
        calibrated_clf = CalibratedClassifierCV(estimator=base_clf, method="sigmoid", cv=3)
        calibrated_clf.fit(X_train, y_train)

        y_probs = calibrated_clf.predict_proba(X_test)[:, 1]
        y_preds = (y_probs >= 0.5).astype(int)

        auc = float(roc_auc_score(y_test, y_probs))
        pr_auc = float(average_precision_score(y_test, y_probs))
        brier = float(brier_score_loss(y_test, y_probs))
        accuracy = float(accuracy_score(y_test, y_preds))
        precision = float(precision_score(y_test, y_preds, zero_division=0))
        recall = float(recall_score(y_test, y_preds, zero_division=0))

        importances = base_clf.feature_importances_
        self.feature_importances = {
            name: float(round(imp, 4)) for name, imp in zip(FEATURE_NAMES, importances)
        }

        self.metrics = {
            "roc_auc": round(auc, 4),
            "pr_auc": round(pr_auc, 4),
            "brier_score": round(brier, 4),
            "accuracy": round(accuracy, 4),
            "precision": round(precision, 4),
            "recall": round(recall, 4),
            "n_train": len(X_train),
            "n_test": len(X_test)
        }

        self.model = calibrated_clf
        self.base_model = base_clf
        joblib.dump({
            "model": calibrated_clf,
            "base_model": base_clf,
            "metrics": self.metrics,
            "importances": self.feature_importances
        }, MODEL_PATH)

        return self.metrics, self.feature_importances

    def load(self):
        if os.path.exists(MODEL_PATH):
            data = joblib.load(MODEL_PATH)
            self.model = data["model"]
            self.base_model = data.get("base_model")
            self.metrics = data.get("metrics", {})
            self.feature_importances = data["importances"]
            return True
        return False

    def predict_candidate_days(self, mandate_amount: float, monthly_inflow: float,
                               inferred_salary_day: int, category: str, attempts: int,
                               balance_curve: dict[int, float], current_due_day: int,
                               credit_days_str: str = "", daily_burn: float = 0.0) -> dict:
        if self.model is None and not self.load():
            raise RuntimeError("Model is not initialized or loaded.")

        candidate_results = []

        for offset in range(1, 11):
            cand_day = ((current_due_day + offset - 1) % 30) + 1
            bal = balance_curve.get(cand_day, 0.0)

            feats = extract_features(
                day=cand_day,
                mandate_amount=mandate_amount,
                monthly_inflow=monthly_inflow,
                inferred_salary_day=inferred_salary_day,
                category=category,
                attempts=attempts,
                avg_balance_on_day=bal,
                credit_days_str=credit_days_str,
                daily_burn=daily_burn
            )

            raw_prob = float(self.model.predict_proba([feats])[0, 1])
            prob = max(0.01, min(0.99, raw_prob))

            if prob >= 0.80:
                tier = "high"
            elif prob >= 0.50:
                tier = "moderate"
            else:
                tier = "low"

            candidate_results.append({
                "day": cand_day,
                "prob": round(prob, 3),
                "confidence_tier": tier,
                "projected_balance": round(bal, 2)
            })

        best_candidate = max(candidate_results, key=lambda x: x["prob"])
        best_day = best_candidate["day"]
        best_bal = best_candidate["projected_balance"]

        coverage = best_bal / max(mandate_amount, 1.0)
        
        if coverage >= 1.5:
            reason = f"Day {best_day} selected (+?{best_bal:,.0f} balance surplus, {coverage:.1f}x coverage over ?{mandate_amount:,.0f} debit post-salary window)."
        elif coverage >= 1.0:
            reason = f"Day {best_day} selected (projected ?{best_bal:,.0f} balance clears ?{mandate_amount:,.0f} debit before daily burn)."
        else:
            reason = f"Day {best_day} selected (optimal statistical liquidity window; {best_candidate['prob']*100:.0f}% confidence vs other deficit days)."

        return {
            "best_day": best_day,
            "predicted_success_prob": best_candidate["prob"],
            "candidate_days": candidate_results,
            "feature_importances": self.feature_importances,
            "local_explanation": reason
        }

predictor = RetryPredictor()
