# Approved Plan: Template Splitting

## Objective

- Split the scaffold template system into smaller concern-focused modules while
  keeping the public template API and scaffolded outputs stable.

## Acceptance Criteria

- `src/lib/templates.ts` becomes a thin facade instead of the main template
  implementation file.
- Scaffold template content is split into smaller modules by concern so no
  single template-definition file remains the default editing hotspot.
- `scaffoldProject`, `setup`, `doctor`, and `status` continue to work without
  changing their external behavior.
- Tests continue to pass and the active-cycle docs are placeholder-free for
  fresh verification.

## Boundaries

- In scope: splitting template-building code, keeping the exported template
  helpers stable, and updating architecture guidance to reflect the new layout.
- Out of scope: changing scaffold content semantics, adding new commands, or
  changing current-state behavior.

## Tasks

### Task 1

- files: `src/lib/templates.ts`, `src/lib/templates/*.ts`, `src/lib/scaffold.ts`
- action: split scaffold template generation into smaller concern-focused
  modules while preserving the existing exported surface used by scaffold and
  work-cycle helpers
- verify: run `node --experimental-strip-types --test tests/*.test.ts` and
  inspect the template facade plus generated template modules
- done: yes

### Task 2

- files: `.sb-codex-tool/project.md`, `.sb-codex-tool/guides/code-consistency.md`
- action: update repo guidance so the architecture truth and consistency rules
  reflect the new template module layout
- verify: inspect the updated guidance files and confirm they match the
  implementation
- done: yes
