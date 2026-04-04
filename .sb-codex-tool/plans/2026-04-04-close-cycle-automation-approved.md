# Approved Plan: Close Cycle Automation

## Objective

- Add a `close` command that records the fresh verification verdict for the
  current work cycle and automates closure artifacts without weakening the
  fresh-agent verification rule.

## Acceptance Criteria

- `sb-codex-tool close` exists and is listed in CLI help.
- `close` consumes the final verdict already recorded by the fresh verification
  review instead of accepting a verdict argument from the implementation
  session.
- `close` moves `pass` and `pass_with_concerns` cycles back to `clarify` and
  appends a human-readable work-journal entry.
- `close` keeps `fail` and `blocked` cycles in `verify`.
- `close` rejects placeholder concerns or missing-evidence sections when the
  review verdict requires explicit detail.
- closure automation keeps `current.json`, `state.md`, and
  `guides/read-this-first.md` aligned through the shared current-state writer.
- tests cover a successful close path and a non-closing failure path.
- the expanded command surface is documented so verification does not have to
  guess about `begin` and `close`.

## Boundaries

- In scope:
  - `close` CLI command
  - verification-summary generation
  - review verdict updates
  - work-journal append flow
  - current-state transition after verified closure
  - command-surface documentation updates
- Out of scope:
  - running fresh verification automatically
  - free-form findings authoring from the CLI
  - git-aware closure logic beyond existing optional context
  - resume or pause commands

## Tasks

### Task 1

- files: `src/lib/close-cycle.ts`, `src/commands/close.ts`, `src/cli.ts`
- action: implement the `close` command so it reads the current review verdict
  and performs the correct closing or non-closing flow
- verify: `sb-codex-tool close` updates the correct artifacts based on the
  recorded review verdict
- done: yes

### Task 2

- files: `src/lib/work-journal.ts`, `src/lib/current-state.ts`
- action: add reusable helpers for work-journal writing and current-state
  transitions during closure
- verify: closure updates stay readable, reusable, and aligned across
  `current.json`, `state.md`, and `read-this-first.md`
- done: yes

### Task 3

- files: `tests/close.test.ts`, `docs/implementation/core-contract.md`,
  `docs/implementation/verification-contract.md`,
  `.sb-codex-tool/project.md`,
  `.sb-codex-tool/summaries/2026-04-04-close-cycle-automation-execution-summary.md`,
  `.sb-codex-tool/handoffs/2026-04-04-close-cycle-automation-to-verification.md`,
  `.sb-codex-tool/guides/2026-04-04-close-cycle-automation-scope.md`
- action: add regression coverage and document the expanded command surface and
  closure behavior
- verify: tests pass and fresh verification can read the new closure behavior
  without guesswork
- done: yes
