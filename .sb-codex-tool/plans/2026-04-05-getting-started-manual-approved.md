# Approved Plan: Getting Started Manual

## Objective

- Add a beginner-friendly sb-codex-tool usage manual that explains the order of
  operations and concrete examples for someone using Codex for the first time.

## Acceptance Criteria

- A beginner can find a dedicated getting-started document from the top-level
  README files.
- The new manual explains prerequisites, the recommended command order, and a
  realistic end-to-end example cycle.
- The manual explains fresh verification, work journal behavior, and common
  mistakes in plain terms.
- Regression coverage exists for README-to-manual discoverability and for the
  key manual sections.

## Boundaries

- In scope: add a top-level getting-started menu doc, add a detailed beginner
  manual with ordered steps and examples, update README entry points, and add
  regression tests for discoverability and content presence.
- Out of scope: changing the CLI command set, translating implementation
  contracts, or changing packaging behavior.

## Tasks

### Task 1

- files: `docs/menu/getting-started.md`,
  `docs/guides/getting-started-ko.md`, `README.md`, `README.ko.md`
- action: add a first-time Codex user manual with ordered steps, examples, and
  links from the top-level README entry points
- verify: inspect the new docs for step order, examples, and discoverability
- done: yes

### Task 2

- files: `tests/getting-started-docs.test.ts`
- action: add regression coverage that the getting-started docs exist, contain
  the core sections, and are linked from the top-level READMEs
- verify: run `node --experimental-strip-types --test tests/getting-started-docs.test.ts`
- done: yes
