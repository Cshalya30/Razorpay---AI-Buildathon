import sys, os
sys.path.append(r'C:\Users\Chirantan\.gemini\antigravity\scratch\recover\ml_service')
import pandas as pd
import numpy as np
from models.retry_predictor import predictor
from utils.feature_engineering import infer_salary_day, extract_features

predictor.load()

seeds_dir = 'generator/seeds'
customers_df = pd.read_csv(os.path.join(seeds_dir, 'customers.csv'))
mandates_df = pd.read_csv(os.path.join(seeds_dir, 'mandates.csv'))
balances_df = pd.read_csv(os.path.join(seeds_dir, 'balance_history.csv'))

balances = {}
for _, r in balances_df.iterrows():
    balances[(r['customer_id'], int(r['day']))] = float(r['balance'])

customers = {r['customer_id']: r for _, r in customers_df.iterrows()}

failed_mandates = mandates_df[mandates_df['outcome'] == 'failed_insufficient_balance'].copy()
total_at_risk = failed_mandates['mandate_amount'].sum()
n_failed = len(failed_mandates)

# 1. Naive Baseline Evaluation
naive_recovered_count = 0
naive_recovered_amount = 0
naive_attempts_total = 0

for _, m in failed_mandates.iterrows():
    due = int(m['due_day'])
    amt = float(m['mandate_amount'])
    cid = m['customer_id']
    
    # Retry on due+1, due+3, due+7
    candidate_days = [((due + 1 - 1) % 30) + 1, ((due + 3 - 1) % 30) + 1, ((due + 7 - 1) % 30) + 1]
    
    recovered = False
    for day in candidate_days:
        naive_attempts_total += 1
        bal = balances.get((cid, day), 0.0)
        if bal >= amt:
            recovered = True
            break
    
    if recovered:
        naive_recovered_count += 1
        naive_recovered_amount += amt

# 2. Intelligent RECOVER Agent Evaluation
model_recovered_count = 0
model_recovered_amount = 0
model_attempts_total = 0

predictions_log = []

for _, m in failed_mandates.iterrows():
    cid = m['customer_id']
    c = customers[cid]
    amt = float(m['mandate_amount'])
    due = int(m['due_day'])
    
    inferred_sal = infer_salary_day(c.get('credit_days', ''), c.get('credit_amounts', ''))
    
    # Customer balance curve dictionary
    c_bal_curve = {d: balances.get((cid, d), 0.0) for d in range(1, 31)}
    
    pred = predictor.predict_candidate_days(
        mandate_amount=amt,
        monthly_inflow=float(c['monthly_inflow']),
        inferred_salary_day=inferred_sal,
        category=m['category'],
        attempts=int(m.get('attempts', 1)),
        balance_curve=c_bal_curve,
        current_due_day=due,
        credit_days_str=str(c.get('credit_days', '')),
        daily_burn=float(c.get('daily_burn', 0.0))
    )
    
    best_day = pred['best_day']
    prob = pred['predicted_success_prob']
    predictions_log.append({
        'mandate_id': m['mandate_id'],
        'best_day': best_day,
        'prob': prob,
        'amount': amt,
        'category': m['category'],
        'explanation': pred['local_explanation']
    })
    
    model_attempts_total += 1
    actual_bal = balances.get((cid, best_day), 0.0)
    
    if actual_bal >= amt:
        model_recovered_count += 1
        model_recovered_amount += amt

naive_rate = (naive_recovered_count / n_failed) * 100
model_rate = (model_recovered_count / n_failed) * 100

print(f"Total at-risk mandates: {n_failed} (Total Volume: Rs. {total_at_risk:,.0f})")
print(f"\n--- NAIVE BASELINE (+1, +3, +7) ---")
print(f"Recovered: {naive_recovered_count}/{n_failed} ({naive_rate:.1f}%)")
print(f"Recovered Capital: Rs. {naive_recovered_amount:,.0f}")
print(f"Average Retries: {naive_attempts_total / n_failed:.2f} attempts")

print(f"\n--- RECOVER INTELLIGENT AGENT ---")
print(f"Recovered: {model_recovered_count}/{n_failed} ({model_rate:.1f}%)")
print(f"Recovered Capital: Rs. {model_recovered_amount:,.0f}")
print(f"Average Retries: {model_attempts_total / n_failed:.2f} attempts")
print(f"Net Lift: +{model_rate - naive_rate:.1f} percentage points (+Rs. {model_recovered_amount - naive_recovered_amount:,.0f})")

# Check predictions variation
probs = [p['prob'] for p in predictions_log]
print(f"\n--- CONFIDENCE DISTRIBUTION CHECK across {len(probs)} records ---")
print(f"Min: {min(probs):.3f} | Max: {max(probs):.3f} | Mean: {np.mean(probs):.3f} | Std Dev: {np.std(probs):.4f}")
print(f"Automated Check (std > 0.05): {'PASS' if np.std(probs) > 0.05 else 'FAIL'}")

print("\nSample 10 Predictions:")
for p in predictions_log[:10]:
    print(f"{p['mandate_id']} | Day {p['best_day']:2d} | Prob: {p['prob']*100:.1f}% | Rs. {p['amount']:>6} | {p['explanation']}")
