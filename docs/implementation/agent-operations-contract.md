# Agent Operations Contract

## Purpose

This document defines the required behavior for main-agent orchestration,
subagent lifecycle, fresh verification, and consistency review.

## Required Agent Roles

The v1 implementation must support these roles conceptually:

- main agent
- execution subagent
- verification agent
- code consistency agent

It does not need to hardcode a large role system, but the operating model and
state model must clearly support these roles.

## Main Agent Contract

The main agent is always the orchestration owner.

The main agent must:

- communicate progress to the user in Korean
- communicate progress periodically during longer work
- assign bounded work to subagents when useful
- record or update state when ownership changes
- finalize the human-facing work journal after verification

Main-agent progress updates should include:

- current stage
- recent completion
- next step
- blocker or risk
- active subagent ownership when relevant

## Execution Subagent Contract

Execution subagents are disposable bounded workers.

Each execution subagent must have:

- a task objective
- an allowed file scope
- relevant reference files
- consistency constraints
- verification expectations

Execution subagents must not own final verification.

## Subagent Lifecycle Contract

When a bounded subagent task completes, the system must force one of:

- close and replace
- clear context and reuse for the same narrow role only

Default rule:

- close and replace

Reuse is allowed only when:

- the role is the same
- the file scope remains narrow
- the context does not cross into unrelated work

The following are disallowed:

- reusing a completed subagent for unrelated features
- carrying exploratory context into implementation without reset
- allowing many unrelated responsibilities to accumulate in one subagent

## Fresh Verification Contract

Final verification must always be performed by a fresh agent.

The implementation agent must not self-approve final completion.

The product must support enough handoff structure that the verification agent
can work from the hot path and the relevant changed-file scope.

## Code Consistency Agent Contract

The code consistency agent exists to evaluate:

- structure
- naming
- module boundaries
- reuse quality
- readability
- complexity drift

This agent must read:

- `.sb-codex-tool/guides/code-consistency.md`
- relevant changed-files summary
- related reference files
- latest plan
- latest relevant summary

The consistency agent must not devolve into minor stylistic nitpicking.
Maintainability, predictability, and structural clarity matter more than
cosmetic preferences.

## Assignment Contract

Before the main agent assigns a new bounded task, it must inspect:

- current plan
- current state
- changed-files scope if relevant
- `.sb-codex-tool/guides/code-consistency.md`

Each assignment should specify:

- objective
- allowed file scope
- relevant references
- consistency expectations
- verification expectations

## Required State Visibility

The implementation must make the following visible in state artifacts:

- active main agent
- active subagents
- active assignment guides for those subagents
- current or last verification run reference
- latest consistency review reference
- latest assignment lifecycle reference

The state model does not need hidden orchestration. It needs visible
orchestration.

## Failure Conditions

The implementation fails this contract if:

- the main agent is not clearly distinguishable from worker agents
- Korean progress reporting is missing from the operating contract
- subagent reset-or-replace behavior is absent
- final verification is not fresh-agent-only
- the consistency-agent role is not supported through files and workflow
- new assignments can proceed without referencing the consistency guide
- bounded assignments cannot be explicitly closed, cleared, or replaced
