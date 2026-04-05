# Execution Summary: Public Repo and npm Release

## Purpose

- Capture implementation progress for the current work cycle before fresh verification.

## Scope

- Make the repository public, document the public install paths, fix the
  packaged runtime so installed copies can execute from `node_modules`, and
  attempt npm publication with explicit blocker capture if auth is missing.

## Implemented Surface

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
- Confirmed that direct install from the now-public GitHub repository works in
  a temporary project.
- Confirmed that npm publish is still blocked on this machine because npm auth
  is missing.

## Checks Run

- `npm whoami`
- `gh repo view SBCHOE-AI/sb-codex-tool --json nameWithOwner,visibility,url`
- `node --experimental-strip-types --test tests/install-smoke.test.ts`
- `node --experimental-strip-types --test tests/distribution.test.ts`
- `node --experimental-strip-types --test tests/*.test.ts`
- `node --experimental-strip-types src/cli.ts doctor`
- `npm pack --dry-run`
- `npm install --save-dev git+https://github.com/SBCHOE-AI/sb-codex-tool.git`
- `cd /tmp/sb-codex-tool-git-install && npx sb-codex-tool setup`

## Plan vs Actual

- Planned: make direct GitHub installation possible from another machine.
- Actual: the repo is now public and a temporary project successfully installed
  from `git+https://github.com/SBCHOE-AI/sb-codex-tool.git`.
- Planned: make packaged installs runnable.
- Actual: the package now builds `dist/cli.js`, the bin wrapper targets that
  file, and the install smoke test verifies `npx sb-codex-tool setup` from an
  installed package.
- Planned: make npm installation possible.
- Actual: the package is publish-ready, but `npm whoami` returns `ENEEDAUTH`,
  so real npm publication is blocked on missing npm credentials for this
  machine.

## Refactor Notes

- Kept the release fix small by bundling a single runtime entrypoint instead of
  introducing a larger TypeScript build graph.

## Deferred Issues

- npm publication remains blocked until this machine is authenticated with
  npm.

## Next-Agent Guidance

- Start from this execution summary as the latest relevant summary.
- Then review `.sb-codex-tool/plans/2026-04-05-public-release-approved.md`.
- Then review `.sb-codex-tool/guides/2026-04-05-public-release-scope.md`.
- Then inspect `package.json`, `bin/sb-codex-tool.js`, `README.md`,
  `README.ko.md`, `tests/distribution.test.ts`, and
  `tests/install-smoke.test.ts`.
