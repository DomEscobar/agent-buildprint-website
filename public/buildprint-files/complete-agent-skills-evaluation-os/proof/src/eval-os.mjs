export const defaultWeights = {
  static: 10,
  install: 10,
  loadout: 10,
  skill: 20,
  activation: 15,
  transcript: 15,
  e2e: 15,
  multiAgent: 5,
};

export function createSetupSnapshot(input) {
  if (!input?.id) throw new Error('snapshot id required');
  const skills = input.skills ?? [];
  const components = [...skills, ...(input.agents ?? []), ...(input.commands ?? []), ...(input.hooks ?? []), ...(input.mcpServers ?? [])];
  return {
    id: input.id,
    target: input.target ?? 'generic',
    createdAt: input.createdAt ?? new Date(0).toISOString(),
    sourceRefs: input.sourceRefs ?? [],
    skills,
    agents: input.agents ?? [],
    commands: input.commands ?? [],
    hooks: input.hooks ?? [],
    mcpServers: input.mcpServers ?? [],
    permissions: input.permissions ?? {},
    router: input.router ?? null,
    componentCount: components.length,
    estimatedLoadedTokens: components.reduce((sum, c) => sum + (c.estimatedLoadedTokens ?? 0), 0),
  };
}

export function staticLint(snapshot) {
  const findings = [];
  for (const skill of snapshot.skills) {
    if (!skill.name || !/^[a-z0-9][a-z0-9-]*$/.test(skill.name)) {
      findings.push({ severity: 'error', layer: 'static', id: skill.id, message: 'invalid skill name' });
    }
    if (!skill.description || skill.description.length < 25) {
      findings.push({ severity: 'warning', layer: 'static', id: skill.id, message: 'weak skill description' });
    }
    if ((skill.requiredFiles ?? []).some((p) => p.includes('..'))) {
      findings.push({ severity: 'error', layer: 'static', id: skill.id, message: 'unsafe required file path' });
    }
  }
  for (const [tool, mode] of Object.entries(snapshot.permissions ?? {})) {
    if (tool === 'externalPublish' && mode === 'allow') {
      findings.push({ severity: 'error', layer: 'safety', id: 'externalPublish', message: 'external publishing cannot be allowed by default' });
    }
  }
  return { passed: !findings.some((f) => f.severity === 'error'), findings };
}

export function loadoutInventory(snapshot, usage = {}) {
  const artifacts = [...snapshot.skills, ...snapshot.agents, ...snapshot.commands, ...snapshot.hooks, ...snapshot.mcpServers];
  const dormant = artifacts.filter((a) => (usage[a.id] ?? 0) === 0 && (a.estimatedLoadedTokens ?? 0) > 0);
  const highCostDormant = dormant.filter((a) => (a.estimatedLoadedTokens ?? 0) >= 500);
  return {
    totalArtifacts: artifacts.length,
    loadedTokens: snapshot.estimatedLoadedTokens,
    dormantIds: dormant.map((a) => a.id),
    highCostDormantIds: highCostDormant.map((a) => a.id),
    score: Math.max(0, 100 - highCostDormant.length * 20 - Math.floor(snapshot.estimatedLoadedTokens / 1000) * 5),
  };
}

export function evaluateSkillUnit(caseResult) {
  const failed = (caseResult.assertions ?? []).filter((a) => a.pass === false);
  const hardFailed = failed.some((a) => a.hardFail);
  return { passed: failed.length === 0, hardFailed, failedAssertions: failed.map((a) => a.type) };
}

export function evaluateActivation(cases) {
  let positives = 0, positiveHits = 0, negatives = 0, negativePasses = 0, wrong = 0;
  for (const c of cases) {
    const expected = new Set(c.expectedComponents ?? []);
    const forbidden = new Set(c.forbiddenComponents ?? []);
    const actual = new Set(c.actualComponents ?? []);
    if (expected.size) {
      positives++;
      const hit = [...expected].every((x) => actual.has(x));
      if (hit) positiveHits++;
      if ([...actual].some((x) => !expected.has(x) && c.strict !== false)) wrong++;
    }
    if (forbidden.size) {
      negatives++;
      const clean = [...forbidden].every((x) => !actual.has(x));
      if (clean) negativePasses++;
      else wrong++;
    }
  }
  const recall = positives ? positiveHits / positives : 1;
  const precision = positives + negatives ? 1 - wrong / (positives + negatives) : 1;
  return { recall, precision: Math.max(0, precision), wrongActivations: wrong, score: Math.round(((recall + Math.max(0, precision)) / 2) * 100) };
}

export function checkTranscriptOrder(events, invariants) {
  const findings = [];
  const indexOf = (pred) => events.findIndex(pred);
  for (const inv of invariants) {
    const beforeIndex = indexOf((e) => e.type === inv.before.type && (!inv.before.name || e.name === inv.before.name));
    const afterIndex = indexOf((e) => e.type === inv.after.type && (!inv.after.name || e.name === inv.after.name));
    if (beforeIndex < 0 || afterIndex < 0 || beforeIndex >= afterIndex) {
      findings.push({ severity: inv.hardFail ? 'error' : 'warning', layer: 'transcript', message: inv.message ?? 'order invariant failed' });
    }
  }
  return { passed: !findings.some((f) => f.severity === 'error'), findings };
}

export function evaluateMultiAgent(runs) {
  const findings = [];
  for (const run of runs) {
    if (!run.parentContextIncluded) findings.push({ severity: 'error', layer: 'multiAgent', id: run.id, message: 'missing parent context' });
    if (!run.fileOwnershipRespected) findings.push({ severity: 'error', layer: 'multiAgent', id: run.id, message: 'file ownership violation' });
    if (!run.outputSchemaValid) findings.push({ severity: 'warning', layer: 'multiAgent', id: run.id, message: 'subagent output schema invalid' });
  }
  return { passed: !findings.some((f) => f.severity === 'error'), findings };
}

export function aggregateScore(layers, weights = defaultWeights) {
  let totalWeight = 0;
  let weighted = 0;
  const findings = [];
  for (const [layer, result] of Object.entries(layers)) {
    const weight = weights[layer] ?? 0;
    totalWeight += weight;
    const score = typeof result.score === 'number' ? result.score : (result.passed ? 100 : 0);
    weighted += score * weight;
    findings.push(...(result.findings ?? []));
  }
  const hardFailed = findings.some((f) => f.severity === 'error' && (f.hardFail ?? true));
  return { total: totalWeight ? Math.round(weighted / totalWeight) : 0, hardFailed, findings };
}

export function runOfflineEvaluation({ snapshot, usage, skillResults, activationCases, transcriptEvents, invariants, multiAgentRuns }) {
  const staticResult = staticLint(snapshot);
  const inventory = loadoutInventory(snapshot, usage);
  const skillEvaluations = skillResults.map(evaluateSkillUnit);
  const skill = { passed: skillEvaluations.every((x) => x.passed), score: Math.round(100 * skillEvaluations.filter((x) => x.passed).length / Math.max(1, skillEvaluations.length)), findings: skillEvaluations.flatMap((x, i) => x.passed ? [] : [{ severity: x.hardFailed ? 'error' : 'warning', layer: 'skill', id: skillResults[i].id, message: `failed assertions: ${x.failedAssertions.join(', ')}` }]) };
  const activation = evaluateActivation(activationCases);
  const transcript = checkTranscriptOrder(transcriptEvents, invariants);
  const multiAgent = evaluateMultiAgent(multiAgentRuns);
  return aggregateScore({ static: staticResult, loadout: inventory, skill, activation, transcript, multiAgent });
}
