import os
import joblib
import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import roc_auc_score, precision_score, recall_score
from sklearn.model_selection import train_test_split

import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from utils.feature_engineering import extract_features, infer_salary_day, FEATURE_NAMES

MODEL_PATH = os.path.join(os.path.dirname(__file__), "saved_model.joblib")

class RetryPredictor:
    def __init__(self):
        self.model = None
        self.feature_importances = {}
        self.auc_score = 0.0

    def train_from_seeds(self, seeds_dir: str):
        customers_df = pd.read_csv(os.path.join(seeds_dir, "customers.csv"))
        mandates_df = pd.read_csv(os.path.join(seeds_dir, "mandates.csv"))
        balances_df = pd.read_csv(os.path.join(seeds_dir, "balance_history.csv"))

        # Build lookup for balances: (customer_id, day) -> balance
        balance_lookup = {}
        for _, r in balances_df.iterrows():
            balance_lookup[(r["customer_id"], int(r["day"]))] = float(r["balance"])

        # Customer lookup
        customer_lookup = {}
        for _, c in customers_df.iterrows():
            inferred_sal = infer_salary_day(c.get("credit_days", ""), c.get("credit_amounts", ""))
            customer_lookup[c["customer_id"]] = {
                "monthly_inflow": float(c["monthly_inflow"]),
                "inferred_salary_day": inferred_sal
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
                # Retrieve balance; handle sync gap by forward-filling or defaulting
                bal = balance_lookup.get((cid, day))
                if bal is None:
                    # Look backwards for last known balance
                    prev_days = [balance_lookup.get((cid, d)) for d in range(day - 1, 0, -1) if (cid, d) in balance_lookup]
                    bal = prev_days[0] if prev_days else 0.0

                feats = extract_features(
                    day=day,
                    mandate_amount=amount,
                    monthly_inflow=cust["monthly_inflow"],
                    inferred_salary_day=cust["inferred_salary_day"],
                    category=cat,
                    attempts=attempts,
                    avg_balance_on_day=bal
                )

                label = 1 if bal >= amount else 0
                X.append(feats)
                y.append(label)

        X = np.array(X)
        y = np.array(y)

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.20, random_state=42, stratify=y
        )

        clf = GradientBoostingClassifier(
            n_estimators=80,
            learning_rate=0.1,
            max_depth=4,
            random_state=42
        )
        clf.fit(X_train, y_train)

        y_probs = clf.predict_proba(X_test)[:, 1]
        self.auc_score = float(roc_auc_score(y_test, y_probs))

        importances = clf.feature_importances_
        self.feature_importances = {
            name: float(round(imp, 4)) for name, imp in zip(FEATURE_NAMES, importances)
        }

        self.model = clf
        joblib.dump({
            "model": clf,
            "auc": self.auc_score,
            "importances": self.feature_importances
        }, MODEL_PATH)

        return self.auc_score, self.feature_importances

    def load(self):
        if os.path.exists(MODEL_PATH):
            data = joblib.load(MODEL_PATH)
            self.model = data["model"]
            self.auc_score = data["auc"]
            self.feature_importances = data["importances"]
            return True
        return False

    def predict_candidate_days(self, mandate_amount: float, monthly_inflow: float,
                               inferred_salary_day: int, category: str, attempts: int,
                               balance_curve: dict[int, float], current_due_day: int) -> dict:
        """
        Evaluates candidate retry days over the next 10 days starting from due_day + 1.
        Returns: best_day, predicted_success_prob, candidate_days, feature_importances.
        """
        if self.model is None:
            if not self.load():
                raise RuntimeError("Model not trained or loaded.")

        candidate_results = []

        # Evaluate candidate retry days (next 10 days following due_day)
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
                avg_balance_on_day=bal
            )

            prob = float(self.model.predict_proba([feats])[0, 1])
            candidate_results.append({
                "day": cand_day,
                "prob": round(prob, 3)
            })

        # Find best candidate day (highest predicted probability)
        best_candidate = max(candidate_results, key=lambda x: x["prob"])

        return {
            "best_day": best_candidate["day"],
            "predicted_success_prob": best_candidate["prob"],
            "candidate_days": candidate_results,
            "feature_importances": self.feature_importances
        }

predictor = RetryPredictor()
