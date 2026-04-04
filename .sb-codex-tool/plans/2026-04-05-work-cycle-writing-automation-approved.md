# Approved Plan: Work-Cycle Writing Automation

## Objective

- Automate verify-ready cycle writing so the main agent can move a current
  increment into fresh verification without manual state or handoff edits.

## Acceptance Criteria

- `prepare-verify` exists as a documented helper command.
- The command rewrites the current handoff from the active execution summary
  and guide.
- The command moves current state to `verify`, records a lifecycle run, and
  marks verification ownership as pending.
- Tests cover both the happy path and missing-guidance failure cases.
- Contracts and repo guidance mention the new helper and its role.

## Boundaries

- In scope: verify-preparation helper command, handoff rewriting, state/run
  updates, tests, and contract/guidance changes.
- Out of scope: final close behavior, automatic review authoring, or full
  summary authoring automation.

## Tasks

### Task 1

- files: `src/lib/prepare-verify.ts`, `src/commands/prepare-verify.ts`,
  `src/lib/run-records.ts`, `src/cli.ts`
- action: add an explicit helper that rewrites the current handoff and moves
  the active cycle into verify-ready state
- verify: run focused prepare-verify tests and exercise the command on the
  current cycle
- done: yes

### Task 2

- files: `tests/prepare-verify.test.ts`, `tests/begin.test.ts`,
  `tests/close.test.ts`
- action: cover verify-preparation behavior and ensure existing lifecycle
  behavior still passes
- verify: run the focused prepare-verify, begin, and close test suite
- done: yes

### Task 3

- files: `docs/implementation/core-contract.md`,
  `docs/implementation/verification-contract.md`,
  `docs/implementation/acceptance-checklist.md`,
  `.sb-codex-tool/project.md`, `.sb-codex-tool/guides/code-consistency.md`
- action: align contracts and repo guidance with the new helper
- verify: inspect the updated docs and rerun `doctor`
- done: yes
