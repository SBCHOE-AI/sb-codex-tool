# Codex Tooling Research

## Purpose

This folder captures the research and planning work around four Codex-adjacent
toolkits:

- `Superpowers`
- `gstack`
- `oh-my-codex`
- `PAUL`

The goal of this document set is not just to summarize them. The goal is to
preserve enough structure and reasoning that future implementation work can
start immediately without re-running the research.

This folder should be treated as the staging area for:

- deciding which external ideas are worth adopting
- deciding how to combine multiple toolkits without conflicts
- defining a Unity-specific usage model
- defining a new in-house or public Codex workflow toolkit

## Executive Summary

The research converged on five conclusions.

### 1. The four tools strengthen different layers

- `Superpowers` is primarily a workflow-discipline layer.
- `oh-my-codex` is primarily a runtime/orchestration layer.
- `gstack` is primarily a specialized utility layer.
- `PAUL` is primarily a governance/closure layer.

That means they are not equally interchangeable. The right way to combine them,
or mine them for ideas, is by assigning ownership by layer instead of letting
multiple systems drive the same stage.

### 2. `Superpowers` and `oh-my-codex` are still the best pair for the core custom toolkit

The most reusable combination is:

- `Superpowers` for clarify -> plan -> execute -> verify discipline
- `oh-my-codex` for launcher, session defaults, persistent state, and parallel
  execution ideas

This pair yields a strong Codex-native core without requiring the breadth and
operational complexity of `gstack`.

### 3. `PAUL` adds the strongest closure and reconciliation model

`PAUL` contributes the clearest model for:

- mandatory loop closure
- acceptance-driven execution
- run summaries and state reconciliation
- single-next-action progress guidance
- resume and handoff structure

It is better treated as a source of governance patterns than as a direct
Codex-native install target.

### 4. `gstack` is strong, but should usually be treated as optional

`gstack` brings meaningful value when:

- browser-based QA matters
- live web validation matters
- performance benchmarking matters
- canary checks or security audits matter

For core Codex workflow design, especially outside web-product contexts, it is
usually better treated as a specialized add-on than as the primary operating
system.

### 5. For Unity 2D game development, `gstack` should not be the default owner

In Unity 2D work, the dominant problems are:

- gameplay loop design
- state transitions
- prefab and scene coupling
- testable game-logic extraction
- asset and code boundary management

Those problems align more directly with `Superpowers` and `oh-my-codex`.
`gstack` remains useful for WebGL validation or related external web surfaces,
but it should not own the core workflow.

## Document Map

### [tool-comparison.md](/Users/seongbok/Workspace/MakeFramework/docs/codex-tooling-research/tool-comparison.md)

Detailed comparison of `Superpowers`, `gstack`, and `oh-my-codex`.

Use this when you need to answer:

- what each tool is actually optimized for
- where they overlap
- where they conflict
- how to assign ownership without workflow drift

### [unity-2d-recommendation.md](/Users/seongbok/Workspace/MakeFramework/docs/codex-tooling-research/unity-2d-recommendation.md)

Unity 2D-specific recommendation document.

Use this when you need to answer:

- how to use these toolkits in a game project
- which toolkit should own planning, implementation, and verification
- how to parallelize Unity work without asset collisions

### [custom-toolkit-plan.md](/Users/seongbok/Workspace/MakeFramework/docs/codex-tooling-research/custom-toolkit-plan.md)

Design reference for building a custom Codex toolkit inspired by
`Superpowers` and `oh-my-codex`.

Use this when you need to answer:

- what to borrow
- what to avoid
- what the v1 product shape should be
- how to keep the toolkit smaller and cleaner than its inspirations

### [paul-summary.md](/Users/seongbok/Workspace/MakeFramework/docs/codex-tooling-research/paul-summary.md)

Focused summary of `PAUL` as a structured development framework.

Use this when you need to answer:

- what `PAUL` actually optimizes for
- how the `PLAN -> APPLY -> UNIFY` loop works
- which concepts are worth carrying into Codex artifacts
- which parts are too Claude-specific to port directly

### [paul-integration-notes.md](/Users/seongbok/Workspace/MakeFramework/docs/codex-tooling-research/paul-integration-notes.md)

Integration notes for folding `PAUL` concepts into a Codex-oriented toolkit.

