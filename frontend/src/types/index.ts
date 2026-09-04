export type MandateStatus = 'pending' | 'retry_scheduled' | 'recovered' | 'escalated' | 'stopped';

export type MandateCategory = 'subscription' | 'insurance' | 'mutual_fund_sip' | 'credit_card_bill' | 'other';

export interface Customer {
  id: string;
  name: string;
  upi_handle: string;
  irregular_income: number;
  salary_day: number | null;
  salary_amount: number;
  daily_burn: number;
  credit_days: string;
  credit_amounts: string;
}

export interface Mandate {
  id: string;
  customer_id: string;
  merchant_name: string;
  category: MandateCategory;
  mandate_amount: number;
  due_day: number;
  status: MandateStatus;
  attempts: number;
  next_retry_day: number | null;
  predicted_success_prob: number | null;
  created_at: string;
  customer_name?: string;
  upi_handle?: string;
  decision_rationale?: string;
}

export interface BalancePoint {
  customer_id: string;
  day: number;
  balance: number;
}

export interface AuditLogEntry {
  id: number;
  mandate_id: string;
  event: string;
  reason: string;
  actor: 'model' | 'rule_engine';
  timestamp: string;
}

export interface NotificationRecord {
  id: number;
  mandate_id: string;
  merchant_name: string;
  amount: number;
  scheduled_debit_at: string;
  sent_at: string;
  reason: string;
  notice_hours_before_debit: number;
  compliant: number;
}

export interface LedgerMetrics {
  recoveredAmount: number;
  atRiskAmount: number;
  escalatedCount: number;
  stoppedCount: number;
  totalMandates: number;
  recoveredCount: number;
  recoveryRate: number;
}

export interface EvalPolicyResult {
  policy: 'baseline' | 'model';
  totalMandates?: number;
  totalAtRisk: number;
  recoveredCount?: number;
  totalRecovered: number;
  recoveryRate: number;
}

export interface EvalComparison {
  baseline: EvalPolicyResult;
  model: EvalPolicyResult;
  deltaRecoveryRate: number;
  deltaRecoveredAmount: number;
  totalAtRisk: number;
  runAt: string;
}

export interface CandidateDay {
  day: number;
  prob: number;
}

export interface PredictionData {
  best_day: number;
  predicted_success_prob: number;
  candidate_days: CandidateDay[];
  feature_importances: Record<string, number>;
}

export type NavTab = "ledger" | "retries" | "compliance" | "eval" | "architecture";
