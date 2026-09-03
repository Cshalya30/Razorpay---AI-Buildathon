import { Router, Request, Response } from "express";
import { queries } from "../db/queries";

export const complianceRouter = Router();

// GET /api/v1/compliance/:mandate_id/notifications
complianceRouter.get("/:mandate_id/notifications", (req: Request, res: Response): void => {
  const mandateId = req.params.mandate_id;
  const notifications = queries.getNotifications(mandateId);
  const auditLog = queries.getAuditLog(mandateId);

  res.json({
    success: true,
    data: {
      mandate_id: mandateId,
      notifications,
      auditLog: auditLog.filter(a => a.actor === 'rule_engine')
    }
  });
});
