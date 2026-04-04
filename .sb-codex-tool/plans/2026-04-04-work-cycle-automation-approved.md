# Approved Plan: Work Cycle Automation

## Objective

- Add a `begin` command that creates the next work-cycle artifacts and updates
  the toolkit's current state so the next increment can start from a bounded,
  verification-friendly hot path.

## Acceptance Criteria

- `sb-codex-tool begin <slug> [title]` exists and is discoverable through CLI
  help.
- `begin` creates a plan, execution summary, handoff, review, and task-specific
  scope guide under `.sb-codex-tool/`.
- `begin` updates `.sb-codex-tool/index/current.json` and `.sb-codex-tool/state.md`.
- `status` surfaces the current guide, handoff, and review paths.
- `doctor` validates referenced current-state paths when they are present.
- Tests cover the new work-cycle creation flow.

## Boundaries

- In scope: state/index automation, artifact templating, CLI support, doctor and
  status integration, smoke tests.
- Out of scope: automatic verification verdict writing, automatic work-journal
  completion, workflow execution semantics, extension system changes.

## Tasks

### Task 1

- files: `src/lib/current-state.ts`, `src/lib/templates.ts`
- action: centralize current-state rendering and initial index generation so
  scaffolded state and future updates use the same model
- verify: current scaffold still generates valid state and tests keep passing
- done: yes

### Task 2

- files: `src/lib/work-cycle.ts`, `src/commands/begin.ts`, `src/cli.ts`
- action: implement the `begin` command and work-cycle artifact generation flow
- verify: `sb-codex-tool begin` creates artifacts and updates current state
- done: yes

### Task 3

- files: `src/lib/doctor.ts`, `src/lib/status.ts`, `src/commands/status.ts`
- action: validate current-state references and expose current guide, handoff,
  and review paths in status output
- verify: `doctor` and `status` show the expected references after a work cycle
  is created
- done: yes

### Task 4

- files: `tests/begin.test.ts`
- action: add a smoke test for work-cycle artifact generation and state updates
- verify: `node --experimental-strip-types --test tests/*.test.ts`
- done: yes
