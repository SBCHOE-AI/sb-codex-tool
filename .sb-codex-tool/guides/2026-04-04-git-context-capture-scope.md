# Scope Guide: Git Context Capture

## Purpose

- Narrow the current work cycle to a bounded file scope and clear verification expectations.

## Working Goal

- Add lifecycle-level git-context capture so fresh verification can see the
  real branch/dirty/changed-file scope of `begin` and `close` runs when Git is
  available.

## Primary Plan

- .sb-codex-tool/plans/2026-04-04-git-context-capture-approved.md

## Allowed File Scope

- src/lib/git.ts
- src/lib/run-records.ts
- src/lib/work-cycle.ts
- src/lib/close-cycle.ts
- src/lib/current-state.ts
- src/lib/status.ts
- src/lib/doctor.ts
- src/commands/begin.ts
- src/commands/close.ts
- src/commands/status.ts
- tests/begin.test.ts
- tests/close.test.ts
- .sb-codex-tool/project.md
- .sb-codex-tool/summaries/2026-04-04-git-context-capture-execution-summary.md
- .sb-codex-tool/handoffs/2026-04-04-git-context-capture-to-verification.md
- .sb-codex-tool/guides/2026-04-04-git-context-capture-scope.md

## Recommended References

- AGENTS.md
- .sb-codex-tool/project.md
- .sb-codex-tool/state.md
- .sb-codex-tool/guides/code-consistency.md
- .sb-codex-tool/summaries/2026-04-04-close-cycle-automation-verification-summary.md

## Verification Expectations

- `node --experimental-strip-types --test tests/*.test.ts`
- `node --experimental-strip-types src/cli.ts help`
- `node --experimental-strip-types src/cli.ts doctor`
- `node --experimental-strip-types src/cli.ts status`
- `begin` must create a lifecycle run artifact with git context when a Git
  repository is available.
- `close` must create a lifecycle run artifact and include matching git context
  in the generated verification summary.
- `status` and `read-this-first` must point at the latest lifecycle run when
  one exists.
- the handoff for the current cycle must expose readable git context for fresh
  verification.
- non-Git repositories must continue to work without failure and must mark git
  context as unavailable instead of guessing.
