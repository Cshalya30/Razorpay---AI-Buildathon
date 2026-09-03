import { agentService } from "./src/services/agentService";
import { queries } from "./src/db/queries";

async function runCheckpoint3() {
  console.log("=== CHECKPOINT 3: FIVE NAMED DEMO SCENARIOS ===");

  // Ensure demo scenario data is correctly seeded for MDT-1001 to MDT-1005 per PRD Part 9:
  
  // Scenario 1: MDT-1001 (Predictable salary-day recovery)
  // CUST-0001 (salary on day 5 = 22,000, day 4 bal = 389.67, day 5 bal = 21,841.4)
  queries.updateMandate("MDT-1001", {
    customer_id: "CUST-0001",
    merchant_name: "Netflix India",
    category: "subscription",
    mandate_amount: 499,
    due_day: 4,
    status: "pending",
    attempts: 1,
    next_retry_day: null
  });

  // Scenario 2: MDT-1002 (High mandate amount ?18,000 subscription -> AFA stopped)
  queries.updateMandate("MDT-1002", {
    customer_id: "CUST-0002",
    merchant_name: "AWS Cloud Services",
    category: "subscription",
    mandate_amount: 18000,
    due_day: 10,
    status: "pending",
    attempts: 1,
    next_retry_day: null
  });

  // Scenario 3: MDT-1003 (Erratic balance curve -> Model picks a day, fails, retries again)
  // CUST-0022 has irregular income (salary_day=null). Balance on day 17 is 0.0, day 18 is 0.0, day 19 is 0.0
  queries.updateMandate("MDT-1003", {
    customer_id: "CUST-0022",
    merchant_name: "Cult.fit Membership",
    category: "subscription",
    mandate_amount: 1199,
    due_day: 16,
    status: "pending",
    attempts: 1,
    next_retry_day: null
  });

  // Scenario 4: MDT-1004 (4 failed attempts -> Escalated retry cap hit)
  queries.updateMandate("MDT-1004", {
    customer_id: "CUST-0004",
    merchant_name: "Spotify Premium",
    category: "subscription",
    mandate_amount: 119,
    due_day: 7,
    status: "pending",
    attempts: 4,
    next_retry_day: null
  });

  // Scenario 5: MDT-1005 (Explicit revoke signal -> Stopped)
  queries.updateMandate("MDT-1005", {
    customer_id: "CUST-0003",
    merchant_name: "Amazon Prime",
    category: "subscription",
    mandate_amount: 1499,
    due_day: 12,
    status: "stopped",
    attempts: 0,
    next_retry_day: null
  });
  queries.insertAuditLog("MDT-1005", "stopped", "Mandate stopped: customer revoked debit authorization", "rule_engine");

  // RUN SCENARIOS:

  console.log("\n--------------------------------------------------");
  console.log("SCENARIO 1: MDT-1001 (Predictable Salary Day)");
  console.log("--------------------------------------------------");
  const s1Schedule = await agentService.processMandate("MDT-1001");
  console.log("1. Scheduling Decision:", {
    status: s1Schedule.status,
    event: s1Schedule.event,
    actor: s1Schedule.actor,
    next_retry_day: s1Schedule.next_retry_day,
    prob: s1Schedule.predicted_success_prob,
    reason: s1Schedule.reason
  });
  const s1Debit = agentService.executeDebitAttempt("MDT-1001");
  console.log("2. Debit Execution:", {
    status: s1Debit.status,
    event: s1Debit.event,
    reason: s1Debit.reason
  });
  console.log("Outcome Category:", s1Debit.status === 'recovered' ? "RECOVERED (PASS)" : "FAILED");

  console.log("\n--------------------------------------------------");
  console.log("SCENARIO 2: MDT-1002 (High Amount Non-Exempt > ?15,000)");
  console.log("--------------------------------------------------");
  const s2 = await agentService.processMandate("MDT-1002");
  console.log("Decision:", {
    status: s2.status,
    event: s2.event,
    actor: s2.actor,
    reason: s2.reason
  });
  console.log("Outcome Category:", s2.event === 'afa_required' && s2.status === 'stopped' ? "AFA-STOPPED (PASS)" : "FAILED");

  console.log("\n--------------------------------------------------");
  console.log("SCENARIO 3: MDT-1003 (Erratic Balance Curve / Honest Failure)");
  console.log("--------------------------------------------------");
  const s3Schedule = await agentService.processMandate("MDT-1003");
  console.log("1. Scheduling Decision:", {
    status: s3Schedule.status,
    event: s3Schedule.event,
    actor: s3Schedule.actor,
    next_retry_day: s3Schedule.next_retry_day,
    prob: s3Schedule.predicted_success_prob,
    reason: s3Schedule.reason
  });
  // Simulate debit on a day where balance ran out (e.g. day 17, 18, 19, or 20 where CUST-0022 has 0.0)
  const s3Debit = agentService.executeDebitAttempt("MDT-1003", 18);
  console.log("2. Debit Execution on zero-balance day 18:", {
    status: s3Debit.status,
    event: s3Debit.event,
    reason: s3Debit.reason
  });
  console.log("Outcome Category:", s3Debit.status === 'pending' && s3Debit.event === 'retry_failed' ? "RETRIED-AND-FAILED-AGAIN (PASS)" : "FAILED");

  console.log("\n--------------------------------------------------");
  console.log("SCENARIO 4: MDT-1004 (Retry Cap of 4 Attempts Hit)");
  console.log("--------------------------------------------------");
  const s4 = await agentService.processMandate("MDT-1004");
  console.log("Decision:", {
    status: s4.status,
    event: s4.event,
    actor: s4.actor,
    reason: s4.reason
  });
  console.log("Outcome Category:", s4.status === 'escalated' && s4.event === 'max_retries_reached' ? "ESCALATED (PASS)" : "FAILED");

  console.log("\n--------------------------------------------------");
  console.log("SCENARIO 5: MDT-1005 (Explicit User Revocation)");
  console.log("--------------------------------------------------");
  const s5 = await agentService.processMandate("MDT-1005");
  console.log("Decision:", {
    status: s5.status,
    event: s5.event,
    actor: s5.actor,
    reason: s5.reason
  });
  console.log("Outcome Category:", s5.status === 'stopped' ? "REVOKED-STOPPED (PASS)" : "FAILED");
}

runCheckpoint3().catch(err => {
  console.error("Checkpoint 3 failed with error:", err);
  process.exit(1);
});
