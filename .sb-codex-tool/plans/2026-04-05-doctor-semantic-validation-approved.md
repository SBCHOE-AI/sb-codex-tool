# Approved Plan: Doctor Semantic Validation

## Objective

- Make `doctor` fail when the current cycle still uses scaffold placeholder
  content, so fresh verification does not start from semantically incomplete
  artifacts.

## Acceptance Criteria

- `doctor` reports failures for placeholder-heavy active-cycle plans, guides,
  handoffs, and execution summaries.
- `doctor` reports failures for placeholder-heavy latest consistency review
  artifacts when one is referenced in current state.
- `doctor` passes once the active-cycle artifacts and latest consistency review
  are filled with real content.
- Tests cover both failing and passing boundaries for the new semantic checks.

## Boundaries

- In scope:
  - semantic placeholder validation in `doctor`
  - tests for active-cycle artifact readiness and consistency-review readiness
  - updates to contracts, project brief, and current-cycle artifacts
- Out of scope:
  - new CLI commands
  - changing `close` verdict semantics
  - broader natural-language quality scoring beyond placeholder detection

## Tasks

### Task 1

- files: `src/lib/doctor.ts`, `tests/doctor.test.ts`, `tests/begin.test.ts`,
  `tests/close.test.ts`
- action: add semantic readiness checks for current-cycle artifacts and update
  the existing lifecycle tests to match the stronger doctor behavior
- verify: `node --experimental-strip-types --test tests/*.test.ts`
- done: yes

### Task 2

- files: `docs/implementation/core-contract.md`,
  `docs/implementation/verification-contract.md`,
  `docs/implementation/acceptance-checklist.md`,
  `.sb-codex-tool/project.md`,
  `.sb-codex-tool/guides/code-consistency.md`,
  `.sb-codex-tool/reviews/2026-04-05-consistency-review-flow-locke-consistency-review.md`,
  `.sb-codex-tool/plans/2026-04-05-doctor-semantic-validation-approved.md`,
  `.sb-codex-tool/guides/2026-04-05-doctor-semantic-validation-scope.md`,
  `.sb-codex-tool/summaries/2026-04-05-doctor-semantic-validation-execution-summary.md`,
  `.sb-codex-tool/handoffs/2026-04-05-doctor-semantic-validation-to-verification.md`
- action: align contracts, repository guidance, and current-cycle artifacts
  with the new semantic validation rule
- verify: `node --experimental-strip-types src/cli.ts doctor`
- done: yes
