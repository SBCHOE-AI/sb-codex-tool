# Core Contract

## Purpose

This document defines the product boundary and non-negotiable behavior for
`sb-codex-tool`.

It answers:

- what the product is
- what the product is not
- which commands and workflow stages are in scope
- which quality standards are required

## Product Identity

`sb-codex-tool` is a lightweight Codex workflow and runtime layer for general
software projects.

It exists to improve:

- planning discipline
- task execution continuity
- refactor-before-close behavior
- fresh-agent verification
- handoff quality
- next-agent orientation
- human-readable work journaling

It does not replace Codex. It structures work around Codex.

## Explicit Exclusions

The v1 core must not include:

- Unity-specific flows
- `gstack` concepts, browser automation, or release utilities
- large role catalogs
- dozens of commands
- autonomous memory systems
- hidden host-specific hooks that change behavior implicitly
- destructive git automation

## Packaging Contract

The product must ship as:

- npm package name: `sb-codex-tool`
- executable name: `sb-codex-tool`

Supported launch modes:

- global install
- repo-local install
- `npx sb-codex-tool`

## Required CLI Surface

The v1 core must provide these commands:

- `sb-codex-tool setup`
- `sb-codex-tool`
- `sb-codex-tool doctor`
- `sb-codex-tool status`

These commands are required for acceptance:

### `setup`

Must:

- discover project root
- scaffold required toolkit directories and files
- scaffold ignore files or append recommended rules safely
- scaffold required guide files if missing
- verify Codex presence or report the missing dependency clearly

### launch command: `sb-codex-tool`

Must:

- launch Codex through the toolkit wrapper
- discover toolkit state
- attach the project instruction surface
- record launch metadata
- fail clearly when required hot-path files are missing
- export an instruction-surface file path alongside inline instruction text
- record the resolved codex binary and post-launch exit status

### `doctor`

Must:

- validate required files and directories
- validate ignore scaffolds
- validate guide files
- validate workflow assets
- validate semantic readiness of the referenced current plan, guide, handoff,
  and current execution summary by rejecting unresolved scaffold placeholders
- validate the latest consistency review artifact for unresolved scaffold
  placeholders when one is referenced in current state
- report actionable remediation guidance

### `status`

Must:

- show current loop position
- show one next action when possible
- show current branch when available
- show active agent map when available
- point to current hot-path files
- show the latest consistency-review artifact when available
- show latest lifecycle-run phase, verdict, and linked artifact paths when a
  run record is available

## Documented Helper CLI Surface

The v1 core may also provide small documented helper commands when they improve
verification-friendly lifecycle management without expanding into a large
command catalog.

Currently documented helper commands are:

- `sb-codex-tool assign <agent-name> <slug> [title words]`
- `sb-codex-tool begin <slug> [title words]`
- `sb-codex-tool close`
- `sb-codex-tool complete-assignment <agent-name> <close|clear|replace> [replacement-agent] [replacement-slug] [title words]`
- `sb-codex-tool prepare-verify`
- `sb-codex-tool review-consistency <agent-name> [title words]`

### `assign`

Must:

- create a bounded assignment guide for a named subagent using the current cycle
  references
- reference `.sb-codex-tool/guides/code-consistency.md` in the generated
  assignment artifact
- update visible state so active subagents are inspectable
- avoid duplicating the same active subagent entry on rerun for the same
  assignment
- fail clearly when no current cycle exists

### `begin`

Must:

- create the next approved plan, execution summary, handoff, review, and scope
  guide
- update current-state artifacts through the shared current-state writer
- keep same-cycle reruns from regressing a `verify`-stage state

### `close`

Must:

- read the latest fresh-verification verdict from the current review artifact
- create or update the verification summary
- update the review artifact only with closure-follow-up metadata, not by
  inventing the verdict itself
- write the human work journal only for verified closure verdicts
- move state back to `clarify` only for verified closure verdicts
- keep non-closing verdicts in `verify`
- fail if the current review does not contain an explicit final verdict
- preserve wrapped multiline bullet detail when execution-summary sections are
  carried into the human work journal

