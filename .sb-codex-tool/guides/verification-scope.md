# Verification Scope

## Purpose

This guide narrows the first fresh-agent verification pass to the current
`sb-codex-tool` scaffold implementation.

## Read These Files First

1. docs/menu/implementation.md
2. docs/implementation/verification-contract.md
3. docs/implementation/acceptance-checklist.md
4. AGENTS.md
5. .sb-codex-tool/project.md
6. .sb-codex-tool/state.md
7. .sb-codex-tool/plans/2026-04-04-initial-scaffold-approved.md
8. .sb-codex-tool/summaries/2026-04-04-initial-scaffold-execution-summary.md
9. .sb-codex-tool/handoffs/2026-04-04-initial-scaffold-to-verification.md

## Primary Code Surface

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

## Expected Checks

- `node --experimental-strip-types --test tests/*.test.ts`
- `node --experimental-strip-types src/cli.ts help`
- `node --experimental-strip-types src/cli.ts doctor`
- `node --experimental-strip-types src/cli.ts status`

## Review Focus

- Scaffold completeness
- `AGENTS.md` rule coverage
- Hot-path clarity
- Fresh-agent verification readiness
- Ignore strategy
- Code readability and module boundaries

## Do Not Treat As Hot Path

- .sb-codex-tool/logs/work-journal/
- Older historical artifacts once they exist
- Research notes outside the implementation contracts unless needed
