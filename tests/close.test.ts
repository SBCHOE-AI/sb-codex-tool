import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  normalizeCurrentIndex,
  readCurrentIndex,
  writeCurrentArtifacts,
} from '../src/lib/current-state.ts';
import { runDoctor } from '../src/lib/doctor.ts';
import { scaffoldProject } from '../src/lib/scaffold.ts';
import { buildTemplateContext } from '../src/lib/templates.ts';
import { beginWorkCycle } from '../src/lib/work-cycle.ts';
import { closeCurrentCycle } from '../src/lib/close-cycle.ts';

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

function writeFreshReview(
  root: string,
  reviewPath: string,
  verdict: 'pass' | 'pass_with_concerns' | 'fail' | 'blocked',
): void {
  const sections = {
    pass: {
      findings: '- None.',
      concerns: '- None.',
      missingEvidence: '- None.',
    },
    pass_with_concerns: {
      findings: '- None.',
      concerns: '- The closure templates are acceptable, but richer structured concern input would still help.',
      missingEvidence: '- None.',
    },
    fail: {
      findings: '- The review result must not be authored by the same implementation session.',
      concerns: '- None.',
      missingEvidence: '- None.',
    },
    blocked: {
      findings: '- None.',
      concerns: '- None.',
      missingEvidence: '- The fresh verification evidence is incomplete.',
    },
  }[verdict];

  writeFileSync(
    path.join(root, reviewPath),
    `# Fresh Verification Review: Closure Flow

## Verification Target

- Closure Flow

## Verdict

- ${verdict}

## Required Checks

- Contract reading order completed
- Acceptance criteria reviewed
- State and guide artifacts inspected
- Relevant code and tests inspected
- Required checks run

## Checks Run

- node --experimental-strip-types --test tests/*.test.ts
- node --experimental-strip-types src/cli.ts doctor

## Findings

${sections.findings}

## Concerns

${sections.concerns}

## Missing Evidence

${sections.missingEvidence}

## Work Journal Decision

- pending
`,
    'utf8',
  );
}

