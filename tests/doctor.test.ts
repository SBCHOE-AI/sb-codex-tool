import assert from 'node:assert/strict';
import { mkdtempSync, unlinkSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { runDoctor } from '../src/lib/doctor.ts';
import { scaffoldProject } from '../src/lib/scaffold.ts';
import { beginWorkCycle } from '../src/lib/work-cycle.ts';
import { createConsistencyReview } from '../src/lib/consistency-review.ts';
import {
  normalizeCurrentIndex,
  readCurrentIndex,
  writeCurrentArtifacts,
} from '../src/lib/current-state.ts';
import { buildTemplateContext } from '../src/lib/templates.ts';

function fillCurrentCycleArtifacts(root: string, begin: ReturnType<typeof beginWorkCycle>): void {
  writeFileSync(
    path.join(root, begin.planPath),
    `# Approved Plan: Doctor Semantic Validation

## Objective

- Add semantic readiness checks to doctor for the active cycle artifacts.

## Acceptance Criteria

- doctor fails when current cycle artifacts still contain scaffold placeholders.
- doctor passes when the current plan, guide, handoff, and execution summary are filled.

## Boundaries

- In scope: current cycle artifact semantic validation and tests.
- Out of scope: changing close verdict behavior.

## Tasks

### Task 1

- files: \`src/lib/doctor.ts\`, \`tests/doctor.test.ts\`
- action: add semantic validation for current cycle artifacts
- verify: run the doctor tests and the full test suite
- done: yes
`,
    'utf8',
  );

  writeFileSync(
    path.join(root, begin.guidePath),
    `# Scope Guide: Doctor Semantic Validation

## Purpose

- Narrow the current work cycle to a bounded file scope and clear verification expectations.

## Working Goal

- Add semantic validation so doctor catches unfilled active-cycle artifacts.

## Primary Plan

- ${begin.planPath}

## Allowed File Scope

- src/lib/doctor.ts
- tests/doctor.test.ts

## Recommended References

- AGENTS.md
- .sb-codex-tool/project.md
- .sb-codex-tool/state.md
- .sb-codex-tool/guides/code-consistency.md

## Verification Expectations

- doctor reports scaffold placeholders as failures for active-cycle artifacts.
- doctor passes after the artifacts are filled.
`,
    'utf8',
  );

  writeFileSync(
    path.join(root, begin.summaryPath),
    `# Execution Summary: Doctor Semantic Validation

## Purpose

- Capture implementation progress for the current work cycle before fresh verification.

## Scope

- Add semantic validation for current cycle artifacts and the latest consistency review.

## Implemented Surface

- Filled current cycle artifacts with real content for doctor validation tests.

## Checks Run

- \`node --experimental-strip-types --test tests/*.test.ts\`

## Plan vs Actual

- Planned: validate active-cycle artifact readiness.
- Actual: prepared representative current-cycle artifacts for doctor readiness checks.

## Refactor Notes

- Kept the fixture content small and explicit so the doctor tests stay readable.

## Deferred Issues

- None.

## Next-Agent Guidance

- Start from this execution summary as the latest relevant summary.
- Then review \`${begin.planPath}\`.
- Then review \`${begin.guidePath}\`.
`,
    'utf8',
  );

  writeFileSync(
    path.join(root, begin.handoffPath),
    `# Handoff: Doctor Semantic Validation

## Goal

- Enable the next fresh agent to continue this work cycle without hidden context.

## Read In This Order

1. AGENTS.md
2. .sb-codex-tool/project.md
3. .sb-codex-tool/state.md
4. .sb-codex-tool/guides/read-this-first.md
5. .sb-codex-tool/guides/code-consistency.md
6. ${begin.summaryPath}
7. ${begin.planPath}
8. ${begin.guidePath}

## Current Status

- The current cycle artifacts are filled and ready for semantic doctor checks.

## Git Context

- Run artifact: ${begin.runPath}
- Git available: no
- Branch: unavailable
- Dirty: unavailable
- Changed files: unavailable outside a Git repository

## Expected Verification Checks

- Run the doctor tests.
- Confirm doctor fails on placeholder artifacts and passes once they are filled.

## Open Risks

- None.
`,
    'utf8',
  );
}

test('runDoctor passes required scaffold checks on a fresh scaffold', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'sb-codex-tool-doctor-'));
  scaffoldProject(root);

  const report = runDoctor(root);
  const failures = report.results.filter((result) => result.level === 'fail');

  assert.equal(failures.length, 0);
});

test('runDoctor fails when the current cycle still uses scaffold placeholders', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'sb-codex-tool-doctor-placeholders-'));
  scaffoldProject(root);
  beginWorkCycle(root, 'doctor-semantic-validation', 'Doctor Semantic Validation');

  const report = runDoctor(root);
  const failureLabels = report.results
    .filter((result) => result.level === 'fail')
    .map((result) => result.label);

  assert.ok(failureLabels.includes('approved plan readiness'));
  assert.ok(failureLabels.includes('current task guide readiness'));
  assert.ok(failureLabels.includes('execution summary readiness'));
  assert.ok(failureLabels.includes('current handoff readiness'));
});

test('runDoctor catches placeholder consistency reviews for the current state', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'sb-codex-tool-doctor-consistency-'));
  scaffoldProject(root);
  const begin = beginWorkCycle(root, 'doctor-semantic-validation', 'Doctor Semantic Validation');
  fillCurrentCycleArtifacts(root, begin);
  createConsistencyReview(root, 'Locke');

  const report = runDoctor(root);
  const failure = report.results.find(
    (result) => result.label === 'latest consistency review readiness',
  );

  assert.ok(failure);
  assert.equal(failure?.level, 'fail');
});

test('runDoctor passes semantic readiness checks after the current cycle is filled', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'sb-codex-tool-doctor-semantic-pass-'));
  scaffoldProject(root);
  const begin = beginWorkCycle(root, 'doctor-semantic-validation', 'Doctor Semantic Validation');
  fillCurrentCycleArtifacts(root, begin);

  const report = runDoctor(root);
  const failures = report.results.filter((result) => result.level === 'fail');

  assert.equal(failures.length, 0);
});

test('runDoctor fails when verify-stage and assignment-guide state drift out of coherence', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'sb-codex-tool-doctor-coherence-'));
  scaffoldProject(root);
  const begin = beginWorkCycle(
    root,
    'doctor-semantic-validation',
    'Doctor Semantic Validation',
  );
  fillCurrentCycleArtifacts(root, begin);

  const current = normalizeCurrentIndex(readCurrentIndex(root));
  const broken = normalizeCurrentIndex({
    ...current,
    currentStage: 'verify',
    nextAction: 'Run fresh verification.',
    activeAgents: {
      ...current.activeAgents,
      subagents: ['Euclid'],
      verification: null,
    },
    assignmentGuides: {
      Locke: '.sb-codex-tool/guides/stale-assignment.md',
    },
  });

  writeCurrentArtifacts(root, broken, buildTemplateContext(root).implementationMenuPath);
  unlinkSync(path.join(root, begin.runPath));

  const report = runDoctor(root);
  const failureLabels = report.results
    .filter((result) => result.level === 'fail')
    .map((result) => result.label);

  assert.ok(failureLabels.includes('latest run coherence'));
  assert.ok(failureLabels.includes('verification-agent coherence'));
  assert.ok(failureLabels.includes('assignment-guide coherence'));
});
