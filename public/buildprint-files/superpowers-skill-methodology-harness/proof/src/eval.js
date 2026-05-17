import { MethodologyHarness } from "./harness.js";
import { runSubagentReviewLoop } from "./subagents.js";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

export function runEvalSuite() {
  const results = [
    evalTodoPrompt(),
    evalTddGate(),
    evalSubagentLoop(),
    evalDebuggingGate(),
    evalCompletionGate()
  ];

  return {
    passed: results.filter((result) => result.status === "PASS").length,
    failed: results.filter((result) => result.status === "FAIL").length,
    results
  };
}

function runCase(name, fn) {
  try {
    const transcript = fn();
    return { name, status: "PASS", transcript: transcript.toJSON() };
  } catch (error) {
    return { name, status: "FAIL", error: error.message };
  }
}

function evalTodoPrompt() {
  return runCase("acceptance prompt activates brainstorming before code", () => {
    const harness = new MethodologyHarness();
    const response = harness.respond("Let's make a react todo list");
    assert(response.status === "NEEDS_DESIGN_APPROVAL", "expected design approval gate");
    assert(harness.transcript.happenedBefore("skill_lookup", "skill_activated"), "skill lookup must precede activation");
    assert(!harness.transcript.find("production_change"), "must not write implementation code");
    assert(harness.transcript.find("brainstorm_options"), "must present brainstorming options");
    return harness.transcript;
  });
}

function evalTddGate() {
  return runCase("TDD gate catches implementation before failing test", () => {
    const harness = new MethodologyHarness();
    const response = harness.implementProductionChange({ files: ["src/feature.js"] });
    assert(response.status === "BLOCKED", "expected blocked production change");
    assert(harness.transcript.find("gate").gate === "no_production_code_before_failing_test", "expected TDD gate");
    return harness.transcript;
  });
}

function evalSubagentLoop() {
  return runCase("subagent loop uses task packet and review order", () => {
    const harness = new MethodologyHarness();
    harness.approveDesign("Build a neutral proof harness.");
    harness.createPlan("neutral proof harness");
    runSubagentReviewLoop({
      transcript: harness.transcript,
      plan: harness.plan,
      taskId: 1,
      implementer: () => ({
        status: "DONE",
        files_changed: ["src/harness.js", "tests/harness.test.js"],
        tests_run: ["npm test"],
        commits: [],
        concerns: [],
        next_context_needed: null
      })
    });
    const specReview = harness.transcript.events.find((event) => event.role === "spec_reviewer");
    const qualityReview = harness.transcript.events.find((event) => event.role === "code_quality_reviewer");
    assert(specReview.seq < qualityReview.seq, "spec review must precede quality review");
    assert(harness.transcript.find("subagent_dispatch").packet.contextPolicy === "task-specific-only", "subagent context must be narrow");
    return harness.transcript;
  });
}

function evalDebuggingGate() {
  return runCase("debugging gathers evidence before fix", () => {
    const harness = new MethodologyHarness();
    harness.respond("Fix this failing test");
    assert(harness.transcript.happenedBefore("root_cause_evidence", "gate"), "root-cause evidence must precede fix gate");
    assert(!harness.transcript.find("production_change"), "debug prompt must not patch first");
    return harness.transcript;
  });
}

function evalCompletionGate() {
  return runCase("completion requires verification evidence", () => {
    const harness = new MethodologyHarness();
    const blocked = harness.respond("I am done");
    assert(blocked.status === "BLOCKED", "completion without evidence should block");
    harness.recordVerification({ command: "npm test", result: "pass" });
    const complete = harness.respond("I am done");
    assert(complete.status === "COMPLETE", "completion with evidence should pass");
    return harness.transcript;
  });
}
