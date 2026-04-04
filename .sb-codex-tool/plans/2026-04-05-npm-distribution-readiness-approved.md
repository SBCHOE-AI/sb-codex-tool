# Approved Plan: Npm Distribution Readiness

## Objective

- Make the package ready for npm distribution by tightening package metadata,
  documenting installation and usage, and verifying the published tarball
  surface.

## Acceptance Criteria

- `package.json` no longer blocks distribution with a private-only setup and
  includes an explicit tarball surface plus package check scripts.
- `README.md` exists and documents install, commands, workflow, and packaging
  checks.
- `npm pack --dry-run` excludes internal state, tests, and research docs.
- Tests cover package metadata, README presence, and pack output expectations.

## Boundaries

- In scope: package metadata, README, distribution tests, and contract/guidance
  updates tied to npm packaging.
- Out of scope: introducing a build step, generating compiled artifacts, or
  deciding a public open-source license.

## Tasks

### Task 1

- files: `package.json`, `README.md`, `tests/distribution.test.ts`
- action: add package metadata, tarball surface control, README guidance, and
  distribution-focused regression coverage
- verify: run `node --experimental-strip-types --test tests/distribution.test.ts`
  and `npm pack --dry-run`
- done: yes

### Task 2

- files: `docs/implementation/verification-contract.md`, `docs/implementation/acceptance-checklist.md`, `.sb-codex-tool/project.md`, `.sb-codex-tool/guides/code-consistency.md`
- action: update verification and repo guidance so fresh agents can inspect the
  npm distribution surface explicitly
- verify: inspect the updated docs and run `node --experimental-strip-types --test tests/*.test.ts`
- done: yes
