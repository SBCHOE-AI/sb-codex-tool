import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { createAssignmentGuide } from '../src/lib/assignment.ts';
import { scaffoldProject } from '../src/lib/scaffold.ts';
import { beginWorkCycle } from '../src/lib/work-cycle.ts';

test('createAssignmentGuide writes a bounded assignment guide and updates active subagents', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'sb-codex-tool-assign-'));

  scaffoldProject(root);
  const begin = beginWorkCycle(root, 'assignment-guides', 'Assignment Guides');
  writeFileSync(
    path.join(root, begin.guidePath),
    `# Scope Guide: Assignment Guides

## Purpose

- Narrow the current work cycle to a bounded file scope and clear verification expectations.

## Working Goal

- Add a bounded assignment helper for subagents.

## Primary Plan

- ${begin.planPath}

## Allowed File Scope

- src/lib/assignment.ts
- src/commands/assign.ts
- tests/assign.test.ts

## Recommended References

- AGENTS.md
- .sb-codex-tool/guides/code-consistency.md

## Verification Expectations

- assignment guide exists
`,
    'utf8',
  );

  const result = createAssignmentGuide(root, 'Euclid', 'refactor-parser', 'Refactor Parser');

  assert.equal(result.agentName, 'Euclid');
  assert.equal(result.title, 'Refactor Parser');
  assert.ok(existsSync(path.join(root, result.assignmentPath)));

  const guide = readFileSync(path.join(root, result.assignmentPath), 'utf8');
  assert.match(guide, /# Assignment Guide: Refactor Parser/);
  assert.match(guide, /## Assigned Agent[\s\S]*- Euclid/);
  assert.match(guide, /Current plan: \.sb-codex-tool\/plans\/\d{4}-\d{2}-\d{2}-assignment-guides-approved\.md/);
  assert.match(guide, /Current guide: \.sb-codex-tool\/guides\/\d{4}-\d{2}-\d{2}-assignment-guides-scope\.md/);
  assert.match(guide, /src\/lib\/assignment\.ts/);
  assert.match(guide, /src\/commands\/assign\.ts/);
  assert.match(guide, /code-consistency\.md/);
  assert.match(guide, /fresh-agent-only/);

  const current = JSON.parse(
    readFileSync(path.join(root, '.sb-codex-tool/index/current.json'), 'utf8'),
  );
  assert.ok(current.activeAgents.subagents.includes('Euclid'));
  assert.ok(current.currentFocusModules.includes(result.assignmentPath));

  const state = readFileSync(path.join(root, '.sb-codex-tool/state.md'), 'utf8');
  assert.match(state, /Execution subagents: Euclid/);
});

test('createAssignmentGuide requires a current cycle', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'sb-codex-tool-assign-missing-'));

  scaffoldProject(root);

  assert.throws(
    () => createAssignmentGuide(root, 'Euclid', 'refactor-parser', 'Refactor Parser'),
    /assign requires a current approved plan/,
  );
});

test('createAssignmentGuide does not duplicate the same subagent on rerun', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'sb-codex-tool-assign-rerun-'));

  scaffoldProject(root);
  const begin = beginWorkCycle(root, 'assignment-guides', 'Assignment Guides');
  writeFileSync(
    path.join(root, begin.guidePath),
    `# Scope Guide: Assignment Guides

## Purpose

- Narrow the current work cycle to a bounded file scope and clear verification expectations.

## Working Goal

- Add a bounded assignment helper for subagents.

## Primary Plan

- ${begin.planPath}

## Allowed File Scope

- src/lib/assignment.ts

## Recommended References

- AGENTS.md

## Verification Expectations

- assignment guide exists
`,
    'utf8',
  );

  const first = createAssignmentGuide(root, 'Euclid', 'refactor-parser', 'Refactor Parser');
  const second = createAssignmentGuide(root, 'Euclid', 'refactor-parser', 'Refactor Parser');

  assert.equal(first.assignmentPath, second.assignmentPath);
  assert.deepEqual(second.createdFiles, []);
  assert.deepEqual(second.keptFiles, [first.assignmentPath]);

  const current = JSON.parse(
    readFileSync(path.join(root, '.sb-codex-tool/index/current.json'), 'utf8'),
  );
  assert.equal(
    current.activeAgents.subagents.filter((name: string) => name === 'Euclid').length,
    1,
  );
});
