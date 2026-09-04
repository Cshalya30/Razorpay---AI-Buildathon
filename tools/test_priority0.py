import sys, os
sys.path.append(r'C:\Users\Chirantan\.gemini\antigravity\scratch\recover\ml_service')
import pandas as pd
import numpy as np
from models.retry_predictor import predictor
from utils.feature_engineering import extract_features, infer_salary_day, FEATURE_NAMES

predictor.load()

seeds_dir = 'generator/seeds'
customers_df = pd.read_csv(os.path.join(seeds_dir, 'customers.csv'))
mandates_df = pd.read_csv(os.path.join(seeds_dir, 'mandates.csv'))
balances_df = pd.read_csv(os.path.join(seeds_dir, 'balance_history.csv'))

balance_lookup = {}
for _, r in balances_df.iterrows():
    balance_lookup[(r['customer_id'], int(r['day']))] = float(r['balance'])

cust_dict = {c['customer_id']: c for _, c in customers_df.iterrows()}

print('Testing 10 records for Priority 0.1:')
records_data = []
for i in range(10):
    m = mandates_df.iloc[i]
    c = cust_dict[m['customer_id']]
    inferred_sal = infer_salary_day(c.get('credit_days', ''), c.get('credit_amounts', ''))
    
    due_day = int(m['due_day'])
    test_day = ((due_day + 2 - 1) % 30) + 1
    bal = balance_lookup.get((m['customer_id'], test_day), 5000.0)
    
    feats = extract_features(
        day=test_day,
        mandate_amount=float(m['mandate_amount']),
        monthly_inflow=float(c['monthly_inflow']),
        inferred_salary_day=inferred_sal,
        category=m['category'],
        attempts=int(m['attempts']),
        avg_balance_on_day=bal,
        credit_days_str=str(c.get('credit_days', '')),
        daily_burn=float(c.get('daily_burn', 0.0))
    )
    
    prob = float(predictor.model.predict_proba([feats])[0, 1])
    records_data.append({
        'mandate_id': m['mandate_id'],
        'amount': m['mandate_amount'],
        'category': m['category'],
        'due_day': due_day,
        'test_day': test_day,
        'feats': [round(x, 2) for x in feats],
        'predicted_prob': round(prob, 4)
    })

for r in records_data:
    print(f"{r['mandate_id']} | amt={r['amount']:>7} | cat={r['category']:<16} | day {r['due_day']}->{r['test_day']} | prob={r['predicted_prob']:.4f}")
    print(f"   Features: {r['feats']}")

probs = [r['predicted_prob'] for r in records_data]
print(f"\nProbabilities min: {min(probs):.4f}, max: {max(probs):.4f}, std: {np.std(probs):.4f}")
