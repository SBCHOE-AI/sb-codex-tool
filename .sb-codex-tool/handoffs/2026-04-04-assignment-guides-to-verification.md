# Handoff: Assignment Guides

## Goal

- Enable the next fresh agent to continue this work cycle without hidden context.

## Read In This Order

1. AGENTS.md
2. .sb-codex-tool/project.md
3. .sb-codex-tool/state.md
4. .sb-codex-tool/guides/read-this-first.md
5. .sb-codex-tool/guides/code-consistency.md
6. .sb-codex-tool/summaries/2026-04-04-assignment-guides-execution-summary.md
7. .sb-codex-tool/plans/2026-04-04-assignment-guides-approved.md
8. .sb-codex-tool/guides/2026-04-04-assignment-guides-scope.md

## Current Status

- Planning is complete.
- Implementation is complete.
- Self-checks have passed.
- Fresh-agent verification is still pending.

## Git Context

- Run artifact: .sb-codex-tool/runs/2026-04-04-assignment-guides-run.json
- Git available: no
- Branch: unavailable
- Dirty: unavailable
- Changed files: unavailable outside a Git repository


## Expected Verification Checks

- `node --experimental-strip-types --test tests/*.test.ts`
- `node --experimental-strip-types src/cli.ts help`
- `node --experimental-strip-types src/cli.ts doctor`
- `node --experimental-strip-types src/cli.ts status`
- inspect `src/lib/assignment.ts`, `src/commands/assign.ts`, `src/cli.ts`, and
  `tests/assign.test.ts`
- confirm that `assign` creates a bounded guide referencing the current cycle
  and `.sb-codex-tool/guides/code-consistency.md`
- confirm that active subagents update visibly without duplicate entries on
  rerun
- confirm that missing-cycle assignment attempts fail clearly

## Open Risks

- The helper must stay small and not evolve into a large role system.
- Assignment guides must remain bounded and readable rather than becoming a
  second plan format.
- Shared markdown-section parsing must not regress close-cycle behavior.
