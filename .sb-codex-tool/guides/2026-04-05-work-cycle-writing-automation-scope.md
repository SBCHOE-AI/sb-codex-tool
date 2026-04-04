# Scope Guide: Work-Cycle Writing Automation

## Purpose

- Narrow the current work cycle to a bounded file scope and clear verification expectations.

## Working Goal

- Add a helper that rewrites the current handoff and current-state artifacts
  from the active execution summary and guide before fresh verification.

## Primary Plan

- .sb-codex-tool/plans/2026-04-05-work-cycle-writing-automation-approved.md

## Allowed File Scope

- src/lib/prepare-verify.ts
- src/commands/prepare-verify.ts
- src/lib/run-records.ts
- src/cli.ts
- tests/prepare-verify.test.ts
- tests/begin.test.ts
- tests/close.test.ts
- docs/implementation/core-contract.md
- docs/implementation/verification-contract.md
- docs/implementation/acceptance-checklist.md
- .sb-codex-tool/project.md
- .sb-codex-tool/guides/code-consistency.md
- .sb-codex-tool/plans/2026-04-05-work-cycle-writing-automation-approved.md
- .sb-codex-tool/summaries/2026-04-05-work-cycle-writing-automation-execution-summary.md
- .sb-codex-tool/handoffs/2026-04-05-work-cycle-writing-automation-to-verification.md

## Recommended References

- AGENTS.md
- .sb-codex-tool/project.md
- .sb-codex-tool/state.md
- .sb-codex-tool/guides/code-consistency.md
- .sb-codex-tool/summaries/2026-04-05-subagent-lifecycle-automation-verification-summary.md

## Verification Expectations

- Run `node --experimental-strip-types --test tests/prepare-verify.test.ts tests/begin.test.ts tests/close.test.ts`.
- Run `node --experimental-strip-types --test tests/*.test.ts`.
- Run `node --experimental-strip-types src/cli.ts help`.
- Run `node --experimental-strip-types src/cli.ts prepare-verify`.
- Run `node --experimental-strip-types src/cli.ts doctor`.
- Run `node --experimental-strip-types src/cli.ts status`.
- Fresh verification should confirm that `prepare-verify` rewrites the handoff
  and moves the current cycle into verify-ready state without manual edits.
