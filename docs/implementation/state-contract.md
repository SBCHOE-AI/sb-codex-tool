# State Contract

## Purpose

This document defines the required project-local state layout for
`sb-codex-tool`.

The state model exists to make agent continuity inspectable, not opaque.

## Required State Root

The toolkit must create and maintain:

- `.sb-codex-tool/`

## Required Layout

The following files and directories are required:

- `.sb-codex-tool/project.md`
- `.sb-codex-tool/state.md`
- `.sb-codex-tool/plans/`
- `.sb-codex-tool/runs/`
- `.sb-codex-tool/summaries/`
- `.sb-codex-tool/handoffs/`
- `.sb-codex-tool/guides/`
- `.sb-codex-tool/index/`
- `.sb-codex-tool/reviews/`
- `.sb-codex-tool/logs/work-journal/`
- `.sb-codex-tool/ignore/`

## File Roles

### `project.md`

Must contain:

- project purpose
- core constraints
- important entrypoints
- always-read docs or files
- high-level architecture truth

### `state.md`

Must contain:

- current workflow stage
- current blocker if any
- one next action
- current focus modules
- latest approved plan reference
- latest relevant summary reference
- active agent map
- latest consistency review reference
- latest assignment lifecycle reference
- active assignment guide visibility for current subagents

### `plans/`

Must store:

- draft plans
- approved plans
- timestamps or ordering information

### `runs/`

Must store:

- run ids
- task progression
- run status
- related branch or commit context when available

### `summaries/`

Must store:

- execution summaries
- verification summaries
- plan-vs-actual reconciliation
- deferred issues
- refactor summary

### `handoffs/`

Must store:

- interrupted-work handoffs
- next-agent guidance artifacts
- resumed-work handoff records when relevant

### `guides/`

Must contain at minimum:

- `read-this-first.md`
- `code-consistency.md`

It may also contain:

- `current-focus.md`
- `entrypoints.md`
- `verification-scope.md`

### `index/`

Must contain compact navigational artifacts if the project needs multiple guide
or state entrypoints.

### `reviews/`

Must store:

- consistency review artifacts
- verification review artifacts
- acceptance review artifacts if used

### `logs/work-journal/`

Must store daily human-readable work logs.

### `ignore/`

Must store toolkit-generated ignore scaffolds or references used to minimize
agent noise.

## Hot Path

The hot path is the minimum reading set for a fresh agent.

The state model must support this reading order:

1. `.sb-codex-tool/project.md`
2. `.sb-codex-tool/state.md`
3. `.sb-codex-tool/guides/read-this-first.md`
4. `.sb-codex-tool/guides/code-consistency.md`
5. latest relevant summary
6. latest approved plan
7. task-specific guide if present

The implementation fails if a fresh agent must read broad historical state to
figure out where to start.

## Cold Path

Cold-path artifacts may exist, but must not be required for ordinary startup.

Examples:

- older summaries
- older run records
- archived handoffs
- legacy plans
- historical review artifacts

## Update Rules

After non-trivial code changes, the implementation flow must update:

- `state.md`
- latest summary artifact
- next-agent reading guidance

If a new convention is introduced, it must also update:

- `.sb-codex-tool/guides/code-consistency.md`

The state model must support both of these modes:

- helper-command-driven lifecycle updates
- Codex-first in-session updates after the human runs `setup`, `doctor`, and
  `status`

## Code Consistency Guide Contract

`code-consistency.md` must include:

- architecture style summary
- naming rules
- module boundary rules
- reuse rules
- readability rules
- anti-patterns
- reference files to read first
- known consistency debt

This file must be suitable for any new agent to read before implementation.

## Work Journal Separation

`logs/work-journal/` is human-facing and must remain separate from the hot path.

It may be git-tracked, but it must not be required for agent continuity.

## Human Readability Requirement

State artifacts must remain inspectable by humans.

Preferred formats:

- Markdown for narrative guidance and summaries
- JSON or TOML for structured metadata where needed

Opaque binary state is out of scope.

## Failure Conditions

The implementation fails this contract if:

- required directories are missing
- `project.md` or `state.md` are missing
- hot-path files are not clearly separable from cold-path history
- next-agent guidance is not clearly represented
- `code-consistency.md` is missing or too vague to guide a fresh agent
- work journal is mixed into agent continuity state
