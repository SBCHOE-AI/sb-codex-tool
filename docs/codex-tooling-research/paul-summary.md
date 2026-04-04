# PAUL Summary

## Purpose

This document captures the parts of `PAUL` that are most relevant to later
Codex work in this repository.

It is not meant to be a feature inventory. It is meant to preserve the ideas
that are strong enough to inform:

- a future repo `AGENTS.md`
- an initial Codex skill set
- a custom toolkit scaffold

Primary upstream sources reviewed:

- [PAUL README](https://github.com/ChristopherKahler/paul)
- [PAUL vs GSD](https://github.com/ChristopherKahler/paul/blob/main/PAUL-VS-GSD.md)

## Short Take

`PAUL` is a structured AI-assisted development framework organized around a
mandatory `PLAN -> APPLY -> UNIFY` loop.

Its core claim is that AI work degrades when:

- plans do not close cleanly
- session state drifts
- acceptance criteria are weak
- subagents are overused for implementation

`PAUL` addresses those problems with a stronger loop, a persistent project
state directory, and explicit reconciliation after execution.

The most important takeaway for Codex is not the slash-command surface. It is
the governance model.

## Core Philosophy

### 1. Loop integrity

Every plan must close with `UNIFY`.

`PAUL` treats closure as a first-class requirement:

- every plan gets a summary
- plan vs actual is compared explicitly
- decisions and deferred issues are logged
- project state is updated before the loop is considered complete

This is the strongest idea in the whole framework.

### 2. In-session context over implementation subagents

`PAUL` argues that implementation quality drops when work is offloaded to fresh
subagents too aggressively.

Its recommended split is:

- use the main session for implementation
- use subagents for discovery and research

The claim is not that subagents are useless. The claim is that cold-start
implementation agents lose too much context and increase cleanup work.

### 3. Acceptance-driven development

`PAUL` requires acceptance criteria before meaningful execution starts.

Its preference is BDD-style criteria:

- `Given [precondition]`
- `When [action]`
- `Then [outcome]`

Tasks are supposed to point back to explicit acceptance criteria instead of
only listing implementation steps.

## Operating Model

The primary loop is:

1. `init`
2. `plan`
3. `apply`
4. `unify`
5. `progress` or `resume` as needed

### `/paul:init`

Bootstraps the project with a populated project brief rather than a blank
template. The upstream README emphasizes a typed walkthrough that adapts to the
kind of work being done.

This matters because `PAUL` wants planning to begin from an actual project
definition, not from an empty state folder.

### `/paul:plan`

Creates an executable plan with adaptive ceremony:

- quick-fix
- standard
- complex

Common plan ingredients:

- objective
- acceptance criteria
- task list
- boundaries
- verification checklist
- coherence validation against current project context

`PAUL` treats a task as underspecified unless it includes all of:

- files
- action
- verify
- done

That requirement is directly reusable.

### `/paul:apply`

Executes the approved plan with built-in quality gates.

The execution model is not "do all tasks and hope the result is fine." It is
"execute a task, qualify it, then continue."

The upstream docs describe this as an `Execute/Qualify` loop.

Task outcomes use four escalation statuses:

- `DONE`
- `DONE_WITH_CONCERNS`
- `NEEDS_CONTEXT`
- `BLOCKED`

This is better than a binary pass/fail model because it preserves uncertainty
without pretending the task cleanly succeeded.

### `/paul:unify`

This is the closure step.

Its responsibilities are:

- produce a summary
- compare plan vs actual
- record decisions
- record deferred issues
- update project state

This is the step most worth carrying into a Codex-native system.

### `/paul:progress`, `/paul:pause`, `/paul:resume`, `/paul:handoff`

These commands turn state continuity into a first-class concern.

Notable behavior from the upstream docs:

- progress aims to suggest one next action
- resume reads stored state and handoff information
- handoff documents not only where work stopped, but why

The "single next action" idea is small but useful. It reduces decision fatigue
after interruptions.

## State Model

`PAUL` stores project state in a dedicated `.paul/` directory.

Representative structure from the upstream README:

- `.paul/PROJECT.md`
- `.paul/ROADMAP.md`
- `.paul/STATE.md`
- `.paul/config.md`
- `.paul/SPECIAL-FLOWS.md`
- `.paul/phases/...`

The notable parts are not the exact filenames. The notable parts are the roles.

### PROJECT.md

Project context and requirements.

Usefulness:

- gives planning a durable source of truth
- allows later plans to validate against the original intent

### ROADMAP.md

Phase and milestone breakdown.

Usefulness:

- keeps short-term plan work attached to longer-term sequencing
- creates a place to record interruptions or inserted work

### STATE.md

Tracks loop position, continuity, decisions, blockers, and deferred issues.

Usefulness:

- makes resumption explicit
- gives the system a durable answer to "what is the next thing to do?"

### SPECIAL-FLOWS.md

Declares required specialized skills or flows before execution can proceed.

Usefulness:

- pushes skill requirements from memory into project state
- creates an audit point for required workflows

## Plan and Task Shape

The upstream README shows a `PLAN.md` shape with structured sections and an
XML-like task block.

The exact syntax is not the important part. The important parts are:

- objective is explicit
- context references are explicit
- acceptance criteria are explicit
- tasks are structured
- boundaries are explicit

Each task must describe:

- the file scope
- the intended action
- how to verify the result
- what counts as done

This is a high-value planning constraint because it prevents vague tasks from
moving into execution.

## Quality Enforcement

`PAUL` has several notable quality mechanisms.

### Execute/Qualify loop

Every task is checked against the plan and acceptance criteria after execution.

This is stronger than "run tests at the end" because it tries to catch drift
before the next task compounds it.

### Diagnostic failure routing

When something fails, `PAUL` tries to classify the failure before choosing a
fix path:

- intent issue
- spec issue
- code issue

This is a strong operating idea. Many AI loops waste time patching code when
the plan was actually wrong.

### Coherence validation

Before plan approval, `PAUL` validates the plan against existing project
constraints and prior state.

This matters because bad plans are cheaper to reject before execution than
after execution.

## CARL Integration

`PAUL` has a companion system called `CARL`, described as a dynamic rule
injection layer.

The upstream docs position CARL as a way to avoid giant static prompts by
loading rules only when relevant.

The important point for this repository is not CARL itself. The important point
is the design direction:

- keep default context smaller
- inject domain rules when a task requires them
- make enforcement contextual rather than permanently global

That concept can influence local `AGENTS.md` structure and future skill design
even if CARL itself is never replicated.

## Strengths

### Strongest closure model reviewed so far

Among the external systems reviewed in this repository, `PAUL` has the clearest
answer to "how does a plan end cleanly?"

### Strong acceptance and verification posture

The framework treats acceptance criteria and verification as execution inputs,
not only as documentation.

### Better state continuity than ad-hoc skill packs

The dedicated state model is more operationally mature than relying on chat
memory or informal notes.

### Better interruption handling

The progress, pause, resume, and handoff pieces fit together well.

## Weaknesses and Portability Limits

### Claude-first command surface

The published interface is built around Claude slash commands. That does not
translate directly to Codex.

### Ceremony can grow quickly

The stronger the structure, the easier it is to add too much routine around
small tasks.

### Exact file and syntax choices are not sacred

The `.paul/` naming and XML-like task structure are implementation choices, not
the main reusable insight.

### Strong anti-subagent stance should be adapted, not copied blindly

The framework is right to push back on careless subagent use. It does not mean
Codex should avoid subagents entirely. The useful rule is narrower: use them
when the work is discovery-heavy or isolated, not as a default replacement for
the main session.

## What To Reuse In Codex

These ideas should be considered direct inputs for local Codex artifacts:

- mandatory closure after non-trivial execution
- acceptance criteria before major work begins
- every task must include a verification step
- explicit plan vs actual reconciliation
- explicit deferred-issue logging
- single next action guidance for resume flows
- state files that survive across sessions
- boundary sections for "do not change" constraints
- intent/spec/code failure classification

## What Not To Port Directly

These elements should be treated as inspiration, not copied verbatim:

- the full Claude slash-command surface
- the exact `.paul/` directory shape and naming
- XML-heavy plan syntax
- CARL as a required dependency
- the strongest form of "implementation must stay in-session"

## Recommended Use In This Repository

When this repository later creates Codex artifacts, `PAUL` should inform them
in the following order:

1. `AGENTS.md`
   - add rules about plan approval, task verification, and mandatory closure
2. initial skills
   - encode plan, execute, verify, and reconcile behavior
3. custom toolkit scaffold
   - give the toolkit run-state, summaries, and progress semantics

This means `PAUL` is most useful here as a design-pattern source, not as a
drop-in package to install.
