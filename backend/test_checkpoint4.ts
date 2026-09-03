import { evalService } from "./src/services/evalService";

console.log("=== CHECKPOINT 4: EVAL DETERMINISM VERIFICATION ===");

console.log("\n--- EVAL RUN 1 ---");
const run1 = evalService.runEvaluation();
console.log(JSON.stringify(run1, null, 2));

console.log("\n--- EVAL RUN 2 ---");
const run2 = evalService.runEvaluation();
console.log(JSON.stringify(run2, null, 2));

// Verify equality
const run1Str = JSON.stringify({ ...run1, runAt: "" });
const run2Str = JSON.stringify({ ...run2, runAt: "" });

if (run1Str === run2Str) {
  console.log("\nPASSED: Both evaluation runs produced 100% IDENTICAL, DETERMINISTIC results!");
  console.log(`Baseline Recovery Rate: ${run1.baseline.recoveryRate}% (?${run1.baseline.totalRecovered.toLocaleString('en-IN')})`);
  console.log(`Model Recovery Rate:    ${run1.model.recoveryRate}% (?${run1.model.totalRecovered.toLocaleString('en-IN')})`);
  console.log(`Net Delta:              +${run1.deltaRecoveryRate} percentage points (+?${run1.deltaRecoveredAmount.toLocaleString('en-IN')})`);
} else {
  console.error("\nFAILED: Runs produced non-deterministic results!");
  process.exit(1);
}
