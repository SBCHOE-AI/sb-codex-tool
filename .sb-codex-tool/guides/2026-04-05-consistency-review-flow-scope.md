# Scope Guide: Consistency Review Flow

## Purpose

- Narrow the current work cycle to a bounded file scope and clear verification expectations.

## Working Goal

- Add a bounded consistency-review helper that creates a reusable review
  artifact for the current cycle and exposes it through visible state.

## Primary Plan

- .sb-codex-tool/plans/2026-04-05-consistency-review-flow-approved.md

## Allowed File Scope

- src/lib/cycle.ts
- src/lib/consistency-review.ts
- src/commands/review-consistency.ts
- src/lib/status.ts
- src/commands/status.ts
- src/lib/work-cycle.ts
- src/lib/assignment.ts
- src/lib/close-cycle.ts
- tests/review-consistency.test.ts
- docs/implementation/core-contract.md
- docs/implementation/verification-contract.md
- docs/implementation/acceptance-checklist.md
- .sb-codex-tool/project.md
- .sb-codex-tool/plans/2026-04-05-consistency-review-flow-approved.md
- .sb-codex-tool/summaries/2026-04-05-consistency-review-flow-execution-summary.md
- .sb-codex-tool/handoffs/2026-04-05-consistency-review-flow-to-verification.md

## Recommended References

- AGENTS.md
- .sb-codex-tool/project.md
- .sb-codex-tool/state.md
- .sb-codex-tool/guides/code-consistency.md
- .sb-codex-tool/summaries/2026-04-04-assignment-guides-verification-summary.md

## Verification Expectations

- Run `node --experimental-strip-types --test tests/*.test.ts`.
- Run `node --experimental-strip-types src/cli.ts help`.
- Run `node --experimental-strip-types src/cli.ts doctor`.
- Run `node --experimental-strip-types src/cli.ts status`.
- Confirm `review-consistency` appears in CLI help and writes a bounded review
  artifact tied to the current cycle.
- Confirm current-state artifacts expose `latestConsistencyReview` and the
  active consistency agent after the helper runs.
- Fresh verification must still be performed by a separate verification agent
  before closure.
