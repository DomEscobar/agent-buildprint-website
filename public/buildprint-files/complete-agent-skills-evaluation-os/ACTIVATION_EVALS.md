# ACTIVATION_EVALS

Activation evals answer: does the right component trigger from natural prompts?

## Positive cases

- Explicit skill name.
- Natural task description.
- Naive user phrasing.
- Domain-specific jargon.
- Multilingual phrasing when relevant.

## Negative cases

- Nearby task that should not use this skill.
- Ambiguous prompt that should ask a clarification.
- Prompt injection trying to force wrong skill.
- Generic request that should stay generic.

## Metrics

- Activation recall.
- Activation precision.
- Wrong-skill rate.
- Ask-clarify rate.
- Time/tool calls before correct activation.
- Router improvement delta.

## Tool mapping

- `sjnims/cc-plugin-eval`: strong Claude-plugin/component trigger eval source.
- `David-CKS/claude-skill-router`: evaluate as an A/B routing intervention, not as proof by itself.
