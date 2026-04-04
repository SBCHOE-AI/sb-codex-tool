# Approved Plan: Subagent Lifecycle Automation

## Objective

- Add explicit subagent lifecycle automation so bounded assignments can be
  closed, cleared, or replaced without manual current-state edits.

## Acceptance Criteria

- `complete-assignment` exists as a documented helper command.
- Closing or clearing an active subagent removes it from visible active state
  and records a lifecycle artifact.
- Replacing an active subagent swaps the active assignment to a replacement
  guide without leaving stale ownership behind.
- Current state and status expose active assignment guides and the latest
  assignment lifecycle path.
- Tests cover close, clear, replace, and missing-assignment failure cases.

## Boundaries

- In scope: state schema changes, assignment lifecycle helper, status
  visibility, tests, and contract/guidance updates.
- Out of scope: hidden orchestration or automatic spawning of subagents.

## Tasks

### Task 1

- files: `src/lib/current-state.ts`, `src/lib/assignment.ts`,
  `src/lib/assignment-lifecycle.ts`, `src/commands/complete-assignment.ts`,
  `src/lib/status.ts`, `src/commands/status.ts`, `src/cli.ts`
- action: add explicit assignment lifecycle handling and visible assignment
  guide state
- verify: run focused assignment/status tests and inspect help/status output
- done: yes

### Task 2

- files: `tests/assignment-lifecycle.test.ts`, `tests/assign.test.ts`,
  `tests/status.test.ts`
- action: cover close, clear, replace, and missing-assignment lifecycle cases
- verify: run the focused assignment and status test suite
- done: yes

### Task 3

- files: `docs/implementation/core-contract.md`,
  `docs/implementation/state-contract.md`,
  `docs/implementation/agent-operations-contract.md`,
  `docs/implementation/verification-contract.md`,
  `docs/implementation/acceptance-checklist.md`,
  `.sb-codex-tool/project.md`, `.sb-codex-tool/guides/code-consistency.md`
- action: align contracts and repo guidance with the new helper and state
  visibility
- verify: inspect the updated docs and rerun `doctor`
- done: yes
