import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { scaffoldProject } from '../src/lib/scaffold.ts';
import { beginWorkCycle } from '../src/lib/work-cycle.ts';
import { prepareVerify } from '../src/lib/prepare-verify.ts';

function prepareCycle(root: string): ReturnType<typeof beginWorkCycle> {
  const begin = beginWorkCycle(root, 'prepare-verify', 'Prepare Verify');
  writeFileSync(
    path.join(root, begin.planPath),
    `# Approved Plan: Prepare Verify

## Objective

- Align handoff and current-state artifacts automatically before fresh verification.

## Acceptance Criteria

- prepare-verify rewrites the handoff from current execution artifacts.
- prepare-verify moves current state to verify and records a lifecycle run.

## Boundaries

- In scope: handoff automation and verify-state transition.
- Out of scope: final close behavior.

## Tasks

### Task 1

- files: \`src/lib/prepare-verify.ts\`, \`src/commands/prepare-verify.ts\`, \`tests/prepare-verify.test.ts\`
- action: automate handoff writing and verify-state transition
- verify: run the prepare-verify tests and inspect the updated handoff and state
- done: yes
`,
    'utf8',
  );
  writeFileSync(
    path.join(root, begin.guidePath),
    `# Scope Guide: Prepare Verify

## Purpose

- Narrow the current work cycle to a bounded file scope and clear verification expectations.

## Working Goal

- Automate the verify-ready handoff and state transition.

## Primary Plan

- ${begin.planPath}

## Allowed File Scope

- src/lib/prepare-verify.ts
- src/commands/prepare-verify.ts
- tests/prepare-verify.test.ts

## Recommended References

- AGENTS.md
- .sb-codex-tool/guides/code-consistency.md

## Verification Expectations

- Run \`node --experimental-strip-types --test tests/prepare-verify.test.ts\`.
- Run \`node --experimental-strip-types src/cli.ts status\`.
`,
    'utf8',
  );
  writeFileSync(
    path.join(root, begin.summaryPath),
    `# Execution Summary: Prepare Verify

## Purpose

- Capture implementation progress for the current work cycle before fresh verification.

## Scope

- Align handoff and current-state artifacts automatically before fresh verification.

## Implemented Surface

- Added \`src/lib/prepare-verify.ts\` to rewrite the current handoff from the active summary and guide.
- Added \`src/commands/prepare-verify.ts\` and wired it into the CLI.
- Added \`tests/prepare-verify.test.ts\` to cover verify-state transition behavior.

## Checks Run

- \`node --experimental-strip-types --test tests/prepare-verify.test.ts\`

## Plan vs Actual

- Planned: automate handoff writing before fresh verification.
- Actual: the helper now writes the handoff from the current execution summary and guide.

## Refactor Notes

- Kept handoff writing inside a dedicated helper so close-flow logic stays separate.

## Deferred Issues

- None.

## Next-Agent Guidance

- Start from this execution summary as the latest relevant summary.
- Then review \`${begin.planPath}\`.
- Then review \`${begin.guidePath}\`.
`,
    'utf8',
  );

  return begin;
}

test('prepareVerify rewrites handoff and moves current state to verify', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'sb-codex-tool-prepare-verify-'));

  scaffoldProject(root);
  const begin = prepareCycle(root);
  const result = prepareVerify(root);

  assert.equal(result.title, 'Prepare Verify');
  const handoff = readFileSync(path.join(root, begin.handoffPath), 'utf8');
  assert.match(handoff, /## Current Status/);
  assert.match(handoff, /Implementation and refactor are ready for fresh verification\./);
  assert.match(handoff, /## Expected Verification Checks/);
  assert.match(handoff, /tests\/prepare-verify\.test\.ts/);
  assert.match(handoff, /## Next-Agent Guidance/);

  const current = JSON.parse(
    readFileSync(path.join(root, '.sb-codex-tool/index/current.json'), 'utf8'),
  );
  assert.equal(current.currentStage, 'verify');
  assert.equal(current.nextAction, 'Run fresh verification for the Prepare Verify increment.');
  assert.equal(current.activeAgents.verification, 'pending assignment');
  assert.equal(current.latestRun, result.runPath);

  const run = JSON.parse(readFileSync(path.join(root, result.runPath), 'utf8'));
  assert.equal(run.phase, 'prepare-verify');
  assert.equal(run.stage, 'verify');
  assert.equal(run.verdict, 'pending');
});

test('prepareVerify requires explicit summary guidance and verification expectations', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'sb-codex-tool-prepare-verify-missing-'));

  scaffoldProject(root);
  const begin = beginWorkCycle(root, 'prepare-verify', 'Prepare Verify');
  writeFileSync(
    path.join(root, begin.summaryPath),
    `# Execution Summary: Prepare Verify

## Purpose

- Capture implementation progress for the current work cycle before fresh verification.

## Scope

- Align handoff and current-state artifacts automatically before fresh verification.

## Implemented Surface

- Added src/lib/prepare-verify.ts.

## Checks Run

- node --experimental-strip-types --test tests/prepare-verify.test.ts

## Plan vs Actual

- Planned: automate verify preparation.
- Actual: partial.

## Refactor Notes

- none

## Deferred Issues

- None.
`,
    'utf8',
  );
  writeFileSync(
    path.join(root, begin.guidePath),
    `# Scope Guide: Prepare Verify

## Purpose

- Narrow the current work cycle to a bounded file scope and clear verification expectations.

## Working Goal

- Automate verify preparation.

## Primary Plan

- ${begin.planPath}

## Allowed File Scope

- src/lib/prepare-verify.ts
`,
    'utf8',
  );

  assert.throws(
    () => prepareVerify(root),
    /requires explicit next-agent guidance before verify can start|requires explicit verification expectations before verify can start/,
  );
});
