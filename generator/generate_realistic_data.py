import os
import csv
import random
import numpy as np
import pandas as pd

random.seed(42)
np.random.seed(42)

SEEDS_DIR = os.path.join(os.path.dirname(__file__), "seeds")
os.makedirs(SEEDS_DIR, exist_ok=True)

# 1. Indian Customer Names & VPA Providers
FIRST_NAMES = [
    "Aarav", "Aditya", "Akash", "Ananya", "Anjali", "Arjun", "Deepak", "Divya",
    "Diya", "Gaurav", "Isha", "Ishaan", "Kabir", "Karan", "Kavya", "Krishna",
    "Lakshmi", "Manish", "Manoj", "Meera", "Neha", "Nikhil", "Pooja", "Pranav",
    "Priya", "Rahul", "Rajesh", "Rhea", "Rohan", "Saanvi", "Sameer", "Sanjay",
    "Shreya", "Siddharth", "Sneha", "Sunil", "Tanvi", "Varun", "Vikram", "Vivek"
]
LAST_NAMES = [
    "Sharma", "Verma", "Patel", "Reddy", "Nair", "Iyer", "Rao", "Mehta",
    "Bhat", "Desai", "Joshi", "Kulkarni", "Hegde", "Gowda", "Pillai", "Bose",
    "Sen", "Das", "Menon", "Malhotra", "Kapoor", "Agarwal", "Bansal", "Gupta"
]
HANDLES = ["paytm", "okhdfcbank", "oksbi", "okicici", "okaxis", "ybl", "kotak"]

# Merchant Catalog
MERCHANTS = {
    "subscription": [
        ("Netflix India", 499), ("Netflix Premium", 649), ("Spotify Premium", 119),
        ("Spotify Family", 179), ("Amazon Prime", 1499), ("YouTube Premium", 189),
        ("Disney+ Hotstar", 899), ("Cult.fit Gym", 1250), ("Times Prime", 1199),
        ("Airtel Fiber", 799), ("Jio Fiber", 599), ("Zomato Gold", 299)
    ],
    "insurance": [
        ("HDFC Life Insurance", 4500), ("ICICI Prudential Life", 5200),
        ("Star Health Insurance", 3800), ("Max Life Insurance", 4200),
        ("Tata AIG Health", 3400), ("LIC Term Plan", 2800),
        ("Bajaj Allianz Health", 4900), ("Care Health Insurance", 3600)
    ],
    "mutual_fund_sip": [
        ("Zerodha Coin SIP", 2500), ("Groww Mutual Fund", 1500),
        ("ICICI Prudential SIP", 3000), ("HDFC Top 100 SIP", 5000),
        ("Nippon India Small Cap", 2000), ("SBI Bluechip Fund", 2500),
        ("Parag Parikh Flexi Cap", 4000), ("Mirae Asset Large Cap", 3500)
    ],
    "credit_card_bill": [
        ("SBI Card AutoPay", 8400), ("HDFC Credit Card AutoPay", 12500),
        ("ICICI Bank Credit Card", 9800), ("Axis Bank Magnus Card", 18500),
        ("Kotak League Card", 6200), ("Standard Chartered Card", 7800)
    ]
}

NUM_CUSTOMERS = 180
NUM_MANDATES = 320

customers = []
balance_history = []

