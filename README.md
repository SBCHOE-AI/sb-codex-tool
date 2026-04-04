# sb-codex-tool

`sb-codex-tool` is a lightweight Codex workflow and runtime scaffold for
general software projects.

It keeps project state, hot-path guidance, fresh-agent verification, and
human-readable work journals in one inspectable layout without taking over the
whole codebase.

Korean README: [README.ko.md](https://github.com/SBCHOE-AI/sb-codex-tool/blob/main/README.ko.md)

## Why It Exists

`sb-codex-tool` is designed for projects that want stronger agent discipline
without introducing a heavy platform.

The tool focuses on a few practical problems:

- keeping the current task state visible to fresh agents
- forcing non-trivial work through `plan -> execute -> refactor -> verify`
- making final verification fresh-agent-only
- preserving a human-readable work journal alongside agent-focused state
- keeping onboarding and verification on a compact hot path

It is intentionally small. The goal is not to replace Codex, but to make Codex
work more repeatable inside a normal repository.

## Core Principles

- Fresh verification is mandatory for final closure.
- State should survive session boundaries.
- Main-agent progress updates should be concise and in Korean.
- Subagents should stay bounded and disposable.
- Code should stay reusable, short, readable, and low-complexity.
- Human work logs and agent continuity state should remain separate.

## Requirements

- Node.js 25 or newer
- A project where Codex can read and write the working tree
- A `codex` binary available when using the default launch wrapper
- A workflow that benefits from explicit state, handoff, and verification
  artifacts

## Install

For local use in a project:

```bash
npm install --save-dev sb-codex-tool
```

For one-off execution:

```bash
npx sb-codex-tool setup
```

## Quick Start

Initialize the scaffold in a repository:

```bash
sb-codex-tool setup
```

Inspect the scaffold and operational state:

```bash
sb-codex-tool doctor
sb-codex-tool status
```

Start a bounded work cycle:

```bash
sb-codex-tool begin add-status-panel "Add Status Panel"
```

Prepare the current cycle for fresh verification:

```bash
sb-codex-tool prepare-verify
```

Close the cycle after a fresh verification agent records a verdict:

```bash
sb-codex-tool close
```

## What `setup` Creates

`setup` scaffolds a `.sb-codex-tool/` state root and repo guidance:

```text
.sb-codex-tool/
  guides/
  handoffs/
  ignore/
  index/
  logs/work-journal/
  plans/
  reviews/
  runs/
  summaries/
  workflows/
AGENTS.md
.ignore
.rgignore
```

This is the minimum structure needed for bounded work cycles, hot-path
onboarding, fresh verification, and human-readable work journaling.

## Commands

| Command | Purpose |
| --- | --- |
| `sb-codex-tool setup` | Create the scaffold, workflow assets, guides, and ignore files. |
| `sb-codex-tool doctor` | Validate scaffold integrity, current-cycle readiness, and semantic coherence. |
| `sb-codex-tool status` | Show the current stage, next action, hot path, latest run details, and semantic issues. |
| `sb-codex-tool begin <slug> [title words]` | Open a new bounded work cycle with plan/summary/handoff/review artifacts. |
| `sb-codex-tool prepare-verify` | Move the current cycle into verify-ready state and rewrite the handoff. |
| `sb-codex-tool close` | Finalize the current cycle from the recorded fresh verification verdict. |
| `sb-codex-tool assign <agent-name> <slug> [title words]` | Create a bounded assignment guide for a subagent. |
| `sb-codex-tool complete-assignment <agent-name> <close\|clear\|replace> ...` | Record lifecycle handling for a completed subagent assignment. |
| `sb-codex-tool review-consistency <agent-name> [title words]` | Write a bounded consistency review artifact for the active cycle. |
| `sb-codex-tool [codex args]` | Launch Codex through the wrapper when no explicit command is given. |

## Workflow Model

`sb-codex-tool` uses a five-stage loop:

1. `clarify`
2. `plan`
3. `execute`
4. `refactor`
5. `verify`

Final verification is always fresh-agent-only. Non-trivial work is expected to
end with `prepare-verify` and then a fresh verification pass before `close`.

### Typical Cycle

1. Run `begin` to open a new cycle.
2. Fill the approved plan and scope guide with real work.
3. Implement the change and update the execution summary.
4. Refactor for simplicity, reuse, and readability.
5. Run `prepare-verify` to align handoff, state, and verification inputs.
6. Have a fresh verification agent inspect the contracts, hot path, code, and
   checks.
7. Run `close` after the fresh verifier records a verdict.

## State Layout

`setup` creates a `.sb-codex-tool/` state root that includes:

- `project.md`
- `state.md`
- `plans/`
- `runs/`
- `summaries/`
- `handoffs/`
- `guides/`
- `reviews/`
- `logs/work-journal/`

Hot-path onboarding starts with:

1. `.sb-codex-tool/project.md`
2. `.sb-codex-tool/state.md`
3. `.sb-codex-tool/guides/read-this-first.md`
4. `.sb-codex-tool/guides/code-consistency.md`

### Directory Responsibilities

- `project.md`: durable project truth and architectural entrypoints
- `state.md`: current stage, next action, active references, and agent map
- `plans/`: approved and draft work-cycle plans
- `runs/`: lifecycle and launch metadata
- `summaries/`: execution and verification summaries
- `handoffs/`: next-agent guidance for bounded verification or continuation
- `guides/`: code consistency, read-first, and task-specific guidance
- `reviews/`: consistency and fresh-verification artifacts
- `logs/work-journal/`: human-readable daily work logs

## Agent Model

### Main Agent

- Owns orchestration
- Reports progress to the user in Korean
- Assigns bounded work to subagents
- Integrates and closes work

### Subagents

- Should stay bounded to one narrow task
- Should not accumulate unrelated context
- Should be cleared or replaced after completion

### Verification Agent

- Must be fresh
- Must not be the same agent that executed the work
- Uses the documented hot path and verification contract

### Consistency Agent

- Reviews structure, naming, module boundaries, and reuse/readability drift
- Uses `code-consistency.md` as the baseline

## Verification Model

`verify` is not just “tests passed”.

Fresh verification is expected to confirm:

- plan vs actual
- next-agent guidance quality
- readability and code-consistency alignment
- active artifact completeness
- semantic coherence between state and latest run metadata

If those conditions are not met, closure should not happen.

## Work Journal

After verified completion, the main agent writes a human-readable work log
entry in:

```text
.sb-codex-tool/logs/work-journal/YYYY-MM-DD.md
```

This journal is intentionally separate from agent continuity state. It is for
people who want to know what changed today without reading internal run
artifacts.

## Git and Repository Context

`sb-codex-tool` uses git as context support, not as a destructive automation
surface.

Current usage includes:

- branch and dirty-state inspection when available
- changed-file context capture in run artifacts
- launch and closure evidence linking

It deliberately avoids destructive git automation in the core.

## Packaging Checks

Use these commands before publishing or sharing a tarball:

```bash
npm run test
npm run pack:check
```

`pack:check` verifies the published tarball surface stays focused on the CLI
runtime rather than shipping local state, tests, or internal research docs.
Root README documents such as `README.md` and `README.ko.md` may still be
included by npm as repository-facing documentation.

For a fuller local release check:

```bash
npm run release:check
```

## Development Notes

- The package currently runs TypeScript directly through Node's
  `--experimental-strip-types` support.
- The distribution surface is controlled with `package.json#files`.
- The published tarball is intentionally limited to runtime files plus root
  README documents that npm auto-includes, such as `README.md` and
  `README.ko.md`.
- Internal `.sb-codex-tool/` state is useful inside the repository, but is not
  part of the package payload.

## Current Status

The repository currently includes:

- scaffold creation and validation
- bounded work-cycle automation
- launch wrapper hardening
- assignment lifecycle handling
- consistency review flow
- semantic coherence checks for `doctor` and `status`
- npm distribution readiness checks

## License

The current package metadata is marked `UNLICENSED`. Adjust that before public
open-source publication if you choose a different distribution model.
