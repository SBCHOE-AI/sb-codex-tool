import path from 'node:path';

import { parseCycleDescriptor, readCycleTitle } from './cycle.ts';
import {
  normalizeCurrentIndex,
  readCurrentIndex,
  writeCurrentArtifacts,
} from './current-state.ts';
import { readTextIfPresent, writeFileIfChanged, type WriteResult } from './fs.ts';
import { getGitContext } from './git.ts';
import { STATE_ROOT_NAME, resolveProjectRoot } from './paths.ts';
import {
  lifecycleRunPath,
  renderGitContextSection,
  writeLifecycleRunRecord,
} from './run-records.ts';
import { extractSectionLines, stripBulletPrefix } from './markdown-sections.ts';
import { buildTemplateContext } from './templates.ts';
import { writeWorkJournalEntry } from './work-journal.ts';

const VERDICTS = ['pass', 'pass_with_concerns', 'fail', 'blocked'] as const;
const REVIEW_PLACEHOLDERS = {
  findings: [
    '- Add findings here in severity order.',
    '- None.',
  ],
  concerns: [
    '- Add non-blocking concerns here.',
    '- None.',
  ],
  missingEvidence: [
    '- Add any blocked evidence here.',
    '- None.',
  ],
} as const;

export type CloseVerdict = (typeof VERDICTS)[number];

export interface CloseCycleResult {
  root: string;
  title: string;
  verdict: CloseVerdict;
  reviewPath: string;
  verificationSummaryPath: string;
  runPath: string;
  journalPath: string | null;
  createdFiles: string[];
  updatedFiles: string[];
}

interface ReviewData {
  verdict: CloseVerdict;
  findings: string[];
  concerns: string[];
  missingEvidence: string[];
  checksRun: string[];
}

interface SummaryContext {
  scope: string[];
  implementedSurface: string[];
  nextAgentGuidance: string[];
}

function isClosingVerdict(verdict: CloseVerdict): boolean {
  return verdict === 'pass' || verdict === 'pass_with_concerns';
}

function extractVerdict(content: string): CloseVerdict {
  const verdict = extractSectionLines(content, 'Verdict')[0]?.replace(/^- /, '');
  if (verdict === undefined || !VERDICTS.includes(verdict as CloseVerdict)) {
    throw new Error('close requires the current review to contain a final verification verdict.');
  }

  return verdict as CloseVerdict;
}

function sectionContainsPlaceholder(
  lines: string[],
  placeholders: readonly string[],
): boolean {
  return lines.some((line) => placeholders.includes(line));
}

function sectionHasExplicitDetail(
  lines: string[],
  placeholders: readonly string[],
): boolean {
  return lines.some((line) => !placeholders.includes(line));
}

function parseReview(content: string): ReviewData {
  const review = {
    verdict: extractVerdict(content),
    findings: extractSectionLines(content, 'Findings'),
    concerns: extractSectionLines(content, 'Concerns'),
    missingEvidence: extractSectionLines(content, 'Missing Evidence'),
    checksRun: extractSectionLines(content, 'Checks Run'),
  };

  if (
    review.verdict === 'pass_with_concerns' &&
    (
      sectionContainsPlaceholder(review.concerns, REVIEW_PLACEHOLDERS.concerns) ||
      !sectionHasExplicitDetail(review.concerns, REVIEW_PLACEHOLDERS.concerns)
    )
  ) {
    throw new Error(
      'close requires explicit concerns in the review before pass_with_concerns can close the cycle.',
    );
  }

  if (
    review.verdict === 'fail' &&
    (
      sectionContainsPlaceholder(review.findings, REVIEW_PLACEHOLDERS.findings) ||
      !sectionHasExplicitDetail(review.findings, REVIEW_PLACEHOLDERS.findings)
    )
  ) {
    throw new Error(
      'close requires explicit findings in the review before fail can be recorded.',
    );
  }

  if (
    review.verdict === 'blocked' &&
    (
      sectionContainsPlaceholder(
        review.missingEvidence,
        REVIEW_PLACEHOLDERS.missingEvidence,
      ) ||
      !sectionHasExplicitDetail(
        review.missingEvidence,
        REVIEW_PLACEHOLDERS.missingEvidence,
      )
    )
  ) {
    throw new Error(
      'close requires explicit missing evidence details before blocked can be recorded.',
    );
  }

  return review;
}

