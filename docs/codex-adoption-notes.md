# Codex Adoption Notes

## Purpose

This document translates Boris Cherny's 13 Claude Code operating tips into a
Codex-specific operating model.

The goal is not to copy Claude-specific mechanics. The goal is to map the
underlying habits to first-class Codex features and define a practical rollout
order for later implementation.

This file is intended to be the reference document for creating:

- a global `~/.codex/AGENTS.md`
- a repo-local `AGENTS.md`
- initial Codex skills
- narrow approval rules
- a repeatable validation loop
- a parallel-work policy for larger tasks

## Current Baseline

Current local observations from this machine:

- Codex CLI is installed and available as `codex`.
- Installed version is `codex-cli 0.118.0`.
- Local config already uses `gpt-5.4` with `xhigh` reasoning.
- GitHub plugin is enabled.
- No global `~/.codex/AGENTS.md` exists yet.
- No repo-local `AGENTS.md` exists yet.
- No custom MCP servers are configured yet.
- No repo files existed when this document was created.

Operational implication:

- model selection is already in a good state
- the biggest gains will come from process, not model changes
- documentation, repeatable skills, and validation policy should be added before
  advanced automation

## Source Summary

The upstream reference is Boris Cherny's thread about how he uses Claude Code.
The exact UI and product mechanics differ, but the underlying ideas are:

1. Use multiple sessions in parallel.
2. Use multiple form factors when helpful.
3. Default to a strong model with more thinking.
4. Keep a shared project instruction file.
5. Feed recurring review feedback back into the system.
6. Start larger work with planning.
7. Compress repeated prompts into reusable commands.
8. Use subagents for bounded side work.
9. Automate post-action cleanup and checks.
10. Pre-approve safe actions to reduce friction.
11. Connect external tools and context sources.
12. Support long-running or repeatable workflows.
13. Always close the loop with verification.

## Codex Mapping

| Boris idea | Codex equivalent | Adoption status |
| --- | --- | --- |
| Shared `CLAUDE.md` | `AGENTS.md` | Adopt now |
| Repeated slash commands | Skills | Adopt now |
| Parallel Claude sessions | Multiple Codex sessions, worktrees, subagents | Adopt now |
| Strong model + long thinking | Current `gpt-5.4` + `xhigh` config | Keep as-is |
| Review comments -> system memory | Update `AGENTS.md` and skills from reviews | Adopt now |
| Plan mode first | Start complex work with explicit planning | Adopt now |
| PostToolUse hooks | Codex hooks | Conditional |
| Pre-allow safe permissions | Narrow Codex rules / approval optimization | Adopt now, conservatively |
| Tool integrations | MCP servers, plugins, GitHub app | Conditional |
| Long-running workflows | Codex app automation or scheduled workflows | Conditional |
| Multi-device workflow | No direct operating rule needed | Low priority |
| Verification loop | Standard validation commands in docs and skills | Adopt now |

## Decision Summary

### Apply Immediately

- `AGENTS.md` as the main instruction surface
- reusable skills for repeated workflows
- explicit validation requirements
- review-feedback-to-rules loop
- planning before large or risky changes
- parallel-work policy for larger tasks
- narrow permission optimization for safe commands

### Apply Conditionally

- MCP integrations
- hooks
- automations
- dedicated worktree-heavy flows

### Keep Current State

- use of a strong base model and high reasoning

### Low Priority or Reinterpret

- "multiple devices" is not a process requirement on its own
- the useful principle is continuity and availability, not device usage itself

## Why These Items Matter Most

Codex is already capable enough on the model side. The main failure modes are
operational:

- repeated instructions are lost across sessions
- agents finish after editing without enough verification
- recurring review feedback does not get encoded into workflow
- large tasks are done serially even when they can be decomposed
- permission friction remains high because safe repetitive commands are not
  standardized

The highest-return changes therefore are process primitives:

- durable instructions
- durable workflows
- durable verification

Everything else should support those three.

## Detailed Adoption Plan

### 1. Establish `AGENTS.md` as the Primary Instruction Layer

#### Intent

Create a stable instruction layer that survives across sessions and reduces the
need to repeat operational rules in prompts.

#### Operating Model

Use two layers:

- global `~/.codex/AGENTS.md` for personal defaults
- repo-local `AGENTS.md` for project-specific rules

#### Global `AGENTS.md` Should Contain

- default working style
- safety constraints
- preferred command-line tools
- expectations for validation before completion
- escalation rules for risky commands
- personal conventions for summarizing changes

