# Scope Guide: Assignment Guides

## Purpose

- Narrow the current work cycle to a bounded file scope and clear verification expectations.

## Working Goal

- Add a bounded `assign` helper that writes subagent assignment guides from the
  current cycle and keeps active-subagent state visible.

## Primary Plan

- .sb-codex-tool/plans/2026-04-04-assignment-guides-approved.md

## Allowed File Scope

- src/lib/assignment.ts
- src/commands/assign.ts
- src/cli.ts
- src/lib/markdown-sections.ts
- src/lib/close-cycle.ts
- tests/assign.test.ts
- tests/close.test.ts
- docs/implementation/core-contract.md
- .sb-codex-tool/project.md
- .sb-codex-tool/summaries/2026-04-04-assignment-guides-execution-summary.md
- .sb-codex-tool/handoffs/2026-04-04-assignment-guides-to-verification.md
- .sb-codex-tool/guides/2026-04-04-assignment-guides-scope.md

## Recommended References

- AGENTS.md
- .sb-codex-tool/project.md
- .sb-codex-tool/state.md
- .sb-codex-tool/guides/code-consistency.md
- .sb-codex-tool/summaries/2026-04-04-git-context-capture-verification-summary.md

## Verification Expectations

- `node --experimental-strip-types --test tests/*.test.ts`
- `node --experimental-strip-types src/cli.ts help`
- `node --experimental-strip-types src/cli.ts doctor`
- `node --experimental-strip-types src/cli.ts status`
- `assign` must create a bounded guide that references the current plan,
  summary, guide, and code-consistency document.
- `assign` must update active subagents without duplicating the same entry on a
  rerun.
- `assign` must fail clearly when no current cycle exists.
