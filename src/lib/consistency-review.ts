import path from 'node:path';

import {
  humanizeSlug,
  normalizeSlug,
  parseCycleDescriptor,
  readCycleTitle,
} from './cycle.ts';
import {
  normalizeCurrentIndex,
  readCurrentIndex,
  writeCurrentArtifacts,
} from './current-state.ts';
import { readTextIfPresent, writeFileIfMissing } from './fs.ts';
import { extractSectionLines } from './markdown-sections.ts';
import { resolveProjectRoot, STATE_ROOT_NAME } from './paths.ts';
import { buildTemplateContext } from './templates.ts';

export interface ConsistencyReviewResult {
  root: string;
  agentName: string;
  title: string;
  reviewPath: string;
  createdFiles: string[];
  keptFiles: string[];
  updatedFiles: string[];
}

function readAllowedFileScope(root: string, guidePath: string | null): string[] {
  if (guidePath === null) {
    return [];
  }

  const text = readTextIfPresent(path.join(root, guidePath));
  if (text === null) {
    return [];
  }

  return extractSectionLines(text, 'Allowed File Scope');
}

function buildConsistencyReview(
  agentName: string,
  title: string,
  current: ReturnType<typeof normalizeCurrentIndex>,
  allowedFileScope: string[],
): string {
  const fileScope = allowedFileScope.length > 0
    ? allowedFileScope.join('\n')
    : '- Replace with the bounded file scope for this review.';

  return `# Code Consistency Review: ${title}

## Assigned Consistency Agent

- ${agentName}

## Review Target

- Current plan: ${current.latestApprovedPlan ?? 'none yet'}
- Latest summary: ${current.latestRelevantSummary ?? 'none yet'}
- Current guide: ${current.currentGuide ?? 'none yet'}
- Latest lifecycle run: ${current.latestRun ?? 'none yet'}

## Review Scope

${fileScope}

## Required References

- AGENTS.md
- ${STATE_ROOT_NAME}/guides/code-consistency.md
- ${current.latestApprovedPlan ?? `${STATE_ROOT_NAME}/plans/README.md`}
- ${current.latestRelevantSummary ?? `${STATE_ROOT_NAME}/summaries/README.md`}
- ${current.currentGuide ?? `${STATE_ROOT_NAME}/guides/read-this-first.md`}

## Review Questions

- Do naming and module boundaries still match the consistency guide?
- Did the latest increment preserve reuse, readability, and low complexity?
- Are there new anti-patterns or consistency drifts that should be recorded?
- Is the code still easy for a fresh agent to read and modify?

## Findings

- Add findings here in severity order.

## Recommendations

- Add follow-up recommendations here.

## Guide Update Decision

- Record whether ${STATE_ROOT_NAME}/guides/code-consistency.md needs an update.
`;
}

export function createConsistencyReview(
  start: string,
  agentName: string,
  requestedTitle?: string,
): ConsistencyReviewResult {
  const root = resolveProjectRoot(start);
  const current = normalizeCurrentIndex(readCurrentIndex(root));

  if (current.latestApprovedPlan === null) {
    throw new Error('review-consistency requires a current approved plan.');
  }
  if (current.latestRelevantSummary === null) {
    throw new Error('review-consistency requires a current summary.');
  }
  if (current.currentGuide === null) {
    throw new Error('review-consistency requires a current task guide.');
  }

  const agentSlug = normalizeSlug(agentName);
  if (agentSlug.length === 0) {
    throw new Error('Agent name must contain at least one alphanumeric character.');
  }

  const { dateStamp, slug } = parseCycleDescriptor(current.latestApprovedPlan);
  const cycleTitle = readCycleTitle(root, current.latestApprovedPlan, slug);
  const title = requestedTitle?.trim().length
    ? requestedTitle.trim()
    : `${cycleTitle} Consistency Review`;
  const reviewPath =
    `${STATE_ROOT_NAME}/reviews/${dateStamp}-${slug}-${agentSlug}-consistency-review.md`;
  const allowedFileScope = readAllowedFileScope(root, current.currentGuide);

  const writeResult = writeFileIfMissing(
    path.join(root, reviewPath),
    buildConsistencyReview(agentName, title, current, allowedFileScope),
  );

  const createdFiles: string[] = [];
  const keptFiles: string[] = [];
  if (writeResult === 'created') {
    createdFiles.push(reviewPath);
  } else {
    keptFiles.push(reviewPath);
  }

  const nextFocusModules = current.currentFocusModules.includes(reviewPath)
    ? current.currentFocusModules
    : [...current.currentFocusModules, reviewPath];

  const nextCurrent = normalizeCurrentIndex({
    ...current,
    latestConsistencyReview: reviewPath,
    currentFocusModules: nextFocusModules,
    activeAgents: {
      ...current.activeAgents,
      consistency: agentName,
    },
    notes: [
      `Current work cycle: ${humanizeSlug(slug)}.`,
      `Prepared consistency review for ${agentName}: ${reviewPath}.`,
      `Previous relevant summary: ${current.latestRelevantSummary}`,
    ],
  });

  const updatedFiles: string[] = [];
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
    agentName,
    title,
    reviewPath,
    createdFiles,
    keptFiles,
    updatedFiles,
  };
}
