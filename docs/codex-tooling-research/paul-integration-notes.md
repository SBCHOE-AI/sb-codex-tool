# PAUL Integration Notes

## Purpose

This document translates `PAUL` into Codex-oriented design decisions for this
repository.

Use it as the bridge between `paul-summary.md` and later implementation work
such as:

- repo `AGENTS.md`
- an initial skill set
- a custom toolkit scaffold

This document assumes the goal is not to port `PAUL` directly. The goal is to
absorb its strongest ideas without importing its full Claude-specific surface.

## Position In The Current Research Set

The existing research already established three useful roles:

- `Superpowers` as workflow discipline
- `oh-my-codex` as runtime and orchestration
- `gstack` as specialized utilities

`PAUL` adds a fourth role:

- governance and loop closure

That is the safest way to think about it. `PAUL` should not become another
competing workflow owner in Codex. Its value is to harden the lifecycle around
planning, execution, and completion.

## What PAUL Changes In The Design

Before reviewing `PAUL`, the custom toolkit direction was already:

- clarify
- plan
- execute
- verify

`PAUL` changes the depth of those steps more than it changes their names.

The major additions are:

- execution should not end without reconciliation
- plans need stronger acceptance structure
- task records need a stable `verify` field
- run state should support resume and one-next-action guidance
- deferred issues should be recorded as first-class output

The result is a stronger closure model, not a bigger command set.

## Command And Concept Mapping

Use the following mapping when translating `PAUL` concepts into Codex or a
custom toolkit.

| PAUL concept | Codex-oriented equivalent | Notes |
| --- | --- | --- |
| `/paul:init` | project bootstrap or brief initializer | Use for project brief, state root, and local instructions bootstrap. |
| `/paul:plan` | `$plan` | Add objective, acceptance criteria, boundaries, task verify steps. |
| `/paul:apply` | `$execute` | Keep task-by-task execution with status recording. |
| `/paul:unify` | `$verify` plus reconcile step | `verify` should include summary, plan-vs-actual, and deferred issues. |
| `/paul:progress` | `status` or next-action helper | Surface exactly one recommended next step when possible. |
| `/paul:pause` and `/paul:handoff` | handoff generator | Use for long-running sessions and interrupted work. |
| `/paul:resume` | resume helper | Read state and handoff artifacts before continuing. |
| `/paul:flows` | skill requirements registry | Track required workflows per project or work type. |
| `/paul:verify` | acceptance test helper | Separate from unit test execution; useful for UAT-oriented checks. |

The important part is not exact naming. The important part is preserving the
loop semantics.

## AGENTS.md Implications

`PAUL` strongly suggests that the future repo `AGENTS.md` should include rules
like these.

### Planning rules

- Large or multi-file work should not start without an explicit approved plan.
- Plans should include objective, acceptance criteria, task list, and
  boundaries.
- A task is not ready if it cannot state files, action, verify, and done.

### Execution rules

- Execute one task at a time unless the work is explicitly parallelized.
- After each task, compare the outcome against the task spec before moving on.
- If a task fails, classify the failure as intent, spec, or code before
  patching.

### Completion rules

- Non-trivial work must end with a reconcile step.
- Reconcile means plan vs actual, verification evidence, decisions made, and
  deferred issues.
- If verification was not run, the summary must say so clearly.

### Subagent rules

- Use subagents primarily for discovery, research, and isolated sidecar work.
- Keep core implementation in the main session unless there is a clear write
  boundary and merge strategy.

These are good `AGENTS.md` rules because they are behavioral, not host-specific.

## Initial Skill Set Implications

`PAUL` supports a smaller and stronger initial skill set than a broad command
catalog.

Recommended initial set:

### 1. `clarify`

Responsibilities:

- tighten the request
- capture acceptance criteria
- identify unknowns, constraints, and boundaries

This skill should output a compact brief that later planning can consume.

### 2. `plan`

Responsibilities:

- produce an executable plan
- choose the right ceremony level
- structure each task with files, action, verify, and done
- name explicit boundaries

This is where the strongest direct reuse from `PAUL` should land.

### 3. `execute`

Responsibilities:

- walk the plan task by task
- capture task status
- stop and escalate cleanly when context or scope is missing