test('closeCurrentCycle pass writes closure artifacts and returns to clarify', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'sb-codex-tool-close-pass-'));

  scaffoldProject(root);
  const begin = beginWorkCycle(root, 'closure-flow', 'Closure Flow');
  moveCurrentCycleToVerify(root);
  writeFileSync(
    path.join(root, begin.planPath),
    `# Approved Plan: Closure Flow

## Objective

- Add closure automation so the current review can drive finalization safely.

## Acceptance Criteria

- close reads the fresh verification verdict and writes the verification summary.
- verified closure returns the current state to clarify and writes the work journal.

## Boundaries

- In scope: close orchestration and work-journal integration.
- Out of scope: changing begin scaffolds.

## Tasks

### Task 1

- files: \`src/lib/close-cycle.ts\`, \`src/lib/work-journal.ts\`, \`tests/close.test.ts\`
- action: add closure automation and validate verified closure behavior
- verify: run the close tests and inspect the verification summary and journal
- done: yes
`,
    'utf8',
  );
  writeFileSync(
    path.join(root, begin.summaryPath),
    `# Execution Summary: Closure Flow

## Purpose

- Capture implementation progress for the current work cycle before fresh verification.

## Scope

- Add closure automation so the current review can drive finalization safely.
  Keep the work journal readable when execution summaries wrap long bullets.

## Implemented Surface

- Added src/lib/close-cycle.ts.
  It finalizes verified closure from the fresh review artifact.
- Added src/lib/work-journal.ts.
  It writes the human-readable daily log after verified closure.
- Added tests/close.test.ts.
  It covers the close flow and journal update behavior.

## Checks Run

- node --experimental-strip-types --test tests/*.test.ts

## Plan vs Actual

- Planned: closure automation
- Actual: delivered

## Refactor Notes

- none

## Deferred Issues

- none

## Next-Agent Guidance

- Start from this execution summary.
- Then review ${begin.planPath}.
- Then review ${begin.guidePath}.
`,
    'utf8',
  );
  writeFileSync(
    path.join(root, begin.guidePath),
    `# Scope Guide: Closure Flow

## Purpose

- Narrow the current work cycle to a bounded file scope and clear verification expectations.

## Working Goal

- Add closure automation.

## Primary Plan

- ${begin.planPath}

## Allowed File Scope

- src/lib/close-cycle.ts
- src/lib/work-journal.ts
- tests/close.test.ts

## Recommended References

- AGENTS.md

## Verification Expectations

- close pass closes safely
`,
    'utf8',
  );
  writeFileSync(
    path.join(root, begin.handoffPath),
    `# Handoff: Closure Flow

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

- Closure automation is implemented and ready for fresh verification.

## Git Context

- Run artifact: ${begin.runPath}
- Git available: no
- Branch: unavailable
- Dirty: unavailable
- Changed files: unavailable outside a Git repository

## Expected Verification Checks

- Run the close tests.
- Confirm verified closure returns the state to clarify and writes the work journal.

## Open Risks

- None.
`,
    'utf8',
  );
  writeFreshReview(root, begin.reviewPath, 'pass');

  const result = closeCurrentCycle(root);

  assert.equal(result.title, 'Closure Flow');
  assert.ok(existsSync(path.join(root, result.verificationSummaryPath)));
  assert.ok(existsSync(path.join(root, result.runPath)));
  assert.ok(existsSync(path.join(root, result.journalPath ?? '')));

  const review = readFileSync(path.join(root, result.reviewPath), 'utf8');
  assert.match(review, /## Verdict[\s\S]*- pass/);

  const current = JSON.parse(
    readFileSync(path.join(root, '.sb-codex-tool/index/current.json'), 'utf8'),
  );
  assert.equal(current.currentStage, 'clarify');
  assert.equal(current.latestRelevantSummary, result.verificationSummaryPath);
  assert.equal(current.latestRun, result.runPath);

  const readThisFirst = readFileSync(
    path.join(root, '.sb-codex-tool/guides/read-this-first.md'),
    'utf8',
  );
  assert.match(readThisFirst, /Current stage: clarify/);
  assert.match(
    readThisFirst,
    new RegExp(`Latest lifecycle run: ${result.runPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`),
  );
  assert.match(
    readThisFirst,
    new RegExp(result.verificationSummaryPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
  );

  const journal = readFileSync(path.join(root, result.journalPath ?? ''), 'utf8');
  assert.match(journal, /## Entry: Closure Flow/);
  assert.match(journal, /Fresh verification verdict: `pass`/);
  assert.match(
    journal,
    /Add closure automation so the current review can drive finalization safely\.\n  Keep the work journal readable when execution summaries wrap long bullets\./,
  );
  assert.match(
    journal,
    /Added src\/lib\/close-cycle\.ts\.\n  It finalizes verified closure from the fresh review artifact\./,
  );
  assert.match(journal, /src\/lib\/close-cycle\.ts/);

  const report = runDoctor(root);
  const failures = report.results.filter((item) => item.level === 'fail');
  assert.equal(failures.length, 0);

  assert.match(
    readFileSync(path.join(root, begin.summaryPath), 'utf8'),
    /Start from this execution summary/,
  );
  assert.match(
    readFileSync(path.join(root, result.verificationSummaryPath), 'utf8'),
    /## Git Context[\s\S]*- Git available: no/,
  );
});

test('closeCurrentCycle rejects closing verdicts when next-agent guidance is missing', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'sb-codex-tool-close-missing-guidance-'));

  scaffoldProject(root);
  const begin = beginWorkCycle(root, 'closure-flow', 'Closure Flow');
  moveCurrentCycleToVerify(root);
  writeFileSync(
    path.join(root, begin.summaryPath),
    `# Execution Summary: Closure Flow

## Purpose

- Capture implementation progress for the current work cycle before fresh verification.

## Scope

- Add closure automation so the current review can drive finalization safely.

## Implemented Surface

- Added src/lib/close-cycle.ts.

## Checks Run

- node --experimental-strip-types --test tests/*.test.ts

## Plan vs Actual

- Planned: closure automation
- Actual: delivered

## Refactor Notes

- none

## Deferred Issues

- none
`,
    'utf8',
  );
  writeFreshReview(root, begin.reviewPath, 'pass');

  assert.throws(
    () => closeCurrentCycle(root),
    /execution summary to include explicit Next-Agent Guidance/,
  );

  const review = readFileSync(path.join(root, begin.reviewPath), 'utf8');
  assert.match(review, /## Work Journal Decision[\s\S]*- pending/);

  const verificationSummaryPath = path.join(
    root,
    '.sb-codex-tool/summaries/2026-04-04-closure-flow-verification-summary.md',
  );
  assert.equal(existsSync(verificationSummaryPath), false);
});

