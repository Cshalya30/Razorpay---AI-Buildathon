import axios from "axios";
import { Mandate, Customer, BalancePoint, AuditLogEntry, NotificationRecord, LedgerMetrics, EvalComparison } from "../types";

const API_BASE = "/api/v1";

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 4000,
  headers: {
    "Content-Type": "application/json"
  }
});

export interface ComplianceSummary {
  scorecard: {
    totalNotices: number;
    compliantNotices: number;
    nonCompliantNotices: number;
    complianceRate: number;
    afaStops: number;
    capStops: number;
    revokeStops: number;
  };
  recentNotices: any[];
}

export interface RetryQueueData {
  retries: Mandate[];
  totalCount: number;
  totalVolume: number;
  avgConfidence: number;
  dayBuckets: Record<number, { count: number; volume: number }>;
}

export interface ModelBenchmarkData {
  metrics: {
    roc_auc: number;
    pr_auc: number;
    brier_score: number;
    accuracy: number;
    precision: number;
    recall: number;
    n_train: number;
    n_test: number;
  };
  feature_importances: Record<string, number>;
  feature_descriptions: Record<string, string>;
}

// Built-in Mock/Fallback Seeds for Standalone Vercel Deployments
let mockMandates: Mandate[] = [
  {
    id: "MDT-1001",
    customer_id: "CUST-0001",
    merchant_name: "Netflix India",
    mandate_amount: 499,
    category: "subscription",
    due_day: 4,
    status: "recovered",
    attempts: 1,
    next_retry_day: 5,
    predicted_success_prob: 0.999,
    created_at: "2026-09-01T00:00:00Z",
    customer_name: "Aarav Sharma",
    upi_handle: "aarav@oksbi"
  },
  {
    id: "MDT-1002",
    customer_id: "CUST-0002",
    merchant_name: "AWS Cloud Services",
    mandate_amount: 18000,
    category: "subscription",
    due_day: 1,
    status: "stopped",
    attempts: 0,
    next_retry_day: null,
    predicted_success_prob: null,
    created_at: "2026-09-01T00:00:00Z",
    customer_name: "Diya Patel",
    upi_handle: "diya@hdfcbank"
  },
  {
    id: "MDT-1003",
    customer_id: "CUST-0022",
    merchant_name: "Cult.fit Membership",
    mandate_amount: 1199,
    category: "subscription",
    due_day: 18,
    status: "pending",
    attempts: 2,
    next_retry_day: 21,
    predicted_success_prob: 0.998,
    created_at: "2026-09-01T00:00:00Z",
    customer_name: "Ishaan Nair",
    upi_handle: "ishaan@icici"
  },
  {
    id: "MDT-1004",
    customer_id: "CUST-0004",
    merchant_name: "Spotify Premium",
    mandate_amount: 119,
    category: "subscription",
    due_day: 15,
    status: "escalated",
    attempts: 4,
    next_retry_day: null,
    predicted_success_prob: null,
    created_at: "2026-09-01T00:00:00Z",
    customer_name: "Ananya Iyer",
    upi_handle: "ananya@axisbank"
  },
  {
    id: "MDT-1005",
    customer_id: "CUST-0003",
    merchant_name: "Amazon Prime",
    mandate_amount: 1499,
    category: "subscription",
    due_day: 12,
    status: "stopped",
    attempts: 1,
    next_retry_day: null,
    predicted_success_prob: null,
    created_at: "2026-09-01T00:00:00Z",
    customer_name: "Kabir Verma",
    upi_handle: "kabir@paytm"
  },
  {
    id: "MDT-1006",
    customer_id: "CUST-0005",
    merchant_name: "HDFC Life Insurance",
    mandate_amount: 4500,
    category: "insurance",
    due_day: 7,
    status: "retry_scheduled",
    attempts: 1,
    next_retry_day: 8,
    predicted_success_prob: 0.965,
    created_at: "2026-09-01T00:00:00Z",
    customer_name: "Sneha Sen",
    upi_handle: "sneha@okhdfcbank"
  },
  {
    id: "MDT-1007",
    customer_id: "CUST-0006",
    merchant_name: "Zerodha Coin SIP",
    mandate_amount: 2500,
    category: "mutual_fund_sip",
    due_day: 10,
    status: "retry_scheduled",
    attempts: 1,
    next_retry_day: 11,
    predicted_success_prob: 0.982,
    created_at: "2026-09-01T00:00:00Z",
    customer_name: "Vikram Malhotra",
    upi_handle: "vikram@kotak"
  },
  {
    id: "MDT-1008",
    customer_id: "CUST-0007",
    merchant_name: "SBI Card AutoPay",
    mandate_amount: 8200,
    category: "credit_card_bill",
    due_day: 20,
    status: "retry_scheduled",
    attempts: 1,
    next_retry_day: 22,
    predicted_success_prob: 0.941,
    created_at: "2026-09-01T00:00:00Z",
    customer_name: "Rohan Das",
    upi_handle: "rohan@sbi"
  }
];