This should preserve `DONE`, `DONE_WITH_CONCERNS`, `NEEDS_CONTEXT`, and
`BLOCKED`, or a close equivalent.

### 4. `verify`

Responsibilities:

- collect verification evidence
- compare plan vs actual
- log deferred issues
- produce a completion summary

This should absorb the meaning of `UNIFY`, even if the user-facing name remains
`verify`.

### 5. `resume` or `status` helper

This can stay optional in v1, but it is a strong early candidate.

Responsibilities:

- read current state files
- show loop position
- recommend one next action

The point is to reduce restart friction after interruptions.

## Custom Toolkit Scaffold Implications

`PAUL` changes the scaffold requirements in four places.

### 1. State layout must support reconciliation

The existing custom toolkit concept already had a state directory. `PAUL`
implies that the state model should be a little more opinionated.

Recommended v1 state root:

- `.yourtool/project.md`
- `.yourtool/state.md`
- `.yourtool/plans/`
- `.yourtool/runs/`
- `.yourtool/summaries/`
- `.yourtool/handoffs/`

Suggested roles:

- `project.md`
  - stable project brief and durable constraints
- `state.md`
  - active run, loop position, blockers, and next action
- `plans/`
  - draft and approved plans
- `runs/`
  - task statuses and execution metadata
- `summaries/`
  - closed-loop outputs
- `handoffs/`
  - interruption and resume artifacts

### 2. Plans need stronger structure

The toolkit does not need `PAUL`'s exact XML-like task syntax, but it does need
the same information density.

Each plan should carry:

- objective
- acceptance criteria
- boundaries
- tasks with files, action, verify, done

That is enough to drive both human review and agent execution.

### 3. Verify must include reconcile

The custom toolkit should avoid a weak "verify means tests only" definition.

For this repository, `verify` should mean:

- tests and checks that were run
- task-by-task completion state
- plan vs actual comparison
- decisions made during execution
- deferred issues or risks

This is the main lesson from `PAUL`.

### 4. Progress should recommend one next action

If the toolkit later adds a `status` command, it should not dump state without
guidance. It should prefer:

- current loop position
- active blocker if any
- one recommended next action

This keeps the system useful during interruptions, not only during ideal linear
execution.

## Suggested Defaults For This Repository

If this repository starts implementing a Codex-oriented toolkit soon, these are
the defaults that should be lifted from `PAUL`.

### Default 1: Closure is mandatory for non-trivial work

Any run that required a plan should also require a summary or reconcile step.

### Default 2: Acceptance criteria are part of planning, not an afterthought

If the plan cannot say what success looks like, the work is not ready.

### Default 3: Verification is attached to each task

Task verification is more robust than one big end-of-run check.

### Default 4: State must survive across sessions

Chat memory is not a durable operational model.

### Default 5: Interruptions are normal

The system should expect pause, resume, handoff, and inserted work instead of
pretending every run will finish in one session.

## What Not To Adopt Blindly

Some parts of `PAUL` should remain reference material only.

- Do not copy the entire slash-command catalog.
- Do not copy `.paul/` naming unless there is a strong reason.
- Do not require XML-like plan syntax if a simpler representation works.
- Do not convert Codex into a Claude clone just to preserve fidelity.
- Do not over-apply the anti-subagent stance where Codex subagents are actually
  useful and bounded.

The right approach is selective adoption.

## Immediate Follow-On Work Enabled By These Notes

This document set is now sufficient to drive three concrete next steps.

### 1. Repo `AGENTS.md`

Use `PAUL` to add:

- plan-before-execute rules
- task verification rules
- reconcile-before-complete rules
- subagent usage boundaries

### 2. Initial skill set

Use `PAUL` to harden:

- `clarify`
- `plan`
- `execute`
- `verify`
- optional `resume`

### 3. Custom toolkit scaffold

Use `PAUL` to harden:

- state file layout
- run-summary generation
- progress helper behavior
- verify-as-reconcile semantics

## Bottom Line

For this repository, `PAUL` should be treated as the clearest source of
governance patterns discovered so far.

`Superpowers` still provides the better workflow discipline baseline.
`oh-my-codex` still provides the better runtime baseline.
`PAUL` is what turns those pieces into a closed loop that can survive real,
interrupted, multi-session work.
