# Scope Guide: Subagent Lifecycle Automation

## Purpose

- Narrow the current work cycle to a bounded file scope and clear verification expectations.

## Working Goal

- Add explicit lifecycle handling for bounded subagent assignments so the main
  agent can close, clear, or replace them without manual state edits.

## Primary Plan

- .sb-codex-tool/plans/2026-04-05-subagent-lifecycle-automation-approved.md

## Allowed File Scope

- src/lib/current-state.ts
- src/lib/assignment.ts
- src/lib/assignment-lifecycle.ts
- src/commands/complete-assignment.ts
- src/lib/status.ts
- src/commands/status.ts
- src/cli.ts
- tests/assignment-lifecycle.test.ts
- tests/assign.test.ts
- tests/status.test.ts
- docs/implementation/core-contract.md
- docs/implementation/state-contract.md
- docs/implementation/agent-operations-contract.md
- docs/implementation/verification-contract.md
- docs/implementation/acceptance-checklist.md
- .sb-codex-tool/project.md
- .sb-codex-tool/guides/code-consistency.md
- .sb-codex-tool/plans/2026-04-05-subagent-lifecycle-automation-approved.md
- .sb-codex-tool/summaries/2026-04-05-subagent-lifecycle-automation-execution-summary.md
- .sb-codex-tool/handoffs/2026-04-05-subagent-lifecycle-automation-to-verification.md

## Recommended References

- AGENTS.md
- .sb-codex-tool/project.md
- .sb-codex-tool/state.md
- .sb-codex-tool/guides/code-consistency.md
- .sb-codex-tool/summaries/2026-04-05-multiline-section-parsing-verification-summary.md

## Verification Expectations

- Run `node --experimental-strip-types --test tests/assign.test.ts tests/assignment-lifecycle.test.ts tests/status.test.ts`.
- Run `node --experimental-strip-types --test tests/*.test.ts`.
- Run `node --experimental-strip-types src/cli.ts help`.
- Run `node --experimental-strip-types src/cli.ts doctor`.
- Run `node --experimental-strip-types src/cli.ts status`.
- Fresh verification should confirm that active assignment guides and the latest
  assignment lifecycle stay visible after `close`, `clear`, and `replace`.
