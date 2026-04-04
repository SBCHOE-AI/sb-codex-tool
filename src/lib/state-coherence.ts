import { existsSync } from 'node:fs';
import path from 'node:path';

import type { CurrentIndex } from './current-state.ts';
import type { LifecycleRunRecord } from './run-records.ts';

export interface CoherenceIssue {
  level: 'warn' | 'fail';
  label: string;
  detail: string;
}

function createIssue(
  label: string,
  detail: string,
  level: CoherenceIssue['level'] = 'fail',
): CoherenceIssue {
  return { level, label, detail };
}

function validateLatestRunCoherence(
  current: CurrentIndex,
  latestRunRecord: LifecycleRunRecord | null,
): CoherenceIssue[] {
  if (current.latestRun === null) {
    return [];
  }

  if (latestRunRecord === null) {
    return [
      createIssue(
        'latest run coherence',
        'current state references a latest run that could not be read',
      ),
    ];
  }

  const issues: CoherenceIssue[] = [];

  if (latestRunRecord.stage !== current.currentStage) {
    issues.push(
      createIssue(
        'latest run coherence',
        `current stage ${current.currentStage} does not match latest run stage ${latestRunRecord.stage}`,
      ),
    );
  }

  if (current.latestApprovedPlan !== latestRunRecord.paths.planPath) {
    issues.push(
      createIssue(
        'latest run coherence',
        'current approved plan does not match the latest run plan path',
      ),
    );
  }

  const allowedSummaryPaths = [
    latestRunRecord.paths.executionSummaryPath,
    latestRunRecord.paths.verificationSummaryPath,
  ].filter((value): value is string => value !== null);

  if (
    current.latestRelevantSummary !== null &&
    !allowedSummaryPaths.includes(current.latestRelevantSummary)
  ) {
    issues.push(
      createIssue(
        'latest run coherence',
        'current latest summary does not match the latest run summary paths',
      ),
    );
  }

  if (current.currentGuide !== latestRunRecord.paths.guidePath) {
    issues.push(
      createIssue(
        'latest run coherence',
        'current guide does not match the latest run guide path',
      ),
    );
  }

  if (current.currentHandoff !== latestRunRecord.paths.handoffPath) {
    issues.push(
      createIssue(
        'latest run coherence',
        'current handoff does not match the latest run handoff path',
      ),
    );
  }

  if (current.currentReview !== latestRunRecord.paths.reviewPath) {
    issues.push(
      createIssue(
        'latest run coherence',
        'current review does not match the latest run review path',
      ),
    );
  }

  return issues;
}

function validateVerifyStage(current: CurrentIndex): CoherenceIssue[] {
  const issues: CoherenceIssue[] = [];

  if (current.currentStage !== 'verify') {
    if (current.activeAgents.verification !== null) {
      issues.push(
        createIssue(
          'verification-agent coherence',
          'verification agent is still assigned outside the verify stage',
        ),
      );
    }

    return issues;
  }

  if (current.activeAgents.verification === null) {
    issues.push(
      createIssue(
        'verification-agent coherence',
        'verify stage requires a pending or assigned verification agent',
      ),
    );
  }

  const missingArtifacts: string[] = [];
  if (current.currentGuide === null) {
    missingArtifacts.push('current guide');
  }
  if (current.currentHandoff === null) {
    missingArtifacts.push('current handoff');
  }
  if (current.currentReview === null) {
    missingArtifacts.push('current review');
  }
  if (current.latestRelevantSummary === null) {
    missingArtifacts.push('latest relevant summary');
  }
  if (current.latestApprovedPlan === null) {
    missingArtifacts.push('latest approved plan');
  }

  if (missingArtifacts.length > 0) {
    issues.push(
      createIssue(
        'verify-stage readiness',
        `verify stage is missing required references: ${missingArtifacts.join(', ')}`,
      ),
    );
  }

  return issues;
}

function validateAssignmentGuides(root: string, current: CurrentIndex): CoherenceIssue[] {
  const issues: CoherenceIssue[] = [];
  const activeSubagents = new Set(current.activeAgents.subagents);
  const guideEntries = Object.entries(current.assignmentGuides);

  for (const agentName of activeSubagents) {
    if (current.assignmentGuides[agentName] === undefined) {
      issues.push(
        createIssue(
          'assignment-guide coherence',
          `active subagent ${agentName} is missing an assignment guide`,
        ),
      );
    }
  }

  for (const [agentName, guidePath] of guideEntries) {
    if (!activeSubagents.has(agentName)) {
      issues.push(
        createIssue(
          'assignment-guide coherence',
          `assignment guide for ${agentName} is still registered without an active subagent`,
        ),
      );
      continue;
    }

    if (!existsSync(path.join(root, guidePath))) {
      issues.push(
        createIssue(
          'assignment-guide coherence',
          `assignment guide for ${agentName} is missing: ${guidePath}`,
        ),
      );
    }
  }

  return issues;
}

export function collectStateCoherenceIssues(
  root: string,
  current: CurrentIndex | null,
  latestRunRecord: LifecycleRunRecord | null,
): CoherenceIssue[] {
  if (current === null) {
    return [];
  }

  return [
    ...validateLatestRunCoherence(current, latestRunRecord),
    ...validateVerifyStage(current),
    ...validateAssignmentGuides(root, current),
  ];
}
