import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { getStatus } from '../src/lib/status.ts';
import { scaffoldProject } from '../src/lib/scaffold.ts';
import { beginWorkCycle } from '../src/lib/work-cycle.ts';
import { closeCurrentCycle } from '../src/lib/close-cycle.ts';
import {
  normalizeCurrentIndex,
  readCurrentIndex,
  writeCurrentArtifacts,
} from '../src/lib/current-state.ts';
import { buildTemplateContext } from '../src/lib/templates.ts';

function runGit(root: string, args: string[]): string {
  const result = spawnSync('git', args, {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result.stdout.trim();
}

function initGitRepo(root: string): void {
  runGit(root, ['init', '-b', 'main']);
  runGit(root, ['config', 'user.name', 'sb-codex-tool']);
  runGit(root, ['config', 'user.email', 'sb-codex-tool@example.com']);
}

function commitAll(root: string, message: string): void {
  runGit(root, ['add', '.']);
  runGit(root, ['commit', '-m', message]);
}

function moveCurrentCycleToVerify(root: string): void {
  const current = normalizeCurrentIndex(readCurrentIndex(root));
  const next = normalizeCurrentIndex({
    ...current,
    currentStage: 'verify',
    nextAction: 'Run fresh verification.',
    activeAgents: {
      ...current.activeAgents,
      verification: 'pending assignment',
    },
  });

  writeCurrentArtifacts(root, next, buildTemplateContext(root).implementationMenuPath);
}

function writeFilledClosureArtifacts(
  root: string,
  begin: ReturnType<typeof beginWorkCycle>,
): void {
  writeFileSync(
    path.join(root, begin.planPath),
    `# Approved Plan: Status Run Visibility

## Objective

- Improve status visibility from the latest lifecycle run record.

## Acceptance Criteria

- status exposes latest run phase, verdict, and linked artifact paths.

## Boundaries

- In scope: status visibility only.

## Tasks

### Task 1

- files: \`src/lib/status.ts\`
- action: expose latest run record details
- verify: inspect status output and tests
- done: yes
`,
    'utf8',
  );

  writeFileSync(
    path.join(root, begin.guidePath),
    `# Scope Guide: Status Run Visibility

## Purpose

- Narrow the current work cycle to a bounded file scope and clear verification expectations.

## Working Goal

- Improve status visibility from the latest lifecycle run record.

## Primary Plan

- ${begin.planPath}

## Allowed File Scope

- src/lib/status.ts
- src/commands/status.ts
- tests/status.test.ts

## Recommended References

- AGENTS.md
- .sb-codex-tool/guides/code-consistency.md

## Verification Expectations

- status shows latest run phase, verdict, and linked artifact paths.
`,
    'utf8',
  );

  writeFileSync(
    path.join(root, begin.summaryPath),
    `# Execution Summary: Status Run Visibility

## Purpose

- Capture implementation progress for the current work cycle before fresh verification.

## Scope

- Improve status visibility from the latest lifecycle run record.

## Implemented Surface

- Added latest run detail visibility to status.

## Checks Run

- \`node --experimental-strip-types --test tests/*.test.ts\`

## Plan vs Actual

- Planned: add latest run visibility
- Actual: delivered

## Refactor Notes

- none

## Deferred Issues

- None.

## Next-Agent Guidance

- Start from this execution summary.
- Then review \`${begin.planPath}\`.
- Then review \`${begin.guidePath}\`.
`,
    'utf8',
  );

  writeFileSync(
    path.join(root, begin.handoffPath),
    `# Handoff: Status Run Visibility

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

- Status run visibility is implemented and ready for fresh verification.

## Git Context

- Run artifact: ${begin.runPath}
- Git available: no
- Branch: unavailable
- Dirty: unavailable
- Changed files: unavailable outside a Git repository

## Expected Verification Checks

- Inspect the latest run details shown by status.

## Open Risks

- None.
`,
    'utf8',
  );
}

function writeFreshReview(root: string, reviewPath: string): void {
  writeFileSync(
    path.join(root, reviewPath),
    `# Fresh Verification Review: Status Run Visibility

## Verification Target

- Status Run Visibility

## Verdict

- pass

## Required Checks

- Contract reading order completed
- Acceptance criteria reviewed
- State and guide artifacts inspected
- Relevant code and tests inspected
- Required checks run

## Checks Run

- node --experimental-strip-types --test tests/*.test.ts

## Findings

- None.

## Concerns

- None.

## Missing Evidence

- None.

## Work Journal Decision

- Verified closure is complete enough to update the work journal.
`,
    'utf8',
  );
}

test('getStatus exposes latest run metadata from the current run record', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'sb-codex-tool-status-run-'));

  scaffoldProject(root);
  const begin = beginWorkCycle(root, 'status-run-visibility', 'Status Run Visibility');

  const status = getStatus(root);

  assert.equal(status.latestRun, begin.runPath);
  assert.equal(status.coherenceIssues.length, 0);
  assert.equal(status.latestRunRecord?.title, 'Status Run Visibility');
  assert.equal(status.latestRunRecord?.phase, 'begin');
  assert.equal(status.latestRunRecord?.stage, 'clarify');
  assert.equal(status.latestRunRecord?.verdict, 'pending');
  assert.equal(status.latestRunRecord?.paths.planPath, begin.planPath);
  assert.equal(status.latestRunRecord?.paths.executionSummaryPath, begin.summaryPath);
  assert.equal(status.latestRunRecord?.paths.guidePath, begin.guidePath);
  assert.equal(status.latestRunRecord?.paths.reviewPath, begin.reviewPath);
});

