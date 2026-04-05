# Scope Guide: Getting Started Manual

## Purpose

- Narrow the current work cycle to a bounded file scope and clear verification expectations.

## Working Goal

- Publish a beginner-friendly usage manual that lets a first-time Codex user
  start using sb-codex-tool in the right order without reading internal
  contract docs first.

## Primary Plan

- .sb-codex-tool/plans/2026-04-05-getting-started-manual-approved.md

## Allowed File Scope

- README.md
- README.ko.md
- docs/menu/getting-started.md
- docs/guides/getting-started-ko.md
- tests/getting-started-docs.test.ts
- .sb-codex-tool/plans/2026-04-05-getting-started-manual-approved.md
- .sb-codex-tool/guides/2026-04-05-getting-started-manual-scope.md
- .sb-codex-tool/summaries/2026-04-05-getting-started-manual-execution-summary.md
- .sb-codex-tool/handoffs/2026-04-05-getting-started-manual-to-verification.md
- .sb-codex-tool/reviews/2026-04-05-getting-started-manual-fresh-verification.md

## Recommended References

- AGENTS.md
- .sb-codex-tool/project.md
- .sb-codex-tool/state.md
- .sb-codex-tool/guides/code-consistency.md
- .sb-codex-tool/summaries/2026-04-05-korean-readme-verification-summary.md

## Verification Expectations

- Run `node --experimental-strip-types --test tests/getting-started-docs.test.ts`.
- Run `node --experimental-strip-types --test tests/*.test.ts`.
- Run `node --experimental-strip-types src/cli.ts doctor`.
- Confirm that `README.md` and `README.ko.md` both link to the getting-started
  menu document.
- Confirm that the detailed manual includes prerequisites, step order,
  examples, verification, and common mistakes.
- Require a fresh-agent verification verdict before closure.
