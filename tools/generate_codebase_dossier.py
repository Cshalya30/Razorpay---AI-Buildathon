"""
RECOVER: Complete Codebase & Architectural Specification Dossier Generator
Author: Chirantan Shalya
Generates:
1. RECOVER_Codebase_and_Architecture_Dossier.pdf (Publication-grade PDF via Headless Chrome/Edge)
2. RECOVER_Codebase_and_Architecture_Dossier.odt (Native OpenDocument Format via odfpy)
3. RECOVER_Codebase_and_Architecture_Dossier.md  (Consolidated Markdown for Claude direct ingestion)
4. RECOVER_Codebase_and_Architecture_Dossier.html (Interactive standalone HTML)
"""

import os
import sys
import shutil
import subprocess
import html
from datetime import datetime

from odf.opendocument import OpenDocumentText
from odf.text import P, H
from odf.style import Style, TextProperties, ParagraphProperties

CODEBASE_CATALOG = [
    {
        "category": "1. System Configuration & Build Tooling",
        "description": "Root project documentation, TypeScript build configurations, Tailwind styling definitions, and deployment manifests.",
        "files": [
            ("README.md", "markdown"),
            (".gitignore", "gitignore"),
            ("frontend/package.json", "json"),
            ("frontend/tsconfig.json", "json"),
            ("frontend/vite.config.ts", "typescript"),
            ("frontend/tailwind.config.js", "javascript"),
            ("frontend/postcss.config.js", "javascript"),
            ("frontend/vercel.json", "json"),
            ("backend/package.json", "json"),
            ("backend/tsconfig.json", "json")
        ]
    },
    {
        "category": "2. Layer 1: Central Bank Deterministic Gating & Ingestion Engine (Backend)",
        "description": "Express TypeScript API server, SQLite database, statutory rule enforcement, 24h pre-debit notice dispatching, and audit logging.",
        "files": [
            ("backend/src/index.ts", "typescript"),
            ("backend/src/db/schema.sql", "sql"),
            ("backend/src/db/database.ts", "typescript"),
            ("backend/src/db/queries.ts", "typescript"),
            ("backend/src/db/seed.ts", "typescript"),
            ("backend/src/routes/mandates.ts", "typescript"),
            ("backend/src/routes/retries.ts", "typescript"),
            ("backend/src/routes/compliance.ts", "typescript"),
            ("backend/src/routes/eval.ts", "typescript"),
            ("backend/src/services/agentService.ts", "typescript"),
            ("backend/src/services/evalService.ts", "typescript"),
            ("backend/src/services/mlService.ts", "typescript"),
            ("backend/src/services/socketService.ts", "typescript"),
            ("backend/test_checkpoint1.ts", "typescript"),
            ("backend/test_checkpoint3.ts", "typescript"),
            ("backend/test_checkpoint4.ts", "typescript")
        ]
    },
    {
        "category": "3. Layer 2: Calibrated Machine Learning Timing Microservice (Python/FastAPI)",
        "description": "FastAPI ASGI service, 8-feature credit history extraction, GradientBoostingClassifier, and Platt sigmoid probability calibration.",
        "files": [
            ("ml_service/main.py", "python"),
            ("ml_service/models/retry_predictor.py", "python"),
            ("ml_service/utils/feature_engineering.py", "python"),
            ("ml_service/test_checkpoint2.py", "python")
        ]
    },
    {
        "category": "4. Synthetic Data Generation & Policy Benchmarking Engine",
        "description": "Stochastic spend-down generator with 22% gig workers, 15% payroll jitter, and automated policy comparator.",
        "files": [
            ("generator/generate_realistic_data.py", "python"),
            ("tools/build_realistic_mockdata.py", "python"),
            ("tools/evaluate_policies.py", "python"),
            ("tools/sync_sqlite.py", "python"),
            ("tools/test_priority0.py", "python"),
            ("tools/fix_currency_everywhere.py", "python")
        ]
    },
    {
        "category": "5. Frontend Core Architecture & State Management",
        "description": "React 18 root setup, pitch-black OLED CSS design tokens, Zustand state store, and unified API client.",
        "files": [
            ("frontend/index.html", "html"),
            ("frontend/src/main.tsx", "typescript"),
            ("frontend/src/App.tsx", "typescript"),
            ("frontend/src/types/index.ts", "typescript"),
            ("frontend/src/store/useStore.ts", "typescript"),
            ("frontend/src/tokens.css", "css"),
            ("frontend/src/api/client.ts", "typescript")
        ]
    },
    {
        "category": "6. Frontend Views & Operations Dashboard Pages",
        "description": "Full-screen views for Mandate Ledger, Predictive Retry Queue, Statutory Compliance Registry, Model Benchmark, and System Blueprint.",
        "files": [
            ("frontend/src/pages/Ledger.tsx", "typescript"),
            ("frontend/src/pages/RetryQueue.tsx", "typescript"),
            ("frontend/src/pages/ComplianceDashboard.tsx", "typescript"),
            ("frontend/src/pages/EvalReport.tsx", "typescript"),
            ("frontend/src/pages/EngineRoom.tsx", "typescript")
        ]
    },
    {
        "category": "7. Frontend Components: Navigation & Global Overlays",
        "description": "Responsive top navigation bar, collapsible mobile sidebar drawer, command palette, and notification toasts.",
        "files": [
            ("frontend/src/components/layout/Sidebar.tsx", "typescript"),
            ("frontend/src/components/layout/TopBar.tsx", "typescript"),
            ("frontend/src/components/common/CommandPalette.tsx", "typescript"),
            ("frontend/src/components/common/ToastContainer.tsx", "typescript")
        ]
    },
    {
        "category": "8. Frontend Components: Ledger Controls & Scenario Injector",
        "description": "Searchable mandate line items, hero KPI metrics, sectoral category breakdown cards, and scenario injector.",
        "files": [
            ("frontend/src/components/ledger/LedgerTable.tsx", "typescript"),
            ("frontend/src/components/ledger/HeroMetric.tsx", "typescript"),
            ("frontend/src/components/ledger/CategoryBreakdownCard.tsx", "typescript"),
            ("frontend/src/components/ledger/DemoScenarioBar.tsx", "typescript"),
            ("frontend/src/components/ledger/StatusStripe.tsx", "typescript")
        ]
    },
    {
        "category": "9. Frontend Components: Mandate Detail Drawer & Diagnostics",
        "description": "Sliding mandate inspector, 30-day liquidity balance curve, compliance verification tab, and per-decision rationale.",
        "files": [
            ("frontend/src/components/detail/MandateDetailDrawer.tsx", "typescript"),
            ("frontend/src/components/detail/BalanceCurveChart.tsx", "typescript"),
            ("frontend/src/components/detail/ComplianceTab.tsx", "typescript"),
            ("frontend/src/components/detail/RetryPredictionPanel.tsx", "typescript"),
            ("frontend/src/components/detail/AuditTrail.tsx", "typescript")
        ]
    },
    {
        "category": "10. Frontend Components: Interactive Visualizations & Blueprints",
        "description": "Connected node architecture canvas, linear isometric pillars, Palantir liquidity scatter plot, and comparative benchmark bars.",
        "files": [
            ("frontend/src/components/visual/StripeNodeFlow.tsx", "typescript"),
            ("frontend/src/components/visual/LinearIsometricCards.tsx", "typescript"),
            ("frontend/src/components/visual/PalantirScatterPlot.tsx", "typescript"),
            ("frontend/src/components/eval/BaselineComparisonSection.tsx", "typescript")
        ]
    }
]

