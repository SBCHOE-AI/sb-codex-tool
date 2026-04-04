# Handoff: Npm Distribution Readiness

## Goal

- Enable the next fresh agent to continue this work cycle without hidden context.

## Read In This Order

1. AGENTS.md
2. .sb-codex-tool/project.md
3. .sb-codex-tool/state.md
4. .sb-codex-tool/guides/read-this-first.md
5. .sb-codex-tool/guides/code-consistency.md
6. .sb-codex-tool/summaries/2026-04-05-npm-distribution-readiness-execution-summary.md
7. .sb-codex-tool/plans/2026-04-05-npm-distribution-readiness-approved.md
8. .sb-codex-tool/guides/2026-04-05-npm-distribution-readiness-scope.md

## Current Status

- Make the package ready for npm distribution with explicit metadata, README
guidance, and a focused tarball surface.
- Updated `package.json` to add a distribution-friendly tarball surface via
the `files` whitelist, explicit packaging scripts, keywords, and a license
placeholder suitable for internal distribution.
- Added `README.md` with installation, command, workflow, state-layout, and
packaging-check guidance.
- Added `tests/distribution.test.ts` to verify package metadata, README
content, and `npm pack --dry-run` output.
- Updated verification and acceptance docs so fresh agents inspect npm
distribution readiness explicitly.
- Implementation and refactor are ready for fresh verification.

## Git Context

- Run artifact: .sb-codex-tool/runs/2026-04-05-npm-distribution-readiness-run.json
- Git available: no
- Branch: unavailable
- Dirty: unavailable
- Changed files: unavailable outside a Git repository

## Expected Verification Checks

- Run `node --experimental-strip-types --test tests/distribution.test.ts`.
- Run `node --experimental-strip-types --test tests/*.test.ts`.
- Run `npm pack --dry-run`.
- Run `node --experimental-strip-types src/cli.ts doctor`.
- Fresh verification should confirm that the tarball excludes internal state,
tests, and research docs while README and package metadata remain usable for
npm distribution.

## Open Risks

- None.

## Next-Agent Guidance

- Start from this execution summary as the latest relevant summary.
- Then review `.sb-codex-tool/plans/2026-04-05-npm-distribution-readiness-approved.md`.
- Then review `.sb-codex-tool/guides/2026-04-05-npm-distribution-readiness-scope.md`.
- Then inspect `package.json`, `README.md`, and `tests/distribution.test.ts`.
