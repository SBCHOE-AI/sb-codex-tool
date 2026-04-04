# Implementation Backlog

## Purpose

This backlog turns the custom toolkit design into a build sequence that another
engineer or agent can execute without redoing the planning work.

The target is the v1 core described in
[custom-toolkit-plan.md](/Users/seongbok/Workspace/MakeFramework/docs/codex-tooling-research/custom-toolkit-plan.md).

## Product Boundary

This backlog is for the general-purpose Codex core only.

It does not include:

- Unity-specific packs
- browser automation
- deployment or canary systems
- large role catalogs
- memory-heavy autonomous systems

Those are explicitly later extensions.

## Roadmap Overview

### Phase 1

Build the launcher core.

### Phase 2

Build the canonical workflow surfaces.

### Phase 3

Build the state and verification model.

### Phase 4

Build minimal parallel-work primitives.

### Phase 5

Build the extension boundary for future domain packs.

## Phase 1: Launcher Core

### Deliverables

- CLI entrypoint
- `setup` command
- `doctor` command
- `status` command
- Codex launcher wrapper
- config loading
- project state bootstrap

### Tasks

#### 1. Create the CLI skeleton

Implement:

- executable entrypoint
- command parsing
- help output

Acceptance criteria:

- the binary runs
- help text is readable
- core commands are registered

#### 2. Implement config discovery

Implement config loading order for:

- project-local config
- user-level config
- command-line overrides

Acceptance criteria:

- config sources are deterministic
- missing config is handled gracefully
- invalid config produces actionable errors

#### 3. Implement `setup`

`setup` should:

- initialize the toolkit directory layout
- install or link core skill assets
- install or scaffold required instruction files if needed
- verify Codex presence

Acceptance criteria:

- first-time setup completes with one command
- rerunning setup is safe
- setup output explains what changed

#### 4. Implement `doctor`

`doctor` should verify:

- Codex is installed
- required files exist
- state directory is valid
- expected workflow assets are discoverable

Acceptance criteria:

- failures are specific
- remediation guidance is included
- green state is clearly reported

#### 5. Implement launcher wrapper

Launching `yourtool` should:

- detect project root
- initialize run context
- pass strong defaults into Codex
- locate the instruction source

Acceptance criteria:

- Codex launches consistently through the wrapper
- launch metadata is recorded
- failure modes are explicit

## Phase 2: Canonical Workflow

### Deliverables

- `$clarify`
- `$plan`
- `$execute`
- `$verify`

### Tasks

#### 1. Define the canonical workflow contract

Lock the intended semantics:

- `$clarify` is for intent, boundaries, assumptions, and non-goals
- `$plan` is for decision-complete implementation plans
- `$execute` is for carrying an approved plan through implementation
- `$verify` is for evidence-backed completion checks

Acceptance criteria:

- each surface has a clear job
- surfaces do not overlap gratuitously
- the path is usable end-to-end

#### 2. Implement workflow assets

Create the skill or prompt assets that define the four surfaces.

Acceptance criteria:

- assets are discoverable by Codex
- descriptions are clear enough to trigger correctly
- assets are narrow and do not sprawl into unrelated roles

#### 3. Define transition rules

The toolkit should encode default workflow expectations:

- unclear requests prefer `$clarify`
- large tasks prefer `$plan`
- risky tasks do not skip straight to completion
- `$verify` is the default last step

Acceptance criteria:

- the workflow feels coherent
- the user can still override when needed
- the toolkit does not create dead-end loops

## Phase 3: State and Verification

### Deliverables

- project-local `.yourtool/` state
- saved plans
- run metadata
- verification logs
- run summaries

### Tasks

#### 1. Implement state root bootstrap

Create:

- `.yourtool/plans`
- `.yourtool/logs`
- `.yourtool/sessions`
- `.yourtool/runs`
- `.yourtool/memory`

Acceptance criteria:

- created automatically when needed
- no opaque layout
- state is human-readable

#### 2. Implement plan persistence

Store:

- draft plan metadata
- approved plan metadata
- timestamps
- linkage to runs if applicable

Acceptance criteria:

- plans are easy to inspect
- the latest approved plan is easy to find
- stale plans can be distinguished from active ones

#### 3. Implement run tracking

Track:

- run id
- start time
- mode
- active workflow stage
- result status

Acceptance criteria:

- `status` can surface active or recent runs
- runs are easy to inspect after completion

