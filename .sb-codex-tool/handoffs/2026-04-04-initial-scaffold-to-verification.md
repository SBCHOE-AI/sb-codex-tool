# Handoff: Initial Scaffold to Fresh Verification

## Goal

Enable a fresh verification agent to judge whether the initial scaffold matches
the implementation contracts.

## Read In This Order

1. docs/menu/implementation.md
2. docs/implementation/verification-contract.md
3. docs/implementation/acceptance-checklist.md
4. AGENTS.md
5. .sb-codex-tool/project.md
6. .sb-codex-tool/state.md
7. .sb-codex-tool/guides/read-this-first.md
8. .sb-codex-tool/guides/code-consistency.md
9. .sb-codex-tool/guides/verification-scope.md
10. .sb-codex-tool/plans/2026-04-04-initial-scaffold-approved.md
11. .sb-codex-tool/summaries/2026-04-04-initial-scaffold-execution-summary.md

## Primary Files To Inspect

- package.json
- bin/sb-codex-tool.js
- src/cli.ts
- src/commands/setup.ts
- src/commands/doctor.ts
- src/commands/status.ts
- src/commands/launch.ts
- src/lib/codex.ts
- src/lib/scaffold.ts
- src/lib/templates.ts
- src/lib/doctor.ts
- src/lib/status.ts
- src/lib/git.ts
- tests/setup.test.ts
- tests/doctor.test.ts

## Expected Verification Checks

- `node --experimental-strip-types --test tests/*.test.ts`
- `node --experimental-strip-types src/cli.ts help`
- `node --experimental-strip-types src/cli.ts doctor`
- `node --experimental-strip-types src/cli.ts status`

## What Still Needs Judgment

- Whether the scaffold is strong enough for fresh-agent verification in
  practice
- Whether `AGENTS.md` and the guide files are specific enough
- Whether `src/lib/templates.ts` is still within acceptable complexity
- Whether the current `status` and `doctor` outputs are strong enough to support
  future work

## Closure Constraint

- Do not mark this work fully closed until a fresh verification agent records a
  final verdict.
- Do not write the first human work-journal entry until that verdict exists.
