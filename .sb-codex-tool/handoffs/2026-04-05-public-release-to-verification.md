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

- Switched the GitHub repository visibility to `PUBLIC`.
- Updated `README.md` and `README.ko.md` to document npm install after publish
  and direct install from the public GitHub repository.
- Added `publishConfig.access = public` to `package.json`.
- Changed the packaged runtime to execute `dist/cli.js` so installed copies
  can run from `node_modules`.
- Added `tests/install-smoke.test.ts` and verified that a packed install can
  run `npx sb-codex-tool setup`.
- Verified direct install from the public GitHub repository in a temporary
  project.
- npm publish is still blocked on this machine because `npm whoami` reports
  `ENEEDAUTH`.

## Git Context

- Run artifact: .sb-codex-tool/runs/2026-04-05-public-release-run.json
- Git available: yes
- Branch: main
- Dirty: yes
- Changed files:
  - .sb-codex-tool/guides/2026-04-05-public-release-scope.md
  - .sb-codex-tool/plans/2026-04-05-public-release-approved.md
  - .sb-codex-tool/reviews/2026-04-05-public-release-fresh-verification.md
  - .sb-codex-tool/summaries/2026-04-05-public-release-execution-summary.md


## Expected Verification Checks

- Run `node --experimental-strip-types --test tests/install-smoke.test.ts`.
- Run `node --experimental-strip-types --test tests/distribution.test.ts`.
- Run `node --experimental-strip-types --test tests/*.test.ts`.
- Run `node --experimental-strip-types src/cli.ts doctor`.
- Confirm the repository visibility is `PUBLIC`.
- Confirm the public GitHub install path is documented and already verified.
- Confirm the packaged runtime points at `dist/cli.js` rather than `src/cli.ts`.
- Confirm the npm publish blocker is explicit and limited to missing npm auth.

## Open Risks

- npm publish cannot proceed until this machine is authenticated with npm.