#### 4. Implement verification logging

Record:

- commands executed for verification
- pass or fail status
- skipped checks
- summarized evidence

Acceptance criteria:

- verification is inspectable after the fact
- failure reporting is explicit
- completion without evidence is discouraged

## Phase 4: Parallel Primitives

### Deliverables

- lane model
- ownership model
- lane metadata storage
- result collection model

### Tasks

#### 1. Define the lane schema

Each lane should record:

- lane id
- owner role
- task summary
- write scope
- verification expectations
- result status

Acceptance criteria:

- the schema is simple
- ownership is explicit
- write-scope collisions can be detected conceptually

#### 2. Implement lane lifecycle metadata

Support:

- created
- active
- completed
- blocked
- abandoned

Acceptance criteria:

- lane state is inspectable
- the main run can summarize lane outcomes

#### 3. Implement merge-back guidance

When lane work completes, the toolkit should make it easy to see:

- what each lane was responsible for
- what it claims to have completed
- what still needs main-session integration

Acceptance criteria:

- the main owner can reassemble the work without guesswork

### Deliberate limitation

Do not require full durable tmux-based orchestration in v1.

The first goal is to define and track parallel structure, not to build a full
remote process supervisor.

## Phase 5: Extension System

### Deliverables

- extension discovery model
- extension registration model
- documented boundary between core and domain pack

### Tasks

#### 1. Define extension packaging rules

An extension should be able to contribute:

- extra skills
- extra configs
- optional workflow helpers

It should not need to modify core internals to work.

Acceptance criteria:

- the loading model is documented
- the pack boundary is stable

#### 2. Define extension precedence

Lock the precedence between:

- core toolkit assets
- project instructions
- extension assets

Acceptance criteria:

- no ambiguity about which layer should win
- extensions cannot silently replace core behavior without explicit intent

#### 3. Create the first example pack contract

Do not fully implement the pack yet. Define the contract needed for a future:

- Unity pack

Acceptance criteria:

- future domain work has a clear target interface

## Suggested Internal Milestones

### Milestone A

The toolkit can launch Codex and manage setup, doctor, and status.

### Milestone B

The four canonical workflow surfaces exist and are usable.

### Milestone C

Plans and verification artifacts are persisted.

### Milestone D

Parallel lane metadata exists.

### Milestone E

An extension pack can be added without changing the core model.

## Initial Testing Matrix

### Install and bootstrap tests

- first-time setup on a clean machine state
- rerun setup on an already initialized project
- doctor on healthy environment
- doctor on broken environment

### Workflow tests

- fuzzy request routes into clarify correctly
- approved plan can be found by execute
- execute without a plan is handled intentionally
- verify can report both pass and fail cases

### State tests

- plan artifacts are created correctly
- run status is inspectable
- verification logs persist
- malformed state files are handled sanely

### Parallel tests

- lane definitions are stored
- lane states can transition
- run summary includes lane outcomes

### Extension tests

- extension discovery works
- extension assets do not silently override core assets

## Risks and Mitigations

### Risk: scope creep

Symptoms:

- adding too many skills
- trying to match every feature of the source projects

Mitigation:

- protect the four-surface core
- treat everything else as an extension candidate

### Risk: runtime and workflow coupling too tightly

Symptoms:

- every workflow change requires launcher changes
- state model becomes host-specific

Mitigation:

- keep launcher, workflow, and state modules separate

### Risk: verification becomes ceremonial

Symptoms:

- completion logs exist, but do not capture real evidence

Mitigation:

- require concrete commands and outcomes in verification records

### Risk: parallel model becomes too ambitious

Symptoms:

- tmux-style orchestration blocks core delivery

Mitigation:

- ship lane metadata before durable multi-process orchestration

## First Demo Scenario

Use this scenario as the first end-to-end proof:

1. create a small sample repo
2. run `yourtool setup`
3. launch via `yourtool`
4. use `$clarify` on a small feature request
5. use `$plan` to create an approved plan
6. use `$execute` to carry the plan out
7. use `$verify` to capture evidence
8. inspect `.yourtool/` to confirm artifacts exist

This demo is enough to prove the core product thesis without needing any domain
pack or advanced runtime features.

## Next Documents to Produce After Implementation Starts

Once implementation begins, add:

- architecture.md for the toolkit internals
- config reference
- extension SDK reference
- contributor guide
