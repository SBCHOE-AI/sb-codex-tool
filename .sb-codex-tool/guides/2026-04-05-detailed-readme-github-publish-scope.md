# Scope Guide: Detailed README and GitHub Publish

## Purpose

- Narrow the current work cycle to a bounded file scope and clear verification expectations.

## Working Goal

- Turn the project into a GitHub-ready repository with a detailed README and
  explicit repository metadata.

## Primary Plan

- .sb-codex-tool/plans/2026-04-05-detailed-readme-github-publish-approved.md

## Allowed File Scope

- README.md
- package.json
- tests/distribution.test.ts
- .sb-codex-tool/plans/2026-04-05-detailed-readme-github-publish-approved.md
- .sb-codex-tool/summaries/2026-04-05-detailed-readme-github-publish-execution-summary.md
- .sb-codex-tool/handoffs/2026-04-05-detailed-readme-github-publish-to-verification.md
- .git/
- GitHub repository metadata for `SBCHOE-AI/sb-codex-tool`

## Recommended References

- AGENTS.md
- .sb-codex-tool/project.md
- .sb-codex-tool/state.md
- .sb-codex-tool/guides/code-consistency.md
- .sb-codex-tool/summaries/2026-04-05-npm-distribution-readiness-verification-summary.md

## Verification Expectations

- Run `node --experimental-strip-types --test tests/distribution.test.ts`.
- Run `node --experimental-strip-types --test tests/*.test.ts`.
- Run `npm pack --dry-run`.
- Run `node --experimental-strip-types src/cli.ts doctor`.
- Confirm that the repository exists at `SBCHOE-AI/sb-codex-tool` and that the
  local `origin` remote points to it.