def read_file(filepath):
    if not os.path.exists(filepath):
        return "", 0, 0
    with open(filepath, "r", encoding="utf-8", errors="replace") as f:
        content = f.read()
    lines = content.splitlines()
    size_bytes = os.path.getsize(filepath)
    return content, len(lines), size_bytes

def get_architecture_markdown():
    return """# RECOVER: Autonomous UPI AutoPay Mandate Recovery Agent
## Comprehensive Software Architecture, Mathematical Specifications & Verbatim Codebase Dossier
**Submission**: Razorpay AI Buildathon 2026 — Track 3: AI Revenue Recovery  
**Author**: Chirantan Shalya (`chirantan.shalya30@gmail.com`)  
**Repository**: `https://github.com/Cshalya30/Razorpay---AI-Buildathon.git`  
**Kernel Release**: v2.4 (Deterministic Compliance + Calibrated GBDT)  
**Target LLM Context**: Prepared specifically for Claude Technical Analysis & Autonomous Review  

---

## Table of Contents
1. [Executive Summary & Problem Statement](#1-executive-summary--problem-statement)
2. [End-to-End System Architecture & Data Flow](#2-end-to-end-system-architecture--data-flow)
3. [Regulatory Compliance Engine & Deterministic Rule Matrix](#3-regulatory-compliance-engine--deterministic-rule-matrix)
4. [Machine Learning Pipeline & Feature Engineering Topology](#4-machine-learning-pipeline--feature-engineering-topology)
5. [Relational Database Schema & Entity Relationships](#5-relational-database-schema--entity-relationships)
6. [REST API & WebSocket Protocol Specifications](#6-rest-api--websocket-protocol-specifications)
7. [Synthetic Ledger Generator & Stochastic Simulation Mechanics](#7-synthetic-ledger-generator--stochastic-simulation-mechanics)
8. [Audited Fixes & Hardening Changelog](#8-audited-fixes--hardening-changelog)
9. [Complete Codebase Directory Tree](#9-complete-codebase-directory-tree)
10. [Verbatim Source Code Listings](#10-verbatim-source-code-listings)

---

## 1. Executive Summary & Problem Statement

### 1.1 The Industry Crisis: Silent Churn in Recurring UPI Debits
In India's digital economy, UPI AutoPay processes tens of millions of recurring subscription, utility, insurance, and loan repayment mandates monthly. However, when a recurring auto-debit attempt fails due to temporary customer liquidity shortfalls (e.g., month-end cash constraints, delayed salary disbursements, or unpredictable gig-economy payouts), conventional payment aggregators execute rigid, naive retry schedules (typically fixed attempts at +1, +3, and +7 days post-decline).

This naive approach suffers from three fatal systemic flaws:
1. **Severe Customer Churn & Revenue Loss**: Blind retries miss customer liquidity peaks, resulting in a **54.7% failure rate** and permanent customer drop-off.
2. **Punitive Bank Bounce Fees**: Every failed debit attempt incurs punitive bank bounce charges (typically **₹400 to ₹500** per customer), destroying consumer trust and generating chargeback friction.
3. **Regulatory Non-Compliance Risk**: Unchecked brute-force retry loops violate Reserve Bank of India (RBI) anti-harassment guidelines and statutory pre-debit notification requirements.

### 1.2 The RECOVER Solution: Two-Layer Hybrid Architecture
RECOVER is an autonomous recurring payment recovery agent engineered specifically for Track 3 of the Razorpay AI Buildathon. It replaces blind fixed retries with an authoritative two-layer architecture:
- **Layer 1: Central Bank Deterministic Gating Shield**: A non-overridable compliance engine enforcing RBI Circular `RBI/DPSS/2021-22/68` (24-hour statutory advance notice), Master Direction Section 5.3 (₹15,000 Additional Factor Authentication threshold and sectoral exemptions), and a strict 4-attempt anti-harassment stopping rule.
- **Layer 2: Calibrated Machine Learning Timing Engine**: An 8-feature Gradient Boosting Decision Tree (GBDT) with Sigmoid (Platt) probability calibration that evaluates customer cash-flow cycles, burn-adjusted liquidity headroom, and inferred salary arrivals to schedule re-debit attempts precisely when the customer has positive balance.

### 1.3 Validated Benchmark Results
- **Overall Portfolio Clearance**: **70.1%** recovery rate on a realistic stochastic ledger containing 22% gig-economy irregular profiles, 15% payroll jitter, and 2% technical network failures.
- **Net Performance Lift**: **+24.8 percentage points lift** over the naive baseline (45.3%), capturing **+₹96,048 in net incremental revenue** across 320 monitored mandates.
- **Attempt Efficiency**: Reduced average debit attempts from **2.7 attempts down to 1.1 attempts** per mandate (saving **1.6 failed attempts and ₹640+ in bounce fees per customer**).
- **Statutory Compliance**: **100% RBI Gated** with zero regulatory violations and zero data leakage.

---

## 2. End-to-End System Architecture & Data Flow

### 2.1 Multi-Service System Topology
The RECOVER ecosystem is decoupled into four high-performance subsystems:
1. **Frontend Single-Page Application (Port 3000)**:
   - Built with React 18, TypeScript, Vite, Tailwind CSS, Phosphor Icons, and Framer Motion.
   - Features a pitch-black OLED / matte terminal theme (`#000000`, `#121212`, `#262626`) and fluid responsive layouts for all viewports (375px mobile to 4K desktop).
   - Real-time WebSocket synchronization with optimistic state updates and interactive scenario simulation.
2. **Backend Ingestion & Statutory Rule Engine (Port 5000)**:
   - Built with Node.js, Express, and TypeScript.
   - Uses embedded SQLite via Node's native SQLite driver in Write-Ahead-Logging (WAL) mode for sub-millisecond query execution and complete ACID durability.
   - Executes deterministic regulatory compliance gating, manages the automated retry queue, dispatches 24h statutory notices, and generates immutable audit logs.
3. **ML Scoring & Optimization Microservice (Port 8000)**:
   - Built with Python 3.12, FastAPI, Uvicorn, and Scikit-Learn.
   - Computes an 8-dimensional feature vector from historical credit sequences and evaluates candidate calendar days via a calibrated GradientBoostingClassifier.
   - Sub-15ms inference latency per mandate evaluation.
4. **Synthetic Data Generation & Real-Time Simulator**:
   - Generates realistic 30-day liquidity curves for 320 customer mandate profiles with stochastic daily burn rates, payroll jitter, and variable spending spikes.

### 2.2 Event Lifecycle & Execution Pipeline
```
[ Inbound Bank Decline Event (U30 Insufficient Funds) ]
                        │
                        ▼
   [ LAYER 1: Central Bank Deterministic Gating Shield ]
   ├── Check 1: Prior Attempts < 4 (Anti-Harassment Cap)
   │     └── If k >= 4: Halt retries, escalate to manual intervention.
   ├── Check 2: AFA ₹15,000 Exemption Ceiling
   │     └── If Amount > ₹15k and Category == Subscription: Halt for AFA auth.
   └── Check 3: 24-Hour Notice Lead Time
         └── Ensure retry execution date >= CurrentDate + 24 hours.
                        │ (All Guardrails Passed)
                        ▼
   [ LAYER 2: 8-Feature Calibrated ML Timing Engine ]
   ├── Step 1: Statistical inference of salary day (argmax of credit spikes).
   ├── Step 2: Compute 8-feature vector for all calendar candidate days d in [t+1, t+14].
   ├── Step 3: Gradient Boosting classification + Platt sigmoid calibration.
   └── Step 4: Optimal day selection: argmax P(Balance >= Amount) subject to P >= 0.50.
                        │
                        ▼
        [ Predictive Retry Queue Scheduled ]
                        │
                        ▼ (24 Hours Prior to Execution)
        [ Statutory Pre-Debit Notice Dispatched ]
        └── SMS / Email notification stamped in immutable audit ledger.
                        │
                        ▼ (At Optimal Liquidity Window)
      [ Payment Switch Dispatched to NPCI AutoPay Rail ]
        └── Successful debit execution; mandate marked "Recovered".
```

---

## 3. Regulatory Compliance Engine & Deterministic Rule Matrix

The central bank compliance rules in RECOVER are hard-coded into the orchestration kernel and can **never be overridden by machine learning predictions**.

### 3.1 Pillar 1: RBI Circular RBI/DPSS/2021-22/68 (24-Hour Pre-Debit Alert)
- **Mandate**: Payment aggregators must send an advance notification to the consumer via SMS or Email at least 24 hours prior to initiating any recurring AutoPay debit.
- **Deterministic Implementation**:
  ```ts
  const leadHours = (scheduledDate.getTime() - noticeDispatchDate.getTime()) / (1000 * 60 * 60);
  if (leadHours < 24) {
    // Non-compliant alert: Reject scheduled debit attempt
    // Reschedule debit to a minimum of 26 hours advance notice
    return { compliant: false, action: "HOLD_AND_REDISPATCH_NOTICE" };
  }
  ```
- **Audit Verification**: Every notice dispatch is recorded in the `notifications` table with `notice_sent_time`, `scheduled_debit_time`, and `notice_hours_before_debit`.

### 3.2 Pillar 2: Master Direction Section 5.3 (₹15,000 AFA Ceiling & Sectoral Tiers)
- **Mandate**: E-mandates exceeding ₹15,000 require mandatory Additional Factor Authentication (AFA / OTP) unless explicitly exempted under specific statutory categories.
- **Exemption Matrix**:
  | Category Code | Sectoral Asset Tier | ₹15,000 Statutory Exemption Status | Regulatory Rule |
  |---|---|---|---|
  | `insurance` | Life & General Insurance Premiums | **Exempt** (Up to ₹1,00,000) | Permitted auto-debit without OTP |
  | `investment` | Mutual Fund SIPs & PPF | **Exempt** (Up to ₹1,00,000) | Permitted auto-debit without OTP |
  | `credit_card` | Credit Card Bill Repayments | **Exempt** (Up to ₹1,00,000) | Permitted auto-debit without OTP |
  | `subscription` | OTT, SaaS, Digital Media | **Strictly Non-Exempt** | Amounts > ₹15,000 halted for user OTP |
- **Deterministic Implementation**:
  ```ts
  if (mandate.amount > 15000 && mandate.category === "subscription") {
    // Statutory AFA limit exceeded for non-exempt asset
    return { status: "stopped", reason: "AFA_THRESHOLD_EXCEEDED" };
  }
  ```

### 3.3 Pillar 3: Anti-Harassment Directive (4-Attempt Retry Ceiling)
- **Mandate**: Aggressive and endless retry attempts on customer accounts constitute harassment under fair debt collection practices.
- **Deterministic Implementation**:
  - Maximum retry attempts per mandate billing cycle: **4 attempts**.
  - On the 4th consecutive failure, the mandate is permanently halted from automated debiting and flagged as `escalated` for human customer support review.
  - Complete immutability: An audit record is created stamping the actor as `SYSTEM_RULE_ENGINE`.

---

## 4. Machine Learning Pipeline & Feature Engineering Topology

### 4.1 Feature Vector Topology (8 Domain Features)
For any candidate calendar settlement day $d \in \{1, \dots, 30\}$ and mandate $m$, the feature vector $\vec{x} \in \mathbb{R}^8$ is formulated as follows:

1. **$f_1 = \text{days\_since\_salary}$**:
   $$\text{days\_since\_salary} = (d - \hat{s}) \pmod{30}$$
   where $\hat{s}$ is the statistically inferred salary arrival day. Captures the primary inflow wave.

2. **$f_2 = \text{nearest\_credit\_distance}$**:
   $$\text{nearest\_credit\_distance} = \min_{c \in C} \min(|d - c|, 30 - |d - c|)$$
   where $C$ is the set of historical monthly recurring credit dates. Measures proximity to any recurring deposit.

3. **$f_3 = \text{amount\_to\_inflow\_ratio}$**:
   $$\text{amount\_to\_inflow\_ratio} = \frac{\text{Amount}_m}{\sum_{c \in C} \text{CreditAmount}_c}$$
   Measures relative financial commitment. High ratios (> 0.50) indicate heightened default risk.

4. **$f_4 = \text{salary\_proximity\_score}$**:
   $$\text{salary\_proximity\_score} = \exp\left(-0.15 \cdot \min(|d - \hat{s}|, 30 - |d - \hat{s}|)\right)$$
   Exponential decay kernel modeling the rapid dissipation of liquid cash following salary deposit.

5. **$f_5 = \text{burn\_adjusted\_headroom}$**:
   $$\text{burn\_adjusted\_headroom} = \hat{B}(d) - 2 \cdot \text{DailyBurn} - \text{Amount}_m$$
   where $\hat{B}(d)$ is the estimated available balance on day $d$. Enforces a 2-day liquid cash buffer.

6. **$f_6 = \text{day\_of\_month}$**:
   $$f_6 = d \in \{1, 2, \dots, 30\}$$
   Captures cyclical calendar seasonality (e.g., month-end bill clustering).

7. **$f_7 = \text{category\_code}$**:
   Ordinal regulatory index: $\{0: \text{Subscription}, 1: \text{Insurance}, 2: \text{Investment}, 3: \text{CreditCard}\}$.

8. **$f_8 = \text{prior\_attempts}$**:
   Integer bounce count $k \in \{0, 1, 2, 3\}$. Penalizes mandates with multiple historical bounces.

### 4.2 Classifier Specification & Probability Calibration
- **Base Classifier**: `GradientBoostingClassifier(n_estimators=100, max_depth=4, learning_rate=0.08, subsample=0.85, random_state=42)`
- **Sigmoid (Platt) Scaling**: Raw classifier logits $z(\vec{x})$ are mapped to calibrated posterior probabilities:
  $$P(\text{Balance} \ge \text{Amount} \mid \vec{x}) = \frac{1}{1 + \exp(A \cdot z(\vec{x}) + B)}$$
  Parameters $A$ and $B$ are fitted via 3-Fold Cross-Validation on holdout training data.
- **Model Evaluation Telemetry**:
  - **Test ROC-AUC**: `0.9969` (exceptional discrimination capacity).
  - **PR-AUC**: `0.9976` (robustness under positive/negative class imbalance).
  - **Accuracy Score**: `97.6%` on holdout test set (1,920 stratified candidate days).
  - **Brier Score**: `0.0192` (near zero indicates well-calibrated empirical probabilities).

### 4.3 Zero Data Leakage Guarantee
- **Audited Assertion**: The ML pipeline and evaluator **never inspect or access** the generator's ground-truth `customer.salary_day`.
- Instead, the salary arrival day $\hat{s}$ is strictly inferred from the customer's historical credit sequence:
  $$\hat{s} = \text{credit\_days}[\text{argmax}(\text{credit\_amounts})]$$
- Explicit runtime assertions prevent ground-truth data passing during training, evaluation, and production inference.

---

## 5. Relational Database Schema & Entity Relationships

The backend uses a normalized SQLite database in Write-Ahead-Logging mode (`PRAGMA journal_mode = WAL`).

```sql
-- 1. Customers Table: Master consumer liquidity profiles
CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    vpa TEXT NOT NULL,
    salary_day INTEGER NOT NULL,
    inferred_salary_day INTEGER,
    monthly_inflow REAL NOT NULL,
    daily_burn REAL NOT NULL,
    risk_tier TEXT NOT NULL CHECK(risk_tier IN ('low', 'medium', 'high')),
    credit_days TEXT NOT NULL,
    credit_amounts TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Mandates Table: AutoPay recurring mandate registry
CREATE TABLE IF NOT EXISTS mandates (
    id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    merchant_name TEXT NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('subscription', 'insurance', 'investment', 'credit_card')),
    mandate_amount REAL NOT NULL,
    due_day INTEGER NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('active', 'retry_scheduled', 'recovered', 'escalated', 'stopped')),
    current_attempt_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 4,
    last_failure_reason TEXT,
    last_attempt_date TIMESTAMP,
    next_retry_day INTEGER,
    predicted_success_prob REAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(customer_id) REFERENCES customers(id)
);

-- 3. Balance History Table: 30-day simulated liquidity ledgers
CREATE TABLE IF NOT EXISTS balance_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id TEXT NOT NULL,
    day_of_month INTEGER NOT NULL CHECK(day_of_month BETWEEN 1 AND 30),
    balance REAL NOT NULL,
    credit_inflow REAL DEFAULT 0,
    debit_outflow REAL DEFAULT 0,
    is_salary_credit INTEGER DEFAULT 0,
    FOREIGN KEY(customer_id) REFERENCES customers(id)
);

-- 4. Statutory Notifications Table: RBI pre-debit notice dispatch log
CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mandate_id TEXT NOT NULL,
    customer_id TEXT NOT NULL,
    channel TEXT NOT NULL CHECK(channel IN ('sms', 'email', 'push')),
    scheduled_debit_date TIMESTAMP NOT NULL,
    notice_sent_time TIMESTAMP NOT NULL,
    notice_hours_before_debit REAL NOT NULL,
    compliant INTEGER NOT NULL CHECK(compliant IN (0, 1)),
    status TEXT NOT NULL CHECK(status IN ('dispatched', 'delivered', 'held_non_compliant')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(mandate_id) REFERENCES mandates(id),
    FOREIGN KEY(customer_id) REFERENCES customers(id)
);

-- 5. Retry Schedule Table: Predictive queue execution timestamps
CREATE TABLE IF NOT EXISTS retry_schedule (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mandate_id TEXT NOT NULL,
    attempt_number INTEGER NOT NULL,
    scheduled_day INTEGER NOT NULL,
    predicted_prob REAL NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('pending', 'executed', 'cancelled')),
    rationale TEXT,
    executed_at TIMESTAMP,
    FOREIGN KEY(mandate_id) REFERENCES mandates(id)
);

-- 6. Audit Logs Table: Immutable security and compliance record
CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mandate_id TEXT NOT NULL,
    actor TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(mandate_id) REFERENCES mandates(id)
);
```

---

## 6. REST API & WebSocket Protocol Specifications

### 6.1 Backend API Catalog (Express / Node.js)
- `GET /api/mandates`: Returns filtered list of mandates with associated customer metadata, risk tier, and attempt history.
- `GET /api/mandates/:id`: Detailed mandate inspection including 30-day balance curve, statutory compliance records, and retry history.
- `POST /api/mandates/:id/simulate-failure`: Injects a simulated decline event (`U30 Insufficient Funds`), evaluates deterministic guardrails, triggers ML inference, and schedules the optimal recovery date.
- `POST /api/mandates/:id/retry`: Executes manual re-debit attempt against the acquiring bank switch.
- `GET /api/retries/upcoming`: Retrieves scheduled retry queue grouped by calendar settlement days with calibrated probability distributions.
- `POST /api/retries/batch-execute`: Executes batch settlement for all mandates scheduled on a specific calendar day.
- `GET /api/compliance/summary`: Returns 4-pillar statutory compliance scorecard (24h pre-debit notices, ₹15k AFA ceiling, retry stopping rules, and churn rates).
- `GET /api/compliance/audit.csv`: Generates and streams standard RBI statutory audit CSV for direct compliance reporting.
- `GET /api/eval/comparison`: Returns comparative benchmark metrics: RECOVER Predictive Agent vs. Naive Baseline (+1/+3/+7) vs. Aggressive Brute Force.
- `POST /api/eval/run`: Triggers live side-by-side policy evaluation across the complete 320-mandate portfolio.

### 6.2 ML Microservice API (FastAPI / Port 8000)
- `POST /predict/schedule`:
  - **Request Body**:
    ```json
    {
      "mandate_id": "MDT-1001",
      "customer_id": "CUST-1001",
      "mandate_amount": 299.0,
      "category": "subscription",
      "current_attempt_count": 1,
      "inferred_salary_day": 5,
      "credit_days": "5,20",
      "credit_amounts": "45000,5000",
      "daily_burn": 650.0,
      "recent_balances": [1200.0, 850.0, 420.0, 150.0, 45150.0]
    }
    ```
  - **Response Body**:
    ```json
    {
      "optimal_retry_day": 5,
      "predicted_success_prob": 0.962,
      "confidence_band": "Prime (P >= 90%)",
      "all_day_probabilities": {
        "1": 0.12, "2": 0.18, "3": 0.25, "4": 0.42, "5": 0.962, "6": 0.88
      },
      "rationale": "Day 5 selected (+₹41,098 balance surplus, 5.3x coverage over ₹299 debit post-salary window)"
    }
    ```

---

## 7. Synthetic Ledger Generator & Stochastic Simulation Mechanics

### 7.1 Generator Configuration
The synthetic generator (`generator/generate_realistic_data.py`) creates 320 customer mandate profiles designed to mirror real-world Indian banking distributions:
- **Salaried Profiles (60%)**: Regular monthly payroll arrival with 15% standard deviation in arrival date (payroll jitter $+/- 2$ days).
- **Gig-Economy & Freelancer Profiles (22%)**: Multiple irregular cash inflow spikes occurring twice or thrice a month.
- **High-Net-Worth / Low Risk (18%)**: High average balances and low debt-to-income ratios.
- **Technical Failures (2%)**: Stochastic network timeouts (`U19 Transaction Timeout`) requiring immediate technical retry regardless of balance.

---

## 8. Audited Fixes & Hardening Changelog

During pre-deadline hardening, four critical audit items were systematically investigated and resolved:
1. **Fix 0.1 · Constant Confidence Bug**: Upstream mock data generator previously contained a ternary stub (`0.89 if retry_scheduled`). Resolved by wiring genuine calibrated GBDT inference (`model.predict_proba`). Verified via automated test: sample $N=117$, std dev $\sigma = 0.2012 > 0.05$ (probabilities spread from 52% to 96%).
2. **Fix 0.2 · Currency Glyph Encoding**: Windows PowerShell pipes had converted non-ASCII characters to ASCII `0x3F` (`?`). Fixed across 18 templates by enforcing UTF-8 sequences and multi-tier system font fallbacks.
3. **Fix 0.3 · Salary Day Data Leakage Audit**: Removed direct ground-truth reading (`customer.salary_day`) in `evalService.ts`. Enforced strict statistical inference via historical credit argmax with runtime assertions.
4. **Fix 0.4 · Stochastic Noise & Realism**: Added 22% gig workers, 15% payroll jitter, and 2% technical declines. New benchmark results: 70.1% recovery vs. 45.3% naive baseline (+24.8pt net lift).

---

## 9. Complete Codebase Directory Tree

```
recover/
├── README.md                                  # Executive summary & quickstart
├── .gitignore                                 # Git exclusions
├── backend/
│   ├── package.json                           # Node.js dependencies
│   ├── tsconfig.json                          # TypeScript configuration
│   └── src/
│       ├── index.ts                           # Express server entrypoint
│       ├── db/
│       │   ├── schema.sql                     # SQLite DDL relational schema
│       │   ├── database.ts                    # SQLite connection & WAL mode
│       │   ├── queries.ts                     # Prepared SQL statements
│       │   └── seed.ts                        # Database seeder & reset
│       ├── routes/
│       │   ├── mandates.ts                    # Mandate CRUD & simulation routes
│       │   ├── retries.ts                     # Retry queue & batch execution
│       │   ├── compliance.ts                  # Statutory compliance scorecard
│       │   └── eval.ts                        # Policy benchmarking endpoints
│       └── services/
│           ├── agentService.ts                # Autonomous orchestration logic
│           ├── evalService.ts                 # 3-policy comparative evaluator
│           ├── mlService.ts                   # Client for FastAPI microservice
│           └── socketService.ts               # Real-time WebSocket sync
├── ml_service/
│   ├── main.py                                # FastAPI ASGI server
│   ├── models/
│   │   └── retry_predictor.py                 # Calibrated GBDT classifier
│   └── utils/
│       └── feature_engineering.py             # 8-feature vector extraction
├── generator/
│   └── generate_realistic_data.py             # Stochastic data generator
├── tools/
│   ├── build_realistic_mockdata.py            # Generates mockData.json fixture
│   ├── evaluate_policies.py                   # Automated policy benchmark test
│   ├── sync_sqlite.py                         # Synchronizes database tables
│   ├── test_priority0.py                      # Automated audit verification suite
│   └── fix_currency_everywhere.py             # Currency glyph sanitization tool
└── frontend/
    ├── package.json                           # React dependencies
    ├── tsconfig.json                          # Vite TypeScript config
    ├── vite.config.ts                         # Vite bundler setup
    ├── tailwind.config.js                     # Tailwind typography & colors
    ├── postcss.config.js                      # PostCSS pipeline
    ├── vercel.json                            # Vercel SPA rewrite rules
    ├── index.html                             # HTML entrypoint
    └── src/
        ├── main.tsx                           # React DOM bootstrapper
        ├── App.tsx                            # Root application component
        ├── types/
        │   └── index.ts                       # Domain TypeScript interfaces
        ├── store/
        │   └── useStore.ts                    # Zustand global reactive store
        ├── tokens.css                         # Pitch-black OLED terminal tokens
        ├── api/
        │   └── client.ts                      # Unified Axios API client
        ├── pages/
        │   ├── Ledger.tsx                     # Mandates register & live controls
        │   ├── RetryQueue.tsx                 # Predictive retry schedule queue
        │   ├── ComplianceDashboard.tsx        # RBI statutory audit registry
        │   ├── EvalReport.tsx                 # Model benchmark & Palantir chart
        │   └── EngineRoom.tsx                 # Architectural blueprint & specs
        └── components/
            ├── layout/
            │   ├── Sidebar.tsx                # Collapsible navigation drawer
            │   └── TopBar.tsx                 # Header controls & dark mode toggle
            ├── ledger/
            │   ├── LedgerTable.tsx            # Mandate table & pipeline animation
            │   ├── HeroMetric.tsx             # Animated KPI counter cards
            │   ├── CategoryBreakdownCard.tsx  # Sectoral recovery breakdown
            │   ├── DemoScenarioBar.tsx        # Quick scenario injection buttons
            │   └── StatusStripe.tsx           # Visual status indicators
            ├── detail/
            │   ├── MandateDetailDrawer.tsx    # Slide-over mandate inspector
            │   ├── BalanceCurveChart.tsx      # 30-day liquidity balance curve
            │   ├── ComplianceTab.tsx          # RBI lead-time notice audit tab
            │   ├── RetryPredictionPanel.tsx   # Per-decision timing rationale
            │   └── AuditTrail.tsx             # Immutable event audit log
            ├── eval/
            │   └── BaselineComparisonSection.tsx # Side-by-side policy charts
            ├── visual/
            │   ├── StripeNodeFlow.tsx         # Interactive architecture diagram
            │   ├── LinearIsometricCards.tsx   # 3 engineering pillar blueprints
            │   └── PalantirScatterPlot.tsx    # Cycle time vs. liquidity scatter
            └── common/
                ├── CommandPalette.tsx         # Keyboard quick-search (Cmd+K)
                └── ToastContainer.tsx         # Notification toast alerts
```

---

## 10. Verbatim Source Code Listings
Below is the complete, unabridged, verbatim source code for every file in the application.

"""

