# MEMORY_CONTEXT

## Memory tiers

1. Raw history: append-only JSONL/messages for recent conversation and trace recovery.
2. Daily episodes: compressed chronological summaries by date/task.
3. Long-term memory: curated stable facts/goals/preferences, editable by user.

## Context builder

Context should be assembled in this order:

1. system/runtime instructions
2. relevant long-term memory
3. selected skill instructions
4. current task/team context
5. recent messages
6. attachment/source summaries
7. tool results

## Compaction

When token usage approaches the configured threshold:

- summarize old messages into an episode
- optionally update long-term memory through a structured compactor response
- retain recent K messages verbatim
- emit `memory.compacted`
- do not silently drop user instructions
