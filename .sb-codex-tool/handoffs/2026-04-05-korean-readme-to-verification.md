# Handoff: Korean README

## Goal

- Enable the next fresh agent to continue this work cycle without hidden context.

## Read In This Order

1. AGENTS.md
2. .sb-codex-tool/project.md
3. .sb-codex-tool/state.md
4. .sb-codex-tool/guides/read-this-first.md
5. .sb-codex-tool/guides/code-consistency.md
6. .sb-codex-tool/summaries/2026-04-05-korean-readme-execution-summary.md
7. .sb-codex-tool/plans/2026-04-05-korean-readme-approved.md
8. .sb-codex-tool/guides/2026-04-05-korean-readme-scope.md

## Current Status

- Add a detailed Korean README as a separate repository document, link it from
the English README, and add regression coverage for bilingual README
discoverability.
- Added `README.ko.md` as a detailed Korean translation/adaptation of the
public repository README.
- Added a top-level Korean README link to `README.md` that points GitHub
readers to the Korean document without changing the package tarball surface.
- Added `tests/readme-l10n.test.ts` to ensure the English README links to the
Korean README and that the Korean README keeps the main documentation
sections discoverable.
- Updated packaging notes and regression expectations so npm auto-inclusion of
`README.ko.md` is treated as expected repository documentation behavior.
- Implementation and refactor are ready for fresh verification.

## Git Context

- Run artifact: .sb-codex-tool/runs/2026-04-05-korean-readme-run.json
- Git available: yes
- Branch: main
- Dirty: yes
- Changed files:
  - sb-codex-tool/guides/read-this-first.md
  - sb-codex-tool/index/current.json
  - sb-codex-tool/state.md
  - EADME.md
  - .sb-codex-tool/guides/2026-04-05-korean-readme-scope.md
  - .sb-codex-tool/handoffs/2026-04-05-korean-readme-to-verification.md
  - .sb-codex-tool/plans/2026-04-05-korean-readme-approved.md
  - .sb-codex-tool/reviews/2026-04-05-korean-readme-fresh-verification.md
  - .sb-codex-tool/runs/2026-04-05-korean-readme-run.json
  - .sb-codex-tool/summaries/2026-04-05-korean-readme-execution-summary.md
  - README.ko.md
  - tests/readme-l10n.test.ts

## Expected Verification Checks

- Run `node --experimental-strip-types --test tests/readme-l10n.test.ts`.
- Run `node --experimental-strip-types --test tests/*.test.ts`.
- Run `node --experimental-strip-types src/cli.ts doctor`.
- Run `npm pack --dry-run`.
- Confirm `README.md` links Korean readers to `README.ko.md`.
- Confirm `README.ko.md` is detailed, readable, and cross-links back to the
English README.
- Require a fresh-agent verification verdict before closure.

## Open Risks

- None.

## Next-Agent Guidance

- Start from this execution summary as the latest relevant summary.
- Then review `.sb-codex-tool/plans/2026-04-05-korean-readme-approved.md`.
- Then review `.sb-codex-tool/guides/2026-04-05-korean-readme-scope.md`.
- Then inspect `README.md`, `README.ko.md`, and `tests/readme-l10n.test.ts`.
