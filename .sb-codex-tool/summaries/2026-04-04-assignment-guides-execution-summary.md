# Execution Summary: Assignment Guides

## Purpose

- Capture implementation progress for the current work cycle before fresh verification.

## Scope

- Add a bounded assignment helper so the main agent can create subagent
  assignment guides from the current cycle and keep active subagents visible in
  state.

## Implemented Surface

- Added `src/lib/assignment.ts` to create bounded assignment guides using the
  current plan, summary, guide, and code-consistency references.
- Added `src/commands/assign.ts` and wired `assign` into `src/cli.ts`.
- Added `tests/assign.test.ts` for guide creation, missing-cycle rejection, and
  rerun deduplication coverage.
- Extracted shared markdown section parsing into
  `src/lib/markdown-sections.ts` and reused it from `src/lib/close-cycle.ts`.
- Updated `docs/implementation/core-contract.md` and
  `.sb-codex-tool/project.md` so the helper command surface and architecture
  truth stay explicit.

## Checks Run

- `node --experimental-strip-types --test tests/*.test.ts`
- `node --experimental-strip-types src/cli.ts help`
- `node --experimental-strip-types src/cli.ts doctor`
- `node --experimental-strip-types src/cli.ts status`

## Plan vs Actual

- Planned: add a bounded assignment helper without expanding into a large role
  system
- Actual: `assign` now creates one guide per named subagent assignment and only
  updates visible active-subagent state
- Planned: keep assignment references tied to the current cycle and the
  code-consistency guide
- Actual: generated guides point to the current plan, latest summary, current
  guide, latest run, and `.sb-codex-tool/guides/code-consistency.md`
- Planned: avoid duplicate active-subagent entries on rerun
- Actual: rerunning the same assignment keeps the same guide and deduplicates
  the subagent list in state
- Planned: keep markdown-section parsing reusable instead of duplicating it
- Actual: close-cycle parsing now uses the shared helper too

## Refactor Notes

- Section parsing now lives in `src/lib/markdown-sections.ts` so assignment and
  close-cycle flows do not each carry their own markdown parsing copy.
- `assign` stays thin at the command layer and keeps state writes on the shared
  current-state path.

## Deferred Issues

- Fresh-agent verification has not yet been completed for this increment.
- Assignment completion, reset, or replacement is still a human/main-agent
  operation rather than an automated command.

## Next-Agent Guidance

- Start from this execution summary as the latest relevant summary.
- Then review `.sb-codex-tool/plans/2026-04-04-assignment-guides-approved.md`.
- Then review `.sb-codex-tool/guides/2026-04-04-assignment-guides-scope.md`.
- Then inspect `src/lib/assignment.ts`, `src/commands/assign.ts`,
  `src/lib/markdown-sections.ts`, and `tests/assign.test.ts`.
