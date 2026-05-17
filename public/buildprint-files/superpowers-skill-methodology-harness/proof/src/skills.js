export const skills = [
  {
    name: "using-superpowers",
    description: "Use at session bootstrap and before any user-task response to require skill lookup before action.",
    gates: ["skill_lookup_before_action", "bootstrap_once"]
  },
  {
    name: "brainstorming",
    description: "Use when the user has a rough creative, build, app, feature, or design idea that needs shaping before implementation.",
    gates: ["no_code_before_approved_design"]
  },
  {
    name: "writing-plans",
    description: "Use after an approved design/spec to create tiny implementation tasks with exact files and checks.",
    gates: ["exact_files", "test_commands", "small_tasks"]
  },
  {
    name: "test-driven-development",
    description: "Use for feature, bugfix, refactor, or behavior-change implementation work.",
    gates: ["no_production_code_before_failing_test"]
  },
  {
    name: "systematic-debugging",
    description: "Use when fixing a failing test, production bug, error, regression, or unexpected behavior.",
    gates: ["root_cause_before_fix"]
  },
  {
    name: "subagent-driven-development",
    description: "Use when a plan should be executed by fresh implementer/reviewer agents with task-specific context.",
    gates: ["fresh_task_context", "spec_review_before_quality_review"]
  },
  {
    name: "verification-before-completion",
    description: "Use when the user or agent claims work is done or asks to finish.",
    gates: ["completion_requires_evidence"]
  }
];

const buildWords = /\b(make|build|create|add|implement|feature|app|todo|react)\b/i;
const debugWords = /\b(fix|failing|bug|error|regression|broken|debug)\b/i;
const completionWords = /\b(done|finished|complete|ship|ready)\b/i;
const subagentWords = /\bsubagent|fresh agent|review loop|execute this plan\b/i;

export function lookupSkills(prompt) {
  const hits = [findSkill("using-superpowers")];

  if (subagentWords.test(prompt)) hits.push(findSkill("subagent-driven-development"));
  if (debugWords.test(prompt)) hits.push(findSkill("systematic-debugging"));
  if (buildWords.test(prompt)) {
    hits.push(findSkill("brainstorming"));
    hits.push(findSkill("test-driven-development"));
  }
  if (/\bapproved design|approved spec|write plan|implementation plan\b/i.test(prompt)) {
    hits.push(findSkill("writing-plans"));
  }
  if (completionWords.test(prompt)) hits.push(findSkill("verification-before-completion"));

  return uniqueByName(hits);
}

export function findSkill(name) {
  const skill = skills.find((candidate) => candidate.name === name);
  if (!skill) throw new Error(`Unknown skill: ${name}`);
  return skill;
}

function uniqueByName(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (seen.has(item.name)) return false;
    seen.add(item.name);
    return true;
  });
}
