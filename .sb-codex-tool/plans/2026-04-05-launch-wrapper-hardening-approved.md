# Approved Plan: Launch Wrapper Hardening

## Objective

- Harden the launch wrapper so it performs preflight checks, records richer
  launch metadata, and exports a durable instruction-surface file for the
  launched Codex session.

## Acceptance Criteria

- Launch metadata records the current stage, latest plan/summary/run, resolved
  Codex binary, exit status, and preflight results.
- Launch preflight fails clearly when hot-path files are missing.
- The wrapper exports both inline instruction text and an instruction-surface
  file path to the launched Codex process.
- Tests cover a successful fake-codex launch and a failing preflight path.
- Contracts and repo guidance mention the stronger launch behavior.

## Boundaries

- In scope: launch wrapper preflight, metadata enrichment, instruction-surface
  file export, codex binary resolution hardening, tests, and contract/guidance
  updates.
- Out of scope: interactive session orchestration beyond spawning the Codex
  binary.

## Tasks

### Task 1

- files: `src/lib/codex.ts`, `src/lib/launch.ts`, `src/commands/launch.ts`,
  `src/cli.ts`
- action: harden launch preflight and metadata while keeping the runtime path
  small and explicit
- verify: run focused launch tests and inspect the launch metadata behavior
- done: yes

### Task 2

- files: `tests/launch.test.ts`
- action: cover fake-codex success and missing-hot-path failure cases
- verify: run the launch-focused test suite
- done: yes

### Task 3

- files: `docs/implementation/core-contract.md`,
  `docs/implementation/verification-contract.md`,
  `docs/implementation/acceptance-checklist.md`,
  `.sb-codex-tool/project.md`, `.sb-codex-tool/guides/code-consistency.md`
- action: align contracts and repo guidance with the stronger launch behavior
- verify: inspect the updated docs and rerun `doctor`
- done: yes
