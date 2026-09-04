import { queries, Mandate } from "../db/queries";
import { mlService, PredictResponse } from "./mlService";

export interface AgentDecision {
  mandate_id: string;
  status: 'pending' | 'retry_scheduled' | 'recovered' | 'escalated' | 'stopped';
  event: string;
  reason: string;
  actor: 'model' | 'rule_engine';
  next_retry_day?: number | null;
  predicted_success_prob?: number | null;
  prediction_data?: PredictResponse | null;
}

const AFA_EXEMPT_CATEGORIES = new Set(['insurance', 'mutual_fund_sip', 'credit_card_bill']);

export class AgentService {
  /**
   * Evaluates compliance gates first (deterministic rule engine).
   * Only if all gates pass does it consult the ML service for timing.
   */
  public async processMandate(mandateId: string): Promise<AgentDecision> {
    const mandate = queries.getMandateById(mandateId);
    if (!mandate) {
      throw new Error(`Mandate ${mandateId} not found`);
    }

    const customer = queries.getCustomerById(mandate.customer_id);
    if (!customer) {
      throw new Error(`Customer ${mandate.customer_id} not found for mandate ${mandateId}`);
    }

    // Gate 1: Check Revocation
    const existingAudit = queries.getAuditLog(mandateId);
    const isRevoked = mandate.status === 'stopped' || existingAudit.some(a => a.reason.toLowerCase().includes('revok'));
    if (isRevoked) {
      queries.updateMandate(mandateId, { status: 'stopped', next_retry_day: null });
      const reason = "Mandate stopped: customer revoked debit authorization. Rule engine prohibits retry on churned mandate.";
      queries.insertAuditLog(mandateId, "stopped", reason, "rule_engine");
      return {
        mandate_id: mandateId,
        status: "stopped",
        event: "stopped",
        reason,
        actor: "rule_engine"
      };
    }

    // Gate 2: Check AFA Threshold (> ₹15,000 outside exempt categories)
    if (mandate.mandate_amount > 15000 && !AFA_EXEMPT_CATEGORIES.has(mandate.category)) {
      queries.updateMandate(mandateId, { status: 'stopped', next_retry_day: null });
      const reason = `Mandate amount ?${mandate.mandate_amount.toLocaleString('en-IN')} exceeds ₹15,000 threshold for non-exempt category '${mandate.category}'. Additional Factor of Authentication (AFA) required.`;
      queries.insertAuditLog(mandateId, "afa_required", reason, "rule_engine");
      return {
        mandate_id: mandateId,
        status: "stopped",
        event: "afa_required",
        reason,
        actor: "rule_engine"
      };
    }

    // Gate 3: Check Retry Cap (4 attempts max)
    if (mandate.attempts >= 4) {
      queries.updateMandate(mandateId, { status: 'escalated', next_retry_day: null });
      const reason = `Maximum retry attempts limit reached (${mandate.attempts} attempts). Escalated to merchant ops.`;
      queries.insertAuditLog(mandateId, "max_retries_reached", reason, "rule_engine");
      return {
        mandate_id: mandateId,
        status: "escalated",
        event: "max_retries_reached",
        reason,
        actor: "rule_engine"
      };
    }

    // Gate 4: 24-hour pre-debit notification check
    const notifications = queries.getNotifications(mandateId);
    const hasNonCompliant = notifications.some(n => n.compliant === 0 || n.notice_hours_before_debit < 24);
    if (hasNonCompliant || notifications.length === 0) {
      const scheduledDebit = new Date();
      scheduledDebit.setHours(scheduledDebit.getHours() + 26);
      queries.insertNotification({
        mandate_id: mandateId,
        merchant_name: mandate.merchant_name,
        amount: mandate.mandate_amount,
        scheduled_debit_at: scheduledDebit.toISOString(),
        sent_at: new Date().toISOString(),
        reason: "Pre-debit notification dispatched 24h prior to debit",
        notice_hours_before_debit: 26,
        compliant: 1
      });
      queries.insertAuditLog(
        mandateId,
        "notification_sent",
        "Dispatched mandatory 24-hour pre-debit notice before scheduling retry debit",
        "rule_engine"
      );
    }

    // Gate 5: GATES PASSED -> Call ML Service for Timing Prediction
    const balancePoints = queries.getBalanceCurve(mandate.customer_id);
    const prediction = await mlService.predictRetry(mandate, customer, balancePoints);

    // Format explainability caption
    const topFeature = Object.entries(prediction.feature_importances)
      .sort((a, b) => b[1] - a[1])[0];
    const featureExplainer = topFeature 
      ? `Model prioritized ${topFeature[0].replace(/_/g, ' ')} (${(topFeature[1] * 100).toFixed(0)}% weight).`
      : "";

    const scheduleReason = `Scheduled retry debit for day ${prediction.best_day} with ${(prediction.predicted_success_prob * 100).toFixed(1)}% recovery probability. ${featureExplainer}`;

    queries.updateMandate(mandateId, {
      status: 'retry_scheduled',
      next_retry_day: prediction.best_day,
      predicted_success_prob: prediction.predicted_success_prob
    });

    queries.insertAuditLog(mandateId, "retry_scheduled", scheduleReason, "model");

    return {
      mandate_id: mandateId,
      status: "retry_scheduled",
      event: "retry_scheduled",
      reason: scheduleReason,
      actor: "model",
      next_retry_day: prediction.best_day,
      predicted_success_prob: prediction.predicted_success_prob,
      prediction_data: prediction
    };
  }