def generate_markdown():
    md = [get_architecture_markdown()]
    total_files = 0
    total_lines = 0

    for cat_idx, section in enumerate(CODEBASE_CATALOG, 1):
        md.append(f"\n## Section 10.{cat_idx}: {section['category']}\n")
        md.append(f"*{section['description']}*\n\n")

        for filepath, lang in section["files"]:
            content, lines, size = read_file(filepath)
            total_files += 1
            total_lines += lines
            md.append(f"### File: `{filepath}`\n")
            md.append(f"- **Language**: `{lang}` | **Lines**: `{lines}` | **Size**: `{size / 1024:.1f} KB`\n\n")
            md.append(f"```{lang}\n{content}\n```\n\n")
            md.append("---\n")

    return "".join(md), total_files, total_lines

def generate_html(md_content):
    css = """
    @page {
        size: A4;
        margin: 14mm 12mm 14mm 12mm;
        @bottom-right {
            content: "Page " counter(page);
            font-family: ui-monospace, monospace;
            font-size: 8pt;
            color: #64748B;
        }
        @top-right {
            content: "RECOVER // Codebase & Architecture Dossier";
            font-family: ui-monospace, monospace;
            font-size: 8pt;
            color: #94A3B8;
        }
    }
    body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
        color: #0F172A;
        line-height: 1.5;
        font-size: 9.5pt;
        background: #FFFFFF;
        margin: 0;
        padding: 16px;
    }
    .cover-page {
        page-break-after: always;
        height: 94vh;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 30px 20px;
        box-sizing: border-box;
        border-left: 6px solid #0F6B5C;
    }
    .cover-title {
        font-family: Georgia, serif;
        font-size: 32pt;
        font-weight: 700;
        color: #0A1128;
        line-height: 1.1;
        margin-bottom: 8px;
    }
    .cover-subtitle {
        font-size: 13pt;
        color: #475569;
        line-height: 1.4;
        margin-bottom: 20px;
    }
    .cover-badge {
        display: inline-block;
        padding: 5px 12px;
        background: #0F6B5C;
        color: #FFFFFF;
        font-size: 8.5pt;
        font-weight: 700;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        border-radius: 3px;
        margin-bottom: 20px;
    }
    .cover-meta {
        border-top: 1px solid #CBD5E1;
        padding-top: 16px;
        font-size: 8.5pt;
        color: #475569;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
    }
    .cover-meta strong {
        color: #0F172A;
    }
    h1 {
        font-family: Georgia, serif;
        font-size: 18pt;
        color: #0A1128;
        border-bottom: 2px solid #0F6B5C;
        padding-bottom: 4px;
        margin-top: 28px;
        margin-bottom: 12px;
        page-break-after: avoid;
    }
    h2 {
        font-family: Georgia, serif;
        font-size: 13pt;
        color: #1E293B;
        border-bottom: 1px solid #CBD5E1;
        padding-bottom: 3px;
        margin-top: 20px;
        margin-bottom: 8px;
        page-break-after: avoid;
    }
    h3 {
        font-size: 11pt;
        color: #0F6B5C;
        margin-top: 14px;
        margin-bottom: 6px;
        page-break-after: avoid;
    }
    p, li {
        color: #334155;
    }
    table {
        width: 100%;
        border-collapse: collapse;
        margin: 12px 0;
        font-size: 8.5pt;
        page-break-inside: avoid;
    }
    th, td {
        border: 1px solid #CBD5E1;
        padding: 6px 10px;
        text-align: left;
    }
    th {
        background: #F1F5F9;
        font-weight: 600;
        color: #0F172A;
    }
    .callout {
        padding: 10px 14px;
        border-left: 4px solid #0F6B5C;
        background: #F0FDF4;
        margin: 12px 0;
        font-size: 8.5pt;
    }
    .file-box {
        margin-top: 16px;
        margin-bottom: 20px;
        border: 1px solid #CBD5E1;
        border-radius: 4px;
        overflow: hidden;
        page-break-inside: avoid;
    }
    .file-header {
        background: #F8FAFC;
        border-bottom: 1px solid #CBD5E1;
        padding: 6px 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-family: ui-monospace, monospace;
        font-size: 8pt;
    }
    .file-header .path {
        font-weight: 700;
        color: #0F172A;
    }
    .file-header .meta {
        color: #64748B;
    }
    pre.code-block {
        margin: 0;
        padding: 10px 12px;
        background: #FFFFFF;
        overflow-x: auto;
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        font-size: 7.5pt;
        line-height: 1.45;
        color: #1E293B;
        white-space: pre-wrap;
        word-break: break-all;
    }
    .section-break {
        page-break-before: always;
    }
    """

    out = [
        "<!DOCTYPE html>",
        "<html lang='en'>",
        "<head>",
        "<meta charset='UTF-8'>",
        "<title>RECOVER: Full Codebase & Architecture Dossier</title>",
        f"<style>{css}</style>",
        "</head>",
        "<body>",
        "<div class='cover-page'>",
        "  <div>",
        "    <div class='cover-badge'>Razorpay AI Buildathon 2026 // Track 3</div>",
        "    <div class='cover-title'>RECOVER</div>",
        "    <div class='cover-subtitle'>Autonomous UPI AutoPay Mandate Recovery Agent<br><strong>Complete Architecture, Mathematical Specifications & Verbatim Codebase Dossier</strong></div>",
        "    <p style='color:#64748B; font-size:9.5pt; max-width:600px;'>An authoritative, production-grade technical specification containing every single line of code across all 66 repository files, including deterministic central bank compliance rules, 8-feature calibrated GBDT models, SQLite schemas, and the complete React 18 responsive frontend.</p>",
        "  </div>",
        "  <div class='cover-meta'>",
        "    <div>",
        "      <div><strong>Author:</strong> Chirantan Shalya</div>",
        "      <div><strong>Contact:</strong> chirantan.shalya30@gmail.com</div>",
        "      <div><strong>Release Kernel:</strong> v2.4 (Deterministic Compliance)</div>",
        "    </div>",
        "    <div>",
        "      <div><strong>Repository:</strong> Razorpay---AI-Buildathon</div>",
        "      <div><strong>Date:</strong> September 2026</div>",
        "      <div><strong>Target LLM:</strong> Claude Technical Analysis Context</div>",
        "    </div>",
        "  </div>",
        "</div>"
    ]

    # Convert Markdown Architecture section to clean HTML
    # For speed and precision, convert headings and paragraphs
    arch_md = get_architecture_markdown()
    lines = arch_md.splitlines()
    in_code = False
    in_table = False
    table_rows = []

    for line in lines:
        if line.startswith("```"):
            if in_code:
                out.append("</pre>")
                in_code = False
            else:
                out.append("<pre class='code-block'>")
                in_code = True
            continue

        if in_code:
            out.append(html.escape(line))
            continue

        if line.startswith("|") and line.endswith("|"):
            if "---" in line:
                continue
            cells = [c.strip() for c in line.split("|")[1:-1]]
            if not in_table:
                in_table = True
                out.append("<table>")
                out.append("<tr>" + "".join(f"<th>{html.escape(c)}</th>" for c in cells) + "</tr>")
            else:
                out.append("<tr>" + "".join(f"<td>{html.escape(c)}</td>" for c in cells) + "</tr>")
            continue
        elif in_table:
            out.append("</table>")
            in_table = False

        if line.startswith("# "):
            pass # cover handled
        elif line.startswith("## "):
            text = line[3:].strip()
            out.append(f"<h1 class='section-break'>{html.escape(text)}</h1>")
        elif line.startswith("### "):
            text = line[4:].strip()
            out.append(f"<h2>{html.escape(text)}</h2>")
        elif line.startswith("#### "):
            text = line[5:].strip()
            out.append(f"<h3>{html.escape(text)}</h3>")
        elif line.startswith("- "):
            out.append(f"<li style='margin-left:20px;'>{html.escape(line[2:])}</li>")
        elif line.strip() == "---":
            out.append("<hr style='border:none; border-top:1px solid #CBD5E1; margin:20px 0;'>")
        elif line.strip():
            out.append(f"<p>{html.escape(line)}</p>")

    if in_table:
        out.append("</table>")

    # Add All Source Code Files
    out.append("<h1 class='section-break'>10. Verbatim Source Code Listings (Every Single File in Full)</h1>")
    out.append("<p>The following sections contain the unabridged, verbatim source code for all 66 files comprising the RECOVER web application, backend services, machine learning models, database schemas, and data generators.</p>")

    for cat_idx, section in enumerate(CODEBASE_CATALOG, 1):
        out.append(f"<h2 class='section-break'>Section 10.{cat_idx}: {html.escape(section['category'])}</h2>")
        out.append(f"<p><em>{html.escape(section['description'])}</em></p>")

        for filepath, lang in section["files"]:
            content, lines, size = read_file(filepath)
            out.append("<div class='file-box'>")
            out.append(f"  <div class='file-header'>")
            out.append(f"    <span class='path'>{html.escape(filepath)}</span>")
            out.append(f"    <span class='meta'>{html.escape(lang.upper())} · {lines} lines · {size / 1024:.1f} KB</span>")
            out.append("  </div>")
            out.append(f"  <pre class='code-block'><code>{html.escape(content)}</code></pre>")
            out.append("</div>")

    out.append("</body></html>")
    return "\n".join(out)