for c_idx in range(1, NUM_CUSTOMERS + 1):
    cid = f"CUST-{c_idx:04d}"
    fname = random.choice(FIRST_NAMES)
    lname = random.choice(LAST_NAMES)
    name = f"{fname} {lname}"
    vpa = f"{fname.lower()}{random.randint(10, 999)}@{random.choice(HANDLES)}"

    is_irregular = random.random() < 0.22  # 22% gig workers / freelancers

    if is_irregular:
        # Irregular: 2 or 3 variable payouts during month
        salary_day = None
        c1 = random.randint(3, 10)
        c2 = random.randint(18, 25)
        credit_days = f"{c1};{c2}"
        total_inflow = random.choice([28000, 35000, 45000, 55000, 70000])
        p1 = round(total_inflow * random.uniform(0.45, 0.55), -2)
        p2 = total_inflow - p1
        credit_amounts = f"{p1};{p2}"
        daily_burn = round(total_inflow / random.uniform(28, 38), 1)
    else:
        # Standard Salaried: Primary salary arrives on 1, 5, 7, 28, or 30
        salary_day = random.choice([1, 1, 5, 5, 5, 7, 28, 30])
        total_inflow = random.choice([25000, 32000, 45000, 55000, 75000, 95000, 120000])
        credit_days = str(salary_day)
        credit_amounts = str(total_inflow)
        daily_burn = round(total_inflow / random.uniform(24, 32), 1)

    customers.append({
        "customer_id": cid,
        "name": name,
        "upi_handle": vpa,
        "irregular_income": is_irregular,
        "salary_day": salary_day if salary_day else "",
        "monthly_inflow": total_inflow,
        "daily_burn": daily_burn,
        "credit_days": credit_days,
        "credit_amounts": credit_amounts
    })

    # Generate 30-day realistic balance curve with stochastic noise
    # Base buffer:
    current_balance = random.uniform(800, 3500)
    
    # Parse credits:
    credits_map = {}
    for d_str, a_str in zip(credit_days.split(";"), credit_amounts.split(";")):
        if d_str.strip():
            day_num = int(d_str)
            # Add stochastic payroll jitter (15% chance of 1-day delay)
            if not is_irregular and random.random() < 0.15:
                day_num = min(30, day_num + 1)
            credits_map[day_num] = float(a_str)

    for day in range(1, 31):
        # 1. Inflow credit if scheduled
        if day in credits_map:
            current_balance += credits_map[day]

        # 2. Daily living expense with stochastic variability (gamma-like / log-normal jitter)
        # 8% chance of large lumpy expense (rent, school fees, utilities on days 5-10)
        expense = daily_burn * random.uniform(0.6, 1.4)
        if 5 <= day <= 10 and random.random() < 0.12:
            expense += daily_burn * random.uniform(3.0, 6.0)
        
        current_balance = max(50.0, current_balance - expense)

        balance_history.append({
            "customer_id": cid,
            "day": day,
            "balance": round(current_balance, 2)
        })

# 2. Generate 320 Mandates
mandates = []
cust_lookup = {c["customer_id"]: c for c in customers}
balances_lookup = {(b["customer_id"], b["day"]): b["balance"] for b in balance_history}

categories = ["subscription", "insurance", "mutual_fund_sip", "credit_card_bill"]
category_weights = [0.45, 0.20, 0.20, 0.15]

for m_idx in range(1, NUM_MANDATES + 1):
    mid = f"MDT-{1000 + m_idx}"
    cid = f"CUST-{(m_idx % NUM_CUSTOMERS) + 1:04d}"
    cust = cust_lookup[cid]

    cat = random.choices(categories, weights=category_weights)[0]
    merch_name, base_amount = random.choice(MERCHANTS[cat])
    
    # Jitter amount slightly
    if cat == "credit_card_bill":
        amount = round(base_amount * random.uniform(0.7, 1.3), -1)
    else:
        amount = base_amount

    # Scheduled due day
    # Often bills fall on 1st, 5th, 10th, 15th, 20th, 25th
    due_day = random.choice([2, 4, 7, 10, 12, 15, 18, 20, 22, 24, 26, 28])

    # Check balance on due day
    due_balance = balances_lookup.get((cid, due_day), 500.0)
    
    # Stochastic technical bank failure (2% rate)
    is_tech_fail = random.random() < 0.02
    
    # User revocation (3% churn rate)
    is_revoked = random.random() < 0.025

    if is_revoked:
        outcome = "user_revoked"
        attempts = random.choice([0, 1])
    elif due_balance < amount or is_tech_fail:
        # Failed on initial debit
        attempts = random.choice([1, 2, 3])
        outcome = "failed_insufficient_balance"
    else:
        # Cleared on initial debit
        attempts = 0
        outcome = "success"

    mandates.append({
        "mandate_id": mid,
        "customer_id": cid,
        "merchant_name": merch_name,
        "category": cat,
        "mandate_amount": amount,
        "due_day": due_day,
        "outcome": outcome,
        "attempts": attempts
    })

# Write CSV files
with open(os.path.join(SEEDS_DIR, "customers.csv"), "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=list(customers[0].keys()))
    writer.writeheader()
    writer.writerows(customers)

with open(os.path.join(SEEDS_DIR, "balance_history.csv"), "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["customer_id", "day", "balance"])
    writer.writeheader()
    writer.writerows(balance_history)

with open(os.path.join(SEEDS_DIR, "mandates.csv"), "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=list(mandates[0].keys()))
    writer.writeheader()
    writer.writerows(mandates)

print(f"Generated realistic seeds: {len(customers)} customers, {len(balance_history)} balance records, {len(mandates)} mandates.")
