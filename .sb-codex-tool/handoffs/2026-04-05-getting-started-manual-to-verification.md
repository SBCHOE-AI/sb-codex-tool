# Handoff: Getting Started Manual

## Goal

- Enable the next fresh agent to continue this work cycle without hidden context.

## Read In This Order

1. AGENTS.md
2. .sb-codex-tool/project.md
3. .sb-codex-tool/state.md
4. .sb-codex-tool/guides/read-this-first.md
5. .sb-codex-tool/guides/code-consistency.md
6. .sb-codex-tool/summaries/2026-04-05-getting-started-manual-execution-summary.md
7. .sb-codex-tool/plans/2026-04-05-getting-started-manual-approved.md
8. .sb-codex-tool/guides/2026-04-05-getting-started-manual-scope.md

## Current Status

- Add a beginner-friendly getting-started document set for first-time Codex
users, link it from the top-level READMEs, and add regression coverage for
discoverability and key sections.
- Added `docs/menu/getting-started.md` as the top-level menu document for
beginner onboarding.
- Added `docs/guides/getting-started-ko.md` as a detailed Korean usage manual
with prerequisites, ordered command flow, end-to-end examples, fresh
verification explanation, subagent notes, and common mistakes.
- Updated `README.md` and `README.ko.md` so both top-level entry points link to
the beginner getting-started menu.
- Added `tests/getting-started-docs.test.ts` so README discoverability and the
core beginner-guide sections stay covered.
- Implementation and refactor are ready for fresh verification.

## Git Context

- Run artifact: .sb-codex-tool/runs/2026-04-05-getting-started-manual-run.json
- Git available: yes
- Branch: main
- Dirty: yes
- Changed files:
  - sb-codex-tool/guides/read-this-first.md
  - sb-codex-tool/index/current.json
  - sb-codex-tool/state.md
  - EADME.ko.md
  - EADME.md
  - .sb-codex-tool/guides/2026-04-05-getting-started-manual-scope.md
  - .sb-codex-tool/handoffs/2026-04-05-getting-started-manual-to-verification.md
  - .sb-codex-tool/plans/2026-04-05-getting-started-manual-approved.md
  - .sb-codex-tool/reviews/2026-04-05-getting-started-manual-fresh-verification.md
  - .sb-codex-tool/runs/2026-04-05-getting-started-manual-run.json
  - .sb-codex-tool/summaries/2026-04-05-getting-started-manual-execution-summary.md
  - docs/guides/
  - docs/menu/getting-started.md
  - tests/getting-started-docs.test.ts

## Expected Verification Checks

- Run `node --experimental-strip-types --test tests/getting-started-docs.test.ts`.
- Run `node --experimental-strip-types --test tests/*.test.ts`.
- Run `node --experimental-strip-types src/cli.ts doctor`.
- Confirm that `README.md` and `README.ko.md` both link to the getting-started
menu document.
- Confirm that the detailed manual includes prerequisites, step order,
examples, verification, and common mistakes.
- Require a fresh-agent verification verdict before closure.

## Open Risks

- None.

## Next-Agent Guidance

- Start from this execution summary as the latest relevant summary.
- Then review `.sb-codex-tool/plans/2026-04-05-getting-started-manual-approved.md`.
- Then review `.sb-codex-tool/guides/2026-04-05-getting-started-manual-scope.md`.
- Then inspect `README.md`, `README.ko.md`, `docs/menu/getting-started.md`,
`docs/guides/getting-started-ko.md`, and `tests/getting-started-docs.test.ts`.
