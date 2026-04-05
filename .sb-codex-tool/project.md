# Project Brief

## Purpose

- Project name: MakeFramework
- Primary package under active development: `sb-codex-tool`
- This repository currently contains the v1 scaffold-first implementation for
  `sb-codex-tool`, plus the contract documents that define how the tool must be
  implemented and verified.
- The current goal is to keep the tool small, verification-friendly, and easy
  for a fresh agent to understand from the hot path.

## Core Constraints

- Follow the workflow defined in AGENTS.md.
- Keep state inspectable through .sb-codex-tool/.
- Optimize for reuse, readability, and low complexity.
- Default human usage is `setup`, `doctor`, and `status`; after that, Codex can
  manage plans, summaries, handoffs, reviews, and work-journal updates
  directly.
- Keep the v1 core general-purpose only.
- Exclude Unity-specific behavior and all gstack-specific concepts.
- Final closure must be performed by a fresh verification agent.

## Important Entrypoints

- AGENTS.md
- .sb-codex-tool/state.md
- .sb-codex-tool/guides/read-this-first.md
- .sb-codex-tool/guides/code-consistency.md
- docs/menu/implementation.md
- src/cli.ts
- src/lib/scaffold.ts
- src/lib/doctor.ts
- src/lib/status.ts

## Always-Read Docs or Files

- AGENTS.md
- .sb-codex-tool/project.md
- .sb-codex-tool/state.md
- .sb-codex-tool/guides/read-this-first.md
- .sb-codex-tool/guides/code-consistency.md
- docs/menu/implementation.md
- docs/implementation/verification-contract.md
- The latest approved plan referenced by `.sb-codex-tool/state.md`
- The latest summary referenced by `.sb-codex-tool/state.md`
- The current task-specific guide referenced by `.sb-codex-tool/state.md`

## Architecture Truth

- `bin/sb-codex-tool.js` is a thin executable wrapper that forwards to the
  TypeScript CLI through Node's strip-types runtime.
- `src/cli.ts` is the top-level command router for `setup`, `doctor`,
  `status`, advanced/manual helper lifecycle commands, and the default launch
  path.
- `src/commands/` contains thin command handlers.
- `src/lib/templates.ts` is a thin public facade for scaffold-template helpers.
- `src/lib/templates/context.ts` owns the shared template context discovery.
- `src/lib/templates/repo-documents.ts` owns repo-facing scaffold documents
  such as `AGENTS.md`, `project.md`, and `code-consistency.md`.
- `src/lib/templates/state-documents.ts` owns state-facing scaffold documents
  such as `state.md`, `read-this-first.md`, README stubs, and `current.json`.
- `src/lib/templates/workflows.ts` owns the canonical workflow asset templates.
- `src/lib/templates/ignore.ts` owns reusable ignore-line and base-ignore
  template generation.
- `src/lib/templates/generated-files.ts` assembles the generated scaffold file
  list from the smaller template modules.
- `src/lib/templates/shared.ts` owns reusable template helpers used across the
  smaller template modules.
- `src/lib/scaffold.ts` creates the `.sb-codex-tool/` state root, guide files,
  workflow assets, ignore files, and `AGENTS.md`.
- `src/lib/current-state.ts` defines the shared current-index model and renders
  `state.md`.
- `src/lib/run-records.ts` owns reusable lifecycle run-record writing and
  git-context rendering shared by begin/close flows.
- `src/lib/cycle.ts` owns reusable cycle date, slug, and title helpers shared
  by work-cycle, close-cycle, assignment, and consistency-review flows.
- `src/lib/assignment.ts` creates bounded subagent assignment guides from the
  current cycle and updates visible active-subagent state.
- `src/lib/assignment-lifecycle.ts` records bounded subagent lifecycle
  decisions for close, clear, and replace flows and keeps active ownership
  state aligned.
- `src/lib/consistency-review.ts` creates bounded consistency review artifacts
  from the current cycle and updates visible review state without changing the
  fresh-verification review path.
- `src/lib/work-cycle.ts` creates the next plan/summary/handoff/review/scope
  artifacts, records the current lifecycle run, and updates current state.
- `src/lib/prepare-verify.ts` rewrites the current handoff from the active
  summary and guide, records a verify-preparation lifecycle run, and moves the
  active cycle into verify-ready state.
- `src/lib/close-cycle.ts` records a fresh-verification verdict and automates
  verification summary, lifecycle run capture, work-journal, and
  state-transition updates.
- `src/lib/markdown-sections.ts` owns reusable `##`-section bullet extraction,
  including wrapped multiline bullet continuation handling.
- `src/lib/work-journal.ts` owns reusable work-journal path resolution,
  multiline bullet rendering, and entry writing.
- `src/lib/codex.ts` resolves the local Codex binary for setup checks and the
  launch wrapper, preferring a local project binary before PATH fallback.
- `src/lib/launch.ts` owns launch preflight, instruction-surface file export,
  and richer launch metadata capture.
- `src/lib/state-coherence.ts` owns shared semantic checks for current-state,
  latest-run, verify-stage, and assignment-guide coherence.
- `src/lib/doctor.ts` validates required artifacts against the implementation
  contracts and rejects unresolved scaffold placeholders in the referenced
  current plan, guide, handoff, execution summary, and latest consistency
  review, plus current-state coherence drift.
- `src/lib/status.ts` reads the hot path, latest lifecycle run, recorded
  run-linked artifact paths, and git context for quick inspection, including
  the latest consistency-review reference, active assignment guides, the
  latest assignment lifecycle reference, and semantic coherence issues.
- `src/lib/git.ts` is limited to non-destructive context support.
- `package.json` defines the runtime entrypoint, npm scripts, and published
  tarball surface through the `files` whitelist.
- `README.md` is the distribution-facing entrypoint for installation, command,
  workflow, and packaging guidance.
- `tests/` contains smoke tests for scaffold creation, assignment guides,
  work-cycle automation, closure automation, consistency review flow, and
  doctor validation, plus status visibility and distribution coverage.
