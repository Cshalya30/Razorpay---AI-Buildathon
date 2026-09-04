import pandas as pd
import numpy as np

CATEGORY_MAP = {
    'subscription': 0,
    'insurance': 1,
    'mutual_fund_sip': 2,
    'credit_card_bill': 3,
    'other': 4
}

def infer_salary_day(credit_days_str: str, credit_amounts_str: str) -> int:
    """
    CRITICAL STATUTORY / ML AUDIT INTEGRITY BOUNDARY:
    Computes salary day as a strictly INFERRED statistical value from recurring
    inbound transaction history. MUST NEVER accept or read ground-truth `salary_day`.
    """
    assert not isinstance(credit_days_str, int), "LEAKAGE_PREVENTION_ASSERTION: Ground-truth integer salary_day cannot be passed."
    if not credit_days_str or not credit_amounts_str or pd.isna(credit_days_str):
        return 1
    try:
        days = [int(x) for x in str(credit_days_str).split(';') if x.strip()]
        amounts = [float(x) for x in str(credit_amounts_str).split(';') if x.strip()]
        if not days or not amounts:
            return 1
        max_idx = int(np.argmax(amounts))
        return days[max_idx]
    except Exception:
        return 1

def distance_to_nearest_credit(day: int, credit_days_str: str) -> float:
    if not credit_days_str or pd.isna(credit_days_str):
        return float((day - 1) % 30)
    try:
        credit_days = [int(x) for x in str(credit_days_str).split(';') if x.strip()]
        if not credit_days:
            return float((day - 1) % 30)
        distances = [min((day - cd) % 30, (cd - day) % 30) for cd in credit_days]
        return float(min(distances))
    except Exception:
        return float((day - 1) % 30)

def extract_features(day: int, mandate_amount: float, monthly_inflow: float, 
                     inferred_salary_day: int, category: str, attempts: int,
                     avg_balance_on_day: float, credit_days_str: str = "",
                     daily_burn: float = 0.0) -> list[float]:
    # 1. Primary salary distance
    days_since_salary = float((day - inferred_salary_day) % 30)

    # 2. Nearest cash credit proximity
    nearest_credit = distance_to_nearest_credit(day, credit_days_str)

    # 3. Mandate amount ratio to typical monthly inflow
    inflow = max(float(monthly_inflow), 1000.0)
    amount_ratio = float(mandate_amount) / inflow

    # 4. Inflow liquidity estimate based on salary proximity
    salary_proximity_score = float(max(0, 10 - days_since_salary))

    # 5. Burn-adjusted headroom
    burn = float(daily_burn) if daily_burn > 0 else (inflow / 25.0)
    burn_headroom = float(max(avg_balance_on_day, 0.0) - (burn * 2.0))

    # 6. Calendar day
    day_of_month = float(day)

    # 7. Category code
    category_code = float(CATEGORY_MAP.get(str(category).lower(), 4))

    # 8. Prior attempts count
    prior_attempts = float(attempts)

    return [
        days_since_salary,
        nearest_credit,
        amount_ratio,
        salary_proximity_score,
        burn_headroom,
        day_of_month,
        category_code,
        prior_attempts
    ]

FEATURE_NAMES = [
    "days_since_salary",
    "nearest_credit_distance",
    "amount_to_inflow_ratio",
    "salary_proximity_score",
    "burn_adjusted_headroom",
    "day_of_month",
    "category_code",
    "prior_attempts"
]

FEATURE_DESCRIPTIONS = {
    "days_since_salary": "Days elapsed since primary monthly salary credit",
    "nearest_credit_distance": "Proximity to closest cash credit or gig payment",
    "amount_to_inflow_ratio": "Mandate debit size as proportion of monthly inflow",
    "salary_proximity_score": "Liquidity window score following salary arrival",
    "burn_adjusted_headroom": "Projected account surplus after 2-day daily burn",
    "day_of_month": "Calendar day effect across 30-day settlement cycle",
    "category_code": "Regulatory category (Subscription, Insurance, SIP, Card)",
    "prior_attempts": "Number of previous failed debit attempts"
}