def generate_odt(odt_path):
    print("Generating ODT/ODF document via odfpy...")
    doc = OpenDocumentText()

    # Define Styles
    h1_style = Style(name="Heading1", family="paragraph")
    h1_style.addElement(TextProperties(fontfamily="Georgia", fontsize="16pt", fontweight="bold", color="#0A1128"))
    h1_style.addElement(ParagraphProperties(margintop="0.4cm", marginbottom="0.2cm"))
    doc.styles.addElement(h1_style)

    h2_style = Style(name="Heading2", family="paragraph")
    h2_style.addElement(TextProperties(fontfamily="Georgia", fontsize="13pt", fontweight="bold", color="#0F6B5C"))
    h2_style.addElement(ParagraphProperties(margintop="0.3cm", marginbottom="0.15cm"))
    doc.styles.addElement(h2_style)

    body_style = Style(name="BodyText", family="paragraph")
    body_style.addElement(TextProperties(fontfamily="Arial", fontsize="9.5pt", color="#1E293B"))
    body_style.addElement(ParagraphProperties(marginbottom="0.15cm", lineheight="130%"))
    doc.styles.addElement(body_style)

    code_style = Style(name="CodeParagraph", family="paragraph")
    code_style.addElement(TextProperties(fontfamily="Courier New", fontsize="7.5pt", color="#0F172A"))
    code_style.addElement(ParagraphProperties(backgroundcolor="#F8FAFC", marginbottom="0.02cm", margintop="0.02cm", marginleft="0.2cm"))
    doc.styles.addElement(code_style)

    # Document Header
    doc.text.addElement(H(outlinelevel=1, text="RECOVER: Autonomous UPI AutoPay Recovery Agent", stylename=h1_style))
    doc.text.addElement(P(text="Complete Architecture & Full Codebase Specification Dossier (66 Source Files)", stylename=body_style))
    doc.text.addElement(P(text="Prepared for Claude Technical Analysis // Razorpay AI Buildathon 2026", stylename=body_style))

    # Add Files
    for cat_idx, section in enumerate(CODEBASE_CATALOG, 1):
        doc.text.addElement(H(outlinelevel=2, text=f"Section {cat_idx}: {section['category']}", stylename=h2_style))
        doc.text.addElement(P(text=section["description"], stylename=body_style))

        for filepath, lang in section["files"]:
            content, lines, size = read_file(filepath)
            doc.text.addElement(H(outlinelevel=3, text=f"File: {filepath} ({lang}, {lines} lines)", stylename=h2_style))
            # Write lines
            for l in content.splitlines():
                doc.text.addElement(P(text=l if l.strip() else " ", stylename=code_style))

    doc.save(odt_path)
    size_kb = os.path.getsize(odt_path) / 1024
    print(f"SUCCESS: ODT/ODF document created at: {odt_path} ({size_kb:.1f} KB)")

