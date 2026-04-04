# Scope Guide: Npm Distribution Readiness

## Purpose

- Narrow the current work cycle to a bounded file scope and clear verification expectations.

## Working Goal

- Make the package ready for npm distribution with explicit metadata, README
  guidance, and a focused published tarball surface.

## Primary Plan

- .sb-codex-tool/plans/2026-04-05-npm-distribution-readiness-approved.md

## Allowed File Scope

- package.json
- README.md
- tests/distribution.test.ts
- docs/implementation/verification-contract.md
- docs/implementation/acceptance-checklist.md
- .sb-codex-tool/project.md
- .sb-codex-tool/guides/code-consistency.md
- .sb-codex-tool/plans/2026-04-05-npm-distribution-readiness-approved.md
- .sb-codex-tool/summaries/2026-04-05-npm-distribution-readiness-execution-summary.md
- .sb-codex-tool/handoffs/2026-04-05-npm-distribution-readiness-to-verification.md

## Recommended References

- AGENTS.md
- .sb-codex-tool/project.md
- .sb-codex-tool/state.md
- .sb-codex-tool/guides/code-consistency.md
- .sb-codex-tool/summaries/2026-04-05-semantic-validation-strengthening-verification-summary.md

## Verification Expectations

- Run `node --experimental-strip-types --test tests/distribution.test.ts`.
- Run `node --experimental-strip-types --test tests/*.test.ts`.
- Run `npm pack --dry-run`.
- Run `node --experimental-strip-types src/cli.ts doctor`.
- Fresh verification should confirm that the tarball excludes internal state,
  tests, and research docs while README and package metadata remain usable for
  npm distribution.
