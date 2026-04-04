# Handoff: Work-Cycle Writing Automation

## Goal

- Enable the next fresh agent to continue this work cycle without hidden context.

## Read In This Order

1. AGENTS.md
2. .sb-codex-tool/project.md
3. .sb-codex-tool/state.md
4. .sb-codex-tool/guides/read-this-first.md
5. .sb-codex-tool/guides/code-consistency.md
6. .sb-codex-tool/summaries/2026-04-05-work-cycle-writing-automation-execution-summary.md
7. .sb-codex-tool/plans/2026-04-05-work-cycle-writing-automation-approved.md
8. .sb-codex-tool/guides/2026-04-05-work-cycle-writing-automation-scope.md

## Current Status

- Add explicit verify-preparation automation so the current handoff, run
record, and current state can be aligned from the active execution summary
and guide.
- Added `src/lib/prepare-verify.ts` to rewrite the current handoff from the
active execution summary and guide, then move the cycle into verify-ready
state.
- Added `src/commands/prepare-verify.ts` and wired the helper into the CLI.
- Updated `src/lib/run-records.ts` to support a `prepare-verify` lifecycle
phase.
- Added `tests/prepare-verify.test.ts` to cover the verify-ready happy path and
missing-guidance failure behavior.
- Updated contracts and repo guidance for the new helper command.
- Implementation and refactor are ready for fresh verification.

## Git Context

- Run artifact: .sb-codex-tool/runs/2026-04-05-work-cycle-writing-automation-run.json
- Git available: no
- Branch: unavailable
- Dirty: unavailable
- Changed files: unavailable outside a Git repository

## Expected Verification Checks

- Run `node --experimental-strip-types --test tests/prepare-verify.test.ts tests/begin.test.ts tests/close.test.ts`.
- Run `node --experimental-strip-types --test tests/*.test.ts`.
- Run `node --experimental-strip-types src/cli.ts help`.
- Run `node --experimental-strip-types src/cli.ts prepare-verify`.
- Run `node --experimental-strip-types src/cli.ts doctor`.
- Run `node --experimental-strip-types src/cli.ts status`.
- Fresh verification should confirm that `prepare-verify` rewrites the handoff
and moves the current cycle into verify-ready state without manual edits.

## Open Risks

- None.

## Next-Agent Guidance

- Start from this execution summary as the latest relevant summary.
- Then review `.sb-codex-tool/plans/2026-04-05-work-cycle-writing-automation-approved.md`.
- Then review `.sb-codex-tool/guides/2026-04-05-work-cycle-writing-automation-scope.md`.
- Then inspect `src/lib/prepare-verify.ts`,
`src/commands/prepare-verify.ts`, `src/lib/run-records.ts`, and
`tests/prepare-verify.test.ts`.
