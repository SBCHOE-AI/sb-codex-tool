# Approved Plan: Assignment Guides

## Objective

- Add a bounded `assign` helper that lets the main agent create subagent
  assignment guides from the current cycle, reference the code-consistency
  guide automatically, and update visible active-subagent state without adding
  a large orchestration system.

## Acceptance Criteria

- `sb-codex-tool assign <agent-name> <slug> [title words]` exists and is listed
  in CLI help.
- `assign` creates a guide under `.sb-codex-tool/guides/` for the named
  subagent and includes current cycle references plus the code-consistency
  guide.
- `assign` updates visible state so the named subagent appears in the active
  subagent list.
- rerunning the same assignment does not duplicate the subagent entry.
- `assign` fails clearly when no current cycle exists.
- tests cover guide creation, missing-cycle rejection, and rerun deduplication.

## Boundaries

- In scope:
  - `assign` CLI command
  - assignment guide generation
  - active-subagent state updates
  - current-cycle reference wiring
  - regression tests and helper-surface documentation
- Out of scope:
  - spawning subagents automatically
  - completing or clearing assignments automatically
  - consistency review automation
  - verification or closure automation changes outside assignment references

## Tasks

### Task 1

- files: `src/lib/assignment.ts`, `src/commands/assign.ts`, `src/cli.ts`,
  `src/lib/markdown-sections.ts`, `src/lib/close-cycle.ts`
- action: implement the bounded assignment helper and reuse shared markdown
  section parsing instead of adding ad hoc assignment logic
- verify: `assign` creates a readable assignment guide and wires active
  subagents into current state
- done: yes

### Task 2

- files: `tests/assign.test.ts`, `tests/close.test.ts`
- action: add assignment-guide regression coverage and keep existing close-cycle
  parsing on the shared markdown helper
- verify: tests cover assignment creation, missing-cycle rejection, and rerun
  deduplication without breaking close-cycle coverage
- done: yes

### Task 3

- files: `docs/implementation/core-contract.md`,
  `.sb-codex-tool/project.md`,
  `.sb-codex-tool/summaries/2026-04-04-assignment-guides-execution-summary.md`,
  `.sb-codex-tool/handoffs/2026-04-04-assignment-guides-to-verification.md`,
  `.sb-codex-tool/guides/2026-04-04-assignment-guides-scope.md`
- action: document the helper command surface and leave verification-friendly
  artifacts for this increment
- verify: a fresh agent can inspect the assignment helper without guessing
- done: yes
