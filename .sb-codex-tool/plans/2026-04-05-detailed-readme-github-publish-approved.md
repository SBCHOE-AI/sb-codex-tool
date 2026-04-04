# Approved Plan: Detailed README and GitHub Publish

## Objective

- Expand the README into a detailed distribution-facing document and publish
  the repository to a newly created GitHub repository.

## Acceptance Criteria

- `README.md` explains installation, commands, workflow, state layout, agent
  model, verification model, and packaging checks in detail.
- `package.json` includes GitHub repository metadata for the new repository.
- Distribution tests still pass and `npm pack --dry-run` remains focused on
  the intended runtime surface.
- The local project is uploaded to a newly created GitHub repository under the
  authenticated account.

## Boundaries

- In scope: README expansion, package repository metadata, distribution tests,
  git repository initialization, GitHub repository creation, and push.
- Out of scope: publishing to npm, adding a compiled build step, or changing
  the core workflow surface.

## Tasks

### Task 1

- files: `README.md`, `package.json`, `tests/distribution.test.ts`
- action: expand the README into a detailed user-facing guide and add GitHub
  repository metadata plus regression coverage for the new distribution-facing
  package surface
- verify: run `node --experimental-strip-types --test tests/distribution.test.ts`
  and `npm pack --dry-run`
- done: yes

### Task 2

- files: `.git/`, GitHub remote `SBCHOE-AI/sb-codex-tool`
- action: initialize the local git repository, create the GitHub repository,
  commit the current project state, and push `main`
- verify: run `gh repo view SBCHOE-AI/sb-codex-tool --json nameWithOwner,visibility,description`
  and confirm `origin` points to the new repository
- done: yes
