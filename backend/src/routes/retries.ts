import { Router, Request, Response } from "express";
import { db } from "../db/database";
import { queries, Mandate } from "../db/queries";
import { agentService } from "../services/agentService";
import { socketService } from "../services/socketService";

export const retriesRouter = Router();

// GET /api/v1/retries/upcoming
retriesRouter.get("/upcoming", (_req: Request, res: Response): void => {
  const retries = queries.getUpcomingRetries();
  
  // Calculate summary metrics
  const totalVolume = retries.reduce((sum, r) => sum + r.mandate_amount, 0);
  const avgProb = retries.length > 0 
    ? (retries.reduce((sum, r) => sum + (r.predicted_success_prob ?? 0), 0) / retries.length) * 100 
    : 0;

  // Day distribution
  const dayBuckets: Record<number, { count: number; volume: number }> = {};
  for (const r of retries) {
    const d = r.next_retry_day ?? 1;
    if (!dayBuckets[d]) {
      dayBuckets[d] = { count: 0, volume: 0 };
    }
    dayBuckets[d].count++;
    dayBuckets[d].volume += r.mandate_amount;
  }

  res.json({
    success: true,
    data: {
      retries,
      totalCount: retries.length,
      totalVolume,
      avgConfidence: Number(avgProb.toFixed(1)),
      dayBuckets
    }
  });
});

// POST /api/v1/retries/batch-execute
// Executes all scheduled debits for a given day in one operations batch
retriesRouter.post("/batch-execute", (req: Request, res: Response): void => {
  const targetDay = req.body.day ? parseInt(req.body.day, 10) : undefined;
  
  let candidates: Mandate[];
  if (targetDay !== undefined) {
    candidates = db.prepare(`
      SELECT * FROM mandates 
      WHERE status = 'retry_scheduled' AND next_retry_day = ?
    `).all(targetDay) as unknown as Mandate[];
  } else {
    candidates = db.prepare(`
      SELECT * FROM mandates 
      WHERE status = 'retry_scheduled'
    `).all() as unknown as Mandate[];
  }

  let recoveredCount = 0;
  let failedCount = 0;
  let recoveredAmount = 0;
  const executionResults = [];

  for (const m of candidates) {
    const decision = agentService.executeDebitAttempt(m.id, m.next_retry_day ?? targetDay);
    const updated = queries.getMandateById(m.id);
    const audit = queries.getAuditLog(m.id)[0];

    socketService.emitMandateUpdate(updated, audit);

    if (decision.status === 'recovered') {
      recoveredCount++;
      recoveredAmount += m.mandate_amount;
      socketService.emitMandateRecovered(updated, audit);
    } else {
      failedCount++;
      if (decision.status === 'escalated') {
        socketService.emitMandateEscalated(updated, audit);
      }
    }

    executionResults.push({
      mandate_id: m.id,
      status: decision.status,
      reason: decision.reason
    });
  }

  res.json({
    success: true,
    data: {
      targetDay: targetDay ?? "all",
      totalExecuted: candidates.length,
      recoveredCount,
      failedCount,
      recoveredAmount,
      results: executionResults
    }
  });
});
