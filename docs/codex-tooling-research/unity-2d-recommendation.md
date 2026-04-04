# Unity 2D Recommendation

## Purpose

This document adapts the general tool comparison to a Unity 2D game project.

A Unity 2D game is not a web app. That changes which toolkit strengths matter
most, which ones are optional, and how multiple systems should be combined.

## Why Unity Changes the Answer

The central problems in a Unity 2D project are usually:

- gameplay loop design
- state transitions
- input handling
- animation trigger timing
- prefab and scene coupling
- serializable state boundaries
- testability of game rules
- keeping logic out of Unity-specific glue where possible

The dominant risks are not browser blind spots. They are:

- tangled MonoBehaviour dependencies
- fragile scene wiring
- hidden prefab regressions
- state explosion
- hard-to-test gameplay logic
- asset merge conflicts

That means the most valuable tool behaviors are:

- strong planning
- strong execution discipline
- strong verification
- careful parallelization

Browser automation is still useful, but it is not the primary bottleneck for
most Unity 2D projects.

## Recommended Ownership Model

For a Unity 2D project:

- `Superpowers` owns the default workflow
- `oh-my-codex` owns runtime/orchestration
- `gstack` remains optional and specialized

This is a stronger recommendation here than it was in the general comparison.

## Tool Roles in a Unity 2D Project

### Superpowers

Use `Superpowers` as the default owner for:

- requirements clarification
- design and planning
- implementation sequencing
- test-first or verification-first discipline
- code review
- completion checks

This is the tool most aligned with the work Unity projects need every day:

- designing state machines
- planning scene transitions
- splitting domain logic from Unity bindings
- locking down acceptance criteria
- preventing implementation drift

### oh-my-codex

Use `oh-my-codex` for:

- stronger session bootstrapping
- persistent runtime defaults
- long-running task ownership
- coordinated parallel execution
- durable state around plans and runs

This is useful when Unity work grows past a single short session or when a task
can be decomposed into independent lanes.

### gstack

Use `gstack` only when it solves a real Unity-adjacent problem, such as:

- WebGL build validation in a browser
- checking a launch page, docs page, account portal, or leaderboard site
- performance or canary-style checks on web-facing companion surfaces
- security review for backend or web services that support the game

Do not use `gstack` as the default workflow owner for Unity gameplay work.

## Recommended Workflow

### Default path

1. Start the Codex environment via `oh-my-codex` if runtime orchestration is
   desired.
2. Use `Superpowers` to clarify the feature and write the plan.
3. Split the work into gameplay rules, Unity adapters, scene or prefab wiring,
   and verification.
4. Implement with `Superpowers` discipline.
5. Use `oh-my-codex` runtime features only when the task is large enough to
   justify coordinated parallel work.
6. Use `gstack` only when the task crosses into a browser-facing surface.

### Default rule

Gameplay and gameplay-adjacent work should stay on the
`Superpowers + oh-my-codex` path.

`gstack` should be an exception, not the default route.

## How to Structure Unity Work for Agents

The best way to make AI assistance work in Unity is to separate concerns.

### Separate pure game rules from Unity glue

Aim for:

- pure C# core logic where possible
- Unity-specific adapters around the core
- scene and prefab wiring treated as a separate integration layer

This gives the agent clear surfaces:

- logic that can be reasoned about and tested
- bindings that can be inspected and verified
- wiring that can be checked as an integration concern

### Define explicit state transitions

For any gameplay feature, the planning phase should define:

- input states
- active states
- exit conditions
- failure states
- effects triggered on entry and exit

This is where `Superpowers` is most useful.

### Keep asset write scopes narrow

Unity asset files have higher merge and regression risk than plain code.

Treat these as high-risk write scopes:

- `.unity`
- `.prefab`
- `.asset`
- animation controller assets
- input asset files

Parallel agents should not edit the same high-risk asset scope without a single
clear owner.

## Recommended Lane Split for Large Tasks

When using `oh-my-codex` for larger work, split by responsibility.

Recommended lanes:

- lane 1: core gameplay logic
- lane 2: Unity adapter layer
- lane 3: tests and verification
- lane 4: scene, prefab, and integration impact analysis

