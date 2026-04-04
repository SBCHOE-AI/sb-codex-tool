# Implementation Roadmap

## Purpose

This roadmap breaks the `sb-codex-tool` implementation into phases that can be
implemented and verified incrementally.

Each phase has:

- deliverables
- required outputs
- non-goals
- completion evidence

## Phase 1: Bootstrap and Ignore Foundation

### Deliverables

- CLI skeleton
- `setup`
- `doctor`
- `status`
- `.sb-codex-tool/` bootstrap
- ignore scaffolds
- initial guide scaffolds

### Required Outputs

- working CLI entrypoint
- project root detection
- `.sb-codex-tool/` required layout creation
- `.gitignore`, `.ignore`, and `.rgignore` support or scaffolding path
- initial `project.md`
- initial `state.md`
- initial `guides/read-this-first.md`
- initial `guides/code-consistency.md`

### Non-Goals

- full workflow behavior
- full verification flow
- full work-journal flow

### Completion Evidence

- commands exist and run
- state root is created
- guide files are created
- `doctor` can identify missing essentials

## Phase 2: Workflow Surfaces

### Deliverables

- `$clarify`
- `$plan`
- `$execute`
- `$refactor`
- `$verify`

### Required Outputs

- workflow assets
- stage descriptions
- transition rules
- explicit distinction between execution, refactor, and verify

### Non-Goals

- full extension system
- broad optional command surface

### Completion Evidence

- every canonical stage exists
- stage responsibilities do not overlap ambiguously
- `$verify` is explicitly fresh-agent-only

## Phase 3: State, Guides, Handoffs, and Reviews

### Deliverables

- plan persistence
- run tracking
- summary persistence
- handoff artifacts
- review artifacts
- hot-path guide structure

### Required Outputs

- state files are updated predictably
- next-agent guidance exists
- summaries distinguish execution from verification
- reviews directory stores verification or consistency review outputs

### Non-Goals

- full extension pack behavior

### Completion Evidence

- fresh agent can follow the hot path
- latest plan and latest summary are easy to locate
- handoff quality is inspectable

## Phase 4: Agent Operations

### Deliverables

- main-agent reporting rules
- subagent lifecycle rules
- assignment rules
- consistency review flow

### Required Outputs

- visible active-agent map
- Korean reporting guidance for the main agent
- reset-or-replace guidance for subagents
- consistency review artifact path

### Non-Goals

- large agent catalog
- hidden autonomous orchestration

### Completion Evidence

- the operating model clearly separates main agent, worker agents, and the
  verification agent
- the consistency guide is referenced by assignment behavior

## Phase 5: Git Integration

### Deliverables

- current branch detection
- dirty-state detection
- changed-files capture
- run-to-branch linkage

### Required Outputs

- git context in status or summaries
- changed-file scope for verification and next-agent guidance

### Non-Goals

- merge automation
- deploy automation

### Completion Evidence

- git state is visible when available
- changed files are usable as review scope

## Phase 6: Work Journal

### Deliverables

- daily journal path resolution
- journal template
- journal write flow after verification

### Required Outputs

- dedicated work-journal folder
- human-readable entries
- separation from hot-path state files

### Non-Goals

- replacing state artifacts with narrative journaling

### Completion Evidence

- verified work results in a readable journal entry
- journal is outside the default agent hot path

## Phase 7: Documentation Scaffolding

### Deliverables

- top-down docs structure
- menu documents
- operations documents
- architecture documents

### Required Outputs

- short menu docs
- separated detail docs
- no monolithic document dependency for ordinary onboarding

### Non-Goals

- writing every future extension doc in v1

### Completion Evidence

- a fresh agent can navigate implementation and verification docs efficiently

## Phase Completion Rule

A phase is complete only when:

- its required outputs exist
- its completion evidence can be observed
- the verification contract can judge it without guesswork

A phase is incomplete if code exists but the evidence or artifacts needed for
fresh verification do not exist.
