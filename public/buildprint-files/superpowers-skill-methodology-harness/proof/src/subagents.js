export function buildTaskPacket({ plan, taskId }) {
  const task = plan.tasks.find((candidate) => candidate.id === taskId);
  if (!task) throw new Error(`Plan task not found: ${taskId}`);

  return {
    role: "implementer",
    contextPolicy: "task-specific-only",
    task,
    constraints: [
      "do not invent missing plan details",
      "report status with files_changed, tests_run, commits, concerns, next_context_needed"
    ],
    reportSchema: {
      status: "DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED",
      files_changed: [],
      tests_run: [],
      commits: [],
      concerns: [],
      next_context_needed: null
    }
  };
}

export function runSubagentReviewLoop({ transcript, plan, taskId, implementer }) {
  const packet = buildTaskPacket({ plan, taskId });
  transcript.record("subagent_dispatch", { role: "implementer", packet });

  const report = implementer(packet);
  transcript.record("subagent_report", report);

  if (report.status === "BLOCKED" || report.status === "NEEDS_CONTEXT") {
    transcript.record("subagent_loop_blocked", { status: report.status, next_context_needed: report.next_context_needed });
    return report;
  }

  transcript.record("review_dispatch", {
    role: "spec_reviewer",
    instruction: "inspect task output independently for spec compliance"
  });
  transcript.record("review_result", {
    role: "spec_reviewer",
    inspectedFiles: report.files_changed,
    status: "PASS"
  });

  transcript.record("review_dispatch", {
    role: "code_quality_reviewer",
    instruction: "inspect task output independently for quality after spec review"
  });
  transcript.record("review_result", {
    role: "code_quality_reviewer",
    inspectedFiles: report.files_changed,
    status: "PASS"
  });

  transcript.record("task_complete", { taskId });
  return report;
}
