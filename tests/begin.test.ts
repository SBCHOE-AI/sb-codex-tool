import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { runDoctor } from '../src/lib/doctor.ts';
import { scaffoldProject } from '../src/lib/scaffold.ts';
import { beginWorkCycle } from '../src/lib/work-cycle.ts';

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

test('beginWorkCycle creates the next work-cycle artifacts and updates current state', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'sb-codex-tool-begin-'));
  scaffoldProject(root);

  const result = beginWorkCycle(root, 'artifact-automation', 'Artifact Automation');

  assert.equal(result.title, 'Artifact Automation');
  assert.ok(existsSync(path.join(root, result.planPath)));
  assert.ok(existsSync(path.join(root, result.summaryPath)));
  assert.ok(existsSync(path.join(root, result.runPath)));
  assert.ok(existsSync(path.join(root, result.handoffPath)));
  assert.ok(existsSync(path.join(root, result.reviewPath)));
  assert.ok(existsSync(path.join(root, result.guidePath)));

  const current = readFileSync(
    path.join(root, '.sb-codex-tool/index/current.json'),
    'utf8',
  );
  assert.match(current, /artifact-automation-approved\.md/);
  assert.match(current, /artifact-automation-scope\.md/);
  assert.match(current, /artifact-automation-run\.json/);

  const state = readFileSync(path.join(root, '.sb-codex-tool/state.md'), 'utf8');
  assert.match(state, /Artifact Automation/);
  assert.match(state, /Latest lifecycle run: \.sb-codex-tool\/runs\/\d{4}-\d{2}-\d{2}-artifact-automation-run\.json/);
  assert.match(state, /Current task guide: \.sb-codex-tool\/guides\/\d{4}-\d{2}-\d{2}-artifact-automation-scope\.md/);

  const readThisFirst = readFileSync(
    path.join(root, '.sb-codex-tool/guides/read-this-first.md'),
    'utf8',
  );
  assert.match(readThisFirst, /Current stage: clarify/);
  const summaryIndex = readThisFirst.indexOf('artifact-automation-execution-summary.md');
  const planIndex = readThisFirst.indexOf('artifact-automation-approved.md');
  const guideIndex = readThisFirst.indexOf('artifact-automation-scope.md');
  assert.notEqual(summaryIndex, -1);
  assert.notEqual(planIndex, -1);
  assert.notEqual(guideIndex, -1);
  assert.ok(summaryIndex < planIndex);
  assert.ok(planIndex < guideIndex);
  assert.match(
    readThisFirst,
    /Latest lifecycle run: \.sb-codex-tool\/runs\/\d{4}-\d{2}-\d{2}-artifact-automation-run\.json/,
  );

  const report = runDoctor(root);
  const failures = report.results.filter((item) => item.level === 'fail');
  const failureLabels = failures.map((item) => item.label);
  assert.ok(failureLabels.includes('approved plan readiness'));
  assert.ok(failureLabels.includes('current task guide readiness'));
  assert.ok(failureLabels.includes('execution summary readiness'));
  assert.ok(failureLabels.includes('current handoff readiness'));
});

