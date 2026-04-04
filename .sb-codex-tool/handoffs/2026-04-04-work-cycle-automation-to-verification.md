# Handoff: Work Cycle Automation

## Goal

- Enable the next fresh agent to verify the new work-cycle automation flow
  without hidden context.

## Read In This Order

1. AGENTS.md
2. .sb-codex-tool/project.md
3. .sb-codex-tool/state.md
4. .sb-codex-tool/guides/read-this-first.md
5. .sb-codex-tool/guides/code-consistency.md
6. .sb-codex-tool/summaries/2026-04-04-work-cycle-automation-execution-summary.md
7. .sb-codex-tool/plans/2026-04-04-work-cycle-automation-approved.md
8. .sb-codex-tool/guides/2026-04-04-work-cycle-automation-scope.md
9. src/lib/current-state.ts
10. src/lib/work-cycle.ts
11. src/commands/begin.ts
12. src/lib/doctor.ts
13. src/lib/status.ts
14. tests/begin.test.ts

## Current Status

- The `begin` command is implemented.
- Work-cycle artifact generation and current-state updates are in place.
- Self-checks have passed.
- Fresh-agent verification is still pending.

## Expected Verification Checks

- `node --experimental-strip-types --test tests/*.test.ts`
- `node --experimental-strip-types src/cli.ts help`
- `node --experimental-strip-types src/cli.ts begin work-cycle-automation "Work Cycle Automation"`
- `node --experimental-strip-types src/cli.ts doctor`
- `node --experimental-strip-types src/cli.ts status`

## Open Risks

- A fresh verification agent still needs to judge whether the generated
  work-cycle templates are strong enough for practical reuse.
- `src/lib/templates.ts` remains acceptable but is still the first likely split
  point if more scaffold assets accumulate.