  /**
   * Executes a collection attempt on the scheduled retry day.
   */
  public executeDebitAttempt(mandateId: string, retryDay?: number): AgentDecision {
    const mandate = queries.getMandateById(mandateId);
    if (!mandate) {
      throw new Error(`Mandate ${mandateId} not found`);
    }

    const dayToDebit = retryDay ?? mandate.next_retry_day ?? mandate.due_day;
    const balanceCurve = queries.getBalanceCurve(mandate.customer_id);
    const balancePoint = balanceCurve.find(p => p.day === dayToDebit);
    const balance = balancePoint ? balancePoint.balance : 0;

    if (balance >= mandate.mandate_amount) {
      queries.updateMandate(mandateId, {
        status: 'recovered',
        next_retry_day: null
      });
      const reason = `Mandate successfully recovered on day ${dayToDebit}. Customer balance ?${balance.toLocaleString('en-IN')} was sufficient for ?${mandate.mandate_amount.toLocaleString('en-IN')}.`;
      queries.insertAuditLog(mandateId, "recovered", reason, "rule_engine");
      return {
        mandate_id: mandateId,
        status: "recovered",
        event: "recovered",
        reason,
        actor: "rule_engine"
      };
    } else {
      const newAttempts = mandate.attempts + 1;
      if (newAttempts >= 4) {
        queries.updateMandate(mandateId, {
          status: 'escalated',
          attempts: newAttempts,
          next_retry_day: null
        });
        const reason = `Debit attempt on day ${dayToDebit} failed (balance ?${balance.toLocaleString('en-IN')} < ?${mandate.mandate_amount.toLocaleString('en-IN')}). Retry cap of 4 reached; escalated to merchant ops.`;
        queries.insertAuditLog(mandateId, "max_retries_reached", reason, "rule_engine");
        return {
          mandate_id: mandateId,
          status: "escalated",
          event: "max_retries_reached",
          reason,
          actor: "rule_engine"
        };
      } else {
        queries.updateMandate(mandateId, {
          status: 'pending',
          attempts: newAttempts,
          next_retry_day: null
        });
        const reason = `Debit attempt on day ${dayToDebit} failed (insufficient balance ?${balance.toLocaleString('en-IN')}). Attempt ${newAttempts}/4 recorded.`;
        queries.insertAuditLog(mandateId, "retry_failed", reason, "rule_engine");
        return {
          mandate_id: mandateId,
          status: "pending",
          event: "retry_failed",
          reason,
          actor: "rule_engine"
        };
      }
    }
  }
}

export const agentService = new AgentService();
