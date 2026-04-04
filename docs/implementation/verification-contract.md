# Verification Contract

## Purpose

This document defines how a fresh verification agent must judge whether the
`sb-codex-tool` implementation is complete enough to pass.

This is an inspection contract, not a narrative overview.

## Verification Philosophy

Verification is not complete because code exists or because the implementing
agent claims the work is finished.

Verification is complete only when a fresh agent can:

- read the contracts
- inspect the generated artifacts and behavior
- confirm the implementation matches the contracts
- confirm the handoff is strong enough for a new agent

## Required Verification Reading Order

The fresh verification agent must read in this order:

1. [implementation.md](/Users/seongbok/Workspace/MakeFramework/docs/menu/implementation.md)
2. [verification-contract.md](/Users/seongbok/Workspace/MakeFramework/docs/implementation/verification-contract.md)
3. [acceptance-checklist.md](/Users/seongbok/Workspace/MakeFramework/docs/implementation/acceptance-checklist.md)
4. [core-contract.md](/Users/seongbok/Workspace/MakeFramework/docs/implementation/core-contract.md)
5. [state-contract.md](/Users/seongbok/Workspace/MakeFramework/docs/implementation/state-contract.md)
6. [agent-operations-contract.md](/Users/seongbok/Workspace/MakeFramework/docs/implementation/agent-operations-contract.md)
7. [work-journal-contract.md](/Users/seongbok/Workspace/MakeFramework/docs/implementation/work-journal-contract.md)

After the contracts, it must inspect the implementation artifacts in this
order:

1. `.sb-codex-tool/project.md`
2. `.sb-codex-tool/state.md`
3. `.sb-codex-tool/guides/read-this-first.md`
4. `.sb-codex-tool/guides/code-consistency.md`
5. latest approved plan
6. latest execution summary
7. changed-files summary and current git context if available

## Required Verdict States

The verification result must use one of:

- `pass`
- `pass_with_concerns`
- `fail`
- `blocked`

### `pass`

Use only when required artifacts, required behavior, and required guidance all
match the contracts.

### `pass_with_concerns`

Use when the implementation is usable and complete enough to continue, but
non-blocking issues remain documented.

### `fail`

Use when a required artifact or required behavior is missing, wrong, or too
weak to support reliable use.

### `blocked`

Use when verification cannot be completed because necessary evidence or
artifacts were not produced.

## Required Verification Areas

The verification agent must inspect all of these areas.

### 1. Product Boundary

Check:

- package and product identity match `sb-codex-tool`
- Node/npm packaging assumption is reflected
- Unity and gstack concepts are absent from the implementation core

Evidence:

- package metadata
- README and install guidance
- command surface
- docs and scaffolds
- `npm pack --dry-run` output

Failure if:

- unsupported external concepts are built into the core
- the command surface expands beyond the contract without documentation
- published tarball content includes internal state, tests, or research docs

### 2. Command Surface

Check:

- `setup` exists
- launch wrapper exists
- `doctor` exists
- `status` exists
- any additional helper commands are explicitly documented in the contracts
- documented helper commands behave according to their contracts

Evidence:

- CLI help
- command behavior
- scaffold outputs
- helper-command documentation when present
- doctor output for active-cycle artifact readiness
- status output for latest run visibility when a run record is present
- status output for semantic issues when current-state coherence drifts
- prepare-verify output when verify-state transition is automated
- launch metadata and launch-focused tests for wrapper hardening

Failure if:

- any required command is missing
- a required command exists but does not fulfill its contract
- a documented helper command exists in help but is not actually wired or
  leaves current-state artifacts inconsistent
- doctor and status disagree about obvious current-state drift that should be
  visible from the latest run and assignment ownership

### 3. Workflow Surface

Check:

- `$clarify` exists and has a distinct job
- `$plan` exists and produces executable plans
- `$execute` exists and records task progression
- `$refactor` exists and is distinct from execution
- `$verify` exists and is closure, not test-only

Evidence:

- workflow assets
- docs
- state outputs

Failure if:

- workflow stages are ambiguous
- `$refactor` is absent
- `$verify` is defined as tests only

### 4. Fresh-Agent Verification

Check:

- final verification requires a fresh agent
- the implementation agent cannot self-approve final closure
- handoff and hot-path files are sufficient for verification

Evidence:

- verification flow
- state files
- guide files
- review artifacts

Failure if:

- same-agent final approval is possible
- handoff is too weak for a fresh agent to inspect the work

### 5. State Model

Check:

- all required directories and files exist
- hot path is clearly separable from cold path
- next-agent guidance is explicit
- work journal is separated from agent continuity state

Evidence:

- `.sb-codex-tool/` layout
- file contents
- doctor output for current-state coherence checks
- status output for semantic issues

Failure if:

- required state artifacts are missing
- hot path depends on historical noise
- work journal is mixed into state continuity
- current state, latest run, and assignment ownership can drift silently
  without doctor or status reporting it

### 6. Agent Operations

Check:

- main-agent Korean reporting rule is documented and implemented in the
  operating model
- subagent reset-or-replace behavior is supported
- assignment requires consistency-guide reference
- consistency review role is supported

Evidence:

- operation docs
- state fields
- review artifacts
- consistency-review helper output when present
- assignment lifecycle artifacts and status output when active assignments exist

Failure if:

- main-agent reporting rule is missing
- subagent lifecycle is not controlled
- consistency review has no artifact or guide basis
- bounded assignments cannot be explicitly closed, cleared, or replaced

### 7. Code Quality and Consistency

Check:

- `code-consistency.md` exists and is strong enough to guide new agents
- the implementation optimizes for reuse, short files, short functions, low
  complexity, and readability
- the code structure is inspectable without deep inference

Evidence:

- guide files
- changed files
- review outputs

Failure if:

- the consistency guide is missing or vague
- code is needlessly clever, sprawling, or opaque
- major duplication or over-abstraction is unaddressed without documentation

### 8. Work Journal

Check:

- verified work leads to a human-readable journal entry
- the journal lives in the dedicated folder
- the journal is excluded from the default agent hot path

Evidence:

- work-journal files
- contract docs
- ignore strategy

Failure if:

- no human-readable work journal exists
- the journal replaces state or summary files
- the journal is required for ordinary agent startup
- wrapped summary bullets are truncated so the journal loses human-readable
  implementation detail

## Required Evidence Per Area

For each verification area, the agent should collect:

- required artifact location
- observed behavior
- whether the behavior matches the contract
- missing evidence if blocked

Verification without explicit evidence should fail.

## Work That Can Pass With Concerns

The implementation may pass with concerns if:

- core behavior is correct
- all required files exist
- only non-blocking polish work remains
- the remaining concerns are written into the latest verification summary

Examples:

- wording improvements in docs
- minor ergonomics not required by the contract
- optional fields not yet populated

## Automatic Failure Conditions

The verification agent must fail the work if any of the following are true:

- required state layout is incomplete
- required guide files are missing
- required commands are missing
- final verification is not fresh-agent-only
- main-agent Korean reporting is omitted from the operating contract
- subagent reset-or-replace is omitted from the operating contract
- work journal contract is missing or not implemented
- hot path and cold path are not clearly separated
- verify is reduced to test-running instead of closure
- implementation quality is too coupled, too long, or too opaque to inspect
  safely

## Blocked Conditions

The verification agent must use `blocked` instead of guessing when:

- the required artifacts do not exist yet
- the implementation output is incomplete
- the latest plan or summary needed for inspection is missing
- the changed-file scope cannot be determined
