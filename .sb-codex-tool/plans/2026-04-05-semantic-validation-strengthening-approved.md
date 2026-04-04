# Approved Plan: Semantic Validation Strengthening

## Objective

- Strengthen `doctor` and `status` so they detect logical drift between the
  current state, latest lifecycle run, and active assignment metadata.

## Acceptance Criteria

- `doctor` fails when verify-state or assignment-guide metadata drifts out of
  coherence with the latest run or active agents.
- `status` surfaces semantic issues so a fresh agent can see logical drift
  without opening the full current-state JSON.
- The new semantic checks reuse one shared helper instead of duplicating rules
  across `doctor` and `status`.
- Tests cover both passing and broken-coherence scenarios.

## Boundaries

- In scope: current-state coherence checks, status visibility, doctor
  validation, and tests/docs tied to those behaviors.
- Out of scope: new workflow commands, new run phases, or changing scaffold
  content generation.

## Tasks

### Task 1

- files: `src/lib/state-coherence.ts`, `src/lib/doctor.ts`, `src/lib/status.ts`, `src/commands/status.ts`
- action: add shared semantic coherence checks for latest-run alignment,
  verify-stage readiness, and assignment-guide/active-subagent consistency
- verify: run `node --experimental-strip-types --test tests/doctor.test.ts tests/status.test.ts`
  and inspect status output for the new semantic issues section
- done: yes

### Task 2

- files: `tests/doctor.test.ts`, `tests/status.test.ts`, `docs/implementation/verification-contract.md`, `docs/implementation/acceptance-checklist.md`
- action: cover broken-coherence scenarios in tests and update verification
  guidance so fresh agents inspect the stronger semantic checks
- verify: run `node --experimental-strip-types --test tests/*.test.ts`,
  `node --experimental-strip-types src/cli.ts doctor`, and
  `node --experimental-strip-types src/cli.ts status`
- done: yes