test('getStatus surfaces semantic coherence issues when state drifts from the latest run', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'sb-codex-tool-status-coherence-'));

  scaffoldProject(root);
  const begin = beginWorkCycle(root, 'status-run-visibility', 'Status Run Visibility');
  writeFilledClosureArtifacts(root, begin);

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

  const status = getStatus(root);
  const labels = status.coherenceIssues.map((issue) => issue.label);

  assert.ok(labels.includes('latest run coherence'));
  assert.ok(labels.includes('verification-agent coherence'));
  assert.ok(labels.includes('assignment-guide coherence'));
});

test('getStatus keeps run-linked git scope from the latest run record', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'sb-codex-tool-status-git-'));

  scaffoldProject(root);
  initGitRepo(root);
  commitAll(root, 'initial scaffold');
  writeFileSync(path.join(root, 'notes.txt'), 'dirty working tree\n', 'utf8');

  beginWorkCycle(root, 'status-run-visibility', 'Status Run Visibility');
  const status = getStatus(root);

  assert.equal(status.latestRunRecord?.git.available, true);
  assert.equal(status.latestRunRecord?.git.branch, 'main');
  assert.equal(status.latestRunRecord?.git.dirty, true);
  assert.ok(status.latestRunRecord?.git.changedFiles.includes('notes.txt'));
});

test('getStatus exposes close-linked artifacts after verified closure', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'sb-codex-tool-status-close-'));

  scaffoldProject(root);
  const begin = beginWorkCycle(root, 'status-run-visibility', 'Status Run Visibility');
  writeFilledClosureArtifacts(root, begin);
  moveCurrentCycleToVerify(root);
  writeFreshReview(root, begin.reviewPath);

  const result = closeCurrentCycle(root);
  const status = getStatus(root);

  assert.equal(status.stage, 'clarify');
  assert.equal(status.latestRun, result.runPath);
  assert.equal(status.latestRunRecord?.phase, 'close');
  assert.equal(status.latestRunRecord?.verdict, 'pass');
  assert.equal(
    status.latestRunRecord?.paths.verificationSummaryPath,
    result.verificationSummaryPath,
  );
  assert.equal(status.latestRunRecord?.paths.journalPath, result.journalPath);
});