function updateWorkJournalDecision(
  content: string,
  verdict: CloseVerdict,
): string {
  const decision = isClosingVerdict(verdict)
    ? 'Verified closure is complete enough to update the work journal.'
    : 'Do not update the work journal as verified completion yet.';

  return content.replace(
    /(## Work Journal Decision\n\n)- .*?(\n)/,
    `$1- ${decision}$2`,
  );
}

function readChecksRun(root: string, summaryPath: string): string[] {
  const text = readTextIfPresent(path.join(root, summaryPath));
  if (text === null) {
    return ['- none recorded'];
  }

  const section = text.match(/## Checks Run\s+([\s\S]*?)\n## /);
  if (section === null) {
    return ['- none recorded'];
  }

  const lines = section[1]
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '));

  return lines.length > 0 ? lines : ['- none recorded'];
}

function readSummaryContext(root: string, summaryPath: string): SummaryContext {
  const text = readTextIfPresent(path.join(root, summaryPath));
  if (text === null) {
    return {
      scope: [],
      implementedSurface: [],
      nextAgentGuidance: [],
    };
  }

  return {
    scope: extractSectionLines(text, 'Scope'),
    implementedSurface: extractSectionLines(text, 'Implemented Surface'),
    nextAgentGuidance: extractSectionLines(text, 'Next-Agent Guidance'),
  };
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

function buildVerificationSummary(
  title: string,
  review: ReviewData,
  planPath: string,
  executionSummaryPath: string,
  reviewPath: string,
  runPath: string,
  gitContextSection: string,
  guidePath: string | null,
  checksRun: string[],
): string {
  const closureComplete = isClosingVerdict(review.verdict);
  const effectiveChecks = review.checksRun.length > 0 ? review.checksRun : checksRun;

  return `# Verification Summary: ${title}

## Verdict

- ${review.verdict}

## Verification Scope

- ${title}
- ${planPath}
- ${executionSummaryPath}
- ${reviewPath}
${guidePath === null ? '' : `- ${guidePath}\n`}
${gitContextSection}
## Checks Run

${effectiveChecks.join('\n')}

## Evidence

- The fresh verification verdict is recorded in \`${reviewPath}\`.
- Current-state artifacts can be updated from one shared writer after the
  review result is already present.
- The latest verification summary is available for the next-agent hot path.
${closureComplete ? '- Verified closure is complete enough to update the work journal.' : '- Verified closure is not complete enough to update the work journal yet.'}

## Plan vs Actual

- Planned: record the fresh verification result for the current cycle
- Actual: the close flow reads the review artifact and records the result
- Planned: keep current-state artifacts aligned after closure
- Actual: the close flow updates the latest summary and hot-path references together

## Findings

${review.findings.length > 0 ? review.findings.join('\n') : '- None.'}

## Concerns

${review.concerns.length > 0 ? review.concerns.join('\n') : '- None.'}

## Missing Evidence

${review.missingEvidence.length > 0 ? review.missingEvidence.join('\n') : '- None.'}

## Closure Decision

- ${
    closureComplete
      ? 'Verified closure is complete.'
      : 'Verified closure is not complete; keep the cycle in verify.'
  }

## Related Review Artifact

- ${reviewPath}
`;
}

export function closeCurrentCycle(start: string): CloseCycleResult {
  const root = resolveProjectRoot(start);
  const current = normalizeCurrentIndex(readCurrentIndex(root));

  if (current.currentStage !== 'verify') {
    throw new Error('close requires the current stage to be verify.');
  }
  if (current.latestApprovedPlan === null) {
    throw new Error('close requires a current approved plan.');
  }
  if (current.latestRelevantSummary === null) {
    throw new Error('close requires a current execution summary.');
  }
  if (current.currentReview === null) {
    throw new Error('close requires a current review artifact.');
  }

  const { dateStamp, slug } = parseCycleDescriptor(current.latestApprovedPlan);
  const title = readCycleTitle(root, current.latestApprovedPlan, slug);
  const runPath = lifecycleRunPath(dateStamp, slug);
  const verificationSummaryPath =
    `${STATE_ROOT_NAME}/summaries/${dateStamp}-${slug}-verification-summary.md`;
  const reviewAbsolutePath = path.join(root, current.currentReview);
  const reviewBefore = readTextIfPresent(reviewAbsolutePath);
  if (reviewBefore === null) {
    throw new Error(`close requires the review artifact ${current.currentReview}.`);
  }

  const review = parseReview(reviewBefore);
  const createdFiles: string[] = [];
  const updatedFiles: string[] = [];
  const closingSummaryContext = isClosingVerdict(review.verdict)
    ? readSummaryContext(root, current.latestRelevantSummary)
    : null;
  const git = getGitContext(root);

  if (
    closingSummaryContext !== null &&
    closingSummaryContext.nextAgentGuidance.length === 0
  ) {
    throw new Error(
      'close requires the current execution summary to include explicit Next-Agent Guidance before verified closure.',
    );
  }

  const reviewWrite = writeFileIfChanged(
    reviewAbsolutePath,
    updateWorkJournalDecision(reviewBefore, review.verdict),
  );
  if (reviewWrite === 'updated') {
    updatedFiles.push(current.currentReview);
  }

  const checksRun = readChecksRun(root, current.latestRelevantSummary);
  const journalPath = isClosingVerdict(review.verdict)
    ? `${STATE_ROOT_NAME}/logs/work-journal/${dateStamp}.md`
    : null;
  const nextStage = isClosingVerdict(review.verdict) ? 'clarify' : 'verify';
  const runWrite = writeLifecycleRunRecord(root, {
    dateStamp,
    slug,
    title,
    phase: 'close',
    stage: nextStage,
    verdict: review.verdict,
    git,
    paths: {
      planPath: current.latestApprovedPlan,
      executionSummaryPath: current.latestRelevantSummary,
      handoffPath: current.currentHandoff,
      reviewPath: current.currentReview,
      guidePath: current.currentGuide,
      verificationSummaryPath,
      journalPath,
    },
  });
  if (runWrite.writeResult === 'created') {
    createdFiles.push(runWrite.path);
  } else if (runWrite.writeResult === 'updated') {
    updatedFiles.push(runWrite.path);
  }
  const verificationSummary = buildVerificationSummary(
    title,
    review,
    current.latestApprovedPlan,
    current.latestRelevantSummary,
    current.currentReview,
    runWrite.path,
    renderGitContextSection(runWrite.path, git),
    current.currentGuide,
    checksRun,
  );
  const verificationWrite = writeFileIfChanged(
    path.join(root, verificationSummaryPath),
    verificationSummary,
  );
  if (verificationWrite === 'created') {
    createdFiles.push(verificationSummaryPath);
  } else if (verificationWrite === 'updated') {
    updatedFiles.push(verificationSummaryPath);
  }

  const nextAction = isClosingVerdict(review.verdict)
    ? 'Start the next implementation increment from a new approved plan.'
    : `Address the latest ${review.verdict} verification result for ${title} and rerun fresh verification.`;

  if (isClosingVerdict(review.verdict)) {
    const allowedFileScope = readAllowedFileScope(root, current.currentGuide);
    const journalWrite = writeWorkJournalEntry(root, {
      dateStamp,
      title,
      verdict: review.verdict,
      summaryLines: [
        `Closed the ${title} increment with verdict \`${review.verdict}\`.`,
        ...stripBulletPrefix(closingSummaryContext.scope),
      ],
      completedLines: [
        ...stripBulletPrefix(closingSummaryContext.implementedSurface),
        `Recorded the fresh verification verdict in \`${current.currentReview}\`.`,
        `Wrote \`${verificationSummaryPath}\`.`,
        'Updated current-state artifacts for the next step.',
      ],
      reviewPath: current.currentReview,
      verificationSummaryPath,
      changedAreas:
        stripBulletPrefix(allowedFileScope).length > 0
          ? stripBulletPrefix(allowedFileScope)
          : [
              current.currentReview,
              verificationSummaryPath,
              current.latestApprovedPlan,
              current.currentGuide ?? 'no current guide recorded',
              `${STATE_ROOT_NAME}/state.md`,
              `${STATE_ROOT_NAME}/index/current.json`,
              `${STATE_ROOT_NAME}/guides/read-this-first.md`,
            ],
      openIssues:
        review.verdict === 'pass'
          ? ['None.']
          : review.concerns.map((line) => line.replace(/^- /, '')),
      nextAction,
    });
    if (journalWrite === 'created') {
      createdFiles.push(journalPath);
    } else if (journalWrite === 'updated') {
      updatedFiles.push(journalPath);
    }
  }

  const nextCurrent = normalizeCurrentIndex({
    ...current,
    currentStage: nextStage,
    nextAction,
    latestRelevantSummary: verificationSummaryPath,
    latestRun: runWrite.path,
    currentFocusModules: [
      'AGENTS.md',
      `${STATE_ROOT_NAME}/guides/code-consistency.md`,
      verificationSummaryPath,
      runWrite.path,
      current.currentReview,
      current.latestApprovedPlan,
      current.currentGuide ?? `${STATE_ROOT_NAME}/guides/read-this-first.md`,
    ],
    hotPath: [
      `${STATE_ROOT_NAME}/project.md`,
      `${STATE_ROOT_NAME}/state.md`,
      `${STATE_ROOT_NAME}/guides/read-this-first.md`,
      `${STATE_ROOT_NAME}/guides/code-consistency.md`,
      verificationSummaryPath,
      current.latestApprovedPlan,
      current.currentGuide ?? `${STATE_ROOT_NAME}/guides/read-this-first.md`,
    ],
    activeAgents: {
      ...current.activeAgents,
      verification: null,
    },
    notes: isClosingVerdict(review.verdict)
      ? [
          `Current work cycle: ${title}.`,
          `The increment is closed with verdict ${review.verdict}.`,
          'The next increment can start from a new approved plan.',
          `Previous relevant summary: ${current.latestRelevantSummary}`,
        ]
      : [
          `Current work cycle: ${title}.`,
          `The latest fresh verification verdict is ${review.verdict}.`,
          'Address the verification result before attempting closure again.',
          `Previous relevant summary: ${current.latestRelevantSummary}`,
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
    title,
    verdict: review.verdict,
    reviewPath: current.currentReview,
    verificationSummaryPath,
    runPath: runWrite.path,
    journalPath,
    createdFiles,
    updatedFiles,
  };
}
