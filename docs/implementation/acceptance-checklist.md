# Acceptance Checklist

## Purpose

This checklist is the condensed verification sheet for a fresh verification
agent.

If any required item below fails, the verdict cannot be `pass`.

## Core Identity

- [ ] Product identity is `sb-codex-tool`
- [ ] Node/npm packaging assumption is reflected
- [ ] Unity-specific concepts are absent from the core
- [ ] gstack-specific concepts are absent from the core
- [ ] Package metadata is publish-ready enough for `npm pack --dry-run`
- [ ] README exists and documents install, commands, workflow, and packaging checks

## CLI Surface

- [ ] `sb-codex-tool setup` exists
- [ ] `sb-codex-tool` launch wrapper exists
- [ ] `sb-codex-tool doctor` exists
- [ ] `sb-codex-tool status` exists
- [ ] `setup`, `doctor`, and `status` are documented as the default human workflow
- [ ] Documented helper commands exist and match their contracts
- [ ] Helper commands are documented as advanced/manual rather than the default path
- [ ] status can surface latest run details when a lifecycle run exists
- [ ] status can surface active assignment guides and the latest assignment lifecycle
- [ ] status can surface semantic issues when current-state coherence drifts
- [ ] verify-ready handoff and state transition can be automated without manual state edits
- [ ] launch metadata captures preflight state, current cycle references, and exit status

## Workflow Surface

- [ ] `$clarify` exists and has a distinct role
- [ ] `$plan` exists and produces executable plans
- [ ] `$execute` exists and records task progression
- [ ] `$refactor` exists and is distinct from execution
- [ ] `$verify` exists and is distinct from test-only behavior
- [ ] `$verify` is defined as fresh-agent-only

## State Layout

- [ ] `.sb-codex-tool/` exists
- [ ] `project.md` exists
- [ ] `state.md` exists
- [ ] `plans/` exists
- [ ] `runs/` exists
- [ ] `summaries/` exists
- [ ] `handoffs/` exists
- [ ] `guides/` exists
- [ ] `index/` exists or is intentionally documented as unnecessary for the
  current state shape
- [ ] `reviews/` exists
- [ ] `logs/work-journal/` exists
- [ ] `ignore/` exists

## Hot Path

- [ ] Hot-path reading order is documented
- [ ] Hot path does not require broad historical context
- [ ] Next-agent guidance is explicit
- [ ] `guides/read-this-first.md` exists
- [ ] `guides/code-consistency.md` exists

## Agent Operations

- [ ] Main-agent Korean progress reporting rule is documented
- [ ] Main-agent orchestration role is explicit
- [ ] Subagent bounded-task rule is documented
- [ ] Subagent reset-or-replace rule is documented
- [ ] Fresh verification rule is documented
- [ ] Consistency-agent role is documented
- [ ] Assignment must reference the consistency guide
- [ ] Consistency review can be recorded as a bounded artifact with visible state
- [ ] Assignment lifecycle can be explicitly closed, cleared, or replaced

## Quality Rules

- [ ] Reuse-first guidance exists
- [ ] Short file guidance exists
- [ ] Short function guidance exists
- [ ] Readability rule exists
- [ ] Anti-cleverness rule exists
- [ ] Module-boundary rule exists
- [ ] Naming rule exists

## Verification

- [ ] Verification reading order is documented
- [ ] Verification verdict states are documented
- [ ] Verification includes plan-vs-actual reconciliation
- [ ] Verification includes next-agent guidance checks
- [ ] Verification includes consistency and readability checks
- [ ] Verification failure conditions are documented
- [ ] Verification blocked conditions are documented
- [ ] doctor can fail active-cycle placeholder artifacts before fresh verification
- [ ] doctor can fail current-state coherence drift before fresh verification

## Work Journal

- [ ] Work journal contract exists
- [ ] Work journal location is documented
- [ ] Work journal sections are documented
- [ ] Work journal is written after verified completion
- [ ] Work journal is excluded from default agent hot path
- [ ] Work journal preserves wrapped bullet detail from execution summaries

## Git Context

- [ ] Branch detection is part of the contract
- [ ] Dirty-state detection is part of the contract
- [ ] Changed-files capture is part of the contract
- [ ] No destructive git automation is required

## Documentation Structure

- [ ] Implementation menu exists
- [ ] Contract docs are top-down and separated by responsibility
- [ ] No single monolithic doc is required for normal onboarding

## Final Verdict Rule

Use:

- `pass` only if all required items above pass
- `pass_with_concerns` only if required items pass and only non-blocking issues
  remain
- `fail` if any required item fails
- `blocked` if the necessary evidence or artifacts are missing
