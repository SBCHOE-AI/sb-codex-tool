# Scope Guide: npm Publish Release

## Purpose

- Narrow the current work cycle to a bounded file scope and clear verification expectations.

## Working Goal

- Confirm that `sb-codex-tool@0.1.0` is publicly available on npm and validate
  the npm-registry install path that a first-time user on another machine would
  use.

## Primary Plan

- .sb-codex-tool/plans/2026-04-05-npm-publish-release-approved.md

## Allowed File Scope

- package.json
- .sb-codex-tool/plans/2026-04-05-npm-publish-release-approved.md
- .sb-codex-tool/guides/2026-04-05-npm-publish-release-scope.md
- .sb-codex-tool/summaries/2026-04-05-npm-publish-release-execution-summary.md
- .sb-codex-tool/handoffs/2026-04-05-npm-publish-release-to-verification.md
- .sb-codex-tool/reviews/2026-04-05-npm-publish-release-fresh-verification.md

## Recommended References

- AGENTS.md
- .sb-codex-tool/project.md
- .sb-codex-tool/state.md
- .sb-codex-tool/guides/code-consistency.md
- .sb-codex-tool/summaries/2026-04-05-public-release-verification-summary.md

## Verification Expectations

- Run `npm publish --access public` and capture the exact result.
- Run `npm view sb-codex-tool version dist-tags.latest --json`.
- In a fresh temporary project, run `npm install --save-dev sb-codex-tool`.
- In the same fresh project, run `npx sb-codex-tool@latest setup`.
- Re-run `node --experimental-strip-types --test tests/*.test.ts`.
- Re-run `node --experimental-strip-types src/cli.ts doctor`.
- A `pass` verdict requires public npm availability plus successful fresh
  npm-registry install and `npx` setup. An already-published `0.1.0` is
  acceptable if the registry and install checks pass.
- A `pass_with_concerns` verdict is acceptable only if publish succeeds but a
  smaller non-blocking concern remains in the cycle artifacts.
- A `blocked` verdict is required if publish or npm-registry installation still
  cannot complete.
