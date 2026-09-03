import { Router, Request, Response } from "express";
import { queries } from "../db/queries";

export const retriesRouter = Router();

// GET /api/v1/retries/upcoming
retriesRouter.get("/upcoming", (req: Request, res: Response): void => {
  const retries = queries.getUpcomingRetries();
  res.json({
    success: true,
    data: retries
  });
});
