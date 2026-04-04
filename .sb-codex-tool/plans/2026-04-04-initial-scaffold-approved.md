# Approved Plan: Initial sb-codex-tool Scaffold

## Objective

Create the first working `sb-codex-tool` scaffold for this repository so that a
fresh verification agent can inspect the codebase, the state root, the guide
files, and the repo-level operating rules without needing hidden context.

## Acceptance Criteria

- `sb-codex-tool` has a working CLI entrypoint with `setup`, `doctor`,
  `status`, and a default launch path.
- `.sb-codex-tool/` required directories and files are scaffolded.
- Repo-level `AGENTS.md` exists and matches the operating contract.
- Guide files and workflow assets exist and are readable.
- Ignore strategy excludes noisy areas from default agent hot-path searches.
- Smoke tests pass for scaffold creation and doctor validation.
- Fresh-agent verification can start from the documented hot path.

## Boundaries

- General-project core only
- No Unity-specific features
- No gstack-specific features
- No browser automation or release utilities
- No autonomous memory or destructive git automation

## Tasks

### Task 1

- files: `package.json`, `bin/sb-codex-tool.js`, `src/cli.ts`
- action: create the package and command entrypoints for the v1 scaffold-first CLI
- verify: CLI help renders and commands resolve
- done: yes

### Task 2

- files: `src/lib/paths.ts`, `src/lib/fs.ts`, `src/lib/templates.ts`, `src/lib/scaffold.ts`
- action: implement the scaffold generator and template system for state, guides, workflow assets, and AGENTS.md
- verify: `setup` creates the required repo artifacts
- done: yes

### Task 3

- files: `src/lib/doctor.ts`, `src/lib/status.ts`, `src/lib/git.ts`, `src/lib/codex.ts`, `src/commands/doctor.ts`, `src/commands/status.ts`, `src/commands/launch.ts`, `src/commands/setup.ts`
- action: implement validation, status reporting, git context support, Codex binary detection, and the minimal launch wrapper
- verify: `doctor` reports required artifacts and `status` exposes the hot path and git context
- done: yes

### Task 4

- files: `tests/setup.test.ts`, `tests/doctor.test.ts`
- action: add smoke tests for scaffold creation and doctor validation
- verify: `node --experimental-strip-types --test tests/*.test.ts`
- done: yes

### Task 5

- files: `.sb-codex-tool/project.md`, `.sb-codex-tool/state.md`, `.sb-codex-tool/guides/read-this-first.md`, `.sb-codex-tool/guides/code-consistency.md`, `.sb-codex-tool/guides/verification-scope.md`, `.sb-codex-tool/index/current.json`
- action: customize the initial scaffold so a fresh verification agent can inspect the actual current repo state
- verify: hot path points to current plan, summary, and verification handoff artifacts
- done: yes

### Task 6

- files: `.sb-codex-tool/summaries/2026-04-04-initial-scaffold-execution-summary.md`, `.sb-codex-tool/handoffs/2026-04-04-initial-scaffold-to-verification.md`, `.sb-codex-tool/reviews/2026-04-04-fresh-verification-template.md`
- action: create implementation artifacts that prepare a separate verification agent to judge completion
- verify: the verification scope and handoff are explicit enough for fresh-agent inspection
- done: yes
