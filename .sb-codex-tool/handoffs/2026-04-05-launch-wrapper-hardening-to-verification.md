# Handoff: Launch Wrapper Hardening

## Goal

- Enable the next fresh agent to continue this work cycle without hidden context.

## Read In This Order

1. AGENTS.md
2. .sb-codex-tool/project.md
3. .sb-codex-tool/state.md
4. .sb-codex-tool/guides/read-this-first.md
5. .sb-codex-tool/guides/code-consistency.md
6. .sb-codex-tool/summaries/2026-04-05-launch-wrapper-hardening-execution-summary.md
7. .sb-codex-tool/plans/2026-04-05-launch-wrapper-hardening-approved.md
8. .sb-codex-tool/guides/2026-04-05-launch-wrapper-hardening-scope.md

## Current Status

- Harden the launch wrapper so it performs hot-path preflight, exports a
durable instruction-surface file, and records richer launch metadata.
- Replaced the old inline launch logic with `src/lib/launch.ts` so launch
preflight and metadata handling live in one focused module.
- Reworked `src/lib/codex.ts` to resolve a local `node_modules/.bin/codex`
first, then fall back to PATH scanning without relying on `which`.
- Updated `src/commands/launch.ts` to use the hardened launch helper and print
the instruction-surface file path.
- Added `tests/launch.test.ts` to cover a successful fake-codex launch and a
failing hot-path preflight.
- Updated contracts and repo guidance for the stronger launch behavior.
- Implementation and refactor are ready for fresh verification.

## Git Context

- Run artifact: .sb-codex-tool/runs/2026-04-05-launch-wrapper-hardening-run.json
- Git available: no
- Branch: unavailable
- Dirty: unavailable
- Changed files: unavailable outside a Git repository

## Expected Verification Checks

- Run `node --experimental-strip-types --test tests/launch.test.ts`.
- Run `node --experimental-strip-types --test tests/*.test.ts`.
- Run `node --experimental-strip-types src/cli.ts help`.
- Run `node --experimental-strip-types src/cli.ts doctor`.
- Run `node --experimental-strip-types src/cli.ts status`.
- Fresh verification should confirm that launch metadata now captures preflight,
current cycle references, and the exported instruction-surface file path.

## Open Risks

- None.

## Next-Agent Guidance

- Start from this execution summary as the latest relevant summary.
- Then review `.sb-codex-tool/plans/2026-04-05-launch-wrapper-hardening-approved.md`.
- Then review `.sb-codex-tool/guides/2026-04-05-launch-wrapper-hardening-scope.md`.
- Then inspect `src/lib/launch.ts`, `src/lib/codex.ts`,
`src/commands/launch.ts`, and `tests/launch.test.ts`.
