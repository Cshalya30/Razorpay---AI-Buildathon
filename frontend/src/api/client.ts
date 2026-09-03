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
    const res = await apiClient.get<{ success: boolean; data: Mandate[] }>("/retries/upcoming");
    return res.data.data;
  },

  async getLatestEval() {
    const res = await apiClient.get<{ success: boolean; data: EvalComparison }>("/eval/latest");
    return res.data.data;
  },

  async runEvaluation() {
    const res = await apiClient.post<{ success: boolean; data: EvalComparison }>("/eval/run");
    return res.data.data;
  }
};
