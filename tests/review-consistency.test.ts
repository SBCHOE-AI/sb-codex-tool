import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { createConsistencyReview } from '../src/lib/consistency-review.ts';
import { scaffoldProject } from '../src/lib/scaffold.ts';
import { beginWorkCycle } from '../src/lib/work-cycle.ts';

test('createConsistencyReview writes a consistency review and updates visible state', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'sb-codex-tool-consistency-'));

  scaffoldProject(root);
  const begin = beginWorkCycle(root, 'consistency-review-flow', 'Consistency Review Flow');
  writeFileSync(
    path.join(root, begin.guidePath),
    `# Scope Guide: Consistency Review Flow

## Purpose

- Narrow the current work cycle to a bounded file scope and clear verification expectations.

## Working Goal

- Add consistency review flow support.

## Primary Plan

- ${begin.planPath}

## Allowed File Scope

- src/lib/consistency-review.ts
- src/commands/review-consistency.ts
- tests/review-consistency.test.ts

## Recommended References

- AGENTS.md
- .sb-codex-tool/guides/code-consistency.md

## Verification Expectations

- consistency review exists
`,
    'utf8',
  );

  const result = createConsistencyReview(root, 'Locke');

  assert.equal(result.agentName, 'Locke');
  assert.ok(existsSync(path.join(root, result.reviewPath)));

  const review = readFileSync(path.join(root, result.reviewPath), 'utf8');
  assert.match(review, /# Code Consistency Review: Consistency Review Flow Consistency Review/);
  assert.match(review, /## Assigned Consistency Agent[\s\S]*- Locke/);
  assert.match(review, /Latest lifecycle run: \.sb-codex-tool\/runs\/\d{4}-\d{2}-\d{2}-consistency-review-flow-run\.json/);
  assert.match(review, /src\/lib\/consistency-review\.ts/);
  assert.match(review, /code-consistency\.md/);
  assert.match(review, /## Findings/);
  assert.match(review, /## Recommendations/);

  const current = JSON.parse(
    readFileSync(path.join(root, '.sb-codex-tool/index/current.json'), 'utf8'),
  );
  assert.equal(current.latestConsistencyReview, result.reviewPath);
  assert.equal(current.activeAgents.consistency, 'Locke');
  assert.ok(current.currentFocusModules.includes(result.reviewPath));

  const state = readFileSync(path.join(root, '.sb-codex-tool/state.md'), 'utf8');
  assert.match(state, new RegExp(`Latest consistency review: ${result.reviewPath.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}`));
  assert.match(state, /Code consistency agent: Locke/);

  const readThisFirst = readFileSync(
    path.join(root, '.sb-codex-tool/guides/read-this-first.md'),
    'utf8',
  );
  assert.match(
    readThisFirst,
    new RegExp(
      `Latest consistency review: ${result.reviewPath.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}`,
    ),
  );
});

test('createConsistencyReview requires a current cycle', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'sb-codex-tool-consistency-missing-'));

  scaffoldProject(root);

  assert.throws(
    () => createConsistencyReview(root, 'Locke'),
    /review-consistency requires a current approved plan/,
  );
});

test('createConsistencyReview rerun for the same agent keeps one artifact path', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'sb-codex-tool-consistency-rerun-'));

  scaffoldProject(root);
  const begin = beginWorkCycle(root, 'consistency-review-flow', 'Consistency Review Flow');
  writeFileSync(
    path.join(root, begin.guidePath),
    `# Scope Guide: Consistency Review Flow

## Purpose

- Narrow the current work cycle to a bounded file scope and clear verification expectations.

## Working Goal

- Add consistency review flow support.

## Primary Plan

- ${begin.planPath}

## Allowed File Scope

- src/lib/consistency-review.ts

## Recommended References

- AGENTS.md

## Verification Expectations

- consistency review exists
`,
    'utf8',
  );

  const first = createConsistencyReview(root, 'Locke');
  const second = createConsistencyReview(root, 'Locke');

  assert.equal(first.reviewPath, second.reviewPath);
  assert.deepEqual(second.createdFiles, []);
  assert.deepEqual(second.keptFiles, [first.reviewPath]);

  const current = JSON.parse(
    readFileSync(path.join(root, '.sb-codex-tool/index/current.json'), 'utf8'),
  );
  assert.equal(current.latestConsistencyReview, first.reviewPath);
  assert.equal(current.activeAgents.consistency, 'Locke');
});
