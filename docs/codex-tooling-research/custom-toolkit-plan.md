# Custom Toolkit Plan

## Goal

Design a new Codex toolkit that combines the best reusable ideas from
`Superpowers` and `oh-my-codex` without inheriting their full surface area,
complexity, or overlap problems.

This toolkit should be suitable for public release as a lightweight but strong
Codex working layer.

For now, this document refers to the toolkit as `yourtool`. The actual product
name can be chosen later.

## Product Thesis

The problem to solve is not "replace Codex."

The problem is:

- Codex sessions start too empty
- good workflow discipline is optional instead of built in
- execution and verification can drift apart
- long-running work lacks enough structure
- parallel work is powerful but not well normalized

`yourtool` should solve those problems by adding:

- a strong launcher
- a small canonical workflow
- durable run state
- optional parallel orchestration

It should not try to become a giant software factory in v1.

## Source Principles

### Borrow from Superpowers

Borrow these ideas:

- clarify before code
- plan before large execution
- verify before completion
- TDD pressure where appropriate
- explicit use of worktrees or subagents
- structured completion criteria

These ideas are the strongest part of `Superpowers` and map well to Codex.

### Avoid from Superpowers

Avoid these traps:

- too many default skills
- too much process surface before the user gets value
- making the user memorize a large ontology

The custom toolkit should keep the workflow obvious and small.

### Borrow from oh-my-codex

Borrow these ideas:

- a launcher or wrapper around Codex
- strong session defaults
- runtime or run-state persistence
- explicit orchestration for long-running work
- a dedicated state directory

These ideas are what make `oh-my-codex` feel like a real operating layer.

### Avoid from oh-my-codex

Avoid these traps:

- turning the toolkit into an entire alternate shell ecosystem too early
- a broad role catalog in v1
- coupling every concept to a large runtime abstraction

The custom toolkit should take the runtime sensibility, not the full runtime
weight.

## Product Shape

`yourtool` should consist of four layers.

### 1. Launcher layer

This is the entrypoint.

Responsibilities:

- launch Codex with stronger defaults
- load config
- locate or initialize project state
- connect instructions and skills
- expose setup and doctor commands

Example commands:

- `yourtool setup`
- `yourtool`
- `yourtool doctor`
- `yourtool status`

### 2. Workflow layer

This is the main user-facing value.

The v1 workflow should be intentionally small.

Canonical surfaces:

- `$clarify`
- `$plan`
- `$execute`
- `$verify`

This is enough to encode the full shape:

- understand the request
- lock the approach
- do the work
- provide evidence

### 3. Runtime and state layer

This is what keeps the toolkit coherent across longer sessions.

Responsibilities:

- approved plan storage
- run logs
- verification summaries
- active session tracking
- optional parallel-lane metadata

### 4. Extension layer

This keeps the core small.

The core should be general-purpose. Domain packs should be pluggable later.

Examples of future packs:

- Unity pack
- Web app pack
- Release pack
- Browser QA pack

## What v1 Must Do

### Strong launch experience

Users should be able to get a stronger Codex environment with one command.

Minimum expectations:

- setup installs or links required assets
- launch applies strong defaults
- project instructions are found predictably
- state directories are initialized automatically

### Canonical workflow without bloat

The user should not have to learn twenty commands.

The main value path should be:

- `$clarify` when intent is fuzzy
- `$plan` when the shape is understood but the approach needs approval
- `$execute` when the plan is locked
- `$verify` before completion

Everything else should be secondary.

### Durable state

The toolkit must remember enough about what happened to support:

- resuming work
- inspecting prior plans
- checking verification evidence
- understanding active or recent runs

### Parallel-work primitives

The toolkit does not need full tmux orchestration in v1, but it does need a
parallel model.

At minimum it should support:

- lane definitions
- ownership assignments
- run summaries per lane
- merge-back guidance

## What v1 Must Not Do

Do not build these into the core v1:

- a persistent browser daemon
- full deployment automation
- canary monitoring
- huge role catalogs
- dozens of skills
- complicated autonomous memory systems
- magic hooks that obscure what happened

Those are valid later extensions. They are not good core scope.

## Proposed CLI Shape

### User-facing commands

- `yourtool setup`
- `yourtool`
- `yourtool doctor`
- `yourtool status`

### In-session canonical surfaces

- `$clarify`
- `$plan`
- `$execute`
- `$verify`

### Optional later additions

- `$parallel`
- `$review`
- `$finish`

These are intentionally not core v1 requirements.

## Proposed State Layout

Project-local state root:

- `.yourtool/`

Suggested structure:

- `.yourtool/plans/`
- `.yourtool/logs/`
- `.yourtool/sessions/`
- `.yourtool/runs/`
- `.yourtool/memory/`

Suggested file roles:

- plans: approved and draft plan artifacts
- logs: execution summaries and event logs
- sessions: active session metadata
- runs: completed run metadata and status
- memory: explicitly promoted notes or reusable local guidance

The state model should remain inspectable by humans. Prefer JSON or TOML over
opaque binary formats.

## Project Instructions Model

The toolkit should integrate with project instructions without trying to replace
Codex policy.

Recommended model:

- prefer project `AGENTS.md`
- allow a toolkit-specific generated scaffold if missing
- never assume the toolkit owns the entire instruction hierarchy

This keeps `yourtool` aligned with Codex instead of fighting it.

## Internal Architecture

### Core modules

Suggested implementation modules:

- launcher
- config
- state
- workflow
- verification
- parallel
- doctor
- extensions

### Separation rules

- prompt assets and orchestration logic should be separate
- workflow definitions should not depend directly on one host's private hacks
- state schema should be versioned
- extension hooks should be explicit

## Packaging Model

Recommended packaging:

- npm package
- global install supported
- local project use also supported

Reasons:

- easiest for Codex users
- reasonable distribution for a workflow wrapper
- aligns with the way both inspiration projects are consumed

## Public Positioning

The toolkit should be described as:

- a lightweight Codex workflow and runtime layer
- inspired by strong existing ideas, but smaller and cleaner
- designed to keep Codex central
- opinionated about planning and verification
- extensible without forcing every user into a huge toolbox

## Release Principles

### v1 release goal

Ship a small but coherent core that proves:

- the launcher is useful
- the canonical workflow is useful
- the state model is useful

### v1 non-goal

Do not try to win every workflow category at once.

The core should succeed first. Domain packs can come later.

## Legal and implementation note

Both `Superpowers` and `oh-my-codex` are open-source and permissively licensed,
but the safest product path is:

- take inspiration from architecture and workflow concepts
- reimplement code directly for the new toolkit
- avoid carrying over large copied prompt or skill bodies without clear reason

That keeps the new toolkit cleaner, more coherent, and easier to maintain.

## Success Criteria

The custom toolkit is successful if a new user can:

1. install it quickly
2. launch a stronger Codex session with one command
3. move through clarify -> plan -> execute -> verify without learning a large
   command surface
4. inspect the resulting state and evidence in project-local files
5. later add domain-specific packs without changing the core model

## Source Links

- [Superpowers README](https://github.com/obra/superpowers)
- [Superpowers Codex guide](https://github.com/obra/superpowers/blob/main/docs/README.codex.md)
- [oh-my-codex README](https://github.com/Yeachan-Heo/oh-my-codex)
- [oh-my-codex Getting Started](https://github.com/Yeachan-Heo/oh-my-codex/blob/main/docs/getting-started.html)
