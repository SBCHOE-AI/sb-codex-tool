# Handoff: Template Splitting

## Goal

- Enable the next fresh agent to continue this work cycle without hidden context.

## Read In This Order

1. AGENTS.md
2. .sb-codex-tool/project.md
3. .sb-codex-tool/state.md
4. .sb-codex-tool/guides/read-this-first.md
5. .sb-codex-tool/guides/code-consistency.md
6. .sb-codex-tool/summaries/2026-04-05-template-splitting-execution-summary.md
7. .sb-codex-tool/plans/2026-04-05-template-splitting-approved.md
8. .sb-codex-tool/guides/2026-04-05-template-splitting-scope.md

## Current Status

- Split scaffold template generation into smaller modules while keeping the
public template API and scaffolded outputs stable.
- Replaced the old monolithic `src/lib/templates.ts` implementation with a thin
facade that re-exports the public template helpers.
- Added `src/lib/templates/context.ts` and `src/lib/templates/types.ts` for the
shared template context and generated-file types.
- Added `src/lib/templates/shared.ts` for reusable list, README, and workflow
helper strings.
- Split scaffold document generation into `repo-documents.ts`,
`state-documents.ts`, and `documents.ts` so repo-facing and state-facing
template content no longer lives in one large file.
- Kept workflow and ignore generation in dedicated modules:
`workflows.ts`, `ignore.ts`, and `generated-files.ts`.
- Updated project and consistency guidance so new agents can find the new
template module layout quickly.
- Implementation and refactor are ready for fresh verification.

## Git Context

- Run artifact: .sb-codex-tool/runs/2026-04-05-template-splitting-run.json
- Git available: no
- Branch: unavailable
- Dirty: unavailable
- Changed files: unavailable outside a Git repository

## Expected Verification Checks

- Run `node --experimental-strip-types --test tests/*.test.ts`.
- Run `node --experimental-strip-types src/cli.ts doctor`.
- Run `node --experimental-strip-types src/cli.ts status`.
- Fresh verification should confirm that `src/lib/templates.ts` is now a thin
facade and that scaffold template content moved into smaller concern-focused
modules without changing scaffold behavior.

## Open Risks

- None.

## Next-Agent Guidance

- Start from this execution summary as the latest relevant summary.
- Then review `.sb-codex-tool/plans/2026-04-05-template-splitting-approved.md`.
- Then review `.sb-codex-tool/guides/2026-04-05-template-splitting-scope.md`.
- Then inspect `src/lib/templates.ts` and the files under `src/lib/templates/`.
