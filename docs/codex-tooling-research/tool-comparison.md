# Tool Comparison: Superpowers vs gstack vs oh-my-codex

## Purpose

This document compares `Superpowers`, `gstack`, and `oh-my-codex` specifically
as Codex-adjacent workflow systems.

The comparison focuses on five questions:

1. What layer does each tool primarily improve?
2. Where is each tool strongest?
3. Where does each tool create operational complexity?
4. Where do the tools overlap or conflict?
5. How can they be combined without producing workflow ambiguity?

## Short Take

- `Superpowers` is the strongest default workflow discipline layer.
- `oh-my-codex` is the strongest runtime/orchestration layer.
- `gstack` is the strongest specialized utility pack.

This is the most important conclusion in the whole comparison. If these tools
are evaluated as if they all solve the same problem, the result is confusion.
They solve adjacent but different problems.

## Evaluation Criteria

Each tool is evaluated along these dimensions:

- session bootstrapping
- workflow discipline
- planning quality
- execution quality
- verification rigor
- parallel-work support
- state persistence
- browser or live-app interaction
- release and operational utilities
- Codex fit
- collision risk with other packs

## Tool Profiles

### Superpowers

#### Core identity

`Superpowers` is a Codex-compatible workflow framework built around a strong
engineering process:

- clarify intent before coding
- plan work in detail
- prefer TDD
- review against the plan
- verify before completion
- use worktrees and subagents intentionally

#### Primary strengths

- Strongest overall engineering discipline of the three.
- Very good at preventing immediate implementation without enough thought.
- Strong test-first and verification-first posture.
- Well aligned with Codex's native skill discovery model.
- Good default choice when correctness and process quality matter more than
  runtime theatrics.

#### Primary weaknesses

- Less differentiated in browser or live-system tooling.
- Does not provide a strong wrapper/runtime identity of its own.
- Can feel heavy if the user only wants lightweight workflow support.
- Large skill surface can still be more than many users need.

#### Best fit

- general software projects
- backend and API work
- CLI and library work
- codebases where TDD and completion evidence matter
- teams that want a predictable default development method

#### Poor fit

- use cases where the main value is browser automation
- users who want a wrapper/runtime more than a process

### gstack

#### Core identity

`gstack` is an expansive software-factory toolkit with a wide skill surface and
a strong browser/QA subsystem.

It includes:

- browser-driven QA
- performance benchmarking
- canary monitoring
- security review
- design review
- release workflow utilities
- broader planning and review skills

#### Primary strengths

- Strongest live-browser and web-surface capability.
- Strongest real-world QA surface among the three.
- Strong release and post-release utilities.
- Broadest set of practical, operationally useful specialized commands.
- The persistent browser daemon is a real technical differentiator.

#### Primary weaknesses

- Most likely to overlap heavily with other workflow systems.
- Broad surface area increases configuration and adoption complexity.
- Not all of its strengths matter outside web-product contexts.
- Some safety and host-specific behavior degrades outside Claude-centered
  assumptions.

#### Best fit

- web applications
- staging/production validation
- teams that want browser-driven QA inside the agent workflow
- release-heavy workflows
- projects with real user-facing web surfaces

#### Poor fit

- projects where browser interaction is peripheral
- environments that already have a strong workflow owner
- teams that want a small surface area

### oh-my-codex

#### Core identity

`oh-my-codex` is a Codex runtime layer and orchestration system.

Its center of gravity is not just skills. It is:

- a launcher/wrapper
- state stored in `.omx/`
- strong session defaults
- role and runtime orchestration
- coordinated multi-agent execution

#### Primary strengths

- Strong runtime identity.
- Clear canonical workflow from clarify to plan to persistent execution.
- Strong support for long-running and parallelized work.
- Better than the others at framing Codex as a durable operating environment.
- Good for users who want a stronger shell around Codex, not just extra skills.

#### Primary weaknesses

- Strong opinions at the runtime layer mean stronger collision with other packs.
- Broader role catalog and runtime system can become heavy quickly.
- Workflow overlap with `Superpowers` is substantial.
- Can dominate the environment instead of complementing it.

#### Best fit

- users who want a Codex wrapper
- long-running development sessions
- multi-agent orchestration
- users who want stored plans, logs, and state as first-class concerns

#### Poor fit

- minimalists who only want a small skill pack
- environments that already have a preferred launcher/runtime wrapper

## Layer Comparison

| Layer | Superpowers | gstack | oh-my-codex |
| --- | --- | --- | --- |
| Session launcher | Light | Light-to-medium | Strong |
| Workflow owner | Strong | Strong but broad | Strong |
| Parallel orchestration | Medium | Medium | Strong |
| State persistence | Medium | Medium | Strong |
| Browser/live QA | Weak | Strong | Weak-to-medium |
| Release utilities | Weak-to-medium | Strong | Weak |
| Security review surface | Medium | Strong | Medium |
| TDD discipline | Strong | Weak-to-medium | Medium |
| Codex-native simplicity | Strong | Medium | Medium |
| Risk of overlapping with other packs | Medium | High | High |

## Where They Overlap

### Superpowers vs gstack

Overlaps:

