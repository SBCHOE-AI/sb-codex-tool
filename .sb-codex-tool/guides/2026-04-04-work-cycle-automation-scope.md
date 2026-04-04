# Scope Guide: Work Cycle Automation

## Purpose

- Narrow the current work cycle to a bounded file scope and clear verification expectations.

## Working Goal

- Add automation for opening the next work cycle so the main agent can create
  the required plan, execution summary, handoff, review, and scope artifacts in
  one step and keep current state synchronized.

## Primary Plan

- .sb-codex-tool/plans/2026-04-04-work-cycle-automation-approved.md

## Allowed File Scope

- src/lib/current-state.ts
- src/lib/work-cycle.ts
- src/commands/begin.ts
- src/cli.ts
- src/lib/templates.ts
- src/lib/doctor.ts
- src/lib/status.ts
- src/commands/status.ts
- tests/begin.test.ts

## Recommended References

- AGENTS.md
- .sb-codex-tool/project.md
- .sb-codex-tool/state.md
- .sb-codex-tool/guides/code-consistency.md
- .sb-codex-tool/summaries/2026-04-04-initial-scaffold-verification-summary.md
- docs/implementation/state-contract.md
- docs/implementation/agent-operations-contract.md

## Verification Expectations

- `begin` creates the expected artifact files.
- `begin` updates `current.json` and `state.md`.
- `doctor` validates current-state references without failures.
- `status` shows the current guide, handoff, and review fields.
- Fresh verification should decide whether the generated templates are strong
  enough for real reuse without hidden context.
