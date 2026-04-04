import { readJsonIfPresent, writeFileIfChanged, type WriteResult } from './fs.ts';
import { STATE_ROOT_NAME, statePath } from './paths.ts';

export interface ActiveAgentMap {
  main: string | null;
  subagents: string[];
  verification: string | null;
  consistency: string | null;
}

export interface CurrentIndex {
  version: number;
  currentStage: string;
  nextAction: string;
  latestApprovedPlan: string | null;
  latestRelevantSummary: string | null;
  latestRun: string | null;
  latestConsistencyReview: string | null;
  latestAssignmentLifecycle: string | null;
  currentGuide: string | null;
  currentHandoff: string | null;
  currentReview: string | null;
  currentFocusModules: string[];
  hotPath: string[];
  activeAgents: ActiveAgentMap;
  assignmentGuides: Record<string, string>;
  notes: string[];
}

function renderBulletList(items: string[]): string {
  if (items.length === 0) {
    return '- none';
  }

  return items.map((item) => `- ${item}`).join('\n');
}

function renderReference(label: string, value: string | null): string {
  return `- ${label}: ${value ?? 'none yet'}`;
}

function renderHotPath(hotPath: string[]): string {
  return hotPath.map((file, index) => `${index + 1}. ${file}`).join('\n');
}

function renderCurrentCycle(current: CurrentIndex): string {
  return [
    `- Current stage: ${current.currentStage}`,
    `- Latest approved plan: ${current.latestApprovedPlan ?? 'none yet'}`,
    `- Latest relevant summary: ${current.latestRelevantSummary ?? 'none yet'}`,
    `- Latest lifecycle run: ${current.latestRun ?? 'none yet'}`,
    `- Latest consistency review: ${current.latestConsistencyReview ?? 'none yet'}`,
    `- Latest assignment lifecycle: ${current.latestAssignmentLifecycle ?? 'none yet'}`,
    `- Current task guide: ${current.currentGuide ?? 'none yet'}`,
    `- Current handoff: ${current.currentHandoff ?? 'none yet'}`,
    `- Current review: ${current.currentReview ?? 'none yet'}`,
  ].join('\n');
}

function renderAssignmentGuides(assignmentGuides: Record<string, string>): string {
  const entries = Object.entries(assignmentGuides);
  if (entries.length === 0) {
    return '- none';
  }

  return entries
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([agent, guidePath]) => `- ${agent}: ${guidePath}`)
    .join('\n');
}

function renderImplementationReference(implementationMenuPath: string | null): string {
  if (implementationMenuPath === null) {
    return '- If this repo has implementation contracts, add them here.\n';
  }

  return `- ${implementationMenuPath}\n`;
}

export function createInitialCurrentIndex(): CurrentIndex {
  return {
    version: 2,
    currentStage: 'clarify',
    nextAction: 'Review AGENTS.md and customize .sb-codex-tool/project.md.',
    latestApprovedPlan: null,
    latestRelevantSummary: null,
    latestRun: null,
    latestConsistencyReview: null,
    latestAssignmentLifecycle: null,
    currentGuide: null,
    currentHandoff: null,
    currentReview: null,
    currentFocusModules: [
      'AGENTS.md',
      `${STATE_ROOT_NAME}/project.md`,
      `${STATE_ROOT_NAME}/state.md`,
      `${STATE_ROOT_NAME}/guides/code-consistency.md`,
    ],
    hotPath: [
      `${STATE_ROOT_NAME}/project.md`,
      `${STATE_ROOT_NAME}/state.md`,
      `${STATE_ROOT_NAME}/guides/read-this-first.md`,
      `${STATE_ROOT_NAME}/guides/code-consistency.md`,
    ],
    activeAgents: {
      main: 'unassigned',
      subagents: [],
      verification: null,
      consistency: null,
    },
    assignmentGuides: {},
    notes: [
      'Keep this file current enough for a fresh agent to start from the hot path.',
    ],
  };
}