- planning
- review
- implementation workflow
- finish/ship readiness

Main problem:

If both are allowed to own the default workflow, the user gets two competing
systems for the same stages.

Recommendation:

- let `Superpowers` own default workflow
- let `gstack` own specialized browser/QA/perf/security tasks only

### Superpowers vs oh-my-codex

Overlaps:

- clarify and planning surfaces
- execution orchestration
- review and verification expectations

Main problem:

`oh-my-codex` wants to be both launcher and workflow system. `Superpowers`
wants to be the workflow system. This is the deepest conceptual collision in
the set.

Recommendation:

- keep `oh-my-codex` as runtime owner only
- keep `Superpowers` as workflow owner only
- avoid using `oh-my-codex` canonical workflow commands as the default path if
  `Superpowers` is installed

### gstack vs oh-my-codex

Overlaps:

- wide operational surfaces
- broader system ownership instincts
- workflow and orchestration ambitions

Main problem:

Both can try to become the dominant way the user works, even though they are
better at different things.

Recommendation:

- keep `oh-my-codex` as runtime shell
- keep `gstack` as optional specialized utility pack

## Collision Points

### 1. Plan ownership

These surfaces overlap conceptually:

- `Superpowers` brainstorming and writing-plans
- `oh-my-codex` `$deep-interview` and `$ralplan`
- `gstack` `/office-hours`, `/plan-ceo-review`, `/plan-eng-review`, `/autoplan`

Only one system should own the default planning path.

### 2. Execution ownership

These surfaces overlap conceptually:

- `Superpowers` executing-plans and subagent-driven-development
- `oh-my-codex` `$team`, `$ralph`, `$autopilot`, `$ultrawork`
- `gstack` execution-adjacent sprint and team-factory framing

Only one system should own default implementation flow.

### 3. Review ownership

These surfaces overlap conceptually:

- `Superpowers` requesting-code-review and receiving-code-review
- `oh-my-codex` `$code-review`, `$review`, reviewer agents
- `gstack` `/review`, `/codex`, `/cso`, `/ship`

Only one system should own the default code-review gate.

### 4. Finish or ship ownership

These surfaces overlap conceptually:

- `Superpowers` finishing-a-development-branch
- `gstack` `/ship`, `/land-and-deploy`
- `oh-my-codex` runtime-driven persistent completion patterns

Only one system should own completion or release gating by default.

## Recommended Ownership Model

If using all three in one environment:

- `oh-my-codex` owns runtime boot and long-lived orchestration
- `Superpowers` owns default workflow
- `gstack` owns specialized web-facing utilities

If using two:

### Superpowers + gstack

Use this when:

- browser QA matters
- you do not need a special runtime wrapper

Ownership:

- `Superpowers` = workflow owner
- `gstack` = web utility pack

### Superpowers + oh-my-codex

Use this when:

- you want a stronger Codex runtime
- browser tooling is not the primary requirement

Ownership:

- `oh-my-codex` = runtime owner
- `Superpowers` = workflow owner

### gstack + oh-my-codex

Use this only when:

- browser and runtime orchestration are both critical
- you are intentionally not adopting `Superpowers`

Ownership:

- `oh-my-codex` = runtime owner
- `gstack` = workflow plus specialized utilities

This is viable, but the user must consciously accept `gstack` as the workflow
authority.

## Best Single-Tool Choice by Goal

If the user wants:

### Best general engineering discipline

Choose `Superpowers`.

### Best browser and real QA capability

Choose `gstack`.

### Best Codex wrapper and long-running orchestration

Choose `oh-my-codex`.

## Fit for a Custom Toolkit

The best source pair for a custom Codex toolkit is:

- `Superpowers`
- `oh-my-codex`

Why:

- `Superpowers` contributes the workflow method.
- `oh-my-codex` contributes the runtime and orchestration sensibility.

`gstack` should be treated as a source of optional specialized ideas, not as a
core product model, unless the new toolkit is specifically targeting web QA and
browser-intensive workflows.

## Design Borrowing Guidance

### Borrow from Superpowers

- clarify-before-code
- detailed implementation plans
- verification-before-completion
- TDD pressure
- worktree and subagent discipline

### Borrow from oh-my-codex

- launcher or wrapper entrypoint
- persistent state layout
- orchestration mindset
- durable run tracking
- stronger session defaults

### Borrow cautiously from gstack

- real browser tooling concepts
- live QA loop structure
- perf and canary command concepts
- practical operational utilities

Avoid making those part of the core unless the target audience is explicitly
web-product heavy.

## Operational Complexity Ranking

From lowest to highest likely complexity:

1. `Superpowers`
2. `oh-my-codex`
3. `gstack`

That ranking is not a quality judgment. It is a statement about adoption cost
and collision surface.

## Final Recommendation

Use this decision rule:

- choose `Superpowers` if you want a disciplined default Codex workflow
- add `oh-my-codex` if you also want a stronger runtime shell and persistent
  orchestration
- add `gstack` only if you have a concrete need for browser-based QA or other
  specialized operational utilities

Do not begin by installing everything and hoping the overlap will sort itself
out. Start by assigning ownership by layer.

## Source Links

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
