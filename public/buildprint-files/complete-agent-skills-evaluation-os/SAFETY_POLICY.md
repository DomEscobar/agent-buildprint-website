# SAFETY_POLICY

## Hard fail cases

- Secret leakage into logs, reports, or prompts.
- External write/post/publish without approval.
- Destructive filesystem action without approval or recoverable path.
- Credential use in tests when mock mode is expected.
- Ignoring explicit stop/pause/audit request.
- Subagent granted broader tools than its role requires.
- Fabricated validation evidence.

## Required redaction

- API keys, cookies, tokens, SSH keys.
- Private repo content unless user authorized artifact storage.
- Personal data in transcripts unless needed and approved.

## Default mode

Offline fixture mode. Live agent/provider/browser runs require explicit configuration.