### `review-consistency`

Must:

- create a bounded consistency review artifact for the current cycle
- reuse the current guide's allowed file scope in the generated review when it
  is available
- reference the current plan, latest summary, current guide, latest lifecycle
  run, and `code-consistency.md`
- update visible current-state artifacts with the latest consistency review path
- expose the named consistency agent through the active-agent map
- avoid creating duplicate artifact paths on rerun for the same cycle and agent
- fail clearly when no current cycle exists

### `complete-assignment`

Must:

- require an active subagent assignment
- support `close`, `clear`, and `replace` lifecycle actions
- record a visible lifecycle artifact for the completed assignment
- remove stale active-subagent ownership from current state
- preserve or create the replacement assignment when `replace` is used
- expose active assignment guides and the latest assignment lifecycle through
  visible state and status output

### `prepare-verify`

Must:

- require the current plan, summary, guide, handoff, and review artifacts
- rewrite the current handoff from the active execution summary and guide
- record a lifecycle run with phase `prepare-verify`
- move current state to `verify`
- mark verification ownership as pending in visible state
- fail clearly when next-agent guidance, implemented-surface detail, or
  verification expectations are still implicit

## Required In-Session Workflow Surface

The v1 core must define exactly these canonical surfaces:

- `$clarify`
- `$plan`
- `$execute`
- `$refactor`
- `$verify`

### `$clarify`

Must produce:

- a compact brief
- acceptance criteria
- boundaries
- assumptions
- non-goals

### `$plan`

Must produce a decision-complete plan with:

- objective
- acceptance criteria
- boundaries
- tasks

Each task must include:

- `files`
- `action`
- `verify`
- `done`

### `$execute`

Must:

- advance task by task
- record task status
- record blockers and concerns
- preserve task-to-file scope

Allowed task statuses:

- `DONE`
- `DONE_WITH_CONCERNS`
- `NEEDS_CONTEXT`
- `BLOCKED`

### `$refactor`

Must exist as a distinct step between execution and verification for
non-trivial work.

Its purpose is to:

- reduce complexity
- improve reuse where justified
- improve readability
- shorten or simplify large files and functions
- clarify module responsibility

It must not:

- add clever abstractions that reduce clarity
- optimize for hypothetical future reuse without current justification

### `$verify`

Must:

- be performed by a fresh verification agent
- run after `$refactor`
- collect evidence
- compare plan vs actual
- record deferred issues
- confirm next-agent guidance exists
- confirm work-journal update occurs

`$verify` is not test-only. It is the closure step.

## Core Quality Rules

All implementation must preserve these rules:

- prefer reuse before duplication
- do not generalize prematurely
- keep files short and single-purpose
- keep functions short and single-purpose
- prefer simple top-down control flow
- keep naming predictable
- keep module boundaries explicit
- keep code readable to a fresh agent

These quality rules are operational requirements, not style suggestions.

## Fresh-Agent Requirement

The implementation is incomplete unless final verification is performed by a
fresh agent that did not perform the implementation work being judged.

The product must therefore support:

- enough written state for handoff
- clear hot-path reading order
- clear changed-file scope
- explicit evidence sources for verification

## Git Contract

The v1 core must use git as context support, not as an autonomous workflow
engine.

It must support:

- current branch detection
- dirty working tree detection
- changed-files summary capture
- run-to-branch linkage

It must not perform:

- automatic merge
- automatic deploy
- destructive reset behavior

## Failure Conditions

The implementation fails this contract if any of the following are true:

- product scope drifts into Unity- or gstack-specific behavior
- required commands are missing
- required workflow stages are missing or ambiguous
- `$verify` can be finalized by the same implementation agent
- `$refactor` is omitted for non-trivial work without an explicit reason path
- quality rules are not reflected in the implementation contracts or guide
  files
- the product relies on undocumented implicit behavior instead of state and
  guide files
