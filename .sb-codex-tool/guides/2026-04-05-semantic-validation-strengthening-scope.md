# Scope Guide: Semantic Validation Strengthening

## Purpose

- Narrow the current work cycle to a bounded file scope and clear verification expectations.

## Working Goal

- Strengthen semantic validation so `doctor` and `status` can detect logical
  drift between current state, latest run, and assignment ownership.

## Primary Plan

- .sb-codex-tool/plans/2026-04-05-semantic-validation-strengthening-approved.md

## Allowed File Scope

- src/lib/state-coherence.ts
- src/lib/doctor.ts
- src/lib/status.ts
- src/commands/status.ts
- tests/doctor.test.ts
- tests/status.test.ts
- docs/implementation/verification-contract.md
- docs/implementation/acceptance-checklist.md
- .sb-codex-tool/project.md
- .sb-codex-tool/guides/code-consistency.md
- .sb-codex-tool/plans/2026-04-05-semantic-validation-strengthening-approved.md
- .sb-codex-tool/summaries/2026-04-05-semantic-validation-strengthening-execution-summary.md
- .sb-codex-tool/handoffs/2026-04-05-semantic-validation-strengthening-to-verification.md

## Recommended References

- AGENTS.md
- .sb-codex-tool/project.md
- .sb-codex-tool/state.md
- .sb-codex-tool/guides/code-consistency.md
- .sb-codex-tool/summaries/2026-04-05-template-splitting-verification-summary.md

## Verification Expectations

- Run `node --experimental-strip-types --test tests/doctor.test.ts tests/status.test.ts`.
- Run `node --experimental-strip-types --test tests/*.test.ts`.
- Run `node --experimental-strip-types src/cli.ts doctor`.
- Run `node --experimental-strip-types src/cli.ts status`.
- Fresh verification should confirm that `doctor` now fails on state/run or
  assignment drift and that `status` exposes semantic issues when coherence is
  broken.
