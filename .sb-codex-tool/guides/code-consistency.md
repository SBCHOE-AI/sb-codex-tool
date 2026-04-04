# Code Consistency Guide

## Purpose

This file defines the structural consistency rules every new agent reads before
implementation.

## Architecture Style Summary

- Prefer small modules with single responsibilities.
- Keep orchestration code separate from filesystem, git, and template logic.
- Favor simple top-down flow over clever abstraction chains.

## Naming Rules

- Use direct names that reveal responsibility quickly.
- Keep command names aligned with workflow stages.
- Keep template and state file names predictable.

## Module Boundary Rules

- CLI parsing stays separate from command logic.
- Command logic stays separate from state persistence.
- Template generation stays separate from command output.
- Verification logic stays separate from execution logic.

## Reuse Rules

- Reuse existing helpers before creating parallel implementations.
- Extract shared logic only when reuse is current and obvious.
- Do not over-generalize for hypothetical future use.

## Readability Rules

- Keep files short and focused.
- Keep functions short and focused.
- Prefer explicit data flow over hidden side effects.
- Add short comments only when the control flow is not self-evident.

## Anti-Patterns

- Clever abstractions that hide simple behavior
- Overlong files and functions
- Mixed responsibilities in one module
- Vague naming
- Hidden state transitions

## Reference Files To Read First

- AGENTS.md
- .sb-codex-tool/project.md
- .sb-codex-tool/state.md
- .sb-codex-tool/guides/read-this-first.md
- src/cli.ts
- src/lib/scaffold.ts
- src/lib/current-state.ts
- src/lib/work-cycle.ts
- src/lib/doctor.ts
- src/lib/status.ts

## Known Consistency Debt

- Template generation is now split under `src/lib/templates/`; keep
  `src/lib/templates.ts` as a thin facade and prefer adding new scaffold
  concerns to the focused modules instead of growing a new monolith.
- Semantic coherence rules should stay centralized in
  `src/lib/state-coherence.ts` instead of being reimplemented separately in
  `doctor` and `status`.
- Keep the npm distribution surface explicit through `package.json#files`
  rather than relying on an implicit or sprawling ignore configuration.
- `status` now surfaces latest lifecycle-run details, but future work may
  still add more compact formatting or filtering for large run-linked artifact
  sets.
- Wrapped bullet continuity is now preserved for work-journal generation, but
  future work may still add richer Markdown handling if non-bullet structures
  ever need to flow through the same helpers.
- Assignment lifecycle handling is now explicit, but future work may still add
  richer stale-assignment detection or lifecycle validation in `doctor`.
- Verify preparation is now explicit, but future work may still add structured
  editing helpers for execution summaries instead of relying on filled markdown
  sections as inputs.
- Launch behavior is now isolated in `src/lib/launch.ts`; if the wrapper grows
  further, keep preflight, metadata writing, and codex resolution split instead
  of collapsing them back into one large command module.
