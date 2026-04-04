# Approved Plan: Korean README

## Objective

- Add a detailed Korean README as a separate repository document and link it
  cleanly from the existing English README for GitHub readers.

## Acceptance Criteria

- `README.ko.md` exists and provides a detailed Korean guide that mirrors the
  current English README at a practical documentation level.
- `README.md` points Korean readers to the Korean README without harming the
  distribution-facing English README.
- Regression coverage exists for the bilingual README entry points so the
  repository keeps both documents discoverable.
- Full test and doctor checks pass after the documentation update.

## Boundaries

- In scope: add `README.ko.md`, add cross-links between the English and Korean
  README documents, and add regression coverage for the bilingual doc entry
  points.
- Out of scope: changing the package distribution surface, translating internal
  `.sb-codex-tool/` state artifacts, or changing the CLI command set.

## Tasks

### Task 1

- files: `README.md`, `README.ko.md`
- action: add a detailed Korean README and link it from the English README
  while keeping the English README distribution-friendly
- verify: inspect both README files for complete cross-linked documentation and
  run a targeted README regression test
- done: yes

### Task 2

- files: `tests/readme-l10n.test.ts`
- action: add regression coverage that confirms the Korean README exists and
  both top-level README documents remain discoverable
- verify: run `node --experimental-strip-types --test tests/readme-l10n.test.ts`
- done: yes