#### Repo `AGENTS.md` Should Contain

- required checks after edits
- branch and PR expectations
- test command hierarchy
- domain-specific correctness rules
- prohibited commands or risky shortcuts
- file locations that must be read before certain changes

#### Authoring Rules

- keep rules short and imperative
- add only rules that prevent repeated mistakes
- prefer concrete commands over abstract advice
- avoid style-guide duplication unless it prevents bugs
- record behaviors, not personal commentary

#### Example Topics to Include Later

- "Run targeted tests for touched modules before reporting completion."
- "Do not edit generated files unless the task explicitly requires regeneration."
- "Read API schema and fixtures before changing request validation."
- "If tests fail, report the failing command and whether the failure is new or
  pre-existing."

#### Anti-Patterns

- long essays
- duplicated architecture docs
- vague norms such as "be careful" or "write good code"
- adding every review comment verbatim

### 2. Convert Repeated Prompts into Skills

#### Intent

Take workflows that are repeatedly explained in chat and convert them into
named, reusable operating units.

#### Selection Rule

A workflow becomes a skill when at least one of the following is true:

- the prompt is explained repeatedly
- the workflow has multiple steps and a stable output format
- the workflow benefits from scripts or templates
- different sessions should execute it consistently

#### First Skill Candidates

- address PR review comments
- investigate CI failures
- produce release-note drafts
- triage a bug report into repro / likely cause / next steps

#### Each Skill Should Define

- when to use it
- required inputs
- exact sequence of actions
- expected output structure
- validation or completion criteria

#### Skill Design Rules

- keep each skill narrow
- prefer task-oriented names
- encode output format explicitly
- include scripts only when they materially reduce effort
- avoid one mega-skill with many unrelated branches

#### Example Skill Boundaries

- `gh-address-comments` handles review-thread triage and fixes
- `gh-fix-ci` handles failing checks and log inspection
- a future `release-notes` skill should only gather and summarize changes, not
  publish a release

### 3. Make Planning a Default Step for Complex Work

#### Intent

Prevent premature implementation on tasks that have unclear success criteria,
cross-cutting impact, or meaningful tradeoffs.

#### When Planning Is Required

- changes affect multiple subsystems
- the request changes behavior, not just implementation
- the task has migration or compatibility implications
- the work requires multiple sessions or multiple agents
- acceptance criteria are ambiguous

#### Practical Rule

Use an explicit planning pass before implementation when the task is expected to
take more than a short, single-file change.

The plan should lock:

- goal and success criteria
- major approach
- constraints
- test strategy
- decomposition for parallel work if needed

#### Anti-Patterns

- planning every tiny change
- implementing before the interface and validation path are clear
- treating planning as prose without decisions

### 4. Standardize the Validation Loop

#### Intent

Shift Codex from "edit generator" to "change plus evidence" workflow.

#### Core Principle

No task should be considered complete after code edits alone. Completion must
include validation appropriate to the size and risk of the change.

#### Validation Levels

##### Level 1: Small, Local Change

- run targeted tests for the touched area
- run lint or typecheck if relevant to the touched files

##### Level 2: Medium Change

- run the module or package test suite
- run lint and typecheck
- run build if UI or packaging can break

##### Level 3: Large or Cross-Cutting Change

- run broader integration or smoke tests
- run full validation for the changed subsystem
- report any unrun checks and why they were skipped

#### Reporting Standard

After implementation, the agent should report:

- which commands were run
- whether they passed or failed
- whether failures were pre-existing or newly introduced
- any checks that were not run

#### What Goes into `AGENTS.md`

Later, each repo should define:

- minimum validation for any code change
- expanded validation for risky changes
- special checks for release, schema, or migration changes

#### Why This Is High Priority

This is the largest practical quality lever. Without it, strong models still
create hidden operational debt.

### 5. Create a Review-Feedback-to-Rules Loop

#### Intent

Stop paying for the same correction multiple times.

#### Rule

When the same category of issue appears repeatedly in review, encode it into one
of:

- repo `AGENTS.md`
- global `AGENTS.md`
- a skill

#### Prioritization

Document these first:

- bug-causing patterns
- missing validation steps
- unsafe operational shortcuts
- common integration mistakes

Document these later, if ever:

- purely stylistic preferences
- one-off reviewer wording

#### Decision Rule

If similar review feedback appears twice, consider it a candidate for
codification.

#### Compression Rule