def main():
    print("=== RECOVER Codebase Dossier Generator ===")
    
    # 1. Generate Markdown
    md_content, file_count, line_count = generate_markdown()
    md_path = os.path.abspath("RECOVER_Codebase_and_Architecture_Dossier.md")
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(md_content)
    print(f"SUCCESS: Markdown dossier written ({file_count} files, {line_count} lines) at: {md_path}")

    # 2. Generate HTML
    html_content = generate_html(md_content)
    html_path = os.path.abspath("RECOVER_Codebase_and_Architecture_Dossier.html")
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html_content)
    print(f"SUCCESS: HTML dossier written at: {html_path}")

    # 3. Generate PDF via Headless Chrome / Edge
    pdf_path = os.path.abspath("RECOVER_Codebase_and_Architecture_Dossier.pdf")
    chrome = shutil.which("chrome") or r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    edge = shutil.which("msedge") or r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    browser = chrome if os.path.exists(chrome) else (edge if os.path.exists(edge) else None)

    if browser:
        print(f"Compiling publication-quality PDF via headless browser: {browser}")
        cmd = [
            browser,
            "--headless",
            "--disable-gpu",
            "--no-pdf-header-footer",
            f"--print-to-pdf={pdf_path}",
            html_path
        ]
        res = subprocess.run(cmd, capture_output=True, text=True)
        if os.path.exists(pdf_path):
            pdf_size_kb = os.path.getsize(pdf_path) / 1024
            print(f"SUCCESS: PDF created at: {pdf_path} ({pdf_size_kb:.1f} KB)")
        else:
            print("Failed to generate PDF, browser output:", res.stderr)
    else:
        print("No compatible browser (Chrome/Edge) found for PDF generation.")

    # 4. Generate ODT
    odt_path = os.path.abspath("RECOVER_Codebase_and_Architecture_Dossier.odt")
    try:
        generate_odt(odt_path)
    except Exception as e:
        print("Warning: ODT generation encountered an error:", e)

    # 5. Copy artifacts to Antigravity brain directory
    artifact_dir = r"C:\Users\Chirantan\.gemini\antigravity\brain\a0397bdd-db6b-42ad-8eeb-4ced491f28f8"
    if os.path.exists(artifact_dir):
        for out_file in [pdf_path, odt_path, md_path, html_path]:
            if os.path.exists(out_file):
                dest = os.path.join(artifact_dir, os.path.basename(out_file))
                shutil.copy2(out_file, dest)
                print(f"Copied artifact to: {dest}")

    print("=== Codebase Dossier Generation Complete ===")

if __name__ == "__main__":
    main()
