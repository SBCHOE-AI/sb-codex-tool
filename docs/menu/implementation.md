# Implementation Menu

## Purpose

This menu is the entrypoint for implementation and verification work on
`sb-codex-tool`.

These documents are not research notes. They are implementation contracts.
They define what must exist, how it should behave, and how a fresh verification
agent should judge completion.

## Scope

This document set covers the v1 general-purpose core only.

It explicitly excludes:

- Unity-specific behavior
- `gstack`-style browser, release, or canary utilities
- large role catalogs
- hidden host-specific automation

## Reading Order

### Implementing Agent

Read in this order before writing code:

1. [core-contract.md](/Users/seongbok/Workspace/MakeFramework/docs/implementation/core-contract.md)
2. [state-contract.md](/Users/seongbok/Workspace/MakeFramework/docs/implementation/state-contract.md)
3. [agent-operations-contract.md](/Users/seongbok/Workspace/MakeFramework/docs/implementation/agent-operations-contract.md)
4. [work-journal-contract.md](/Users/seongbok/Workspace/MakeFramework/docs/implementation/work-journal-contract.md)
5. [roadmap.md](/Users/seongbok/Workspace/MakeFramework/docs/implementation/roadmap.md)
6. [verification-contract.md](/Users/seongbok/Workspace/MakeFramework/docs/implementation/verification-contract.md)
7. [acceptance-checklist.md](/Users/seongbok/Workspace/MakeFramework/docs/implementation/acceptance-checklist.md)

### Fresh Verification Agent

Read in this order before judging completion:

1. [implementation.md](/Users/seongbok/Workspace/MakeFramework/docs/menu/implementation.md)
2. [verification-contract.md](/Users/seongbok/Workspace/MakeFramework/docs/implementation/verification-contract.md)
3. [acceptance-checklist.md](/Users/seongbok/Workspace/MakeFramework/docs/implementation/acceptance-checklist.md)
4. [core-contract.md](/Users/seongbok/Workspace/MakeFramework/docs/implementation/core-contract.md)
5. [state-contract.md](/Users/seongbok/Workspace/MakeFramework/docs/implementation/state-contract.md)
6. [agent-operations-contract.md](/Users/seongbok/Workspace/MakeFramework/docs/implementation/agent-operations-contract.md)
7. [work-journal-contract.md](/Users/seongbok/Workspace/MakeFramework/docs/implementation/work-journal-contract.md)

## Document Roles

### Core Contract

Defines the product boundary, canonical workflow, command surface, and quality
rules.

### State Contract

Defines the required `.sb-codex-tool/` layout, hot-path files, and update
requirements for agent continuity.

### Agent Operations Contract

Defines main-agent, subagent, verification-agent, and consistency-agent rules.

### Work Journal Contract

Defines the human-readable journal that must be written after verified work is
completed.

### Roadmap

Defines the phased implementation order and what counts as phase completion.

### Verification Contract

Defines how a fresh verification agent inspects the implementation and when it
must fail it.

### Acceptance Checklist

Defines the condensed pass/fail list derived from the contracts.

## Precedence

If documents appear to conflict, use this order:

1. `verification-contract.md`
2. `core-contract.md`
3. `state-contract.md`
4. `agent-operations-contract.md`
5. `work-journal-contract.md`
6. `roadmap.md`
7. `acceptance-checklist.md`

The checklist is derived from the contracts. It does not override them.

## Verification Principle

Implementation is not complete because code exists.

Implementation is complete only when a fresh verification agent can:

- read the contract documents
- inspect the generated files and behavior
- confirm the workflow and state model match the contracts
- verify that handoff and next-agent guidance are sufficient

## Current Assumptions

- package name: `sb-codex-tool`
- runtime and packaging: `Node/npm`
- canonical workflow:
  - `$clarify`
  - `$plan`
  - `$execute`
  - `$refactor`
  - `$verify`
- final verification must always be done by a fresh agent
- user-facing progress updates from the main agent must be in Korean
