import { readCurrentIndex, type CurrentIndex } from './current-state.ts';
import { getGitContext } from './git.ts';
import { resolveProjectRoot } from './paths.ts';
import { readLifecycleRunRecord, type LifecycleRunRecord } from './run-records.ts';
import { collectStateCoherenceIssues, type CoherenceIssue } from './state-coherence.ts';

export interface StatusSnapshot {
  root: string;
  stage: string;
  nextAction: string;
  latestPlan: string | null;
  latestSummary: string | null;
  latestRun: string | null;
  latestRunRecord: LifecycleRunRecord | null;
  latestConsistencyReview: string | null;
  latestAssignmentLifecycle: string | null;
  currentGuide: string | null;
  currentReview: string | null;
  currentHandoff: string | null;
  hotPath: string[];
  agents: CurrentIndex['activeAgents'];
  assignmentGuides: CurrentIndex['assignmentGuides'];
  coherenceIssues: CoherenceIssue[];
  git: ReturnType<typeof getGitContext>;
}

export function getStatus(start = process.cwd()): StatusSnapshot {
  const root = resolveProjectRoot(start);
  const current = readCurrentIndex(root);
  const git = getGitContext(root);
  const latestRun = current?.latestRun ?? null;
  const latestRunRecord = readLifecycleRunRecord(root, latestRun);
  const coherenceIssues = collectStateCoherenceIssues(root, current, latestRunRecord);

  return {
    root,
    stage: current?.currentStage ?? 'unknown',
    nextAction: current?.nextAction ?? 'No next action recorded.',
    latestPlan: current?.latestApprovedPlan ?? null,
    latestSummary: current?.latestRelevantSummary ?? null,
    latestRun,
    latestRunRecord,
    latestConsistencyReview: current?.latestConsistencyReview ?? null,
    latestAssignmentLifecycle: current?.latestAssignmentLifecycle ?? null,
    currentGuide: current?.currentGuide ?? null,
    currentReview: current?.currentReview ?? null,
    currentHandoff: current?.currentHandoff ?? null,
    hotPath: current?.hotPath ?? [
      '.sb-codex-tool/project.md',
      '.sb-codex-tool/state.md',
      '.sb-codex-tool/guides/read-this-first.md',
      '.sb-codex-tool/guides/code-consistency.md',
    ],
    agents: current?.activeAgents,
    assignmentGuides: current?.assignmentGuides ?? {},
    coherenceIssues,
    git,
  };
}
