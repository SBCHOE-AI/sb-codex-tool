import path from 'node:path';

import { parseCycleDescriptor, readCycleTitle } from './cycle.ts';
import {
  normalizeCurrentIndex,
  readCurrentIndex,
  writeCurrentArtifacts,
} from './current-state.ts';
import { readTextIfPresent, writeFileIfChanged } from './fs.ts';
import { getGitContext } from './git.ts';
import { extractSectionLines, stripBulletPrefix } from './markdown-sections.ts';
import { resolveProjectRoot, STATE_ROOT_NAME } from './paths.ts';
import {
  renderGitContextSection,
  writeLifecycleRunRecord,
} from './run-records.ts';
import { buildTemplateContext } from './templates.ts';

export interface PrepareVerifyResult {
  root: string;
  title: string;
  runPath: string;
  handoffPath: string;
  updatedFiles: string[];
}

interface ExecutionSummaryContext {
  scope: string[];
  implementedSurface: string[];
  deferredIssues: string[];
  nextAgentGuidance: string[];
}

function readSummaryContext(root: string, summaryPath: string): ExecutionSummaryContext {
  const text = readTextIfPresent(path.join(root, summaryPath));
  if (text === null) {
    throw new Error(`prepare-verify requires the execution summary ${summaryPath}.`);
  }

  return {
    scope: extractSectionLines(text, 'Scope'),
    implementedSurface: extractSectionLines(text, 'Implemented Surface'),
    deferredIssues: extractSectionLines(text, 'Deferred Issues'),
    nextAgentGuidance: extractSectionLines(text, 'Next-Agent Guidance'),
  };
}

function readVerificationExpectations(root: string, guidePath: string): string[] {
  const text = readTextIfPresent(path.join(root, guidePath));
  if (text === null) {
    throw new Error(`prepare-verify requires the current guide ${guidePath}.`);
  }

  return extractSectionLines(text, 'Verification Expectations');
}

function ensureExplicitLines(lines: string[], label: string): string[] {
  const values = stripBulletPrefix(lines)
    .map((line) => line.trim())
    .filter((line) =>
      line.length > 0 &&
      line !== 'none' &&
      line !== 'none.' &&
      line !== 'not started yet' &&
      line !== 'none yet',
    );

  if (values.length === 0) {
    throw new Error(`prepare-verify requires explicit ${label} before verify can start.`);
  }

  return values;
}

function renderBulletList(items: string[]): string {
  return items.map((item) => `- ${item}`).join('\n');
}

function buildHandoff(
  title: string,
  summaryContext: ExecutionSummaryContext,
  verificationExpectations: string[],
  summaryPath: string,
  planPath: string,
  guidePath: string,
  runPath: string,
  gitContextSection: string,
): string {
  const implementedSurface = ensureExplicitLines(
    summaryContext.implementedSurface,
    'implemented surface details',
  );
  const nextAgentGuidance = ensureExplicitLines(
    summaryContext.nextAgentGuidance,
    'next-agent guidance',
  );
  const checks = ensureExplicitLines(
    verificationExpectations,
    'verification expectations',
  );
  const scope = stripBulletPrefix(summaryContext.scope).filter((line) => line.trim().length > 0);
  const risks = stripBulletPrefix(summaryContext.deferredIssues)
    .filter((line) => line.trim().length > 0 && line.trim().toLowerCase() !== 'none.');

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

${renderBulletList([
  ...scope,
  ...implementedSurface,
  'Implementation and refactor are ready for fresh verification.',
])}

${gitContextSection}
## Expected Verification Checks

${renderBulletList(checks)}

## Open Risks

${renderBulletList(risks.length > 0 ? risks : ['None.'])}

## Next-Agent Guidance

${renderBulletList(nextAgentGuidance)}
`;
}

export function prepareVerify(start: string): PrepareVerifyResult {
  const root = resolveProjectRoot(start);
  const current = normalizeCurrentIndex(readCurrentIndex(root));

  if (current.latestApprovedPlan === null) {
    throw new Error('prepare-verify requires a current approved plan.');
  }
  if (current.latestRelevantSummary === null) {
    throw new Error('prepare-verify requires a current execution summary.');
  }
  if (current.currentGuide === null) {
    throw new Error('prepare-verify requires a current task guide.');
  }
  if (current.currentHandoff === null) {
    throw new Error('prepare-verify requires a current handoff artifact.');
  }
  if (current.currentReview === null) {
    throw new Error('prepare-verify requires a current review artifact.');
  }

  const { dateStamp, slug } = parseCycleDescriptor(current.latestApprovedPlan);
  const title = readCycleTitle(root, current.latestApprovedPlan, slug);
  const summaryContext = readSummaryContext(root, current.latestRelevantSummary);
  const verificationExpectations = readVerificationExpectations(root, current.currentGuide);
  const git = getGitContext(root);

  const runWrite = writeLifecycleRunRecord(root, {
    dateStamp,
    slug,
    title,
    phase: 'prepare-verify',
    stage: 'verify',
    verdict: 'pending',
    git,
    paths: {
      planPath: current.latestApprovedPlan,
      executionSummaryPath: current.latestRelevantSummary,
      handoffPath: current.currentHandoff,
      reviewPath: current.currentReview,
      guidePath: current.currentGuide,
      verificationSummaryPath: null,
      journalPath: null,
    },
  });

  const handoffWrite = writeFileIfChanged(
    path.join(root, current.currentHandoff),
    buildHandoff(
      title,
      summaryContext,
      verificationExpectations,
      current.latestRelevantSummary,
      current.latestApprovedPlan,
      current.currentGuide,
      runWrite.path,
      renderGitContextSection(runWrite.path, git),
    ),
  );

  const nextCurrent = normalizeCurrentIndex({
    ...current,
    currentStage: 'verify',
    nextAction: `Run fresh verification for the ${title} increment.`,
    latestRun: runWrite.path,
    currentFocusModules: [
      'AGENTS.md',
      `${STATE_ROOT_NAME}/guides/code-consistency.md`,
      current.latestRelevantSummary,
      current.latestApprovedPlan,
      current.currentGuide,
      current.currentHandoff,
      current.currentReview,
      runWrite.path,
    ],
    hotPath: [
      `${STATE_ROOT_NAME}/project.md`,
      `${STATE_ROOT_NAME}/state.md`,
      `${STATE_ROOT_NAME}/guides/read-this-first.md`,
      `${STATE_ROOT_NAME}/guides/code-consistency.md`,
      current.latestRelevantSummary,
      current.latestApprovedPlan,
      current.currentGuide,
    ],
    activeAgents: {
      ...current.activeAgents,
      verification: 'pending assignment',
    },
    notes: [
      `Current work cycle: ${title}.`,
      'Execution and refactor are complete.',
      'Handoff and current-state artifacts are aligned for fresh verification.',
      `Previous relevant summary: ${current.latestRelevantSummary}`,
    ],
  });

  const updatedFiles: string[] = [];
  if (runWrite.writeResult === 'created' || runWrite.writeResult === 'updated') {
    updatedFiles.push(runWrite.path);
  }
  if (handoffWrite === 'created' || handoffWrite === 'updated') {
    updatedFiles.push(current.currentHandoff);
  }

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
    title,
    runPath: runWrite.path,
    handoffPath: current.currentHandoff,
    updatedFiles,
  };
}
