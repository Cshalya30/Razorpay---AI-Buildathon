import fs from "fs";
import path from "path";
import { db, initDb } from "./database";

function parseCsv(content: string): string[][] {
  const lines = content.trim().split(/\r?\n/);
  const rows: string[][] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    // Simple CSV parser supporting standard values
    rows.push(line.split(","));
  }
  return rows;
}

export function seed() {
  console.log("Initializing database schema...");
  initDb();

  // Clear existing rows
  db.exec("DELETE FROM notifications;");
  db.exec("DELETE FROM audit_log;");
  db.exec("DELETE FROM mandates;");
  db.exec("DELETE FROM balance_curves;");
  db.exec("DELETE FROM customers;");
  db.exec("DELETE FROM eval_runs;");

  const seedsDir = path.resolve(__dirname, "../../../generator/seeds");

  // 1. Seed customers
  console.log("Seeding customers...");
  const customersRaw = fs.readFileSync(path.join(seedsDir, "customers.csv"), "utf-8");
  const customerRows = parseCsv(customersRaw);
  const insertCustomer = db.prepare(`
    INSERT INTO customers (id, name, upi_handle, irregular_income, salary_day, salary_amount, daily_burn, credit_days, credit_amounts)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const row of customerRows) {
    const [id, name, upi_handle, irregular_income, salary_day, monthly_inflow, daily_burn, credit_days, credit_amounts] = row;
    insertCustomer.run(
      id,
      name,
      upi_handle,
      irregular_income.toLowerCase() === "true" ? 1 : 0,
      salary_day ? parseInt(salary_day, 10) : null,
      parseFloat(monthly_inflow),
      parseFloat(daily_burn),
      credit_days || "",
      credit_amounts || ""
    );
  }

  // 2. Seed balance curves
  console.log("Seeding balance curves...");
  const balanceRaw = fs.readFileSync(path.join(seedsDir, "balance_history.csv"), "utf-8");
  const balanceRows = parseCsv(balanceRaw);
  const insertBalance = db.prepare(`
    INSERT INTO balance_curves (customer_id, day, balance)
    VALUES (?, ?, ?)
  `);

  for (const row of balanceRows) {
    const [customer_id, day, balance] = row;
    insertBalance.run(customer_id, parseInt(day, 10), parseFloat(balance));
  }

  // 3. Seed mandates
  console.log("Seeding mandates...");
  const mandatesRaw = fs.readFileSync(path.join(seedsDir, "mandates.csv"), "utf-8");
  const mandateRows = parseCsv(mandatesRaw);
  const insertMandate = db.prepare(`
    INSERT INTO mandates (id, customer_id, merchant_name, category, mandate_amount, due_day, status, attempts, next_retry_day, predicted_success_prob)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertAudit = db.prepare(`
    INSERT INTO audit_log (mandate_id, event, reason, actor, timestamp)
    VALUES (?, ?, ?, ?, ?)
  `);

  for (const row of mandateRows) {
    const [id, customer_id, merchant_name, category, mandate_amount, due_day, outcome, attempts] = row;
    const numAttempts = parseInt(attempts, 10) || 0;
    let status = "pending";
    if (outcome === "success") {
      status = "recovered";
    } else if (outcome === "user_revoked") {
      status = "stopped";
    } else if (numAttempts >= 4) {
      status = "escalated";
    } else {
      status = "pending";
    }

    insertMandate.run(
      id,
      customer_id,
      merchant_name,
      category,
      parseFloat(mandate_amount),
      parseInt(due_day, 10),
      status,
      numAttempts,
      null,
      null
    );

    // Initial audit entry
    if (outcome === "user_revoked") {
      insertAudit.run(
        id,
        "stopped",
        "Mandate stopped: user revoked debit authorization",
        "rule_engine",
        new Date().toISOString()
      );
    } else if (outcome === "failed_insufficient_balance") {
      insertAudit.run(
        id,
        "failed",
        `Debit attempt failed on scheduled due day ${due_day}: insufficient account balance`,
        "rule_engine",
        new Date().toISOString()
      );
    }
  }

  // 4. Seed notifications
  console.log("Seeding notifications...");
  const notifRaw = fs.readFileSync(path.join(seedsDir, "notifications_seed.csv"), "utf-8");
  const notifRows = parseCsv(notifRaw);
  const insertNotif = db.prepare(`
    INSERT INTO notifications (mandate_id, merchant_name, amount, scheduled_debit_at, sent_at, reason, notice_hours_before_debit, compliant)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const row of notifRows) {
    const [mandate_id, merchant_name, amount, due_day, notice_hours_before_debit, compliant, reason] = row;
    const dueDayNum = parseInt(due_day, 10) || 1;
    const noticeHours = parseFloat(notice_hours_before_debit);
    const debitTime = new Date(`2026-09-${String(dueDayNum).padStart(2, "0")}T06:00:00.000Z`);
    const sentTime = new Date(debitTime.getTime() - noticeHours * 3600 * 1000);

    insertNotif.run(
      mandate_id,
      merchant_name,
      parseFloat(amount),
      debitTime.toISOString(),
      sentTime.toISOString(),
      reason,
      noticeHours,
      compliant.toLowerCase() === "true" ? 1 : 0
    );
  }

  console.log("Database seeded successfully!");
}

if (require.main === module) {
  seed();
}
