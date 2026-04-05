# Handoff: npm Publish Release

## Goal

- Enable the next fresh agent to continue this work cycle without hidden context.

## Read In This Order

1. AGENTS.md
2. .sb-codex-tool/project.md
3. .sb-codex-tool/state.md
4. .sb-codex-tool/guides/read-this-first.md
5. .sb-codex-tool/guides/code-consistency.md
6. .sb-codex-tool/summaries/2026-04-05-npm-publish-release-execution-summary.md
7. .sb-codex-tool/plans/2026-04-05-npm-publish-release-approved.md
8. .sb-codex-tool/guides/2026-04-05-npm-publish-release-scope.md

## Current Status

- Normalize the publish-safe bin manifest, confirm npm-registry availability for
`sb-codex-tool@0.1.0`, and validate `npm install` plus
`npx sb-codex-tool@latest setup` from a fresh temporary project.
- Normalized `package.json` so the published bin entry uses
`bin/sb-codex-tool.js`, matching npm's publish expectations.
- Confirmed `sb-codex-tool@0.1.0` is already visible on the public npm
registry.
- Confirmed a fresh temporary project can install from npm and run
`npx sb-codex-tool@latest setup`.
- Confirmed the earlier publish rejection is no longer an auth problem; it now
fails only because `0.1.0` is already published.
- Implementation and refactor are ready for fresh verification.

## Git Context

- Run artifact: .sb-codex-tool/runs/2026-04-05-npm-publish-release-run.json
- Git available: yes
- Branch: main
- Dirty: yes
- Changed files:
  - sb-codex-tool/guides/read-this-first.md
  - sb-codex-tool/index/current.json
  - sb-codex-tool/state.md
  - ackage.json
  - ests/distribution.test.ts
  - .sb-codex-tool/guides/2026-04-05-npm-publish-release-scope.md
  - .sb-codex-tool/handoffs/2026-04-05-npm-publish-release-to-verification.md
  - .sb-codex-tool/plans/2026-04-05-npm-publish-release-approved.md
  - .sb-codex-tool/reviews/2026-04-05-npm-publish-release-fresh-verification.md
  - .sb-codex-tool/runs/2026-04-05-npm-publish-release-run.json
  - .sb-codex-tool/summaries/2026-04-05-npm-publish-release-execution-summary.md

## Expected Verification Checks

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

## Open Risks

- `tests/distribution.test.ts` still expects the older `./bin/...` manifest
string and must be updated to the normalized bin path before final
verification.

## Next-Agent Guidance

- Start from this execution summary as the latest relevant summary.
- Then review `.sb-codex-tool/plans/2026-04-05-npm-publish-release-approved.md`.
- Then review `.sb-codex-tool/guides/2026-04-05-npm-publish-release-scope.md`.
- Then inspect `package.json` and `tests/distribution.test.ts`.
