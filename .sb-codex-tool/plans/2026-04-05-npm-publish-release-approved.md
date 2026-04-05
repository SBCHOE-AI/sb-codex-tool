# Approved Plan: npm Publish Release

## Objective

- Ensure `sb-codex-tool@0.1.0` is actually available from npm, verify the
  package can be installed from the npm registry on a fresh machine, and
  capture any remaining publish or install blockers explicitly.

## Acceptance Criteria

- `package.json` reflects the publish-safe bin manifest expected by npm.
- `npm view sb-codex-tool version dist-tags.latest --json` resolves from the
  public npm registry and reports `0.1.0` as the latest version.
- A fresh temporary project can run `npm install --save-dev sb-codex-tool`
  followed by `npx sb-codex-tool@latest setup`.
- If `npm publish --access public` is run against the same version, the cycle
  can explicitly record that the version already exists instead of treating the
  re-publish rejection as a blocker.
- If any real availability step still fails, the exact blocker is recorded in
  the execution summary, handoff, and fresh verification review.

## Boundaries

- In scope: publish-safe manifest fixes, npm publication, npm registry install
  validation, and explicit blocker capture.
- Out of scope: feature changes unrelated to distribution, version bumps beyond
  `0.1.0`, and broader documentation rewrites unless the publish/install flow
  requires a small correction.

## Tasks

### Task 1

- files: `package.json`,
  `.sb-codex-tool/plans/2026-04-05-npm-publish-release-approved.md`,
  `.sb-codex-tool/guides/2026-04-05-npm-publish-release-scope.md`,
  `.sb-codex-tool/summaries/2026-04-05-npm-publish-release-execution-summary.md`,
  `.sb-codex-tool/handoffs/2026-04-05-npm-publish-release-to-verification.md`,
  `.sb-codex-tool/reviews/2026-04-05-npm-publish-release-fresh-verification.md`
- action: normalize the publish manifest if needed, confirm the package is
  publicly available on npm, and verify npm-registry installation in a fresh
  temporary project
- verify: run `npm publish --access public`, `npm view sb-codex-tool version dist-tags.latest --json`,
  `npm install --save-dev sb-codex-tool`, and `npx sb-codex-tool@latest setup`
- done: yes
