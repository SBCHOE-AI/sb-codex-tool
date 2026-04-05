# AGENTS.md

## Purpose

This repository uses `sb-codex-tool` as its workflow and runtime scaffold.

Use the toolkit state and guide files to keep work inspectable, compact, and
verification-friendly.

## Required Workflow

1. Non-trivial work starts with an approved plan.
2. Each task defines `files`, `action`, `verify`, and `done`.
3. Non-trivial work proceeds through `execute -> refactor -> verify`.
4. Final verification is always performed by a fresh agent.
5. Verification is a closure step, not test-only behavior.

## Agent Roles

- The main agent owns orchestration and user communication.
- Main-agent progress updates to the user are always in Korean.
- Most users run `setup`, `doctor`, and `status` directly, then let Codex
  update plans, state, summaries, handoffs, and reviews in-session.
- Subagents are bounded workers and must be reset or replaced after completion.
- Every new implementation agent reads `.sb-codex-tool/guides/code-consistency.md` first.
- The main agent references `.sb-codex-tool/guides/code-consistency.md` before assigning new work.

## Code Quality Rules

- Prefer reuse before adding parallel duplicate implementations.
- Keep files short and single-purpose.
- Keep functions short and single-purpose.
- Prefer simple top-down control flow.
- Avoid clever abstractions and speculative generalization.
- Keep naming predictable and module boundaries explicit.
- Write code that a fresh agent can read quickly.

## Verification Rules

- Final verification must be performed by a fresh agent.
- Verification compares plan vs actual and records deferred issues.
- Verification checks next-agent guidance and readability, not only tests.
- Keep work journal updates outside the default hot path.

## State and Guide Rules

- Hot path starts with `.sb-codex-tool/project.md` and `.sb-codex-tool/state.md`.
- Update next-agent guidance after non-trivial code changes.
- Codex may create or update plan, summary, handoff, and review artifacts
  directly when the repo is operating in Codex-first mode.
- If new conventions are introduced, update `.sb-codex-tool/guides/code-consistency.md`.

## Work Journal Rules

- After verified completion, update the human work journal under
  `.sb-codex-tool/logs/work-journal/`.
- The work journal is for people, not for agent continuity state.

## Git Rules

- Use git as context support only.
- Keep changed-file scope visible when available.
- Do not rely on destructive git automation.

## Repo Entry Points

- AGENTS.md
- .sb-codex-tool/project.md
- .sb-codex-tool/state.md
- .sb-codex-tool/guides/read-this-first.md
- .sb-codex-tool/guides/code-consistency.md
- docs/menu/implementation.md
