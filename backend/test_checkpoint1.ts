import { agentService } from "./src/services/agentService";
import { queries } from "./src/db/queries";

console.log("=== CHECKPOINT 1 VERIFICATION ===");

// 1. Test user-revoked mandate: MDT-1269
console.log("\n--- TEST 1: User-revoked mandate (MDT-1269) ---");
const revokedDecision = agentService.processMandate("MDT-1269");
console.log("Agent decision:", revokedDecision);
const revokedAudit = queries.getAuditLog("MDT-1269");
console.log("Audit log for MDT-1269:");
console.log(revokedAudit);

// 2. Test > ₹15,000 mandate with non-exempt category (PRD Part 9: MDT-1002, ?18,000 subscription)
console.log("\n--- TEST 2: Mandate > ₹15,000 non-exempt category ---");
// Ensure MDT-1002 has amount: 18000, category: 'subscription' per PRD Part 9
queries.updateMandate("MDT-1002", {
  mandate_amount: 18000,
  category: "subscription",
  status: "pending",
  attempts: 1
});

const afaDecision = agentService.processMandate("MDT-1002");
console.log("Agent decision:", afaDecision);
const afaAudit = queries.getAuditLog("MDT-1002");
console.log("Audit log for MDT-1002:");
console.log(afaAudit);
