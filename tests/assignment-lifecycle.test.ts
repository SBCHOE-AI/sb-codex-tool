import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { createAssignmentGuide } from '../src/lib/assignment.ts';
import { completeAssignment } from '../src/lib/assignment-lifecycle.ts';
import { scaffoldProject } from '../src/lib/scaffold.ts';
import { beginWorkCycle } from '../src/lib/work-cycle.ts';

function prepareCycle(root: string): ReturnType<typeof beginWorkCycle> {
  const begin = beginWorkCycle(root, 'assignment-lifecycle', 'Assignment Lifecycle');
  writeFileSync(
    path.join(root, begin.guidePath),
    `# Scope Guide: Assignment Lifecycle

## Purpose

- Narrow the current work cycle to a bounded file scope and clear verification expectations.

## Working Goal

- Add lifecycle automation for bounded subagent assignments.

## Primary Plan

- ${begin.planPath}

## Allowed File Scope

- src/lib/assignment.ts
- src/lib/assignment-lifecycle.ts
- src/commands/assign.ts
- src/commands/complete-assignment.ts
- tests/assignment-lifecycle.test.ts

## Recommended References

- AGENTS.md
- .sb-codex-tool/guides/code-consistency.md

## Verification Expectations

- lifecycle decisions are visible in state and artifacts
`,
    'utf8',
  );

  return begin;
}

test('completeAssignment close removes the active subagent and records lifecycle state', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'sb-codex-tool-assignment-close-'));

  scaffoldProject(root);
  prepareCycle(root);
  const assignment = createAssignmentGuide(root, 'Euclid', 'refactor-parser', 'Refactor Parser');

  const result = completeAssignment(root, 'Euclid', 'close');

  assert.equal(result.action, 'close');
  assert.equal(result.replacementAssignmentPath, null);
  assert.ok(existsSync(path.join(root, result.lifecyclePath)));

  const lifecycle = readFileSync(path.join(root, result.lifecyclePath), 'utf8');
  assert.match(lifecycle, /## Decision[\s\S]*- close/);
  assert.match(lifecycle, /Completed Assignment Guide[\s\S]*refactor-parser-assignment\.md/);

  const current = JSON.parse(
    readFileSync(path.join(root, '.sb-codex-tool/index/current.json'), 'utf8'),
  );
  assert.equal(current.latestAssignmentLifecycle, result.lifecyclePath);
  assert.deepEqual(current.activeAgents.subagents, []);
  assert.equal(current.assignmentGuides.Euclid, undefined);
  assert.ok(!current.currentFocusModules.includes(assignment.assignmentPath));
});

test('completeAssignment clear records clear lifecycle handling without a replacement', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'sb-codex-tool-assignment-clear-'));

  scaffoldProject(root);
  prepareCycle(root);
  createAssignmentGuide(root, 'Popper', 'narrow-scope', 'Narrow Scope');

  const result = completeAssignment(root, 'Popper', 'clear');

  assert.equal(result.action, 'clear');
  const lifecycle = readFileSync(path.join(root, result.lifecyclePath), 'utf8');
  assert.match(lifecycle, /## Decision[\s\S]*- clear/);
  assert.match(lifecycle, /Replacement Assignment[\s\S]*- none/);

  const state = readFileSync(path.join(root, '.sb-codex-tool/state.md'), 'utf8');
  assert.match(state, /Latest assignment lifecycle: .*assignment-lifecycle\.md/);
  assert.match(state, /Execution subagents: none/);
});

test('completeAssignment replace swaps the active subagent and creates a replacement guide', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'sb-codex-tool-assignment-replace-'));

  scaffoldProject(root);
  prepareCycle(root);
  createAssignmentGuide(root, 'Euclid', 'refactor-parser', 'Refactor Parser');

  const result = completeAssignment(root, 'Euclid', 'replace', {
    agentName: 'Locke',
    slug: 'verify-parser',
    title: 'Verify Parser',
  });

  assert.ok(result.replacementAssignmentPath !== null);
  assert.ok(existsSync(path.join(root, result.replacementAssignmentPath ?? '')));

  const current = JSON.parse(
    readFileSync(path.join(root, '.sb-codex-tool/index/current.json'), 'utf8'),
  );
  assert.deepEqual(current.activeAgents.subagents, ['Locke']);
  assert.equal(current.assignmentGuides.Euclid, undefined);
  assert.equal(current.assignmentGuides.Locke, result.replacementAssignmentPath);

  const statusState = readFileSync(path.join(root, '.sb-codex-tool/state.md'), 'utf8');
  assert.match(statusState, /Execution subagents: Locke/);
  assert.match(statusState, /Locke: .*verify-parser-assignment\.md/);
});

test('completeAssignment requires an active subagent assignment', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'sb-codex-tool-assignment-missing-'));

  scaffoldProject(root);
  prepareCycle(root);

  assert.throws(
    () => completeAssignment(root, 'Euclid', 'close'),
    /requires Euclid to be an active subagent/,
  );
});