test('closeCurrentCycle fail keeps the cycle in verify and skips the work journal', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'sb-codex-tool-close-fail-'));

  scaffoldProject(root);
  const begin = beginWorkCycle(root, 'closure-flow', 'Closure Flow');
  moveCurrentCycleToVerify(root);
  writeFreshReview(root, begin.reviewPath, 'fail');

  const result = closeCurrentCycle(root);

  assert.equal(result.journalPath, null);
  assert.ok(existsSync(path.join(root, result.verificationSummaryPath)));

  const review = readFileSync(path.join(root, result.reviewPath), 'utf8');
  assert.match(review, /## Verdict[\s\S]*- fail/);

  const current = JSON.parse(
    readFileSync(path.join(root, '.sb-codex-tool/index/current.json'), 'utf8'),
  );
  assert.equal(current.currentStage, 'verify');
  assert.equal(current.latestRelevantSummary, result.verificationSummaryPath);
  assert.equal(
    current.nextAction,
    'Address the latest fail verification result for Closure Flow and rerun fresh verification.',
  );
  assert.equal(current.latestRun, result.runPath);

  const journalFiles = readdirSync(path.join(root, '.sb-codex-tool/logs/work-journal'));
  assert.deepEqual(journalFiles, ['README.md']);
});

test('closeCurrentCycle rejects pending review verdicts', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'sb-codex-tool-close-pending-'));

  scaffoldProject(root);
  beginWorkCycle(root, 'closure-flow', 'Closure Flow');
  moveCurrentCycleToVerify(root);

  assert.throws(
    () => closeCurrentCycle(root),
    /current review to contain a final verification verdict/,
  );
});

test('closeCurrentCycle pass_with_concerns closes only with explicit concerns', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'sb-codex-tool-close-concerns-'));

  scaffoldProject(root);
  const begin = beginWorkCycle(root, 'closure-flow', 'Closure Flow');
  moveCurrentCycleToVerify(root);
  writeFreshReview(root, begin.reviewPath, 'pass_with_concerns');

  const result = closeCurrentCycle(root);

  assert.equal(result.verdict, 'pass_with_concerns');
  assert.ok(existsSync(path.join(root, result.journalPath ?? '')));

  const current = JSON.parse(
    readFileSync(path.join(root, '.sb-codex-tool/index/current.json'), 'utf8'),
  );
  assert.equal(current.currentStage, 'clarify');

  const journal = readFileSync(path.join(root, result.journalPath ?? ''), 'utf8');
  assert.match(
    journal,
    /The closure templates are acceptable, but richer structured concern input would still help\./,
  );
});

test('closeCurrentCycle blocked keeps verify and requires explicit missing evidence', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'sb-codex-tool-close-blocked-'));

  scaffoldProject(root);
  const begin = beginWorkCycle(root, 'closure-flow', 'Closure Flow');
  moveCurrentCycleToVerify(root);
  writeFreshReview(root, begin.reviewPath, 'blocked');

  const result = closeCurrentCycle(root);

  assert.equal(result.verdict, 'blocked');
  assert.equal(result.journalPath, null);

  const current = JSON.parse(
    readFileSync(path.join(root, '.sb-codex-tool/index/current.json'), 'utf8'),
  );
  assert.equal(current.currentStage, 'verify');
  assert.equal(
    current.nextAction,
    'Address the latest blocked verification result for Closure Flow and rerun fresh verification.',
  );
});

test('closeCurrentCycle rejects mixed placeholder concerns for pass_with_concerns', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'sb-codex-tool-close-mixed-concerns-'));

  scaffoldProject(root);
  const begin = beginWorkCycle(root, 'closure-flow', 'Closure Flow');
  moveCurrentCycleToVerify(root);
  writeFileSync(
    path.join(root, begin.reviewPath),
    `# Fresh Verification Review: Closure Flow

## Verification Target

- Closure Flow

## Verdict

- pass_with_concerns

## Required Checks

- Contract reading order completed

## Checks Run

- node --experimental-strip-types --test tests/*.test.ts

## Findings

- None.

## Concerns

- Add non-blocking concerns here.
- There is a real concern, but the placeholder was left behind.

## Missing Evidence

- None.

## Work Journal Decision

- pending
`,
    'utf8',
  );

  assert.throws(
    () => closeCurrentCycle(root),
    /explicit concerns in the review/,
  );
});

