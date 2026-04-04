import path from 'node:path';

import { formatDateStamp, humanizeSlug, normalizeSlug } from './cycle.ts';
import { normalizeCurrentIndex, readCurrentIndex, writeCurrentArtifacts } from './current-state.ts';
import { writeFileIfMissing } from './fs.ts';
import { getGitContext } from './git.ts';
import { resolveProjectRoot, STATE_ROOT_NAME } from './paths.ts';
import {
  lifecycleRunPath,
  renderGitContextSection,
  writeLifecycleRunRecord,
} from './run-records.ts';
import { buildTemplateContext } from './templates.ts';

export interface BeginWorkCycleResult {
  root: string;
  slug: string;
  title: string;
  createdFiles: string[];
  keptFiles: string[];
  updatedFiles: string[];
  planPath: string;
  summaryPath: string;
  runPath: string;
  handoffPath: string;
  reviewPath: string;
  guidePath: string;
}

function planTemplate(title: string): string {
  return `# Approved Plan: ${title}

## Objective

- Replace with the concrete objective for this work cycle.

## Acceptance Criteria

- Replace with the acceptance criteria that define completion.

## Boundaries

- Replace with in-scope and out-of-scope notes.

## Tasks

### Task 1

- files: \`fill-in-file-scope\`
- action: describe the concrete implementation task
- verify: describe how this task will be checked
- done: no
`;
}

function executionSummaryTemplate(title: string, guidePath: string, planPath: string): string {
  return `# Execution Summary: ${title}

## Purpose

- Capture implementation progress for the current work cycle before fresh verification.

## Scope

- Replace with the actual implementation scope.

## Implemented Surface

- not started yet

## Checks Run

- none yet

## Plan vs Actual

- Update this section as implementation progresses.

## Refactor Notes

- Update this section after refactor.

## Deferred Issues

- Add deferred issues if they exist.

## Next-Agent Guidance

- Start from this execution summary as the latest relevant summary.
- Then review \`${planPath}\`.
- Then review \`${guidePath}\`.
`;
}

function handoffTemplate(
  title: string,
  guidePath: string,
  planPath: string,
  summaryPath: string,
  gitContextSection: string,
): string {
  return `# Handoff: ${title}

## Goal

- Enable the next fresh agent to continue this work cycle without hidden context.

## Read In This Order

1. AGENTS.md
2. ${STATE_ROOT_NAME}/project.md
3. ${STATE_ROOT_NAME}/state.md
4. ${STATE_ROOT_NAME}/guides/read-this-first.md
5. ${STATE_ROOT_NAME}/guides/code-consistency.md
6. ${summaryPath}
7. ${planPath}
8. ${guidePath}

## Current Status

- Replace with the current implementation status.

${gitContextSection}

## Expected Verification Checks

- Replace with the checks relevant to this work cycle.

## Open Risks

- Replace with the current blocker or risk list.
`;
}

function reviewTemplate(title: string): string {
  return `# Fresh Verification Review: ${title}

## Verification Target

- ${title}

## Verdict

- pending

## Required Checks

- Contract reading order completed
- Acceptance criteria reviewed
- State and guide artifacts inspected
- Relevant code and tests inspected
- Required checks run

## Checks Run

- Add the checks run during the fresh verification pass.

## Findings

- Add findings here in severity order.

## Concerns

- Add non-blocking concerns here.

## Missing Evidence

- Add any blocked evidence here.

## Work Journal Decision

- Record whether verified closure is complete enough to update the work journal.
`;
}

function scopeGuideTemplate(
  title: string,
  planPath: string,
  previousSummary: string | null,
): string {
  return `# Scope Guide: ${title}

## Purpose

- Narrow the current work cycle to a bounded file scope and clear verification expectations.

## Working Goal

- Replace with the concrete goal for this cycle.

## Primary Plan

- ${planPath}

## Allowed File Scope

- Replace with the files or modules that should be touched.

## Recommended References

- AGENTS.md
- ${STATE_ROOT_NAME}/project.md
- ${STATE_ROOT_NAME}/state.md
- ${STATE_ROOT_NAME}/guides/code-consistency.md
${previousSummary === null ? '' : `- ${previousSummary}\n`}
## Verification Expectations

- Replace with the checks and verdict expectations for this cycle.
`;
}

