# QA Prompt

Review an AI Influencer OS implementation against this Buildprint.

Check:

1. Does the persona have stable canon and boundaries?
2. Is user memory separate from persona self-state?
3. Can public posts only claim grounded events?
4. Are media requests gated by visibility, trust, and safety?
5. Is publishing mock/approval-gated by default?
6. Are tests meaningful and runnable?
7. Are secrets absent?
8. Does `VALIDATION.md` mention ambiguities?

Return:

- pass/fail
- missing files
- risky implementation choices
- recommended fixes