test('closeCurrentCycle rejects mixed placeholder missing evidence for blocked', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'sb-codex-tool-close-mixed-blocked-'));

  scaffoldProject(root);
  const begin = beginWorkCycle(root, 'closure-flow', 'Closure Flow');
  moveCurrentCycleToVerify(root);
  writeFileSync(
    path.join(root, begin.reviewPath),
    `# Fresh Verification Review: Closure Flow

## Verification Target

- Closure Flow

## Verdict

- blocked

## Required Checks

- Contract reading order completed

## Checks Run

- node --experimental-strip-types --test tests/*.test.ts

## Findings

- None.

## Concerns

- None.

## Missing Evidence

- Add any blocked evidence here.
- The required evidence is still incomplete.

## Work Journal Decision

- pending
`,
    'utf8',
  );

  assert.throws(
    () => closeCurrentCycle(root),
    /explicit missing evidence details/,
  );
});

test('closeCurrentCycle rejects mixed placeholder findings for fail', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'sb-codex-tool-close-mixed-fail-'));

  scaffoldProject(root);
  const begin = beginWorkCycle(root, 'closure-flow', 'Closure Flow');
  moveCurrentCycleToVerify(root);
  writeFileSync(
    path.join(root, begin.reviewPath),
    `# Fresh Verification Review: Closure Flow

## Verification Target

- Closure Flow

## Verdict

- fail

## Required Checks

- Contract reading order completed

## Checks Run

- node --experimental-strip-types --test tests/*.test.ts

## Findings

- Add findings here in severity order.
- There is a real failure detail, but the placeholder was left behind.

## Concerns

- None.

## Missing Evidence

- None.

## Work Journal Decision

- pending
`,
    'utf8',
  );

  assert.throws(
    () => closeCurrentCycle(root),
    /explicit findings in the review/,
  );
});

test('closeCurrentCycle records git context in the closing run and verification summary when git is available', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'sb-codex-tool-close-git-'));

  scaffoldProject(root);
  initGitRepo(root);
  commitAll(root, 'initial scaffold');

  const begin = beginWorkCycle(root, 'closure-flow', 'Closure Flow');
  writeFileSync(path.join(root, 'notes.txt'), 'dirty before close\n', 'utf8');
  moveCurrentCycleToVerify(root);
  writeFileSync(
    path.join(root, begin.summaryPath),
    `# Execution Summary: Closure Flow

## Purpose

- Capture implementation progress for the current work cycle before fresh verification.

## Scope

- Add closure automation so a verified work cycle can be finalized with one command.

## Implemented Surface

- Added src/lib/close-cycle.ts.

## Checks Run

- node --experimental-strip-types --test tests/*.test.ts

## Plan vs Actual

- Planned: closure automation
- Actual: delivered

## Refactor Notes

- none

## Deferred Issues

- none

## Next-Agent Guidance

- Start from this execution summary.
- Then review ${begin.planPath}.
- Then review ${begin.guidePath}.
`,
    'utf8',
  );
  writeFreshReview(root, begin.reviewPath, 'pass');

  const result = closeCurrentCycle(root);
  const run = JSON.parse(readFileSync(path.join(root, result.runPath), 'utf8'));
  const summary = readFileSync(path.join(root, result.verificationSummaryPath), 'utf8');

  assert.equal(run.phase, 'close');
  assert.equal(run.stage, 'clarify');
  assert.equal(run.verdict, 'pass');
  assert.equal(run.git.available, true);
  assert.equal(run.git.branch, 'main');
  assert.equal(run.git.dirty, true);
  assert.ok(run.git.changedFiles.includes('notes.txt'));
  assert.equal(run.paths.verificationSummaryPath, result.verificationSummaryPath);
  assert.equal(run.paths.journalPath, result.journalPath);

  assert.match(summary, /## Git Context/);
  assert.match(
    summary,
    new RegExp(result.runPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
  );
  assert.match(summary, /- Git available: yes/);
  assert.match(summary, /- Branch: main/);
  assert.match(summary, /- Dirty: yes/);
  assert.match(summary, /notes\.txt/);
});