test('beginWorkCycle does not regress state when re-run for the current cycle', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'sb-codex-tool-begin-rerun-'));
  const currentPath = path.join(root, '.sb-codex-tool/index/current.json');

  scaffoldProject(root);
  const result = beginWorkCycle(root, 'artifact-automation', 'Artifact Automation');

  const current = JSON.parse(readFileSync(currentPath, 'utf8'));
  current.currentStage = 'verify';
  current.nextAction = 'Run fresh verification.';
  current.latestRelevantSummary =
    '.sb-codex-tool/summaries/custom-verification-summary.md';
  current.notes = ['verification is pending'];
  writeFileSync(currentPath, JSON.stringify(current, null, 2) + '\n', 'utf8');
  writeFileSync(
    path.join(root, '.sb-codex-tool/summaries/custom-verification-summary.md'),
    '# Custom Verification Summary\n',
    'utf8',
  );

  beginWorkCycle(root, 'artifact-automation', 'Artifact Automation');

  const rerunCurrent = JSON.parse(readFileSync(currentPath, 'utf8'));
  assert.equal(rerunCurrent.currentStage, 'verify');
  assert.equal(rerunCurrent.nextAction, 'Run fresh verification.');
  assert.equal(
    rerunCurrent.latestRelevantSummary,
    '.sb-codex-tool/summaries/custom-verification-summary.md',
  );

  const readThisFirst = readFileSync(
    path.join(root, '.sb-codex-tool/guides/read-this-first.md'),
    'utf8',
  );
  assert.match(readThisFirst, /Current stage: verify/);
  const summaryIndex = readThisFirst.indexOf('custom-verification-summary.md');
  const planIndex = readThisFirst.indexOf('artifact-automation-approved.md');
  const guideIndex = readThisFirst.indexOf('artifact-automation-scope.md');
  assert.notEqual(summaryIndex, -1);
  assert.notEqual(planIndex, -1);
  assert.notEqual(guideIndex, -1);
  assert.ok(summaryIndex < planIndex);
  assert.ok(planIndex < guideIndex);
  assert.match(readThisFirst, /custom-verification-summary\.md/);
  assert.match(readThisFirst, new RegExp(result.guidePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));

  const report = runDoctor(root);
  const failures = report.results.filter((item) => item.level === 'fail');
  const failureLabels = failures.map((item) => item.label);
  assert.ok(failureLabels.includes('approved plan readiness'));
  assert.ok(failureLabels.includes('current task guide readiness'));
  assert.ok(failureLabels.includes('current handoff readiness'));
});

test('beginWorkCycle records git context in a lifecycle run and handoff when git is available', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'sb-codex-tool-begin-git-'));

  scaffoldProject(root);
  initGitRepo(root);
  commitAll(root, 'initial scaffold');
  writeFileSync(path.join(root, 'notes.txt'), 'dirty working tree\n', 'utf8');

  const result = beginWorkCycle(root, 'artifact-automation', 'Artifact Automation');
  const run = JSON.parse(readFileSync(path.join(root, result.runPath), 'utf8'));
  const handoff = readFileSync(path.join(root, result.handoffPath), 'utf8');

  assert.equal(run.phase, 'begin');
  assert.equal(run.stage, 'clarify');
  assert.equal(run.verdict, 'pending');
  assert.equal(run.git.available, true);
  assert.equal(run.git.branch, 'main');
  assert.equal(run.git.dirty, true);
  assert.ok(run.git.changedFiles.includes('notes.txt'));
  assert.equal(run.paths.planPath, result.planPath);
  assert.equal(run.paths.executionSummaryPath, result.summaryPath);

  assert.match(handoff, /## Git Context/);
  assert.match(
    handoff,
    new RegExp(result.runPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
  );
  assert.match(handoff, /- Git available: yes/);
  assert.match(handoff, /- Branch: main/);
  assert.match(handoff, /- Dirty: yes/);
  assert.match(handoff, /notes\.txt/);
});

test('doctor fails when read-this-first hot-path order drifts from current state', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'sb-codex-tool-begin-order-'));

  scaffoldProject(root);
  const result = beginWorkCycle(root, 'artifact-automation', 'Artifact Automation');

  writeFileSync(
    path.join(root, '.sb-codex-tool/guides/read-this-first.md'),
    `# Read This First

## Hot Path

Read in this order before implementation or verification:

1. .sb-codex-tool/project.md
2. .sb-codex-tool/state.md
3. .sb-codex-tool/guides/read-this-first.md
4. .sb-codex-tool/guides/code-consistency.md
5. ${result.guidePath}
6. ${result.planPath}
7. ${result.summaryPath}

## Additional Repo Docs

- docs/menu/implementation.md

- docs/implementation/verification-contract.md
- docs/implementation/acceptance-checklist.md

## Current Cycle

- Current stage: clarify
- Latest approved plan: ${result.planPath}
- Latest relevant summary: ${result.summaryPath}
- Current task guide: ${result.guidePath}
- Current handoff: ${result.handoffPath}
- Current review: ${result.reviewPath}

## Default Ignore Guidance

- Ignore build outputs, caches, and bulky generated artifacts by default.
- Keep .sb-codex-tool/logs/work-journal/ out of the default hot path.
- Do not ignore AGENTS.md, guide files, state files, or current summaries.
`,
    'utf8',
  );

  const report = runDoctor(root);
  const hotPathFailure = report.results.find(
    (item) =>
      item.level === 'fail' &&
      item.label === 'read-this-first hot path' &&
      item.detail.includes('order'),
  );

  assert.ok(hotPathFailure);
});
