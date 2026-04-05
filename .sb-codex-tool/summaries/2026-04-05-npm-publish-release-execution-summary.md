# Execution Summary: npm Publish Release

## Purpose

- Capture implementation progress for the current work cycle before fresh verification.

## Scope

- Normalize the publish-safe bin manifest, confirm npm-registry availability for
  `sb-codex-tool@0.1.0`, and validate `npm install` plus
  `npx sb-codex-tool@latest setup` from a fresh temporary project.

## Implemented Surface

- Normalized `package.json` so the published bin entry uses
  `bin/sb-codex-tool.js`, matching npm's publish expectations.
- Confirmed `sb-codex-tool@0.1.0` is already visible on the public npm
  registry.
- Confirmed a fresh temporary project can install from npm and run
  `npx sb-codex-tool@latest setup`.
- Confirmed the earlier publish rejection is no longer an auth problem; it now
  fails only because `0.1.0` is already published.

## Checks Run

- `npm whoami`
- `npm publish --access public`
- `npm view sb-codex-tool version dist-tags.latest --json`
- `rm -rf /tmp/sb-codex-tool-npm-install && mkdir -p /tmp/sb-codex-tool-npm-install && cd /tmp/sb-codex-tool-npm-install && npm init -y >/dev/null 2>&1 && npm install --save-dev sb-codex-tool && npx sb-codex-tool@latest setup`
- `node --experimental-strip-types --test tests/*.test.ts`
- `node --experimental-strip-types src/cli.ts doctor`

## Plan vs Actual

- Planned: publish or otherwise confirm public npm availability for `0.1.0`.
- Actual: `npm publish --access public` reported that `0.1.0` cannot be
  published again because it is already published, and `npm view` confirmed the
  version is live on the public registry.
- Planned: validate first-time npm installation.
- Actual: a fresh temporary project successfully ran
  `npm install --save-dev sb-codex-tool` and `npx sb-codex-tool@latest setup`.
- Planned: keep the manifest acceptable to npm publish.
- Actual: `package.json` now uses the bin path format npm expects.

## Refactor Notes

- Kept the change minimal by normalizing the manifest instead of introducing a
  broader packaging change.

## Deferred Issues

- `tests/distribution.test.ts` still expects the older `./bin/...` manifest
  string and must be updated to the normalized bin path before final
  verification.

## Next-Agent Guidance

- Start from this execution summary as the latest relevant summary.
- Then review `.sb-codex-tool/plans/2026-04-05-npm-publish-release-approved.md`.
- Then review `.sb-codex-tool/guides/2026-04-05-npm-publish-release-scope.md`.
- Then inspect `package.json` and `tests/distribution.test.ts`.
