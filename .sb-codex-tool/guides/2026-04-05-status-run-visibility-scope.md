# Scope Guide: Status Run Visibility

## Purpose

- Narrow the current work cycle to a bounded file scope and clear verification expectations.

## Working Goal

- Make `status` expose useful latest-run detail without requiring a reader to
  open the lifecycle run JSON directly.

## Primary Plan

- .sb-codex-tool/plans/2026-04-05-status-run-visibility-approved.md

## Allowed File Scope

- src/lib/run-records.ts
- src/lib/status.ts
- src/commands/status.ts
- tests/status.test.ts
- docs/implementation/core-contract.md
- docs/implementation/verification-contract.md
- docs/implementation/acceptance-checklist.md
- .sb-codex-tool/project.md
- .sb-codex-tool/guides/code-consistency.md
- .sb-codex-tool/plans/2026-04-05-status-run-visibility-approved.md
- .sb-codex-tool/summaries/2026-04-05-status-run-visibility-execution-summary.md
- .sb-codex-tool/handoffs/2026-04-05-status-run-visibility-to-verification.md

## Recommended References

- AGENTS.md
- .sb-codex-tool/project.md
- .sb-codex-tool/state.md
- .sb-codex-tool/guides/code-consistency.md
- .sb-codex-tool/summaries/2026-04-05-doctor-semantic-validation-verification-summary.md

## Verification Expectations

- Run `node --experimental-strip-types --test tests/*.test.ts`.
- Run `node --experimental-strip-types src/cli.ts help`.
- Run `node --experimental-strip-types src/cli.ts doctor`.
- Run `node --experimental-strip-types src/cli.ts status`.
- Confirm status shows latest run phase, verdict, and linked artifact paths
  when a lifecycle run exists.
- Confirm status surfaces recorded run git scope from the latest run record.
- Fresh verification must still be performed by a separate verification agent.
