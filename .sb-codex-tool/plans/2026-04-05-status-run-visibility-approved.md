# Approved Plan: Status Run Visibility

## Objective

- Make `status` read the latest lifecycle run record so the main agent and
  fresh agents can see the current run phase, verdict, linked artifacts, and
  recorded change scope without opening the JSON run file directly.

## Acceptance Criteria

- `getStatus` exposes the latest lifecycle run record when `latestRun` exists.
- `sb-codex-tool status` prints latest run phase, stage, verdict, and linked
  artifact paths when a run record is available.
- Recorded run git scope is visible through status even when the current live
  repository state is different or unavailable.
- Tests cover begin-run visibility, git-backed run visibility, and
  post-close run visibility.

## Boundaries

- In scope:
  - reading lifecycle run records from status
  - exposing run phase/verdict/paths in status
  - tests for begin/close/git-backed run visibility
  - contract and repo guidance updates for the richer status surface
- Out of scope:
  - new CLI commands
  - editing lifecycle run record schema
  - compact TUI or alternate output formatting

## Tasks

### Task 1

- files: `src/lib/run-records.ts`, `src/lib/status.ts`,
  `src/commands/status.ts`, `tests/status.test.ts`
- action: add lifecycle run record reading to status and expose run-linked
  detail in both the status snapshot and CLI output
- verify: `node --experimental-strip-types --test tests/*.test.ts`
- done: yes

### Task 2

- files: `docs/implementation/core-contract.md`,
  `docs/implementation/verification-contract.md`,
  `docs/implementation/acceptance-checklist.md`,
  `.sb-codex-tool/project.md`,
  `.sb-codex-tool/guides/code-consistency.md`,
  `.sb-codex-tool/plans/2026-04-05-status-run-visibility-approved.md`,
  `.sb-codex-tool/guides/2026-04-05-status-run-visibility-scope.md`,
  `.sb-codex-tool/summaries/2026-04-05-status-run-visibility-execution-summary.md`,
  `.sb-codex-tool/handoffs/2026-04-05-status-run-visibility-to-verification.md`
- action: align contracts, repository guidance, and current-cycle artifacts
  with the richer status run-visibility behavior
- verify: `node --experimental-strip-types src/cli.ts status`
- done: yes
