# Approved Plan: Consistency Review Flow

## Objective

- Add a bounded consistency-review helper so the current cycle can create a
  reusable code-consistency review artifact and expose it through visible
  current-state references.

## Acceptance Criteria

- `sb-codex-tool review-consistency <agent-name> [title words]` exists in CLI
  help and creates a consistency review artifact for the current cycle.
- The generated review references the current plan, latest summary, current
  guide, latest lifecycle run, and `.sb-codex-tool/guides/code-consistency.md`.
- The helper reuses allowed file scope from the current guide when present.
- Current-state artifacts expose `latestConsistencyReview` and the active
  consistency agent after the helper runs.
- Rerunning the helper for the same cycle and agent keeps a single artifact
  path instead of duplicating files.
- Tests cover creation, missing-cycle failure, and rerun idempotence.

## Boundaries

- In scope:
  - shared cycle metadata extraction for consistent artifact naming
  - a new consistency-review helper command and library
  - status visibility for the latest consistency review
  - tests for the new helper flow
  - contract and cycle artifact updates for this increment
- Out of scope:
  - automatic consistency-review execution inside `begin` or `close`
  - new destructive git behavior
  - any Unity or gstack-specific workflow additions

## Tasks

### Task 1

- files: `src/lib/cycle.ts`, `src/lib/consistency-review.ts`,
  `src/commands/review-consistency.ts`, `src/lib/status.ts`,
  `src/commands/status.ts`, `src/lib/work-cycle.ts`,
  `src/lib/assignment.ts`, `src/lib/close-cycle.ts`
- action: add shared cycle helpers, implement a bounded consistency-review
  flow, expose the helper in CLI/status, and reuse shared cycle logic where it
  reduces duplication
- verify: `node --experimental-strip-types --test tests/*.test.ts`,
  `node --experimental-strip-types src/cli.ts help`,
  `node --experimental-strip-types src/cli.ts doctor`,
  `node --experimental-strip-types src/cli.ts status`
- done: yes

### Task 2

- files: `tests/review-consistency.test.ts`,
  `docs/implementation/core-contract.md`,
  `docs/implementation/verification-contract.md`,
  `docs/implementation/acceptance-checklist.md`,
  `.sb-codex-tool/project.md`,
  `.sb-codex-tool/guides/2026-04-05-consistency-review-flow-scope.md`,
  `.sb-codex-tool/summaries/2026-04-05-consistency-review-flow-execution-summary.md`,
  `.sb-codex-tool/handoffs/2026-04-05-consistency-review-flow-to-verification.md`
- action: align tests, contracts, project brief, and current cycle artifacts
  with the implemented consistency-review flow
- verify: review the generated artifacts and confirm they match the helper
  behavior and the verification contract
- done: yes
