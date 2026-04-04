# Scope Guide: Multiline Section Parsing

## Purpose

- Narrow the current work cycle to a bounded file scope and clear verification expectations.

## Working Goal

- Preserve wrapped multiline bullets from execution summaries so close-flow
  artifacts and the human work journal keep their full meaning.

## Primary Plan

- .sb-codex-tool/plans/2026-04-05-multiline-section-parsing-approved.md

## Allowed File Scope

- src/lib/markdown-sections.ts
- src/lib/work-journal.ts
- tests/markdown-sections.test.ts
- tests/close.test.ts
- docs/implementation/core-contract.md
- docs/implementation/verification-contract.md
- docs/implementation/acceptance-checklist.md
- .sb-codex-tool/project.md
- .sb-codex-tool/guides/code-consistency.md
- .sb-codex-tool/plans/2026-04-05-multiline-section-parsing-approved.md
- .sb-codex-tool/summaries/2026-04-05-multiline-section-parsing-execution-summary.md
- .sb-codex-tool/handoffs/2026-04-05-multiline-section-parsing-to-verification.md

## Recommended References

- AGENTS.md
- .sb-codex-tool/project.md
- .sb-codex-tool/state.md
- .sb-codex-tool/guides/code-consistency.md
- .sb-codex-tool/summaries/2026-04-05-status-run-visibility-verification-summary.md

## Verification Expectations

- Run `node --experimental-strip-types --test tests/markdown-sections.test.ts tests/close.test.ts`.
- Run `node --experimental-strip-types --test tests/*.test.ts`.
- Run `node --experimental-strip-types src/cli.ts help`.
- Run `node --experimental-strip-types src/cli.ts doctor`.
- Run `node --experimental-strip-types src/cli.ts status`.
- Fresh verification should confirm that work-journal entries no longer lose
  wrapped bullet detail.
