# Execution Summary: Launch Wrapper Hardening

## Purpose

- Capture implementation progress for the current work cycle before fresh verification.

## Scope

- Harden the launch wrapper so it performs hot-path preflight, exports a
  durable instruction-surface file, and records richer launch metadata.

## Implemented Surface

- Replaced the old inline launch logic with `src/lib/launch.ts` so launch
  preflight and metadata handling live in one focused module.
- Reworked `src/lib/codex.ts` to resolve a local `node_modules/.bin/codex`
  first, then fall back to PATH scanning without relying on `which`.
- Updated `src/commands/launch.ts` to use the hardened launch helper and print
  the instruction-surface file path.
- Added `tests/launch.test.ts` to cover a successful fake-codex launch and a
  failing hot-path preflight.
- Updated contracts and repo guidance for the stronger launch behavior.

## Checks Run

- `node --experimental-strip-types --test tests/launch.test.ts`

## Plan vs Actual

- Planned: harden the launch wrapper with explicit preflight and richer
  evidence.
- Actual: launch now records current stage, current plan/summary/run, resolved
  codex binary, exit status, and preflight state in launch metadata.
- Planned: export a durable instruction-surface file to the launched process.
- Actual: launch now writes `.sb-codex-tool/index/current-launch-instructions.txt`
  and passes its path through an environment variable.
- Planned: verify the new behavior without requiring a real interactive Codex
  session.
- Actual: added fake-codex tests that capture exported environment and metadata.

## Refactor Notes

- Moved launch behavior out of the command module so the wrapper is testable
  without opening an interactive Codex session.
- Kept metadata writing in small helper functions instead of coupling it to the
  spawn path directly.

## Deferred Issues

- None.

## Next-Agent Guidance

- Start from this execution summary as the latest relevant summary.
- Then review `.sb-codex-tool/plans/2026-04-05-launch-wrapper-hardening-approved.md`.
- Then review `.sb-codex-tool/guides/2026-04-05-launch-wrapper-hardening-scope.md`.
- Then inspect `src/lib/launch.ts`, `src/lib/codex.ts`,
  `src/commands/launch.ts`, and `tests/launch.test.ts`.
