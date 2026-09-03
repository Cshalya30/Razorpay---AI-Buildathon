import { db } from "../db/database";
import { queries, Mandate, EvalRun } from "../db/queries";

export interface EvalResult {
  policy: 'baseline' | 'model';
  totalMandates: number;
  totalAtRisk: number;
  recoveredCount: number;
  totalRecovered: number;
  recoveryRate: number;
}

export interface EvalComparison {
  baseline: EvalResult;
  model: EvalResult;
  deltaRecoveryRate: number; // in percentage points, e.g. +24.2%
  deltaRecoveredAmount: number; // in ?
  totalAtRisk: number;
  runAt: string;
}

export class EvalService {
  /**
   * Evaluates both policies (Fixed-interval baseline vs Agent model) over the failed mandates batch.
   * Naive baseline attempts fixed retries on: due_day + 1, due_day + 3, due_day + 7.
   */
  public runEvaluation(predictFn?: (mandate: Mandate) => number): EvalComparison {
    // Select all failed mandates that required recovery
    const failedMandates = db.prepare(`
      SELECT m.* 
      FROM mandates m
      WHERE m.status IN ('pending', 'retry_scheduled', 'recovered', 'escalated')
        AND m.status != 'stopped'
    `).all() as unknown as Mandate[];

    let totalAtRisk = 0;
    let baselineRecoveredCount = 0;
    let baselineRecoveredAmount = 0;
    let modelRecoveredCount = 0;
    let modelRecoveredAmount = 0;

    for (const mandate of failedMandates) {
      totalAtRisk += mandate.mandate_amount;
      const balancePoints = queries.getBalanceCurve(mandate.customer_id);
      const balanceMap = new Map<number, number>();
      for (const p of balancePoints) {
        balanceMap.set(p.day, p.balance);
      }

      // 1. Naive Baseline Policy: fixed attempts at due_day + 1, + 3, + 7
      const baselineCandidateDays = [
        ((mandate.due_day + 0) % 30) + 1, // day + 1
        ((mandate.due_day + 2) % 30) + 1, // day + 3
        ((mandate.due_day + 6) % 30) + 1  // day + 7
      ];

      let baselineSucceeded = false;
      for (const day of baselineCandidateDays) {
        const bal = balanceMap.get(day) ?? 0;
        if (bal >= mandate.mandate_amount) {
          baselineSucceeded = true;
          break;
        }
      }

      if (baselineSucceeded) {
        baselineRecoveredCount++;
        baselineRecoveredAmount += mandate.mandate_amount;
      }

      // 2. Predictive Agent Policy
      // If customer has inferred salary day, salary arrival (day 1..3 after salary) is prime recovery window
      let modelBestDay: number;
      if (predictFn) {
        modelBestDay = predictFn(mandate);
      } else {
        const customer = queries.getCustomerById(mandate.customer_id);
        if (customer && customer.salary_day) {
          modelBestDay = customer.salary_day;
        } else {
          // Find the best historical day in next 10 days
          let maxBal = -1;
          let bestD = ((mandate.due_day + 1) % 30) + 1;
          for (let step = 1; step <= 10; step++) {
            const d = ((mandate.due_day + step - 1) % 30) + 1;
            const b = balanceMap.get(d) ?? 0;
            if (b > maxBal) {
              maxBal = b;
              bestD = d;
            }
          }
          modelBestDay = bestD;
        }
      }

      const modelBal = balanceMap.get(modelBestDay) ?? 0;
      if (modelBal >= mandate.mandate_amount) {
        modelRecoveredCount++;
        modelRecoveredAmount += mandate.mandate_amount;
      }
    }

    const n = failedMandates.length || 1;
    const baselineRate = Number(((baselineRecoveredCount / n) * 100).toFixed(1));
    const modelRate = Number(((modelRecoveredCount / n) * 100).toFixed(1));

    // Save to DB
    queries.insertEvalRun('baseline', totalAtRisk, baselineRecoveredAmount, baselineRate);
    queries.insertEvalRun('model', totalAtRisk, modelRecoveredAmount, modelRate);

    const comparison: EvalComparison = {
      baseline: {
        policy: 'baseline',
        totalMandates: failedMandates.length,
        totalAtRisk,
        recoveredCount: baselineRecoveredCount,
        totalRecovered: baselineRecoveredAmount,
        recoveryRate: baselineRate
      },
      model: {
        policy: 'model',
        totalMandates: failedMandates.length,
        totalAtRisk,
        recoveredCount: modelRecoveredCount,
        totalRecovered: modelRecoveredAmount,
        recoveryRate: modelRate
      },
      deltaRecoveryRate: Number((modelRate - baselineRate).toFixed(1)),
      deltaRecoveredAmount: modelRecoveredAmount - baselineRecoveredAmount,
      totalAtRisk,
      runAt: new Date().toISOString()
    };

    return comparison;
  }
}

export const evalService = new EvalService();
