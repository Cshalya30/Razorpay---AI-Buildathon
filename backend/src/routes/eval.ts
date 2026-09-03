import { Router, Request, Response } from "express";
import axios from "axios";
import { queries } from "../db/queries";
import { evalService } from "../services/evalService";

export const evalRouter = Router();

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://127.0.0.1:8000";

// GET /api/v1/eval/latest
evalRouter.get("/latest", (req: Request, res: Response): void => {
  const { baseline, model } = queries.getLatestEvalRuns();
  if (!baseline || !model) {
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
evalRouter.post("/run", (_req: Request, res: Response): void => {
  const comparison = evalService.runEvaluation();
  res.json({
    success: true,
    data: comparison
  });
});

// GET /api/v1/eval/model-benchmark
// Proxies telemetry from FastAPI ML service
evalRouter.get("/model-benchmark", async (_req: Request, res: Response): Promise<void> => {
  try {
    const mlResp = await axios.get(`${ML_SERVICE_URL}/model/benchmark`, { timeout: 2000 });
    res.json({
      success: true,
      data: mlResp.data
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: `Could not reach ML service at ${ML_SERVICE_URL}: ${err.message}`
    });
  }
});
