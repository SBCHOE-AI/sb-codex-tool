import { STATE_ROOT_NAME } from '../paths.ts';
import type { TemplateContext } from './context.ts';
import { alwaysReadList } from './shared.ts';
import type { GeneratedFile } from './types.ts';

function agentsTemplate(context: TemplateContext): string {
  return `# AGENTS.md

## Purpose

This repository uses \`sb-codex-tool\` as its workflow and runtime scaffold.

Use the toolkit state and guide files to keep work inspectable, compact, and
verification-friendly.

## Required Workflow

1. Non-trivial work starts with an approved plan.
2. Each task defines \`files\`, \`action\`, \`verify\`, and \`done\`.
3. Non-trivial work proceeds through \`execute -> refactor -> verify\`.
4. Final verification is always performed by a fresh agent.
5. Verification is a closure step, not test-only behavior.

## Agent Roles

- The main agent owns orchestration and user communication.
- Main-agent progress updates to the user are always in Korean.
- Most users run \`setup\`, \`doctor\`, and \`status\` directly, then let Codex
  update plans, state, summaries, handoffs, and reviews in-session.
- Subagents are bounded workers and must be reset or replaced after completion.
- Every new implementation agent reads \`${STATE_ROOT_NAME}/guides/code-consistency.md\` first.
- The main agent references \`${STATE_ROOT_NAME}/guides/code-consistency.md\` before assigning new work.

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

- Hot path starts with \`${STATE_ROOT_NAME}/project.md\` and \`${STATE_ROOT_NAME}/state.md\`.
- Update next-agent guidance after non-trivial code changes.
- Codex may create or update plan, summary, handoff, and review artifacts
  directly when the team is operating in Codex-first mode.
- If new conventions are introduced, update \`${STATE_ROOT_NAME}/guides/code-consistency.md\`.

## Work Journal Rules

- After verified completion, update the human work journal under
  \`${STATE_ROOT_NAME}/logs/work-journal/\`.
- The work journal is for people, not for agent continuity state.

## Git Rules

- Use git as context support only.
- Keep changed-file scope visible when available.
- Do not rely on destructive git automation.

## Repo Entry Points

${alwaysReadList(context)}
`;
}

function projectTemplate(context: TemplateContext): string {
  return `# Project Brief

## Purpose

- Project name: ${context.projectName}
- Replace this section with the actual project purpose.
- Keep this file short and update it when the architecture truth changes.

## Core Constraints

- Follow the workflow defined in AGENTS.md.
- Keep state inspectable through ${STATE_ROOT_NAME}/.
- Optimize for reuse, readability, and low complexity.
- Most users will run \`setup\`, \`doctor\`, and \`status\` directly, then let
  Codex maintain plans, summaries, handoffs, and reviews during normal work.

## Important Entrypoints

- AGENTS.md
- ${STATE_ROOT_NAME}/state.md
- ${STATE_ROOT_NAME}/guides/read-this-first.md
- ${STATE_ROOT_NAME}/guides/code-consistency.md

## Always-Read Docs or Files

${alwaysReadList(context)}

## Architecture Truth

- Replace with a short summary of the current architecture.
- Keep module boundaries explicit.
- Prefer top-down, easy-to-modify flows.
`;
}

function codeConsistencyTemplate(): string {
  return `# Code Consistency Guide

## Purpose

This file defines the structural consistency rules every new agent reads before
implementation.

## Architecture Style Summary

- Prefer small modules with single responsibilities.
- Keep orchestration code separate from filesystem, git, and template logic.
- Favor simple top-down flow over clever abstraction chains.

## Naming Rules

- Use direct names that reveal responsibility quickly.
- Keep command names aligned with workflow stages.
- Keep template and state file names predictable.

## Module Boundary Rules

- CLI parsing stays separate from command logic.
- Command logic stays separate from state persistence.
- Template generation stays separate from command output.
- Verification logic stays separate from execution logic.

## Reuse Rules

- Reuse existing helpers before creating parallel implementations.
- Extract shared logic only when reuse is current and obvious.
- Do not over-generalize for hypothetical future use.

## Readability Rules

- Keep files short and focused.
- Keep functions short and focused.
- Prefer explicit data flow over hidden side effects.
- Add short comments only when the control flow is not self-evident.

## Anti-Patterns

- Clever abstractions that hide simple behavior
- Overlong files and functions
- Mixed responsibilities in one module
- Vague naming
- Hidden state transitions

## Reference Files To Read First

- AGENTS.md
- ${STATE_ROOT_NAME}/project.md
- ${STATE_ROOT_NAME}/state.md
- ${STATE_ROOT_NAME}/guides/read-this-first.md

## Known Consistency Debt

- Fill this section with real debt as the project evolves.
`;
}

export function buildRepoDocumentFiles(
  context: TemplateContext,
): GeneratedFile[] {
  return [
    { path: 'AGENTS.md', content: agentsTemplate(context) },
    { path: `${STATE_ROOT_NAME}/project.md`, content: projectTemplate(context) },
    {
      path: `${STATE_ROOT_NAME}/guides/code-consistency.md`,
      content: codeConsistencyTemplate(),
    },
  ];
}
