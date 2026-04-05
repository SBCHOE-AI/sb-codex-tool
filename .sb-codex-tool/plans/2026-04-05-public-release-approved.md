# Approved Plan: Public Repo and npm Release

## Objective

- Make the repository public and enable real-world installation paths for other
  machines, covering direct GitHub installation immediately and npm
  installation when publish credentials are available.

## Acceptance Criteria

- The GitHub repository visibility is `PUBLIC`.
- The top-level documentation explains both npm installation and direct GitHub
  installation.
- Regression coverage protects the documented public install paths.
- If npm publish credentials are available, `sb-codex-tool@0.1.0` is published
  to npm and installable with `npm install` and `npx`.
- If npm publish credentials are not available, the remaining blocker is
  captured explicitly in the cycle artifacts.

## Boundaries

- In scope: GitHub visibility change, install documentation updates, install
  path regression coverage, the minimal packaged runtime build needed for
  installed execution, npm publish attempt, and explicit blocker capture if
  publish auth is missing.
- Out of scope: changing the package version or changing the CLI feature
  surface.

## Tasks

### Task 1

- files: `README.md`, `README.ko.md`, `package.json`,
  `bin/sb-codex-tool.js`, `tests/distribution.test.ts`,
  `tests/install-smoke.test.ts`
- action: update public-facing installation docs so users can install from npm
  and directly from the public GitHub repository, and fix the packaged runtime
  so installed copies run correctly from `node_modules`
- verify: inspect both README files and run distribution plus install-smoke
  regression tests
- done: yes

### Task 2

- files: GitHub repo `SBCHOE-AI/sb-codex-tool`
- action: change the repository visibility from private to public and verify
  the public repository URL
- verify: run `gh repo view SBCHOE-AI/sb-codex-tool --json visibility,url`
- done: yes

### Task 3

- files: npm package `sb-codex-tool`
- action: publish the package to npm if credentials are available, otherwise
  capture the explicit auth blocker in the execution summary and handoff
- verify: run `npm view sb-codex-tool version dist-tags.latest --json`
- done: no
