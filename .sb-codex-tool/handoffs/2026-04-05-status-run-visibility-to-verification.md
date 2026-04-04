# Handoff: Status Run Visibility

## Goal

- Enable the next fresh agent to continue this work cycle without hidden context.

## Read In This Order

1. AGENTS.md
2. .sb-codex-tool/project.md
3. .sb-codex-tool/state.md
4. .sb-codex-tool/guides/read-this-first.md
5. .sb-codex-tool/guides/code-consistency.md
6. .sb-codex-tool/summaries/2026-04-05-status-run-visibility-execution-summary.md
7. .sb-codex-tool/plans/2026-04-05-status-run-visibility-approved.md
8. .sb-codex-tool/guides/2026-04-05-status-run-visibility-scope.md

## Current Status

- Implementation is complete and self-checks are passing.
- status now reads the latest lifecycle run record and exposes run-linked
  detail directly.

## Git Context

- Run artifact: .sb-codex-tool/runs/2026-04-05-status-run-visibility-run.json
- Git available: no
- Branch: unavailable
- Dirty: unavailable
- Changed files: unavailable outside a Git repository


## Expected Verification Checks

- Read the implementation contracts in the required order.
- Run `node --experimental-strip-types --test tests/*.test.ts`.
- Run `node --experimental-strip-types src/cli.ts help`.
- Run `node --experimental-strip-types src/cli.ts doctor`.
- Run `node --experimental-strip-types src/cli.ts status`.
- Confirm status shows latest run phase, verdict, linked artifact paths, and
  recorded run git scope when a run exists.

## Open Risks

- No blocking implementation risk is known.
- Fresh verification still needs to confirm the richer status output matches
  the updated contracts.
