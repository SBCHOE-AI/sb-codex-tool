# $execute

## Purpose

Advance work task by task while keeping scope, blockers, and status explicit.

## Required Outputs

- task progression
- status updates
- blocker notes
- changed-file scope

## Completion Rule

- This stage is complete only when its required outputs are written clearly
  enough for a fresh agent to inspect.

## Failure Conditions

- Required outputs are missing
- The stage overlaps ambiguously with another stage
- The next agent cannot tell what happened or what to do next

## Related State Files

- .sb-codex-tool/state.md
- .sb-codex-tool/plans/
- .sb-codex-tool/summaries/
- .sb-codex-tool/guides/
