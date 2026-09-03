import { db } from "./database";

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
  category: 'subscription' | 'insurance' | 'mutual_fund_sip' | 'credit_card_bill' | 'other';
  mandate_amount: number;
  due_day: number;
  status: 'pending' | 'retry_scheduled' | 'recovered' | 'escalated' | 'stopped';
  attempts: number;
  next_retry_day: number | null;
  predicted_success_prob: number | null;
  created_at: string;
  customer_name?: string;
  upi_handle?: string;
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

export interface EvalRun {
  id: number;
  policy: 'baseline' | 'model';
  total_at_risk: number;
  total_recovered: number;
  recovery_rate: number;
  run_at: string;
}

export const queries = {
  getMandates(filters: { status?: string; category?: string; limit?: number; offset?: number; search?: string } = {}): { mandates: Mandate[]; total: number } {
    const conditions: string[] = [];
    const params: any[] = [];

    if (filters.status && filters.status !== 'all') {
      conditions.push('m.status = ?');
      params.push(filters.status);
    }
    if (filters.category && filters.category !== 'all') {
      conditions.push('m.category = ?');
      params.push(filters.category);
    }
    if (filters.search) {
      conditions.push('(m.id LIKE ? OR m.merchant_name LIKE ? OR c.name LIKE ?)');
      const s = `%${filters.search}%`;
      params.push(s, s, s);
    }

    const whereClause = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

    const countStmt = db.prepare(`
      SELECT COUNT(*) as cnt 
      FROM mandates m
      JOIN customers c ON m.customer_id = c.id
      ${whereClause}
    `);
    const total = (countStmt.get(...params) as any).cnt;

    const limit = filters.limit ?? 50;
    const offset = filters.offset ?? 0;

    const queryStmt = db.prepare(`
      SELECT m.*, c.name as customer_name, c.upi_handle
      FROM mandates m
      JOIN customers c ON m.customer_id = c.id
      ${whereClause}
      ORDER BY m.id ASC
      LIMIT ? OFFSET ?
    `);

    const mandates = queryStmt.all(...params, limit, offset) as unknown as Mandate[];
    return { mandates, total };
  },

  getMandateById(id: string): Mandate | null {
    const stmt = db.prepare(`
      SELECT m.*, c.name as customer_name, c.upi_handle
      FROM mandates m
      JOIN customers c ON m.customer_id = c.id
      WHERE m.id = ?
    `);
    const row = stmt.get(id);
    return (row as unknown as Mandate) || null;
  },

  updateMandate(id: string, updates: Partial<Mandate>): void {
    const fields: string[] = [];
    const values: any[] = [];

    for (const [key, val] of Object.entries(updates)) {
      fields.push(`${key} = ?`);
      values.push(val);
    }

    if (!fields.length) return;
    values.push(id);

    const stmt = db.prepare(`UPDATE mandates SET ${fields.join(', ')} WHERE id = ?`);
    stmt.run(...values);
  },

  getCustomerById(id: string): Customer | null {
    const stmt = db.prepare('SELECT * FROM customers WHERE id = ?');
    return (stmt.get(id) as unknown as Customer) || null;
  },

  getBalanceCurve(customerId: string): BalancePoint[] {
    const stmt = db.prepare('SELECT * FROM balance_curves WHERE customer_id = ? ORDER BY day ASC');
    return stmt.all(customerId) as unknown as BalancePoint[];
  },

  getAuditLog(mandateId: string): AuditLogEntry[] {
    const stmt = db.prepare('SELECT * FROM audit_log WHERE mandate_id = ? ORDER BY id DESC');
    return stmt.all(mandateId) as unknown as AuditLogEntry[];
  },

  insertAuditLog(mandateId: string, event: string, reason: string, actor: 'model' | 'rule_engine'): void {
    const stmt = db.prepare(`
      INSERT INTO audit_log (mandate_id, event, reason, actor, timestamp)
      VALUES (?, ?, ?, ?, datetime('now'))
    `);
    stmt.run(mandateId, event, reason, actor);
  },

  getNotifications(mandateId: string): NotificationRecord[] {
    const stmt = db.prepare('SELECT * FROM notifications WHERE mandate_id = ? ORDER BY id DESC');
    return stmt.all(mandateId) as unknown as NotificationRecord[];
  },

  insertNotification(data: Omit<NotificationRecord, 'id'>): void {
    const stmt = db.prepare(`
      INSERT INTO notifications (mandate_id, merchant_name, amount, scheduled_debit_at, sent_at, reason, notice_hours_before_debit, compliant)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      data.mandate_id,
      data.merchant_name,
      data.amount,
      data.scheduled_debit_at,
      data.sent_at,
      data.reason,
      data.notice_hours_before_debit,
      data.compliant
    );
  },

  getUpcomingRetries(): Mandate[] {
    const stmt = db.prepare(`
      SELECT m.*, c.name as customer_name, c.upi_handle
      FROM mandates m
      JOIN customers c ON m.customer_id = c.id
      WHERE m.status = 'retry_scheduled'
      ORDER BY m.next_retry_day ASC, m.mandate_amount DESC
    `);
    return stmt.all() as unknown as Mandate[];
  },

  getLedgerMetrics() {
    const totalRecoveredRow = db.prepare("SELECT COALESCE(SUM(mandate_amount), 0) as val FROM mandates WHERE status = 'recovered'").get() as any;
    const totalAtRiskRow = db.prepare("SELECT COALESCE(SUM(mandate_amount), 0) as val FROM mandates WHERE status IN ('pending', 'retry_scheduled')").get() as any;
    const totalEscalatedRow = db.prepare("SELECT COUNT(*) as val FROM mandates WHERE status = 'escalated'").get() as any;
    const totalStoppedRow = db.prepare("SELECT COUNT(*) as val FROM mandates WHERE status = 'stopped'").get() as any;
    const totalMandatesRow = db.prepare("SELECT COUNT(*) as val FROM mandates").get() as any;
    const recoveredCountRow = db.prepare("SELECT COUNT(*) as val FROM mandates WHERE status = 'recovered'").get() as any;

    const recoveredAmount = totalRecoveredRow.val;
    const atRiskAmount = totalAtRiskRow.val;
    const escalatedCount = totalEscalatedRow.val;
    const stoppedCount = totalStoppedRow.val;
    const totalMandates = totalMandatesRow.val;
    const recoveredCount = recoveredCountRow.val;

    const recoveryRate = totalMandates > 0 ? (recoveredCount / totalMandates) * 100 : 0;

    return {
      recoveredAmount,
      atRiskAmount,
      escalatedCount,
      stoppedCount,
      totalMandates,
      recoveredCount,
      recoveryRate: Number(recoveryRate.toFixed(1))
    };
  },

  getLatestEvalRuns(): { baseline: EvalRun | null; model: EvalRun | null } {
    const baseline = db.prepare("SELECT * FROM eval_runs WHERE policy = 'baseline' ORDER BY id DESC LIMIT 1").get() as unknown as EvalRun || null;
    const model = db.prepare("SELECT * FROM eval_runs WHERE policy = 'model' ORDER BY id DESC LIMIT 1").get() as unknown as EvalRun || null;
    return { baseline, model };
  },

  insertEvalRun(policy: 'baseline' | 'model', totalAtRisk: number, totalRecovered: number, recoveryRate: number): void {
    const stmt = db.prepare(`
      INSERT INTO eval_runs (policy, total_at_risk, total_recovered, recovery_rate, run_at)
      VALUES (?, ?, ?, ?, datetime('now'))
    `);
    stmt.run(policy, totalAtRisk, totalRecovered, recoveryRate);
  }
};
