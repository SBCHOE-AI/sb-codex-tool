# Handoff: Git Context Capture

## Goal

- Enable the next fresh agent to continue this work cycle without hidden context.

## Read In This Order

1. AGENTS.md
2. .sb-codex-tool/project.md
3. .sb-codex-tool/state.md
4. .sb-codex-tool/guides/read-this-first.md
5. .sb-codex-tool/guides/code-consistency.md
6. .sb-codex-tool/summaries/2026-04-04-git-context-capture-execution-summary.md
7. .sb-codex-tool/plans/2026-04-04-git-context-capture-approved.md
8. .sb-codex-tool/guides/2026-04-04-git-context-capture-scope.md
9. .sb-codex-tool/runs/2026-04-04-git-context-capture-run.json
10. src/lib/run-records.ts
11. src/lib/work-cycle.ts
12. src/lib/close-cycle.ts
13. src/lib/current-state.ts
14. src/lib/doctor.ts
15. src/lib/status.ts
16. tests/begin.test.ts
17. tests/close.test.ts

## Current Status

- Planning is complete.
- Implementation is complete.
- Self-checks have passed.
- Fresh-agent verification is still pending.

## Git Context

- Run artifact: .sb-codex-tool/runs/2026-04-04-git-context-capture-run.json
- Git available: no
- Branch: unavailable
- Dirty: unavailable
- Changed files: unavailable outside a Git repository

## Expected Verification Checks

- `node --experimental-strip-types --test tests/*.test.ts`
- `node --experimental-strip-types src/cli.ts help`
- `node --experimental-strip-types src/cli.ts begin git-context-capture "Git Context Capture"`
- `node --experimental-strip-types src/cli.ts doctor`
- `node --experimental-strip-types src/cli.ts status`
- inspect the begin/close lifecycle run artifacts created for the current cycle
- confirm that the handoff and verification summary expose git context when
  available
- confirm that non-Git repositories degrade cleanly without throwing
- confirm that `latestRun` is visible in current-state artifacts and CLI status

## Open Risks

- The main workspace is not a Git repository, so Git-available coverage must
  come from temporary test repositories.
- run-record capture should stay reusable and not bloat `work-cycle.ts` or
  `close-cycle.ts`.
- git context must remain non-destructive and read-only.