export function beginWorkCycle(
  start: string,
  requestedSlug: string,
  requestedTitle?: string,
): BeginWorkCycleResult {
  const root = resolveProjectRoot(start);
  const slug = normalizeSlug(requestedSlug);
  if (slug.length === 0) {
    throw new Error('Work-cycle slug must contain at least one alphanumeric character.');
  }

  const title = requestedTitle?.trim().length
    ? requestedTitle.trim()
    : humanizeSlug(slug);
  const dateStamp = formatDateStamp();
  const current = normalizeCurrentIndex(readCurrentIndex(root));
  const previousSummary = current.latestRelevantSummary;

  const planPath = `${STATE_ROOT_NAME}/plans/${dateStamp}-${slug}-approved.md`;
  const summaryPath = `${STATE_ROOT_NAME}/summaries/${dateStamp}-${slug}-execution-summary.md`;
  const handoffPath = `${STATE_ROOT_NAME}/handoffs/${dateStamp}-${slug}-to-verification.md`;
  const reviewPath = `${STATE_ROOT_NAME}/reviews/${dateStamp}-${slug}-fresh-verification.md`;
  const guidePath = `${STATE_ROOT_NAME}/guides/${dateStamp}-${slug}-scope.md`;
  const runPath = lifecycleRunPath(dateStamp, slug);
  const sameCycle = current.latestApprovedPlan === planPath;

  const generatedFiles = [
    { path: planPath, content: planTemplate(title) },
    { path: summaryPath, content: executionSummaryTemplate(title, guidePath, planPath) },
    { path: reviewPath, content: reviewTemplate(title) },
    { path: guidePath, content: scopeGuideTemplate(title, planPath, previousSummary) },
  ];

  const createdFiles: string[] = [];
  const keptFiles: string[] = [];
  for (const file of generatedFiles) {
    const result = writeFileIfMissing(path.join(root, file.path), file.content);
    if (result === 'created') {
      createdFiles.push(file.path);
    } else {
      keptFiles.push(file.path);
    }
  }

  const latestSummary = sameCycle
    ? current.latestRelevantSummary ?? summaryPath
    : summaryPath;
  const git = getGitContext(root);
  const handoffContent = handoffTemplate(
    title,
    guidePath,
    planPath,
    summaryPath,
    renderGitContextSection(runPath, git),
  );
  const handoffWrite = writeFileIfMissing(path.join(root, handoffPath), handoffContent);
  if (handoffWrite === 'created') {
    createdFiles.push(handoffPath);
  } else {
    keptFiles.push(handoffPath);
  }
  const currentGuide = sameCycle ? current.currentGuide ?? guidePath : guidePath;
  const currentHandoff = sameCycle ? current.currentHandoff ?? handoffPath : handoffPath;
  const currentReview = sameCycle ? current.currentReview ?? reviewPath : reviewPath;
  const latestRun = sameCycle ? current.latestRun ?? runPath : runPath;
  const updatedFiles: string[] = [];

  const runWrite = writeLifecycleRunRecord(root, {
    dateStamp,
    slug,
    title,
    phase: 'begin',
    stage: sameCycle ? current.currentStage : 'clarify',
    verdict: 'pending',
    git,
    paths: {
      planPath,
      executionSummaryPath: summaryPath,
      handoffPath: currentHandoff,
      reviewPath: currentReview,
      guidePath: currentGuide,
      verificationSummaryPath: null,
      journalPath: null,
    },
  });
  if (runWrite.writeResult === 'created') {
    createdFiles.push(runWrite.path);
  } else if (runWrite.writeResult === 'updated') {
    updatedFiles.push(runWrite.path);
  }

  const nextCurrent = normalizeCurrentIndex({
    ...current,
    currentStage: sameCycle ? current.currentStage : 'clarify',
    nextAction: sameCycle
      ? current.nextAction
      : `Fill in ${planPath} and narrow ${guidePath} before implementation starts.`,
    latestApprovedPlan: planPath,
    latestRelevantSummary: latestSummary,
    latestRun,
    currentGuide,
    currentHandoff,
    currentReview,
    currentFocusModules: [
      'AGENTS.md',
      `${STATE_ROOT_NAME}/guides/code-consistency.md`,
      latestRun,
      latestSummary,
      planPath,
      currentGuide,
      currentHandoff,
      currentReview,
    ],
    hotPath: [
      `${STATE_ROOT_NAME}/project.md`,
      `${STATE_ROOT_NAME}/state.md`,
      `${STATE_ROOT_NAME}/guides/read-this-first.md`,
      `${STATE_ROOT_NAME}/guides/code-consistency.md`,
      latestSummary,
      planPath,
      currentGuide,
    ],
    activeAgents: sameCycle
      ? current.activeAgents
      : {
          main: 'current main session',
          subagents: [],
          verification: null,
          consistency: null,
        },
    notes: sameCycle
      ? current.notes
      : [
          `Current work cycle: ${title}.`,
          `Fill in the approved plan and scope guide before implementation starts.`,
          previousSummary === null
            ? 'No previous summary was recorded.'
            : `Previous relevant summary: ${previousSummary}`,
        ],
  });

  const currentWrites = writeCurrentArtifacts(
    root,
    nextCurrent,
    buildTemplateContext(root).implementationMenuPath,
  );
  if (currentWrites.index !== 'unchanged') {
    updatedFiles.push(`${STATE_ROOT_NAME}/index/current.json`);
  }
  if (currentWrites.state !== 'unchanged') {
    updatedFiles.push(`${STATE_ROOT_NAME}/state.md`);
  }
  if (currentWrites.readThisFirst !== 'unchanged') {
    updatedFiles.push(`${STATE_ROOT_NAME}/guides/read-this-first.md`);
  }

  return {
    root,
    slug,
    title,
    createdFiles,
    keptFiles,
    updatedFiles,
    planPath,
    summaryPath,
    runPath: runWrite.path,
    handoffPath,
    reviewPath,
    guidePath,
  };
}
