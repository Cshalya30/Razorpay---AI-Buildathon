import { Router, Request, Response } from "express";
import { queries } from "../db/queries";
import { evalService } from "../services/evalService";

export const evalRouter = Router();

// GET /api/v1/eval/latest
evalRouter.get("/latest", (req: Request, res: Response): void => {
  const { baseline, model } = queries.getLatestEvalRuns();
  if (!baseline || !model) {
    // Run evaluation once if no runs exist
    const comparison = evalService.runEvaluation();
    res.json({ success: true, data: comparison });
    return;
  }

  const deltaRecoveryRate = Number((model.recovery_rate - baseline.recovery_rate).toFixed(1));
  const deltaRecoveredAmount = model.total_recovered - baseline.total_recovered;

  res.json({
    success: true,
    data: {
      baseline: {
        policy: 'baseline',
        totalAtRisk: baseline.total_at_risk,
        totalRecovered: baseline.total_recovered,
        recoveryRate: baseline.recovery_rate,
      },
      model: {
        policy: 'model',
        totalAtRisk: model.total_at_risk,
        totalRecovered: model.total_recovered,
        recoveryRate: model.recovery_rate,
      },
      deltaRecoveryRate,
      deltaRecoveredAmount,
      totalAtRisk: model.total_at_risk,
      runAt: model.run_at
    }
  });
});

// POST /api/v1/eval/run
// Re-runs both policies over the dataset deterministically
evalRouter.post("/run", (req: Request, res: Response): void => {
  const comparison = evalService.runEvaluation();
  res.json({
    success: true,
    data: comparison
  });
});