Optional lane:

- lane 5: documentation or implementation notes

Do not split by random file chunks. Split by responsibility and write scope.

## Task-by-Task Guidance

### Player movement, jump, dash, wall interactions

Primary owner:

- `Superpowers`

Parallel support:

- `oh-my-codex` only if the system is being refactored across multiple
  interacting mechanics

`gstack`:

- not needed

Why:

This is state machine and game-feel work. The important questions are
acceptance criteria, edge cases, and testable rules, not browser automation.

### Combat systems and enemy AI

Primary owner:

- `Superpowers`

Parallel support:

- `oh-my-codex` when combat, targeting, hit reactions, and AI states can be
  cleanly separated

`gstack`:

- not needed

Why:

Combat work benefits from structured planning and explicit verification of
states and transitions.

### Inventory, quests, save/load, progression

Primary owner:

- `Superpowers`

Parallel support:

- `oh-my-codex` for large data-model or persistence work

`gstack`:

- usually not needed

Why:

These systems are best treated as domain-logic-heavy features with strong test
surfaces.

### UI, menus, HUD, onboarding

Primary owner:

- `Superpowers`

Parallel support:

- `oh-my-codex` when the feature spans multiple UI screens or onboarding flows

`gstack`:

- only if the target is WebGL or an external browser-based companion surface

Why:

Unity UI problems are still mostly prefab, layout, event, and scene problems,
not web QA problems.

### Scene or prefab refactors

Primary owner:

- `Superpowers`

Parallel support:

- `oh-my-codex` for read-heavy exploration or clean ownership-based refactors

`gstack`:

- not needed

Why:

These are structural Unity concerns with high merge risk and low browser value.

### WebGL validation

Primary owner:

- `Superpowers` for feature implementation

Specialized utility:

- `gstack` for browser-level validation once the WebGL build exists

Why:

This is the clearest Unity use case for `gstack`. Once the game is running in a
browser, browser-based QA becomes relevant again.

## Verification Model for Unity

The completion standard for Unity work should include evidence. A feature is
not done because it compiles.

### Minimum verification surfaces

- compile or build sanity
- targeted EditMode tests where appropriate
- targeted PlayMode tests where appropriate
- scenario-based state verification
- null-reference or missing-reference checks in touched systems

### For gameplay features

Report:

- the expected player behavior
- the state transitions tested
- whether the change was verified via tests, manual play steps, or both

### For scene or prefab changes

Report:

- which scenes or prefabs were touched
- whether there are any known missing references
- whether the touched assets were exercised in a meaningful scenario

### For WebGL or external web surfaces

Add:

- browser validation using `gstack` if available

## What Not to Do

Do not:

- let `gstack` own the default planning flow
- let multiple systems own default review behavior
- parallelize the same prefab or scene across multiple writers
- assume gameplay correctness because the scene loads
- mix runtime ownership and workflow ownership without declaring the boundary

## Suggested Operating Rules

If all three toolkits exist in a Unity project, write these rules into project
documentation:

- `Superpowers` is the default workflow owner
- `oh-my-codex` is the runtime and parallel execution owner
- `gstack` is only for web-facing validation, perf, canary, or supporting web
  utilities
- `.unity`, `.prefab`, and critical `.asset` files must have one active writer
- large features must separate game rules from Unity glue before execution
- completion reports must include explicit verification evidence

## Final Recommendation

For Unity 2D, the right bias is:

- invest heavily in `Superpowers`
- use `oh-my-codex` when the runtime and task size justify it
- add `gstack` only where browser or web-surface tooling is clearly relevant

If only two are used, prefer:

- `Superpowers + oh-my-codex`

If only one is used, prefer:

- `Superpowers`

## Source Links

- [Superpowers README](https://github.com/obra/superpowers)
- [oh-my-codex README](https://github.com/Yeachan-Heo/oh-my-codex)
- [gstack README](https://github.com/garrytan/gstack)
- [gstack Architecture](https://github.com/garrytan/gstack/blob/main/ARCHITECTURE.md)
