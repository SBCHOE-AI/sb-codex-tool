# Scope Guide: Close Cycle Automation

## Purpose

- Narrow the current work cycle to a bounded file scope and clear verification expectations.

## Working Goal

- Add a reusable closure path so the main agent can finalize a verified work
  cycle without manually editing the review, verification summary, state files,
  and work journal.

## Primary Plan

- .sb-codex-tool/plans/2026-04-04-close-cycle-automation-approved.md

## Allowed File Scope

- src/cli.ts
- src/commands/close.ts
- src/lib/close-cycle.ts
- src/lib/work-journal.ts
- src/lib/current-state.ts
- tests/close.test.ts
- docs/implementation/core-contract.md
- docs/implementation/verification-contract.md
- .sb-codex-tool/project.md
- .sb-codex-tool/summaries/2026-04-04-close-cycle-automation-execution-summary.md
- .sb-codex-tool/handoffs/2026-04-04-close-cycle-automation-to-verification.md

## Recommended References

- AGENTS.md
- .sb-codex-tool/project.md
- .sb-codex-tool/state.md
- .sb-codex-tool/guides/code-consistency.md
- .sb-codex-tool/summaries/2026-04-04-work-cycle-automation-verification-summary.md

## Verification Expectations

- `node --experimental-strip-types --test tests/*.test.ts`
- `node --experimental-strip-types src/cli.ts help`
- `node --experimental-strip-types src/cli.ts doctor`
- `node --experimental-strip-types src/cli.ts status`
- `close` must read the current review verdict instead of accepting a new
  verdict from the implementation session.
- a review with verdict `pass` must lead to a verification summary, a
  work-journal entry, and a stage transition to `clarify`.
- a review with verdict `fail` must keep the current stage in `verify` and
  avoid writing a verified-completion journal entry.
- reviews with `pass_with_concerns` or `blocked` must contain explicit
  non-placeholder concern or missing-evidence details before `close` will
  proceed.
