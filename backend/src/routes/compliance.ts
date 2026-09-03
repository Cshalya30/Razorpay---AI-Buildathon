import { Router, Request, Response } from "express";
import { db } from "../db/database";
import { queries } from "../db/queries";

export const complianceRouter = Router();

// GET /api/v1/compliance/summary
// Aggregated RBI compliance scorecard
complianceRouter.get("/summary", (_req: Request, res: Response): void => {
  const totalNotices = (db.prepare("SELECT COUNT(*) as cnt FROM notifications").get() as any).cnt;
  const compliantNotices = (db.prepare("SELECT COUNT(*) as cnt FROM notifications WHERE compliant = 1 AND notice_hours_before_debit >= 24").get() as any).cnt;
  const nonCompliantNotices = (db.prepare("SELECT COUNT(*) as cnt FROM notifications WHERE compliant = 0 OR notice_hours_before_debit < 24").get() as any).cnt;

  const afaStops = (db.prepare("SELECT COUNT(*) as cnt FROM audit_log WHERE event = 'afa_required'").get() as any).cnt;
  const capStops = (db.prepare("SELECT COUNT(*) as cnt FROM audit_log WHERE event = 'max_retries_reached'").get() as any).cnt;
  const revokeStops = (db.prepare("SELECT COUNT(*) as cnt FROM audit_log WHERE event = 'stopped' AND reason LIKE '%revok%'").get() as any).cnt;

  // Recent regulatory notices
  const recentNotices = db.prepare(`
    SELECT n.*, m.category, m.mandate_amount 
    FROM notifications n
    JOIN mandates m ON n.mandate_id = m.id
    ORDER BY n.id DESC
    LIMIT 20
  `).all();

  res.json({
    success: true,
    data: {
      scorecard: {
        totalNotices,
        compliantNotices,
        nonCompliantNotices,
        complianceRate: totalNotices > 0 ? Number(((compliantNotices / totalNotices) * 100).toFixed(1)) : 100,
        afaStops,
        capStops,
        revokeStops
      },
      recentNotices
    }
  });
});

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

// GET /api/v1/compliance/export
// Downloadable statutory regulatory audit trail
complianceRouter.get("/export", (req: Request, res: Response): void => {
  const format = req.query.format === "csv" ? "csv" : "json";
  const rows = db.prepare(`
    SELECT a.id, a.timestamp, a.mandate_id, a.actor, a.event, a.reason, m.mandate_amount, m.category, m.status
    FROM audit_log a
    JOIN mandates m ON a.mandate_id = m.id
    ORDER BY a.id ASC
  `).all() as any[];

  if (format === "csv") {
    const headers = "id,timestamp,mandate_id,actor,event,reason,mandate_amount,category,status\n";
    const csvContent = rows.map(r => 
      `${r.id},"${r.timestamp}","${r.mandate_id}","${r.actor}","${r.event}","${r.reason.replace(/"/g, '""')}",${r.mandate_amount},"${r.category}","${r.status}"`
    ).join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="rbi_mandate_statutory_audit.csv"');
    res.send(headers + csvContent);
    return;
  }

  res.json({
    success: true,
    exported_at: new Date().toISOString(),
    total_records: rows.length,
    data: rows
  });
});
