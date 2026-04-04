# Scope Guide: Launch Wrapper Hardening

## Purpose

- Narrow the current work cycle to a bounded file scope and clear verification expectations.

## Working Goal

- Harden the launch wrapper so it validates the hot path first and records
  enough metadata to inspect how the launched Codex session started.

## Primary Plan

- .sb-codex-tool/plans/2026-04-05-launch-wrapper-hardening-approved.md

## Allowed File Scope

- src/lib/codex.ts
- src/lib/launch.ts
- src/commands/launch.ts
- src/cli.ts
- tests/launch.test.ts
- docs/implementation/core-contract.md
- docs/implementation/verification-contract.md
- docs/implementation/acceptance-checklist.md
- .sb-codex-tool/project.md
- .sb-codex-tool/guides/code-consistency.md
- .sb-codex-tool/plans/2026-04-05-launch-wrapper-hardening-approved.md
- .sb-codex-tool/summaries/2026-04-05-launch-wrapper-hardening-execution-summary.md
- .sb-codex-tool/handoffs/2026-04-05-launch-wrapper-hardening-to-verification.md

## Recommended References

- AGENTS.md
- .sb-codex-tool/project.md
- .sb-codex-tool/state.md
- .sb-codex-tool/guides/code-consistency.md
- .sb-codex-tool/summaries/2026-04-05-work-cycle-writing-automation-execution-summary.md

## Verification Expectations

- Run `node --experimental-strip-types --test tests/launch.test.ts`.
- Run `node --experimental-strip-types --test tests/*.test.ts`.
- Run `node --experimental-strip-types src/cli.ts help`.
- Run `node --experimental-strip-types src/cli.ts doctor`.
- Run `node --experimental-strip-types src/cli.ts status`.
- Fresh verification should confirm that launch metadata now captures preflight,
  current cycle references, and the exported instruction-surface file path.
