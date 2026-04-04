# Handoff: Consistency Review Flow

## Goal

- Enable the next fresh agent to continue this work cycle without hidden context.

## Read In This Order

1. AGENTS.md
2. .sb-codex-tool/project.md
3. .sb-codex-tool/state.md
4. .sb-codex-tool/guides/read-this-first.md
5. .sb-codex-tool/guides/code-consistency.md
6. .sb-codex-tool/summaries/2026-04-05-consistency-review-flow-execution-summary.md
7. .sb-codex-tool/reviews/2026-04-05-consistency-review-flow-locke-consistency-review.md
8. .sb-codex-tool/plans/2026-04-05-consistency-review-flow-approved.md
9. .sb-codex-tool/guides/2026-04-05-consistency-review-flow-scope.md

## Current Status

- Implementation is complete and self-checks are passing.
- `review-consistency` is wired into CLI help and current-state updates.
- `.sb-codex-tool/reviews/2026-04-05-consistency-review-flow-locke-consistency-review.md`
  exists and is recorded as the latest consistency review.
- The current cycle still requires a fresh verification pass before closure.

## Git Context

- Run artifact: .sb-codex-tool/runs/2026-04-05-consistency-review-flow-run.json
- Git available: no
- Branch: unavailable
- Dirty: unavailable
- Changed files: unavailable outside a Git repository


## Expected Verification Checks

- Read the implementation contracts in the order required by
  `docs/implementation/verification-contract.md`.
- Inspect the current cycle plan, guide, execution summary, and generated
  consistency-review artifact.
- Run `node --experimental-strip-types --test tests/*.test.ts`.
- Run `node --experimental-strip-types src/cli.ts help`.
- Run `node --experimental-strip-types src/cli.ts doctor`.
- Run `node --experimental-strip-types src/cli.ts status`.
- Confirm the latest consistency review is visible in current state and status.

## Open Risks

- No blocking implementation risk is known.
- Fresh verification still needs to confirm the new helper output and visible
  state updates match the contracts.
