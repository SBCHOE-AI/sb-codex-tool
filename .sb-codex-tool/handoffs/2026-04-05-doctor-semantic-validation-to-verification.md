# Handoff: Doctor Semantic Validation

## Goal

- Enable the next fresh agent to continue this work cycle without hidden context.

## Read In This Order

1. AGENTS.md
2. .sb-codex-tool/project.md
3. .sb-codex-tool/state.md
4. .sb-codex-tool/guides/read-this-first.md
5. .sb-codex-tool/guides/code-consistency.md
6. .sb-codex-tool/summaries/2026-04-05-doctor-semantic-validation-execution-summary.md
7. .sb-codex-tool/plans/2026-04-05-doctor-semantic-validation-approved.md
8. .sb-codex-tool/guides/2026-04-05-doctor-semantic-validation-scope.md

## Current Status

- Implementation is complete and self-checks are passing.
- `doctor` now fails when the current cycle still contains scaffold placeholder
  content.
- The latest consistency review example has been filled so current semantic
  validation can pass.

## Git Context

- Run artifact: .sb-codex-tool/runs/2026-04-05-doctor-semantic-validation-run.json
- Git available: no
- Branch: unavailable
- Dirty: unavailable
- Changed files: unavailable outside a Git repository


## Expected Verification Checks

- Read the implementation contracts in the required order.
- Run `node --experimental-strip-types --test tests/*.test.ts`.
- Run `node --experimental-strip-types src/cli.ts help`.
- Run `node --experimental-strip-types src/cli.ts doctor`.
- Run `node --experimental-strip-types src/cli.ts status`.
- Confirm doctor reports no semantic placeholder failures for the current cycle
  or the latest consistency review.

## Open Risks

- No blocking implementation risk is known.
- Fresh verification still needs to confirm the semantic doctor checks match
  the updated contracts.
