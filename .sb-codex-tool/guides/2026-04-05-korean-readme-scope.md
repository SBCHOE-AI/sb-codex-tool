# Scope Guide: Korean README

## Purpose

- Narrow the current work cycle to a bounded file scope and clear verification expectations.

## Working Goal

- Publish a repository-facing Korean README that mirrors the current English
  README closely enough for Korean readers and keeps both entry points easy to
  discover on GitHub.

## Primary Plan

- .sb-codex-tool/plans/2026-04-05-korean-readme-approved.md

## Allowed File Scope

- README.md
- README.ko.md
- tests/readme-l10n.test.ts
- .sb-codex-tool/plans/2026-04-05-korean-readme-approved.md
- .sb-codex-tool/guides/2026-04-05-korean-readme-scope.md
- .sb-codex-tool/summaries/2026-04-05-korean-readme-execution-summary.md
- .sb-codex-tool/handoffs/2026-04-05-korean-readme-to-verification.md
- .sb-codex-tool/reviews/2026-04-05-korean-readme-fresh-verification.md

## Recommended References

- AGENTS.md
- .sb-codex-tool/project.md
- .sb-codex-tool/state.md
- .sb-codex-tool/guides/code-consistency.md
- .sb-codex-tool/summaries/2026-04-05-detailed-readme-github-publish-verification-summary.md

## Verification Expectations

- Run `node --experimental-strip-types --test tests/readme-l10n.test.ts`.
- Run `node --experimental-strip-types --test tests/*.test.ts`.
- Run `node --experimental-strip-types src/cli.ts doctor`.
- Run `npm pack --dry-run`.
- Confirm `README.md` links Korean readers to `README.ko.md`.
- Confirm `README.ko.md` is detailed, readable, and cross-links back to the
  English README.
- Require a fresh-agent verification verdict before closure.
