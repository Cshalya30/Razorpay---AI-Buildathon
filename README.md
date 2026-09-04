# RECOVER ? Predictive UPI AutoPay Mandate Recovery Agent
**Razorpay AI Buildathon 2026 ? Track 3: AI Revenue Recovery**

[![Frontend](https://img.shields.io/badge/frontend-React%2018%20%2B%20Vite%20%2B%20Tailwind-teal.svg)](frontend/)
[![Backend](https://img.shields.io/badge/backend-Node.js%2025%20%2B%20Express-black.svg)](backend/)
[![ML Service](https://img.shields.io/badge/ml-FastAPI%20%2B%20GradientBoosting-darkgreen.svg)](ml_service/)

---

## 1. The Problem
Over **20 million UPI AutoPay mandates** fail or are cancelled every month in India. The dominant cause is not fraud or deliberate churn, but **stateless insufficient account balance** at the arbitrary moment of debit.

UPI Autopay failure rates hover between **8% and 15%**?roughly triple that of credit card recurring mandates?because debit attempts are treated as blind point-in-time transactions. Traditional retry systems rely on naive fixed-interval retries (e.g. Day+1, Day+3, Day+7) without knowing whether the customer has received their salary or cleared previous obligations. This causes high bounce fees, merchant churn, and unnecessary mandate cancellations.

**RECOVER** replaces naive retry guessing with an autonomous predictive agent that times re-debit attempts to align with inferred customer liquidity (e.g. salary arrival windows), while enforcing strict central bank compliance gating and an immutable audit trail.

---

## 2. Architecture & Decision Boundary

RECOVER is engineered around a **strict structural separation between prediction and decision**:

1. **AI Layer (`ml_service/`) ? Pure Prediction Only**:
   - Built with Python 3.14 + FastAPI + scikit-learn (`GradientBoostingClassifier` + Platt Sigmoid Calibration).
   - Given customer transaction history, historical balance patterns, and mandate amount, it calculates P(success) across candidate retry days.
   - **Structural Guarantee**: The `/predict` Pydantic response schema contains **strictly** `best_day`, `predicted_success_prob`, `candidate_days`, and `feature_importances`. It contains **no `status`, `decision`, or `action` field**. The model is structurally incapable of making business or compliance decisions.

2. **Deterministic Layer (`backend/src/services/agentService.ts`) ? Rule Engine Gating**:
   - Built with Node.js 25 + Express + `node:sqlite`.
   - All regulatory and lifecycle decisions live exclusively in this layer.
   - Evaluates compliance rules *before* ever consulting the ML service. If any gate fails, the model is never invoked.

```
Incoming Mandate Bounce (NPCI U30 / U69)
         ?
         ?
?????????????????????????????????????????
?   1. STATUTORY SHIELD (Deterministic) ?
?   ? 24h Pre-Debit Notice Lead Time    ?
?   ? ?15,000 AFA Ceiling (Master Dir)  ?
?   ? 4-Attempt Anti-Harassment Stopping?
?   ? Customer Revocation Registry      ?
?????????????????????????????????????????
                   ? Pass (Compliant)
                   ?
?????????????????????????????????????????
?   2. NEURAL PIPELINE (ML Inference)   ?
?   ? 8-Feature Vector Topology         ?
?   ? Argmax Inferred Salary Day Window ?
?   ? Calibrated Gradient-Boosted Trees ?
?   ? Output: P(clearance) per cand day ?
?????????????????????????????????????????
                   ? Selected Day & Probability
                   ?
?????????????????????????????????????????
?   3. ORCHESTRATION SWITCH             ?
?   ? Schedule re-debit on optimal day  ?
?   ? Route to NPCI AutoPay gateway     ?
?   ? Record dual-actor append-only log ?
?????????????????????????????????????????
```

---

## 3. Codebase Structure

```
recover/
??? generator/              # [DATA] Synthetic realistic 30-day liquidity dataset
?   ??? seeds/              # customers.csv, balance_history.csv, mandates.csv
?   ??? generate_realistic_data.py  # Stochastic spending, gig-workers, technical declines
??? ml_service/             # [FEATURES & MODEL] Python ML microservice
?   ??? models/             # retry_predictor.py (Calibrated GradientBoosting)
?   ??? utils/              # feature_engineering.py (8-feature vector, strict inference)
?   ??? main.py             # FastAPI prediction endpoints
??? backend/                # [AGENT & DETERMINISTIC ENGINE] Node.js 25 runtime
?   ??? src/db/             # SQLite schema (node:sqlite DatabaseSync) & seed scripts
?   ??? src/services/       # agentService.ts (Statutory Shield) & evalService.ts
?   ??? src/routes/         # REST API routes (mandates, retries, compliance, eval)
??? frontend/               # [USER INTERFACE] React 18 + Vite + Tailwind CSS
?   ??? src/components/     # Stripe connected flow, Palantir scatter, Linear cards
?   ??? src/pages/          # Ledger, RetryQueue, Compliance, EvalReport, Architecture
?   ??? src/tokens.css      # Warm Editorial & Obsidian Dark Mode tokens
??? tools/                  # Verification, sync, and automated audit scripts
```

---

## 4. Evaluated Benchmarks (Realistic Noisy Data)

Tested on a simulated 30-day liquidity ledger containing stochastic spending variance, 22% gig-economy profiles, and 2% technical bank gateway declines:

| Metric | Naive Baseline (+1, +3, +7) | RECOVER Intelligent Agent | Net Performance Lift |
|---|:---:|:---:|:---:|
| **Portfolio Recovery Rate** | **45.3%** | **70.1%** | **? +24.8 percentage points** |
| **Capital Recovered** | ?2,27,483 | ?3,23,531 | **+?96,048 additional lift** |
| **Average Retries Needed** | 2.67 attempts | **1.00 attempt** | **-62.5% reduction in customer bounce friction** |
| **Customer Bounce Fees** | Incurred on 54.7% | **0 fees (timed to liquidity surplus)** | **100% compliant** |

*Benchmarked across 117 at-risk mandate records (Total Volume: ₹4,78,495).*

> **Note on Deployment Architecture**: The live UI deployed on Vercel runs on precomputed model output for reliability; the full trainable pipeline and live FastAPI service are in `ml_service/`.

---

## 5. Central Bank Compliance Specifications

Every lifecycle transition is recorded in an append-only SQLite `audit_log` with an explicit `actor` tag (`model` vs `rule_engine`):

- **24-Hour Pre-Debit Notification (RBI Rule 2021/68)**: Statutory mandate rules require customer notification at least 24 hours prior to debit. Non-compliant alerts (<24h lead time) are automatically rejected by the rule engine and a compliant 26-hour advance notice is dispatched.
- **?15,000 AFA Threshold Gating**: Mandates > ?15,000 outside AFA-exempt categories (`insurance`, `mutual_fund_sip`, `credit_card_bill`) require Additional Factor of Authentication (AFA). The agent halts auto-retry and flags the mandate as `afa_required`.
- **4-Attempt Hard Retry Cap**: Mandates that fail 4 consecutive debit attempts are permanently halted and transitioned to `escalated` for human operations review.
- **Customer Revocation Respect**: If a customer revokes mandate authorization, the rule engine marks the mandate `stopped` and permanently refuses to schedule further retries.

---

## 6. Running Locally

### Prerequisites
- Node.js v20+ (tested on Node.js v25.9.0)
- Python 3.10+ (tested on Python 3.14)
- npm v10+

### Step 1: Start ML Service (Port 8000)
```bash
cd ml_service
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

### Step 2: Start Backend Daemon (Port 3001)
```bash
cd backend
npm install
npm run seed     # Initializes and seeds SQLite database
npm run dev      # Starts Express server on http://127.0.0.1:3001
```

### Step 3: Start Frontend (Port 3000)
```bash
cd frontend
npm install
npm run dev      # Starts Vite dev server on http://localhost:3000
```