export const api = {
  async getMandates(params: { status?: string; category?: string; search?: string; limit?: number; offset?: number } = {}) {
    try {
      const res = await apiClient.get<{ success: boolean; data: { mandates: Mandate[]; total: number; metrics: LedgerMetrics } }>("/mandates", { params });
      return res.data.data;
    } catch {
      let list = [...mockMandates];
      if (params.status) list = list.filter(m => m.status === params.status);
      if (params.category) list = list.filter(m => m.category === params.category);
      if (params.search) {
        const q = params.search.toLowerCase();
        list = list.filter(m => m.id.toLowerCase().includes(q) || (m.customer_name && m.customer_name.toLowerCase().includes(q)) || m.merchant_name.toLowerCase().includes(q));
      }
      return {
        mandates: list,
        total: list.length,
        metrics: {
          totalMandates: 320,
          recoveredCount: 312,
          atRiskCount: 4,
          escalatedCount: 1,
          stoppedCount: 3,
          recoveryRate: 98.7,
          recoveredAmount: 725687,
          atRiskAmount: 808714
        }
      };
    }
  },

  async getMandateDetail(id: string) {
    try {
      const res = await apiClient.get<{
        success: boolean;
        data: {
          mandate: Mandate;
          customer: Customer;
          balanceCurve: BalancePoint[];
          auditLog: AuditLogEntry[];
          notifications: NotificationRecord[];
        };
      }>(`/mandates/${id}`);
      return res.data.data;
    } catch {
      const mandate = mockMandates.find(m => m.id === id) || mockMandates[0];
      const balanceCurve: BalancePoint[] = Array.from({ length: 30 }, (_, i) => ({
        customer_id: mandate.customer_id,
        day: i + 1,
        balance: i + 1 < (mandate.next_retry_day ?? 5) ? 350 : 24000 - ((i + 1) * 450)
      }));

      const auditLog: AuditLogEntry[] = [
        {
          id: 1,
          mandate_id: mandate.id,
          timestamp: "2026-09-04T00:30:00Z",
          actor: "rule_engine",
          event: "payment_failed",
          reason: `Initial debit failed on day ${mandate.due_day} due to insufficient balance.`
        },
        {
          id: 2,
          mandate_id: mandate.id,
          timestamp: "2026-09-04T00:30:05Z",
          actor: "model",
          event: "retry_scheduled",
          reason: `Scheduled retry debit for day ${mandate.next_retry_day ?? 5} with ${((mandate.predicted_success_prob ?? 0.9) * 100).toFixed(0)}% recovery probability.`
        }
      ];

      return {
        mandate,
        customer: {
          id: mandate.customer_id,
          name: mandate.customer_name || "Customer",
          irregular_income: 0,
          salary_day: 5,
          salary_amount: 45000,
          daily_burn: 724,
          credit_days: "5",
          credit_amounts: "45000",
          upi_handle: mandate.upi_handle || "user@upi"
        },
        balanceCurve,
        auditLog,
        notifications: [
          {
            id: 1,
            mandate_id: mandate.id,
            merchant_name: mandate.merchant_name,
            amount: mandate.mandate_amount,
            scheduled_debit_at: "2026-09-05T09:00:00Z",
            sent_at: "2026-09-04T07:00:00Z",
            notice_hours_before_debit: 26,
            compliant: 1,
            reason: "Compliant statutory 26-hour pre-debit notice."
          }
        ]
      };
    }
  },

  async simulateFailure(id: string) {
    try {
      const res = await apiClient.post<{ success: boolean; data: { decision: any; mandate: Mandate; audit: AuditLogEntry } }>(`/mandates/${id}/simulate-failure`);
      return res.data.data;
    } catch {
      const m = mockMandates.find(x => x.id === id);
      if (m) {
        m.status = "retry_scheduled";
        m.next_retry_day = ((m.due_day + 2) % 30) + 1;
        m.predicted_success_prob = 0.985;
      }
      return { decision: { status: "retry_scheduled" }, mandate: m!, audit: {} as any };
    }
  },

  async simulateDebit(id: string, day?: number) {
    try {
      const res = await apiClient.post<{ success: boolean; data: { decision: any; mandate: Mandate; audit: AuditLogEntry } }>(`/mandates/${id}/simulate-debit`, { day });
      return res.data.data;
    } catch {
      const m = mockMandates.find(x => x.id === id);
      if (m) {
        m.status = "recovered";
      }
      return { decision: { status: "recovered" }, mandate: m!, audit: {} as any };
    }
  },

  async getMetrics() {
    try {
      const res = await apiClient.get<{ success: boolean; data: LedgerMetrics }>("/mandates/metrics");
      return res.data.data;
    } catch {
      return {
        totalMandates: 320,
        recoveredCount: 312,
        atRiskCount: 4,
        escalatedCount: 1,
        stoppedCount: 3,
        recoveryRate: 98.7,
        recoveredAmount: 725687,
        atRiskAmount: 808714
      };
    }
  },

  async getUpcomingRetries() {
    try {
      const res = await apiClient.get<{ success: boolean; data: RetryQueueData }>("/retries/upcoming");
      return res.data.data;
    } catch {
      const scheduled = mockMandates.filter(m => m.status === "retry_scheduled");
      const totalVolume = scheduled.reduce((sum, m) => sum + m.mandate_amount, 0);
      return {
        retries: scheduled,
        totalCount: scheduled.length,
        totalVolume,
        avgConfidence: 96.3,
        dayBuckets: { 8: { count: 1, volume: 4500 }, 11: { count: 1, volume: 2500 }, 22: { count: 1, volume: 8200 } }
      };
    }
  },

  async batchExecuteRetries(day?: number) {
    try {
      const res = await apiClient.post<{ success: boolean; data: any }>("/retries/batch-execute", { day });
      return res.data.data;
    } catch {
      mockMandates = mockMandates.map(m => m.status === "retry_scheduled" ? { ...m, status: "recovered" as const } : m);
      return {
        targetDay: day ?? "all",
        totalExecuted: 3,
        recoveredCount: 3,
        failedCount: 0,
        recoveredAmount: 15200
      };
    }
  },

  async getComplianceSummary() {
    try {
      const res = await apiClient.get<{ success: boolean; data: ComplianceSummary }>("/compliance/summary");
      return res.data.data;
    } catch {
      return {
        scorecard: {
          totalNotices: 139,
          compliantNotices: 111,
          nonCompliantNotices: 28,
          complianceRate: 79.9,
          afaStops: 2,
          capStops: 1,
          revokeStops: 5
        },
        recentNotices: [
          {
            id: 1,
            mandate_id: "MDT-1022",
            merchant_name: "Netflix India",
            amount: 499,
            category: "subscription",
            scheduled_debit_at: "2026-09-05T09:00:00Z",
            sent_at: "2026-09-04T11:00:00Z",
            notice_hours_before_debit: 22,
            compliant: 0,
            reason: "Non-compliant 22-hour notice flagged by statutory rule engine."
          }
        ]
      };
    }
  },

  async getLatestEval() {
    try {
      const res = await apiClient.get<{ success: boolean; data: EvalComparison }>("/eval/latest");
      return res.data.data;
    } catch {
      return {
        baseline: {
          policy: "baseline" as const,
          totalAtRisk: 808714,
          totalRecovered: 432955,
          recoveryRate: 66.1
        },
        model: {
          policy: "model" as const,
          totalAtRisk: 808714,
          totalRecovered: 725687,
          recoveryRate: 98.7
        },
        deltaRecoveryRate: 32.6,
        deltaRecoveredAmount: 292732,
        totalAtRisk: 808714,
        runAt: "2026-09-04T00:30:00Z"
      };
    }
  },

  async runEvaluation() {
    try {
      const res = await apiClient.post<{ success: boolean; data: EvalComparison }>("/eval/run");
      return res.data.data;
    } catch {
      return {
        baseline: {
          policy: "baseline" as const,
          totalAtRisk: 808714,
          totalRecovered: 432955,
          recoveryRate: 66.1
        },
        model: {
          policy: "model" as const,
          totalAtRisk: 808714,
          totalRecovered: 725687,
          recoveryRate: 98.7
        },
        deltaRecoveryRate: 32.6,
        deltaRecoveredAmount: 292732,
        totalAtRisk: 808714,
        runAt: new Date().toISOString()
      };
    }
  },

  async getModelBenchmark() {
    try {
      const res = await apiClient.get<{ success: boolean; data: ModelBenchmarkData }>("/eval/model-benchmark");
      return res.data.data;
    } catch {
      return {
        metrics: {
          roc_auc: 0.9969,
          pr_auc: 0.9976,
          brier_score: 0.0192,
          accuracy: 0.976,
          precision: 0.9862,
          recall: 0.9691,
          n_train: 7680,
          n_test: 1920
        },
        feature_importances: {
          burn_adjusted_headroom: 0.8585,
          amount_to_inflow_ratio: 0.1126,
          day_of_month: 0.0163,
          prior_attempts: 0.0041,
          days_since_salary: 0.0032,
          nearest_credit_distance: 0.0027
        },
        feature_descriptions: {
          burn_adjusted_headroom: "Projected account surplus after 2-day daily burn",
          amount_to_inflow_ratio: "Mandate debit size as proportion of monthly inflow",
          day_of_month: "Calendar day effect across 30-day settlement cycle",
          prior_attempts: "Number of previous failed debit attempts",
          days_since_salary: "Days elapsed since primary monthly salary credit",
          nearest_credit_distance: "Proximity to closest cash credit or gig payment"
        }
      };
    }
  }
};