Use this when you need to answer:

- how `PAUL` changes the custom toolkit design
- what to add to `AGENTS.md`
- what the initial skill set should encode
- what state and reconciliation artifacts the scaffold should own

### [implementation-backlog.md](/Users/seongbok/Workspace/MakeFramework/docs/codex-tooling-research/implementation-backlog.md)

Execution-oriented backlog for the custom toolkit.

Use this when you need to answer:

- what to build first
- what each phase needs to ship
- what acceptance criteria should gate the next phase

## Recommended Ownership Model

If all four tools are present in the same Codex environment, the safest model
is:

- `oh-my-codex` owns runtime bootstrapping and long-lived orchestration
- `Superpowers` owns the default engineering workflow
- `gstack` owns specialized browser/QA/perf/security utilities
- `PAUL` contributes closure, reconciliation, and run-governance patterns
  rather than becoming a second workflow owner

This folder does not recommend giving all four full workflow authority at the
same time.

Do not let multiple tools own the same layer by default:

- one runtime owner
- one workflow owner
- one optional specialized utility pack

## Recommended Reading Order

If you are deciding whether to adopt the external tools:

1. Read [tool-comparison.md](/Users/seongbok/Workspace/MakeFramework/docs/codex-tooling-research/tool-comparison.md).
2. If the project is a Unity game, read [unity-2d-recommendation.md](/Users/seongbok/Workspace/MakeFramework/docs/codex-tooling-research/unity-2d-recommendation.md).

If you are planning to build an internal or public Codex toolkit:

1. Read [tool-comparison.md](/Users/seongbok/Workspace/MakeFramework/docs/codex-tooling-research/tool-comparison.md).
2. Read [paul-summary.md](/Users/seongbok/Workspace/MakeFramework/docs/codex-tooling-research/paul-summary.md).
3. Read [paul-integration-notes.md](/Users/seongbok/Workspace/MakeFramework/docs/codex-tooling-research/paul-integration-notes.md).
4. Read [custom-toolkit-plan.md](/Users/seongbok/Workspace/MakeFramework/docs/codex-tooling-research/custom-toolkit-plan.md).
5. Read [implementation-backlog.md](/Users/seongbok/Workspace/MakeFramework/docs/codex-tooling-research/implementation-backlog.md).

## Scope of This Research

This document set is based on publicly available project documentation and the
Codex-specific install or usage notes that were reviewed during the research.

It is intentionally focused on:

- Codex compatibility
- workflow ownership
- operational complexity
- reuse potential for a custom toolkit

It is not a full feature inventory of each project.

## Source Links

Primary sources referenced during research:

- [Superpowers README](https://github.com/obra/superpowers)
- [Superpowers Codex guide](https://github.com/obra/superpowers/blob/main/docs/README.codex.md)
- [Superpowers Codex install](https://github.com/obra/superpowers/blob/main/.codex/INSTALL.md)
- [gstack README](https://github.com/garrytan/gstack)
- [gstack Architecture](https://github.com/garrytan/gstack/blob/main/ARCHITECTURE.md)
- [gstack Skills](https://github.com/garrytan/gstack/blob/main/docs/skills.md)
- [oh-my-codex README](https://github.com/Yeachan-Heo/oh-my-codex)
- [oh-my-codex Getting Started](https://github.com/Yeachan-Heo/oh-my-codex/blob/main/docs/getting-started.html)
- [oh-my-codex Skills](https://github.com/Yeachan-Heo/oh-my-codex/blob/main/docs/skills.html)
- [oh-my-codex Agents](https://github.com/Yeachan-Heo/oh-my-codex/blob/main/docs/agents.html)
- [PAUL README](https://github.com/ChristopherKahler/paul)
- [PAUL vs GSD](https://github.com/ChristopherKahler/paul/blob/main/PAUL-VS-GSD.md)

## Maintenance Note

If these external projects change substantially, update this folder by:

1. refreshing the upstream docs review
2. updating the comparison table in
   [tool-comparison.md](/Users/seongbok/Workspace/MakeFramework/docs/codex-tooling-research/tool-comparison.md)
3. checking whether the custom toolkit assumptions in
   [custom-toolkit-plan.md](/Users/seongbok/Workspace/MakeFramework/docs/codex-tooling-research/custom-toolkit-plan.md)
   still hold
