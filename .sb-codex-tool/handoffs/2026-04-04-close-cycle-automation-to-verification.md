# Handoff: Close Cycle Automation

## Goal

- Enable the next fresh agent to continue this work cycle without hidden context.

## Read In This Order

1. AGENTS.md
2. .sb-codex-tool/project.md
3. .sb-codex-tool/state.md
4. .sb-codex-tool/guides/read-this-first.md
5. .sb-codex-tool/guides/code-consistency.md
6. .sb-codex-tool/summaries/2026-04-04-close-cycle-automation-execution-summary.md
7. .sb-codex-tool/plans/2026-04-04-close-cycle-automation-approved.md
8. .sb-codex-tool/guides/2026-04-04-close-cycle-automation-scope.md
9. src/lib/close-cycle.ts
10. src/lib/work-journal.ts
11. src/commands/close.ts
12. src/cli.ts
13. tests/close.test.ts
14. docs/implementation/core-contract.md
15. docs/implementation/verification-contract.md

## Current Status

- Planning is complete.
- Implementation is complete.
- Self-checks have passed.
- Fresh-agent verification is still pending.

## Expected Verification Checks

- `node --experimental-strip-types --test tests/*.test.ts`
- `node --experimental-strip-types src/cli.ts help`
- `node --experimental-strip-types src/cli.ts doctor`
- `node --experimental-strip-types src/cli.ts status`
- Inspect the `close` path through code and tests; do not run it against the
  live repository while the review verdict is still pending.
- `close` must read the verdict from the current review artifact
- `close` must reject closing verdicts when the execution summary no longer
  contains explicit `Next-Agent Guidance`
- a `pass` review closes the cycle and writes a journal entry
- a `fail` review keeps the cycle in `verify`

## Open Risks

- The closure flow must not weaken the fresh-agent verification rule.
- The work-journal append path must stay separate from the hot path.
- The command surface expansion must be documented so verification does not
  treat it as accidental scope creep.
- The close flow must not overwrite the current cycle into `clarify` for
  failing verification verdicts.
- The close flow must reject placeholder review sections when the verdict
  requires explicit concerns or missing evidence.
