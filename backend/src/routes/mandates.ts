import { Router, Request, Response, NextFunction } from "express";
import { queries } from "../db/queries";
import { agentService } from "../services/agentService";
import { socketService } from "../services/socketService";

export const mandatesRouter = Router();

// GET /api/v1/mandates
mandatesRouter.get("/", (req: Request, res: Response): void => {
  const status = req.query.status as string | undefined;
  const category = req.query.category as string | undefined;
  const search = req.query.search as string | undefined;
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
  const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : 0;

  const { mandates, total } = queries.getMandates({ status, category, search, limit, offset });
  const metrics = queries.getLedgerMetrics();

  res.json({
    success: true,
    data: {
      mandates,
      total,
      limit,
      offset,
      metrics
    }
  });
});

// GET /api/v1/mandates/metrics
mandatesRouter.get("/metrics", (req: Request, res: Response): void => {
  const metrics = queries.getLedgerMetrics();
  res.json({ success: true, data: metrics });
});

// GET /api/v1/mandates/:id
mandatesRouter.get("/:id", (req: Request, res: Response): void => {
  const mandateId = req.params.id;
  const mandate = queries.getMandateById(mandateId);

  if (!mandate) {
    res.status(404).json({ success: false, error: `Mandate ${mandateId} not found` });
    return;
  }

  const customer = queries.getCustomerById(mandate.customer_id);
  const balanceCurve = queries.getBalanceCurve(mandate.customer_id);
  const auditLog = queries.getAuditLog(mandateId);
  const notifications = queries.getNotifications(mandateId);

  res.json({
    success: true,
    data: {
      mandate,
      customer,
      balanceCurve,
      auditLog,
      notifications
    }
  });
});

// POST /api/v1/mandates/:id/simulate-failure
// Triggers agent state machine for this mandate
mandatesRouter.post("/:id/simulate-failure", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const mandateId = req.params.id;
    const mandate = queries.getMandateById(mandateId);

    if (!mandate) {
      res.status(404).json({ success: false, error: `Mandate ${mandateId} not found` });
      return;
    }

    // Execute agent pipeline
    const decision = await agentService.processMandate(mandateId);
    const updatedMandate = queries.getMandateById(mandateId);
    const auditLog = queries.getAuditLog(mandateId);
    const latestAudit = auditLog[0];

    // Broadcast live update
    socketService.emitMandateUpdate(updatedMandate, latestAudit);
    if (decision.status === 'retry_scheduled') {
      socketService.emitRetryScheduled(updatedMandate, latestAudit);
    } else if (decision.status === 'escalated') {
      socketService.emitMandateEscalated(updatedMandate, latestAudit);
    }

    res.json({
      success: true,
      data: {
        decision,
        mandate: updatedMandate,
        audit: latestAudit
      }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/mandates/:id/simulate-debit
// Executes collection attempt on scheduled retry day
mandatesRouter.post("/:id/simulate-debit", (req: Request, res: Response): void => {
  const mandateId = req.params.id;
  const retryDay = req.body.day ? parseInt(req.body.day, 10) : undefined;

  const decision = agentService.executeDebitAttempt(mandateId, retryDay);
  const updatedMandate = queries.getMandateById(mandateId);
  const auditLog = queries.getAuditLog(mandateId);
  const latestAudit = auditLog[0];

  socketService.emitMandateUpdate(updatedMandate, latestAudit);
  if (decision.status === 'recovered') {
    socketService.emitMandateRecovered(updatedMandate, latestAudit);
  } else if (decision.status === 'escalated') {
    socketService.emitMandateEscalated(updatedMandate, latestAudit);
  }

  res.json({
    success: true,
    data: {
      decision,
      mandate: updatedMandate,
      audit: latestAudit
    }
  });
});
