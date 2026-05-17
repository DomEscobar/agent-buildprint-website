import test from "node:test";
import assert from "node:assert/strict";
import { MethodologyHarness } from "../src/harness.js";
import { runEvalSuite } from "../src/eval.js";
import { runSubagentReviewLoop } from "../src/subagents.js";

test("clean session acceptance prompt bootstraps, looks up skills, and brainstorms before code", () => {
  const harness = new MethodologyHarness();
  const response = harness.respond("Let's make a react todo list");

  assert.equal(response.status, "NEEDS_DESIGN_APPROVAL");
  assert.equal(harness.transcript.all("bootstrap_loaded").length, 1);
  assert.ok(harness.transcript.happenedBefore("bootstrap_loaded", "skill_lookup"));
  assert.ok(harness.transcript.happenedBefore("skill_lookup", "skill_activated"));
  assert.deepEqual(
    harness.transcript.find("skill_lookup").selectedSkills,
    ["using-superpowers", "brainstorming", "test-driven-development"]
  );
  assert.equal(harness.transcript.find("production_change"), undefined);
});

test("bootstrap is idempotent across turns", () => {
  const harness = new MethodologyHarness();
  harness.respond("Let's make a react todo list");
  harness.respond("Add feature X");

  assert.equal(harness.transcript.all("bootstrap_loaded").length, 1);
  assert.equal(harness.transcript.all("bootstrap_skipped").length, 1);
});

test("approved design can become an exact task plan", () => {
  const harness = new MethodologyHarness();
  harness.approveDesign("Build a compact harness proof.");
  const response = harness.respond("approved design: write implementation plan");

  assert.equal(response.status, "PLAN_CREATED");
  assert.match(response.plan.path, /^docs\/superpowers\/plans\/2026-05-17-/);
  assert.deepEqual(response.plan.tasks[0].files.test, ["tests/harness.test.js"]);
  assert.ok(response.plan.tasks[0].steps.includes("Write failing test"));
});

test("production implementation is blocked until a failing test is observed", () => {
  const harness = new MethodologyHarness();

  assert.equal(harness.implementProductionChange({ files: ["src/new-feature.js"] }).status, "BLOCKED");
  harness.observeFailingTest({ command: "npm test", expectedFailure: "missing new feature" });
  assert.equal(harness.implementProductionChange({ files: ["src/new-feature.js"] }).status, "IMPLEMENTATION_ALLOWED");
});

test("subagent task loop uses task-specific packet and reviews spec before quality", () => {
  const harness = new MethodologyHarness();
  harness.approveDesign("Build a compact harness proof.");
  harness.createPlan("compact harness proof");

  runSubagentReviewLoop({
    transcript: harness.transcript,
    plan: harness.plan,
    taskId: 1,
    implementer: (packet) => {
      assert.equal(packet.contextPolicy, "task-specific-only");
      assert.equal(packet.task.id, 1);
      return {
        status: "DONE",
        files_changed: ["src/harness.js"],
        tests_run: ["npm test"],
        commits: [],
        concerns: [],
        next_context_needed: null
      };
    }
  });

  const dispatches = harness.transcript.all("review_dispatch");
  assert.equal(dispatches[0].role, "spec_reviewer");
  assert.equal(dispatches[1].role, "code_quality_reviewer");
  assert.ok(harness.transcript.happenedBefore("subagent_report", "task_complete"));
});

test("eval suite passes and records transcript evidence", () => {
  const result = runEvalSuite();

  assert.equal(result.failed, 0);
  assert.equal(result.passed, 5);
  assert.ok(result.results.every((item) => item.transcript?.length > 0));
});