export function normalizeCurrentIndex(
  current: Partial<CurrentIndex> | null | undefined,
): CurrentIndex {
  const initial = createInitialCurrentIndex();

  return {
    ...initial,
    ...current,
    version: Math.max(current?.version ?? 0, initial.version),
    currentFocusModules: current?.currentFocusModules ?? initial.currentFocusModules,
    hotPath: current?.hotPath ?? initial.hotPath,
    activeAgents: {
      ...initial.activeAgents,
      ...current?.activeAgents,
      subagents: current?.activeAgents?.subagents ?? initial.activeAgents.subagents,
    },
    assignmentGuides: current?.assignmentGuides ?? initial.assignmentGuides,
    notes: current?.notes ?? initial.notes,
  };
}

export function renderStateMarkdown(current: CurrentIndex): string {
  return `# Current State

## Current Workflow Stage

- ${current.currentStage}

## One Next Action

- ${current.nextAction}

## Current Focus Modules

${renderBulletList(current.currentFocusModules)}

## References

${renderReference('Latest approved plan', current.latestApprovedPlan)}
${renderReference('Latest relevant summary', current.latestRelevantSummary)}
${renderReference('Latest lifecycle run', current.latestRun)}
${renderReference('Latest consistency review', current.latestConsistencyReview)}
${renderReference('Latest assignment lifecycle', current.latestAssignmentLifecycle)}
${renderReference('Current task guide', current.currentGuide)}
${renderReference('Current handoff', current.currentHandoff)}
${renderReference('Current review', current.currentReview)}

## Active Agent Map

- Main agent: ${current.activeAgents.main ?? 'none'}
- Execution subagents: ${
    current.activeAgents.subagents.length > 0
      ? current.activeAgents.subagents.join(', ')
      : 'none'
  }
- Verification agent: ${current.activeAgents.verification ?? 'none'}
- Code consistency agent: ${current.activeAgents.consistency ?? 'none'}

## Active Assignment Guides

${renderAssignmentGuides(current.assignmentGuides)}

## Notes

${renderBulletList(current.notes)}
`;
}

export function renderReadThisFirstMarkdown(
  current: CurrentIndex,
  implementationMenuPath: string | null,
): string {
  return `# Read This First

## Hot Path

Read in this order before implementation or verification:

${renderHotPath(current.hotPath)}

## Additional Repo Docs

${renderImplementationReference(implementationMenuPath)}
- docs/implementation/verification-contract.md
- docs/implementation/acceptance-checklist.md

## Current Cycle

${renderCurrentCycle(current)}

## Default Ignore Guidance

- Ignore build outputs, caches, and bulky generated artifacts by default.
- Keep ${STATE_ROOT_NAME}/logs/work-journal/ out of the default hot path.
- Do not ignore AGENTS.md, guide files, state files, or current summaries.
`;
}

export function readCurrentIndex(root: string): CurrentIndex | null {
  const current = readJsonIfPresent<CurrentIndex>(statePath(root, 'index', 'current.json'));
  if (current === null) {
    return null;
  }

  return normalizeCurrentIndex(current);
}

export function writeCurrentIndex(root: string, current: CurrentIndex): WriteResult {
  return writeFileIfChanged(
    statePath(root, 'index', 'current.json'),
    JSON.stringify(current, null, 2) + '\n',
  );
}

export function writeCurrentState(root: string, current: CurrentIndex): WriteResult {
  return writeFileIfChanged(
    statePath(root, 'state.md'),
    renderStateMarkdown(current),
  );
}

export function writeCurrentArtifacts(
  root: string,
  current: CurrentIndex,
  implementationMenuPath: string | null,
): {
  index: WriteResult;
  state: WriteResult;
  readThisFirst: WriteResult;
} {
  return {
    index: writeCurrentIndex(root, current),
    state: writeCurrentState(root, current),
    readThisFirst: writeFileIfChanged(
      statePath(root, 'guides', 'read-this-first.md'),
      renderReadThisFirstMarkdown(current, implementationMenuPath),
    ),
  };
}
