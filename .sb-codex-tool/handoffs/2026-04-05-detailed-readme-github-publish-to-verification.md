# Handoff: Detailed README and GitHub Publish

## Goal

- Enable the next fresh agent to continue this work cycle without hidden context.

## Read In This Order

1. AGENTS.md
2. .sb-codex-tool/project.md
3. .sb-codex-tool/state.md
4. .sb-codex-tool/guides/read-this-first.md
5. .sb-codex-tool/guides/code-consistency.md
6. .sb-codex-tool/summaries/2026-04-05-detailed-readme-github-publish-execution-summary.md
7. .sb-codex-tool/plans/2026-04-05-detailed-readme-github-publish-approved.md
8. .sb-codex-tool/guides/2026-04-05-detailed-readme-github-publish-scope.md

## Current Status

- Expand the README into a detailed user-facing guide, add GitHub repository
metadata to the package, and prepare the project for upload to a new GitHub
repository.
- Expanded `README.md` into a detailed document that covers motivation,
principles, installation, quick start, state layout, agent roles,
verification, work-journal behavior, git context, packaging checks, and
development notes.
- Added repository metadata to `package.json` for the intended GitHub
repository at `SBCHOE-AI/sb-codex-tool`.
- Extended `tests/distribution.test.ts` so distribution checks also cover the
richer README and GitHub repository metadata.
- Verified that `npm pack --dry-run` still excludes internal state, tests, and
research docs from the package tarball.
- Initialized the local Git repository, created the private GitHub repository
at `https://github.com/SBCHOE-AI/sb-codex-tool`, and pushed `main` to
`origin`.
- Implementation and refactor are ready for fresh verification.

## Git Context

- Run artifact: .sb-codex-tool/runs/2026-04-05-detailed-readme-github-publish-run.json
- Git available: yes
- Branch: main
- Dirty: yes
- Changed files:
  - sb-codex-tool/handoffs/2026-04-05-detailed-readme-github-publish-to-verification.md
  - sb-codex-tool/plans/2026-04-05-detailed-readme-github-publish-approved.md
  - sb-codex-tool/summaries/2026-04-05-detailed-readme-github-publish-execution-summary.md

## Expected Verification Checks

- Run `node --experimental-strip-types --test tests/distribution.test.ts`.
- Run `node --experimental-strip-types --test tests/*.test.ts`.
- Run `npm pack --dry-run`.
- Run `node --experimental-strip-types src/cli.ts doctor`.
- Confirm that the repository exists at `SBCHOE-AI/sb-codex-tool` and that the
local `origin` remote points to it.

## Open Risks

- None.

## Next-Agent Guidance

- Start from this execution summary as the latest relevant summary.
- Then review `.sb-codex-tool/plans/2026-04-05-detailed-readme-github-publish-approved.md`.
- Then review `.sb-codex-tool/guides/2026-04-05-detailed-readme-github-publish-scope.md`.
- Then inspect `README.md`, `package.json`, `tests/distribution.test.ts`, and
confirm the GitHub remote metadata from the local repository.