Do not paste comments into documents. Convert them into short operational rules.

Example transformation:

- review comment: "You forgot to re-run fixtures after changing the parser."
- durable rule: "After parser changes, regenerate fixtures and compare expected
  outputs before completion."

### 6. Optimize Permissions Conservatively

#### Intent

Reduce approval friction for safe, repetitive commands without widening the risk
surface.

#### Principle

The target is not "approve everything." The target is "eliminate repeated
approval for commands that are both common and low-risk."

#### First-Wave Candidate Commands

- `git status`
- `git diff`
- `rg`
- `pnpm test`
- `pnpm lint`
- `cargo test`
- `gh pr view`

#### What Stays Approval-Gated

- destructive shell commands
- branch rewriting
- deployment commands
- commands with broad write scope
- unreviewed scripts that hit external services

#### Adoption Rule

Only add a rule after confirming the command is:

- frequently used
- operationally safe
- narrow enough to approve by prefix without abuse

#### Anti-Patterns

- broad prefixes such as `python` or unrestricted shell wrappers
- allowing commands simply because they are annoying to re-approve
- approving write-heavy workflows before they are stable

### 7. Parallelize Large Work Intentionally

#### Intent

Use Codex concurrency to reduce cycle time while avoiding merge conflicts and
duplicate reasoning.

#### Available Codex Mechanisms

- multiple interactive sessions
- subagents for sidecar tasks
- separate worktrees when independent implementation is required

#### Default Decomposition

For larger tasks, split work into roles such as:

- exploration
- implementation
- verification
- documentation or PR preparation

#### Rules of Use

- the main session handles blocking decisions and integration
- subagents handle bounded, non-blocking side work
- do not assign overlapping write scopes to parallel implementers
- use worktrees when independent code changes would otherwise collide

#### Good Parallel Tasks

- codebase exploration
- separate test investigation
- reviewing a failing CI path while implementation continues
- drafting documentation while code is being finalized

#### Bad Parallel Tasks

- two agents editing the same module without explicit ownership
- delegating the immediate blocking decision away from the main session
- parallelizing tiny tasks where coordination cost dominates

### 8. Use MCP and Plugins Only When They Remove Repeated Friction

#### Intent

Bring external context closer to the agent only when it removes repeated manual
lookup or enables a stable workflow.

#### Good Early Candidates

- GitHub context beyond local git state
- issue trackers
- error monitoring
- internal docs or runbooks

#### Adoption Criteria

Add an integration only if at least one is true:

- the same lookup happens repeatedly in browser tabs
- a skill would be meaningfully better with direct tool access
- the integration reduces context-switching during debugging or review

#### Order of Adoption

- start with read-only or low-risk integrations
- add write-capable integrations later
- document usage inside skills, not only in tribal knowledge

### 9. Treat Hooks as a Later Optimization

#### Intent

Use hooks to automate repeated checks once the workflow is already stable.

#### Good First Hook Uses

- run formatter or lint checks after edits
- warn when required validation was skipped
- capture simple post-action hygiene signals

#### Recommended Rollout

- begin with informational hooks
- only later consider hooks that mutate files
- avoid hiding important work behind opaque automation

#### Why Not First

Hooks can add invisible complexity. They should reinforce a stable process, not
be used to invent one.

### 10. Treat Automation as a Read-Mostly Workflow First

#### Intent

Use automation for recurring context gathering before using it for autonomous
changes.

#### Good First Automation Targets

- CI summary generation
- issue or PR triage summaries
- scheduled status reports
- routine dependency visibility checks

#### Bad First Automation Targets

- autonomous code changes on a schedule
- broad write access without human review
- workflows that encode unstable project policy

### 11. Keep the Strong Model Default

#### Intent

Avoid downgrading quality to save trivial latency on tasks where correctness
matters more than speed.

#### Current State

The local setup already uses:

- `gpt-5.4`
- `xhigh` reasoning

#### Practical Rule

Keep this as the default. Only choose a lighter path for obviously small,
low-risk tasks.

### 12. Reinterpret the "Multiple Devices" Tip

#### Intent

Extract the real principle without copying a tool-specific habit that may not be
structurally important in Codex.

#### Interpretation

The useful lesson is not "use phone plus desktop." The useful lesson is:

- work should be resumable
- context should be durable
- instructions should not depend on a single session

Codex should satisfy this through:

- durable docs
- skills
- resumable sessions where available

This does not need a dedicated rollout item.

## Recommended Rollout Order

