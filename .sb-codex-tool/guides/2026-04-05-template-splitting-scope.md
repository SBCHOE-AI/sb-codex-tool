# Scope Guide: Template Splitting

## Purpose

- Narrow the current work cycle to a bounded file scope and clear verification expectations.

## Working Goal

- Split scaffold template generation into smaller modules while keeping the
  `templates.ts` public surface stable for existing callers.

## Primary Plan

- .sb-codex-tool/plans/2026-04-05-template-splitting-approved.md

## Allowed File Scope

- src/lib/templates.ts
- src/lib/templates/context.ts
- src/lib/templates/types.ts
- src/lib/templates/shared.ts
- src/lib/templates/repo-documents.ts
- src/lib/templates/state-documents.ts
- src/lib/templates/documents.ts
- src/lib/templates/workflows.ts
- src/lib/templates/ignore.ts
- src/lib/templates/generated-files.ts
- .sb-codex-tool/project.md
- .sb-codex-tool/guides/code-consistency.md
- .sb-codex-tool/plans/2026-04-05-template-splitting-approved.md
- .sb-codex-tool/summaries/2026-04-05-template-splitting-execution-summary.md
- .sb-codex-tool/handoffs/2026-04-05-template-splitting-to-verification.md

## Recommended References

- AGENTS.md
- .sb-codex-tool/project.md
- .sb-codex-tool/state.md
- .sb-codex-tool/guides/code-consistency.md
- .sb-codex-tool/summaries/2026-04-05-launch-wrapper-hardening-verification-summary.md

## Verification Expectations

- Run `node --experimental-strip-types --test tests/*.test.ts`.
- Run `node --experimental-strip-types src/cli.ts doctor`.
- Run `node --experimental-strip-types src/cli.ts status`.
- Fresh verification should confirm that `src/lib/templates.ts` is now a thin
  facade and that scaffold template content moved into smaller concern-focused
  modules without changing scaffold behavior.
