# Scope Guide: Public Repo and npm Release

## Purpose

- Narrow the current work cycle to a bounded file scope and clear verification expectations.

## Working Goal

- Open the public release path so another machine can install from the public
  GitHub repository right away and from npm once publish auth is available.

## Primary Plan

- .sb-codex-tool/plans/2026-04-05-public-release-approved.md

## Allowed File Scope

- README.md
- README.ko.md
- package.json
- bin/sb-codex-tool.js
- tests/distribution.test.ts
- tests/install-smoke.test.ts
- .sb-codex-tool/plans/2026-04-05-public-release-approved.md
- .sb-codex-tool/guides/2026-04-05-public-release-scope.md
- .sb-codex-tool/summaries/2026-04-05-public-release-execution-summary.md
- .sb-codex-tool/handoffs/2026-04-05-public-release-to-verification.md
- .sb-codex-tool/reviews/2026-04-05-public-release-fresh-verification.md

## Recommended References

- AGENTS.md
- .sb-codex-tool/project.md
- .sb-codex-tool/state.md
- .sb-codex-tool/guides/code-consistency.md
- .sb-codex-tool/summaries/2026-04-05-getting-started-manual-verification-summary.md

## Verification Expectations

- Run `node --experimental-strip-types --test tests/distribution.test.ts`.
- Run `node --experimental-strip-types --test tests/install-smoke.test.ts`.
- Run `node --experimental-strip-types --test tests/*.test.ts`.
- Run `node --experimental-strip-types src/cli.ts doctor`.
- Confirm the repository visibility is `PUBLIC`.
- Confirm the READMEs explain direct GitHub installation.
- If npm publish succeeds, confirm `npm view sb-codex-tool version
  dist-tags.latest --json` resolves.
- If npm publish is blocked, require the blocker to be explicit in the cycle
  summary and handoff.
