# Scope Guide: Doctor Semantic Validation

## Purpose

- Narrow the current work cycle to a bounded file scope and clear verification expectations.

## Working Goal

- Add semantic readiness checks so `doctor` fails before fresh verification
  when the current cycle still contains scaffold placeholders.

## Primary Plan

- .sb-codex-tool/plans/2026-04-05-doctor-semantic-validation-approved.md

## Allowed File Scope

- src/lib/doctor.ts
- tests/doctor.test.ts
- tests/begin.test.ts
- tests/close.test.ts
- docs/implementation/core-contract.md
- docs/implementation/verification-contract.md
- docs/implementation/acceptance-checklist.md
- .sb-codex-tool/project.md
- .sb-codex-tool/guides/code-consistency.md
- .sb-codex-tool/reviews/2026-04-05-consistency-review-flow-locke-consistency-review.md
- .sb-codex-tool/plans/2026-04-05-doctor-semantic-validation-approved.md
- .sb-codex-tool/summaries/2026-04-05-doctor-semantic-validation-execution-summary.md
- .sb-codex-tool/handoffs/2026-04-05-doctor-semantic-validation-to-verification.md

## Recommended References

- AGENTS.md
- .sb-codex-tool/project.md
- .sb-codex-tool/state.md
- .sb-codex-tool/guides/code-consistency.md
- .sb-codex-tool/summaries/2026-04-05-consistency-review-flow-verification-summary.md

## Verification Expectations

- Run `node --experimental-strip-types --test tests/*.test.ts`.
- Run `node --experimental-strip-types src/cli.ts help`.
- Run `node --experimental-strip-types src/cli.ts doctor`.
- Run `node --experimental-strip-types src/cli.ts status`.
- Confirm doctor now fails on active-cycle placeholder artifacts and on a
  placeholder latest consistency review artifact.
- Confirm doctor passes once the current cycle artifacts and latest consistency
  review are filled.
- Fresh verification must still be done by a separate verification agent.
