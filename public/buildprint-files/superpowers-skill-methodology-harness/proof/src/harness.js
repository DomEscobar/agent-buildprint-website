import { lookupSkills } from "./skills.js";
import { Transcript } from "./transcript.js";

export class MethodologyHarness {
  constructor({ registryPath = "src/skills.js" } = {}) {
    this.registryPath = registryPath;
    this.bootstrapLoaded = false;
    this.transcript = new Transcript();
    this.approvedDesign = null;
    this.plan = null;
    this.failingTestObserved = false;
    this.verificationEvidence = [];
  }

  startSession() {
    if (this.bootstrapLoaded) {
      this.transcript.record("bootstrap_skipped", { reason: "already_loaded" });
      return;
    }

    this.bootstrapLoaded = true;
    this.transcript.record("bootstrap_loaded", {
      registryPath: this.registryPath,
      rules: [
        "check relevant skills before action",
        "creative/build work needs approved design before implementation",
        "implementation needs failing test first",
        "completion needs verification evidence"
      ]
    });
  }

  respond(prompt) {
    this.startSession();
    const selectedSkills = lookupSkills(prompt);
    this.transcript.record("skill_lookup", {
      prompt,
      selectedSkills: selectedSkills.map((skill) => skill.name)
    });

    if (selectedSkills.some((skill) => skill.name === "systematic-debugging")) {
      return this.debug(prompt);
    }

    if (selectedSkills.some((skill) => skill.name === "subagent-driven-development")) {
      this.transcript.record("skill_activated", { skill: "subagent-driven-development" });
      return {
        status: "SUBAGENT_CONTRACT_REQUIRED",
        message: "Dispatch one task-specific implementer, then independent spec and quality reviewers."
      };
    }

    if (selectedSkills.some((skill) => skill.name === "brainstorming")) {
      return this.brainstorm(prompt);
    }

    if (selectedSkills.some((skill) => skill.name === "writing-plans")) {
      return this.createPlan(prompt);
    }

    if (selectedSkills.some((skill) => skill.name === "verification-before-completion")) {
      return this.finish();
    }

    return { status: "NO_OP", message: "No methodology workflow matched." };
  }

  brainstorm(prompt) {
    this.transcript.record("skill_activated", { skill: "brainstorming" });
    this.transcript.record("gate", {
      gate: "no_code_before_approved_design",
      result: "blocked_implementation",
      reason: "creative/build request requires accepted design first"
    });
    this.transcript.record("brainstorm_options", {
      options: [
        "minimal single-screen implementation",
        "componentized implementation with tests",
        "full app shell with persistence"
      ],
      recommended: "componentized implementation with tests"
    });
    return {
      status: "NEEDS_DESIGN_APPROVAL",
      message: "Brainstorming activated. No code will be written until a design/spec is approved."
    };
  }

  approveDesign(spec) {
    this.approvedDesign = {
      path: "docs/superpowers/specs/2026-05-17-methodology-harness-design.md",
      spec
    };
    this.transcript.record("design_approved", this.approvedDesign);
    return this.approvedDesign;
  }

  createPlan(topic = "methodology harness") {
    if (!this.approvedDesign) {
      this.transcript.record("gate", {
        gate: "approved_design_required",
        result: "blocked_plan",
        reason: "no approved design/spec recorded"
      });
      return { status: "BLOCKED", message: "Plan creation requires approved design/spec." };
    }

    this.transcript.record("skill_activated", { skill: "writing-plans" });
    this.plan = {
      path: "docs/superpowers/plans/2026-05-17-methodology-harness.md",
      tasks: [
        {
          id: 1,
          title: `Implement ${topic}`,
          files: {
            create: ["src/harness.js"],
            test: ["tests/harness.test.js"]
          },
          steps: [
            "Write failing test",
            "Run test and confirm expected failure",
            "Implement minimal code",
            "Run tests and confirm pass",
            "Commit"
          ]
        }
      ]
    };
    this.transcript.record("plan_created", this.plan);
    return { status: "PLAN_CREATED", plan: this.plan };
  }

  observeFailingTest({ command, expectedFailure }) {
    this.failingTestObserved = true;
    this.transcript.record("test_red_observed", { command, expectedFailure });
  }

  implementProductionChange({ files }) {
    this.transcript.record("skill_activated", { skill: "test-driven-development" });
    if (!this.failingTestObserved) {
      this.transcript.record("gate", {
        gate: "no_production_code_before_failing_test",
        result: "blocked_implementation",
        files
      });
      return { status: "BLOCKED", message: "Production code requires a failing test first." };
    }

    this.transcript.record("production_change", { files });
    return { status: "IMPLEMENTATION_ALLOWED" };
  }

  debug(prompt) {
    this.transcript.record("skill_activated", { skill: "systematic-debugging" });
    this.transcript.record("root_cause_evidence", {
      prompt,
      evidence: ["reproduce failure", "read full error", "trace bad data to origin"]
    });
    this.transcript.record("gate", {
      gate: "root_cause_before_fix",
      result: "fix_blocked_until_evidence"
    });
    return { status: "NEEDS_ROOT_CAUSE", message: "Gather root-cause evidence before proposing a fix." };
  }

  recordVerification(evidence) {
    this.verificationEvidence.push(evidence);
    this.transcript.record("verification_evidence", evidence);
  }

  finish() {
    this.transcript.record("skill_activated", { skill: "verification-before-completion" });
    if (this.verificationEvidence.length === 0) {
      this.transcript.record("gate", {
        gate: "completion_requires_evidence",
        result: "blocked_completion"
      });
      return { status: "BLOCKED", message: "Completion requires verification evidence." };
    }

    this.transcript.record("completion_claim", { evidence: this.verificationEvidence });
    return { status: "COMPLETE", evidence: this.verificationEvidence };
  }
}
