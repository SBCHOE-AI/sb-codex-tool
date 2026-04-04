import path from 'node:path';

import { createAssignmentGuide } from './assignment.ts';
import { humanizeSlug, normalizeSlug, parseCycleDescriptor } from './cycle.ts';
import {
  normalizeCurrentIndex,
  readCurrentIndex,
  writeCurrentArtifacts,
} from './current-state.ts';
import { readTextIfPresent, writeFileIfChanged, type WriteResult } from './fs.ts';
import { resolveProjectRoot, STATE_ROOT_NAME } from './paths.ts';
import { buildTemplateContext } from './templates.ts';

export const ASSIGNMENT_LIFECYCLE_ACTIONS = ['close', 'clear', 'replace'] as const;
export type AssignmentLifecycleAction = (typeof ASSIGNMENT_LIFECYCLE_ACTIONS)[number];

export interface CompleteAssignmentResult {
  root: string;
  agentName: string;
  action: AssignmentLifecycleAction;
  lifecyclePath: string;
  replacementAssignmentPath: string | null;
  createdFiles: string[];
  updatedFiles: string[];
}

function buildLifecycleArtifact(
  agentName: string,
  title: string,
  action: AssignmentLifecycleAction,
  assignmentPath: string,
  replacementAssignmentPath: string | null,
): string {
  return `# Assignment Lifecycle: ${title}

## Agent

- ${agentName}

## Decision

- ${action}

## Completed Assignment Guide

- ${assignmentPath}

## Lifecycle Rule Applied

- Default rule is close and replace.
- Clear is allowed only for the same narrow role after context reset.
- Final verification remains fresh-agent-only.

## Replacement Assignment

- ${replacementAssignmentPath ?? 'none'}

## Next Main-Agent Action

- ${replacementAssignmentPath === null
    ? 'Keep the agent inactive until a new bounded assignment is created.'
    : `Continue with the replacement assignment guide at \`${replacementAssignmentPath}\`.`}
`;
}

function findAssignmentGuide(
  current: ReturnType<typeof normalizeCurrentIndex>,
  agentName: string,
): string | null {
  const fromMap = current.assignmentGuides[agentName];
  if (fromMap !== undefined) {
    return fromMap;
  }

  if (current.latestApprovedPlan === null) {
    return null;
  }

  const { dateStamp } = parseCycleDescriptor(current.latestApprovedPlan);
  const agentSlug = normalizeSlug(agentName);
  return current.currentFocusModules.find((entry) =>
    entry.startsWith(`${STATE_ROOT_NAME}/guides/${dateStamp}-${agentSlug}-`) &&
    entry.endsWith('-assignment.md'),
  ) ?? null;
}

function removeAssignmentGuide(
  assignmentGuides: Record<string, string>,
  agentName: string,
): Record<string, string> {
  const next = { ...assignmentGuides };
  delete next[agentName];
  return next;
}

function withoutItem(items: string[], target: string): string[] {
  return items.filter((item) => item !== target);
}

function ensureFocusModules(
  currentFocusModules: string[],
  items: Array<string | null>,
): string[] {
  const next = [...currentFocusModules];
  for (const item of items) {
    if (item !== null && !next.includes(item)) {
      next.push(item);
    }
  }

  return next;
}

function readAssignmentTitle(root: string, assignmentPath: string): string {
  const text = readTextIfPresent(path.join(root, assignmentPath));
  const match = text?.match(/^# Assignment Guide: (.+)$/m);
  return match?.[1]?.trim() ?? humanizeSlug(normalizeSlug(agentNameFromPath(assignmentPath)));
}

function agentNameFromPath(assignmentPath: string): string {
  const fileName = path.basename(assignmentPath, '.md');
  return fileName;
}

interface ReplacementOptions {
  agentName: string;
  slug: string;
  title?: string;
}

export function completeAssignment(
  start: string,
  agentName: string,
  action: AssignmentLifecycleAction,
  replacement?: ReplacementOptions,
): CompleteAssignmentResult {
  const root = resolveProjectRoot(start);
  const current = normalizeCurrentIndex(readCurrentIndex(root));

  if (current.latestApprovedPlan === null) {
    throw new Error('complete-assignment requires a current approved plan.');
  }

  if (!current.activeAgents.subagents.includes(agentName)) {
    throw new Error(`complete-assignment requires ${agentName} to be an active subagent.`);
  }

  const assignmentPath = findAssignmentGuide(current, agentName);
  if (assignmentPath === null) {
    throw new Error(`complete-assignment requires an active assignment guide for ${agentName}.`);
  }

  if (action === 'replace' && replacement === undefined) {
    throw new Error('complete-assignment replace requires a replacement agent and slug.');
  }

  const createdFiles: string[] = [];
  const updatedFiles: string[] = [];
  let replacementAssignmentPath: string | null = null;
  let latestCurrent = current;

  if (action === 'replace' && replacement !== undefined) {
    const replacementResult = createAssignmentGuide(
      root,
      replacement.agentName,
      replacement.slug,
      replacement.title,
    );
    replacementAssignmentPath = replacementResult.assignmentPath;
    createdFiles.push(...replacementResult.createdFiles);
    updatedFiles.push(...replacementResult.updatedFiles);
    latestCurrent = normalizeCurrentIndex(readCurrentIndex(root));
  }

  const { dateStamp, slug } = parseCycleDescriptor(latestCurrent.latestApprovedPlan ?? current.latestApprovedPlan);
  const agentSlug = normalizeSlug(agentName);
  const lifecyclePath =
    `${STATE_ROOT_NAME}/handoffs/${dateStamp}-${slug}-${agentSlug}-assignment-lifecycle.md`;
  const assignmentTitle = readAssignmentTitle(root, assignmentPath);
  const lifecycleWrite = writeFileIfChanged(
    path.join(root, lifecyclePath),
    buildLifecycleArtifact(
      agentName,
      assignmentTitle,
      action,
      assignmentPath,
      replacementAssignmentPath,
    ),
  );
  if (lifecycleWrite === 'created') {
    createdFiles.push(lifecyclePath);
  } else if (lifecycleWrite === 'updated') {
    updatedFiles.push(lifecyclePath);
  }

  const nextSubagents = withoutItem(latestCurrent.activeAgents.subagents, agentName);
  const nextAssignmentGuides = removeAssignmentGuide(latestCurrent.assignmentGuides, agentName);
  const nextFocusModules = ensureFocusModules(
    withoutItem(latestCurrent.currentFocusModules, assignmentPath),
    [lifecyclePath, replacementAssignmentPath],
  );

  const nextCurrent = normalizeCurrentIndex({
    ...latestCurrent,
    latestAssignmentLifecycle: lifecyclePath,
    currentFocusModules: nextFocusModules,
    activeAgents: {
      ...latestCurrent.activeAgents,
      subagents: nextSubagents,
    },
    assignmentGuides: nextAssignmentGuides,
    notes: [
      `Current work cycle: ${humanizeSlug(parseCycleDescriptor(latestCurrent.latestApprovedPlan ?? current.latestApprovedPlan).slug)}.`,
      `Recorded ${action} lifecycle decision for ${agentName}: ${lifecyclePath}.`,
      replacementAssignmentPath === null
        ? `The completed assignment guide was ${assignmentPath}.`
        : `Replacement assignment guide: ${replacementAssignmentPath}.`,
      `Previous relevant summary: ${latestCurrent.latestRelevantSummary}`,
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
    agentName,
    action,
    lifecyclePath,
    replacementAssignmentPath,
    createdFiles,
    updatedFiles,
  };
}
