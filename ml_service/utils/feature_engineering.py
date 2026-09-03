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
    Infers salary arrival day as the day of largest monthly inflow credit.
    For regular customers, this matches their salary date.
    For irregular/gig workers (15%), this heuristic is noisy as expected.
    """
    if not credit_days_str or not credit_amounts_str or pd.isna(credit_days_str):
        return 1  # Default fallback

    try:
        days = [int(x) for x in str(credit_days_str).split(';') if x.strip()]
        amounts = [float(x) for x in str(credit_amounts_str).split(';') if x.strip()]
        if not days or not amounts:
            return 1
        max_idx = int(np.argmax(amounts))
        return days[max_idx]
    except Exception:
        return 1

def extract_features(day: int, mandate_amount: float, monthly_inflow: float, 
                     inferred_salary_day: int, category: str, attempts: int,
                     avg_balance_on_day: float) -> list[float]:
    """
    Engineers the 6 core features for a candidate retry day.
    """
    # 1. Days since salary credit (directional circular distance 0..29)
    days_since_salary = (day - inferred_salary_day) % 30

    # 2. Ratio of mandate amount to typical monthly inflow
    amount_ratio = mandate_amount / max(monthly_inflow, 1000.0)

    # 3. Calendar day of month (1..30)
    day_of_month = float(day)

    # 4. Number of prior failed retry attempts
    prior_attempts = float(attempts)

    # 5. Category code
    category_code = float(CATEGORY_MAP.get(str(category).lower(), 4))

    # 6. Historical balance on this day
    balance_on_day = float(avg_balance_on_day)

    return [
        days_since_salary,
        amount_ratio,
        day_of_month,
        prior_attempts,
        category_code,
        balance_on_day
    ]

FEATURE_NAMES = [
    "days_since_inferred_salary",
    "amount_to_inflow_ratio",
    "day_of_month",
    "prior_attempts",
    "category_code",
    "historical_balance"
]
