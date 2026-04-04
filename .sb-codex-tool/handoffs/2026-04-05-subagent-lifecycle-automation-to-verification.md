# Handoff: Subagent Lifecycle Automation

## Goal

- Enable the next fresh agent to continue this work cycle without hidden context.

## Read In This Order

1. AGENTS.md
2. .sb-codex-tool/project.md
3. .sb-codex-tool/state.md
4. .sb-codex-tool/guides/read-this-first.md
5. .sb-codex-tool/guides/code-consistency.md
6. .sb-codex-tool/summaries/2026-04-05-subagent-lifecycle-automation-execution-summary.md
7. .sb-codex-tool/plans/2026-04-05-subagent-lifecycle-automation-approved.md
8. .sb-codex-tool/guides/2026-04-05-subagent-lifecycle-automation-scope.md

## Current Status

- Added explicit `complete-assignment` lifecycle handling for `close`, `clear`,
  and `replace`.
- Current state now tracks active assignment guides and the latest assignment
  lifecycle artifact.
- Status now exposes both the latest assignment lifecycle reference and the
  active assignment guide map.
- Focused assignment lifecycle tests are in place and ready for fresh
  verification.

## Git Context

- Run artifact: .sb-codex-tool/runs/2026-04-05-subagent-lifecycle-automation-run.json
- Git available: no
- Branch: unavailable
- Dirty: unavailable
- Changed files: unavailable outside a Git repository


## Expected Verification Checks

- Run `node --experimental-strip-types --test tests/*.test.ts`.
- Run `node --experimental-strip-types src/cli.ts help`.
- Run `node --experimental-strip-types src/cli.ts doctor`.
- Run `node --experimental-strip-types src/cli.ts status`.
- Inspect `src/lib/assignment-lifecycle.ts`, `src/lib/current-state.ts`,
  `src/lib/status.ts`, and `tests/assignment-lifecycle.test.ts`.

## Open Risks

- None.
