# Approved Plan: Multiline Section Parsing

## Objective

- Preserve wrapped multiline bullet content when active-cycle summaries are
  parsed into closure artifacts and the human work journal.

## Acceptance Criteria

- Wrapped bullet continuations under active-cycle `##` sections are preserved
  instead of being truncated to the first line.
- The work journal renders multiline bullets as readable Markdown with
  indented continuation lines.
- Tests cover both the section parser behavior and close-flow journal output.
- Contracts and repo guidance mention the stronger human-readable journal
  requirement.

## Boundaries

- In scope: bullet-section parsing, work-journal rendering, close-flow journal
  coverage, and related contract/guidance updates.
- Out of scope: full Markdown parsing, non-bullet rich text handling, or
  unrelated CLI surface changes.

## Tasks

### Task 1

- files: `src/lib/markdown-sections.ts`, `src/lib/work-journal.ts`,
  `tests/markdown-sections.test.ts`, `tests/close.test.ts`
- action: preserve wrapped bullet continuations and render them readably in the
  human work journal
- verify: run focused parser/close tests and inspect the resulting journal
  formatting
- done: yes

### Task 2

- files: `docs/implementation/core-contract.md`,
  `docs/implementation/verification-contract.md`,
  `docs/implementation/acceptance-checklist.md`,
  `.sb-codex-tool/project.md`, `.sb-codex-tool/guides/code-consistency.md`
- action: align contracts and guidance with the new multiline journal behavior
- verify: inspect the updated docs and rerun `doctor`
- done: yes
