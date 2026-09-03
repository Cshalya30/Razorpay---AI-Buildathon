CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  name TEXT,
  upi_handle TEXT,
  irregular_income INTEGER DEFAULT 0,
  salary_day INTEGER,
  salary_amount REAL NOT NULL,
  daily_burn REAL NOT NULL,
  credit_days TEXT,
  credit_amounts TEXT
);

CREATE TABLE IF NOT EXISTS mandates (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES customers(id),
  merchant_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK(category IN ('subscription','insurance','mutual_fund_sip','credit_card_bill','other')),
  mandate_amount REAL NOT NULL,
  due_day INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK(status IN ('pending','retry_scheduled','recovered','escalated','stopped')),
  attempts INTEGER NOT NULL DEFAULT 0,
  next_retry_day INTEGER,
  predicted_success_prob REAL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS balance_curves (
  customer_id TEXT NOT NULL REFERENCES customers(id),
  day INTEGER NOT NULL,
  balance REAL NOT NULL,
  PRIMARY KEY (customer_id, day)
);

CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  mandate_id TEXT NOT NULL REFERENCES mandates(id),
  event TEXT NOT NULL,
  reason TEXT NOT NULL,
  actor TEXT NOT NULL CHECK(actor IN ('model','rule_engine')),
  timestamp TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  mandate_id TEXT NOT NULL REFERENCES mandates(id),
  merchant_name TEXT NOT NULL,
  amount REAL NOT NULL,
  scheduled_debit_at TEXT NOT NULL,
  sent_at TEXT NOT NULL,
  reason TEXT NOT NULL,
  notice_hours_before_debit REAL,
  compliant INTEGER
);

CREATE TABLE IF NOT EXISTS eval_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  policy TEXT NOT NULL CHECK(policy IN ('baseline','model')),
  total_at_risk REAL NOT NULL,
  total_recovered REAL NOT NULL,
  recovery_rate REAL NOT NULL,
  run_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_mandates_status ON mandates(status);
CREATE INDEX IF NOT EXISTS idx_audit_mandate ON audit_log(mandate_id);
CREATE INDEX IF NOT EXISTS idx_notifications_mandate ON notifications(mandate_id);
CREATE INDEX IF NOT EXISTS idx_balance_cust_day ON balance_curves(customer_id, day);
