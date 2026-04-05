# Handoff: Public Repo and npm Release

## Goal

- Enable the next fresh agent to continue this work cycle without hidden context.

## Read In This Order

1. AGENTS.md
2. .sb-codex-tool/project.md
3. .sb-codex-tool/state.md
4. .sb-codex-tool/guides/read-this-first.md
5. .sb-codex-tool/guides/code-consistency.md
6. .sb-codex-tool/summaries/2026-04-05-public-release-execution-summary.md
7. .sb-codex-tool/plans/2026-04-05-public-release-approved.md
8. .sb-codex-tool/guides/2026-04-05-public-release-scope.md

## Current Status

- Make the repository public, document the public install paths, fix the
packaged runtime so installed copies can execute from `node_modules`, and
attempt npm publication with explicit blocker capture if auth is missing.
- Switched the GitHub repository visibility to `PUBLIC`.
- Updated `README.md` and `README.ko.md` so both public install paths are
documented:
- npm install after publish
- direct install from the public GitHub repository
- Added `publishConfig.access = public` to `package.json`.
- Reworked the packaged runtime so the published package executes
`dist/cli.js` instead of trying to run `src/cli.ts` from `node_modules`.
- Added a build pipeline with `esbuild`, `prepare`, and `prepack`.
- Added `tests/install-smoke.test.ts` so a packed install can run
`npx sb-codex-tool setup` from `node_modules`.
- Updated the installation docs so published installs can use
`npx sb-codex-tool@latest setup` while GitHub installs use
`npm exec sb-codex-tool -- setup`.
- Pushed the packaged-runtime fix to `main` and confirmed that direct install
from the now-public GitHub repository works in a temporary project.
- Confirmed that npm publish is still blocked on this machine because npm auth
is missing.
- Implementation and refactor are ready for fresh verification.

## Git Context

- Run artifact: .sb-codex-tool/runs/2026-04-05-public-release-run.json
- Git available: yes
- Branch: main
- Dirty: yes
- Changed files:
  - sb-codex-tool/guides/2026-04-05-public-release-scope.md
  - sb-codex-tool/summaries/2026-04-05-public-release-execution-summary.md

## Expected Verification Checks

- Run `node --experimental-strip-types --test tests/distribution.test.ts`.
- Run `node --experimental-strip-types --test tests/install-smoke.test.ts`.
- Run `node --experimental-strip-types --test tests/*.test.ts`.
- Run `node --experimental-strip-types src/cli.ts doctor`.
- Confirm `npm install --save-dev git+https://github.com/SBCHOE-AI/sb-codex-tool.git`
followed by `npm exec sb-codex-tool -- setup` succeeds in a fresh temporary
project.
- Confirm the repository visibility is `PUBLIC`.
- Confirm the READMEs explain direct GitHub installation.
- If npm publish succeeds, confirm `npm view sb-codex-tool version
dist-tags.latest --json` resolves.
- If npm publish is blocked, require the blocker to be explicit in the cycle
summary and handoff.

## Open Risks

- npm publication remains blocked until this machine is authenticated with
npm.

## Next-Agent Guidance

- Start from this execution summary as the latest relevant summary.
- Then review `.sb-codex-tool/plans/2026-04-05-public-release-approved.md`.
- Then review `.sb-codex-tool/guides/2026-04-05-public-release-scope.md`.
- Then inspect `package.json`, `bin/sb-codex-tool.js`, `README.md`,
`README.ko.md`, `tests/distribution.test.ts`, and
`tests/install-smoke.test.ts`.