### Phase 1: Durable Operating Instructions

Create:

- global `~/.codex/AGENTS.md`
- repo-local `AGENTS.md`

Goal:

- new sessions follow the same baseline rules without re-prompting

### Phase 2: Validation Standard

Define:

- minimum validation commands
- expanded validation for riskier work
- reporting format for executed checks

Goal:

- "what was verified?" becomes explicit and repeatable

### Phase 3: First Skills

Create two or three high-value skills, likely:

- review-comment handling
- CI failure investigation
- release-note drafting

Goal:

- repeated multi-step tasks no longer require long natural-language prompts

### Phase 4: Narrow Approval Optimization

Add only narrow, proven-safe approval rules.

Goal:

- remove repeated friction from common reads and checks

### Phase 5: Parallel-Work Standard

Define:

- when to use subagents
- when to use extra sessions
- when to use worktrees

Goal:

- large tasks are decomposed intentionally instead of ad hoc

### Phase 6: Conditional Tooling

Adopt only as needed:

- MCP integrations
- hooks
- automations

Goal:

- advanced tooling supports stable workflows instead of preceding them

## Completion Criteria for Future Implementation

The later implementation work should be considered successful when:

- a fresh Codex session can operate with consistent baseline rules
- repeated workflows can be invoked through skills instead of repeated prompting
- completion messages consistently include validation evidence
- recurring review issues are translated into durable operating rules
- safe repetitive commands require less approval friction
- large work can be split across sessions without ownership ambiguity

## Concrete Follow-Up Artifacts

This document is a reference, not the final operating surface. The next concrete
artifacts to create are:

1. `~/.codex/AGENTS.md`
2. repo `AGENTS.md`
3. initial rules for narrow safe-command approval
4. two or three initial skills
5. optional MCP or hook configuration only after the above are stable

## Suggested Initial Contents for Future `AGENTS.md`

### Global `~/.codex/AGENTS.md`

Suggested topics:

- prefer `rg` for search and `rg --files` for file discovery
- avoid destructive git commands unless explicitly requested
- validate changes before concluding work
- summarize actual commands run, not assumptions
- prefer narrow, explainable changes over broad speculative edits

### Repo `AGENTS.md`

Suggested topics:

- canonical test commands
- typecheck and lint commands
- paths that require extra caution
- generated-file policy
- migration or schema-change policy
- reporting format for failed checks

## Risks and Failure Modes

### Risk: Document bloat

If `AGENTS.md` becomes too long, it stops being operationally useful.

Mitigation:

- keep `AGENTS.md` short
- move procedures into skills
- move rationale into docs like this file, not into the instruction layer

### Risk: Skill sprawl

If too many low-value skills are created, discoverability drops.

Mitigation:

- only create skills for repeated, high-friction workflows
- keep names task-specific
- retire or consolidate skills that are rarely used

### Risk: False confidence from automation

Hooks or automation can hide skipped reasoning or skipped validation.

Mitigation:

- start with explicit reporting
- add automation only after the manual process is stable
- avoid silent mutation in early automation

### Risk: Unsafe approval expansion

Broad command approval can increase blast radius.

Mitigation:

- approve narrow prefixes only
- prefer read and validation commands first
- keep destructive and deployment actions gated

### Risk: Parallel conflict

Multiple sessions can create duplicated effort or conflicting edits.

Mitigation:

- define ownership before parallel implementation
- use subagents for bounded side work
- use worktrees for independent implementation branches

## Working Checklist

Use this checklist when turning this reference into actual Codex setup:

- create global `~/.codex/AGENTS.md`
- create repo `AGENTS.md`
- define minimum and expanded validation commands
- define reporting format for checks
- create first two or three skills
- add narrow safe approval rules
- define a simple parallel-work policy
- review whether MCP adds enough value yet
- postpone hooks until the base workflow is stable

## Default Assumptions

Unless a later repo-specific decision overrides them, use these defaults:

- process improvements take priority over more tooling
- strong model + high reasoning remains the default
- validation is mandatory before completion
- approval optimization must remain narrow
- skills should be introduced gradually
- advanced automation is optional and late-stage

## Bottom Line

The Codex version of Boris's advice is not "copy Claude workflows."

It is:

- make instructions durable with `AGENTS.md`
- make repeated work durable with skills
- make quality durable with validation
- make scale manageable with explicit parallelization
- add permissions, tools, and automation only after the base workflow is stable

That is the operating model this repo should use as the reference point for the
next implementation steps.
