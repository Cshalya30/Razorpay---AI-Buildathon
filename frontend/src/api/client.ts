import axios from "axios";
import { Mandate, Customer, BalancePoint, AuditLogEntry, NotificationRecord, LedgerMetrics, EvalComparison } from "../types";

const API_BASE = "/api/v1";

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
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

export const api = {
  async getMandates(params: { status?: string; category?: string; search?: string; limit?: number; offset?: number } = {}) {
    const res = await apiClient.get<{ success: boolean; data: { mandates: Mandate[]; total: number; metrics: LedgerMetrics } }>("/mandates", { params });
    return res.data.data;
  },

  async getMandateDetail(id: string) {
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
  },

  async simulateFailure(id: string) {
    const res = await apiClient.post<{ success: boolean; data: { decision: any; mandate: Mandate; audit: AuditLogEntry } }>(`/mandates/${id}/simulate-failure`);
    return res.data.data;
  },

  async simulateDebit(id: string, day?: number) {
    const res = await apiClient.post<{ success: boolean; data: { decision: any; mandate: Mandate; audit: AuditLogEntry } }>(`/mandates/${id}/simulate-debit`, { day });
    return res.data.data;
  },

  async getMetrics() {
    const res = await apiClient.get<{ success: boolean; data: LedgerMetrics }>("/mandates/metrics");
    return res.data.data;
  },

  async getUpcomingRetries() {
    const res = await apiClient.get<{ success: boolean; data: RetryQueueData }>("/retries/upcoming");
    return res.data.data;
  },

  async batchExecuteRetries(day?: number) {
    const res = await apiClient.post<{ success: boolean; data: any }>("/retries/batch-execute", { day });
    return res.data.data;
  },

  async getComplianceSummary() {
    const res = await apiClient.get<{ success: boolean; data: ComplianceSummary }>("/compliance/summary");
    return res.data.data;
  },

  async getLatestEval() {
    const res = await apiClient.get<{ success: boolean; data: EvalComparison }>("/eval/latest");
    return res.data.data;
  },

  async runEvaluation() {
    const res = await apiClient.post<{ success: boolean; data: EvalComparison }>("/eval/run");
    return res.data.data;
  },

  async getModelBenchmark() {
    const res = await apiClient.get<{ success: boolean; data: ModelBenchmarkData }>("/eval/model-benchmark");
    return res.data.data;
  }
};
