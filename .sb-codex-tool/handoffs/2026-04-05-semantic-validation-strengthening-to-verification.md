# Handoff: Semantic Validation Strengthening

## Goal

- Enable the next fresh agent to continue this work cycle without hidden context.

## Read In This Order

1. AGENTS.md
2. .sb-codex-tool/project.md
3. .sb-codex-tool/state.md
4. .sb-codex-tool/guides/read-this-first.md
5. .sb-codex-tool/guides/code-consistency.md
6. .sb-codex-tool/summaries/2026-04-05-semantic-validation-strengthening-execution-summary.md
7. .sb-codex-tool/plans/2026-04-05-semantic-validation-strengthening-approved.md
8. .sb-codex-tool/guides/2026-04-05-semantic-validation-strengthening-scope.md

## Current Status

- Strengthen semantic validation so `doctor` and `status` detect logical drift
between current state, latest run, and assignment ownership.
- Added `src/lib/state-coherence.ts` as the shared semantic checker for
latest-run alignment, verify-stage readiness, and assignment-guide
coherence.
- Updated `src/lib/doctor.ts` to reuse the shared coherence checks in addition
to the existing placeholder and artifact validation.
- Updated `src/lib/status.ts` and `src/commands/status.ts` so status now
reports a `Semantic issues` section instead of silently assuming state
coherence.
- Added regression coverage in `tests/doctor.test.ts` and
`tests/status.test.ts` for broken verify-stage and stale assignment-guide
states.
- Updated verification guidance and repo guidance to describe the stronger
semantic validation behavior.
- Implementation and refactor are ready for fresh verification.

## Git Context

- Run artifact: .sb-codex-tool/runs/2026-04-05-semantic-validation-strengthening-run.json
- Git available: no
- Branch: unavailable
- Dirty: unavailable
- Changed files: unavailable outside a Git repository

## Expected Verification Checks

- Run `node --experimental-strip-types --test tests/doctor.test.ts tests/status.test.ts`.
- Run `node --experimental-strip-types --test tests/*.test.ts`.
- Run `node --experimental-strip-types src/cli.ts doctor`.
- Run `node --experimental-strip-types src/cli.ts status`.
- Fresh verification should confirm that `doctor` now fails on state/run or
assignment drift and that `status` exposes semantic issues when coherence is
broken.

## Open Risks

- None.

## Next-Agent Guidance

- Start from this execution summary as the latest relevant summary.
- Then review `.sb-codex-tool/plans/2026-04-05-semantic-validation-strengthening-approved.md`.
- Then review `.sb-codex-tool/guides/2026-04-05-semantic-validation-strengthening-scope.md`.
- Then inspect `src/lib/state-coherence.ts`, `src/lib/doctor.ts`,
`src/lib/status.ts`, `src/commands/status.ts`, and the updated tests.
