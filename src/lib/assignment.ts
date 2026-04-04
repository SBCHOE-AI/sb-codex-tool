import path from 'node:path';

import { humanizeSlug, normalizeSlug, parseCycleDescriptor } from './cycle.ts';
import {
  normalizeCurrentIndex,
  readCurrentIndex,
  writeCurrentArtifacts,
} from './current-state.ts';
import { readTextIfPresent, writeFileIfMissing } from './fs.ts';
import { extractSectionLines } from './markdown-sections.ts';
import { resolveProjectRoot, STATE_ROOT_NAME } from './paths.ts';
import { buildTemplateContext } from './templates.ts';

export interface AssignmentGuideResult {
  root: string;
  agentName: string;
  title: string;
  assignmentPath: string;
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

function buildAssignmentGuide(
  agentName: string,
  title: string,
  current: ReturnType<typeof normalizeCurrentIndex>,
  assignmentSlug: string,
  allowedFileScope: string[],
): string {
  const fileScope = allowedFileScope.length > 0
    ? allowedFileScope.join('\n')
    : '- Replace with the bounded file scope for this assignment.';

  return `# Assignment Guide: ${title}

## Assigned Agent

- ${agentName}

## Assignment Slug

- ${assignmentSlug}

## Objective

- Replace with the bounded objective for ${agentName}.

## Current Cycle References

- Current plan: ${current.latestApprovedPlan ?? 'none yet'}
- Latest summary: ${current.latestRelevantSummary ?? 'none yet'}
- Current guide: ${current.currentGuide ?? 'none yet'}
- Latest lifecycle run: ${current.latestRun ?? 'none yet'}

## Allowed File Scope

${fileScope}

## Required References

- AGENTS.md
- ${STATE_ROOT_NAME}/guides/code-consistency.md
- ${current.latestApprovedPlan ?? `${STATE_ROOT_NAME}/plans/README.md`}
- ${current.latestRelevantSummary ?? `${STATE_ROOT_NAME}/summaries/README.md`}
- ${current.currentGuide ?? `${STATE_ROOT_NAME}/guides/read-this-first.md`}

## Consistency Expectations

- Read ${STATE_ROOT_NAME}/guides/code-consistency.md before implementation.
- Reuse existing helpers before adding parallel implementations.
- Keep files and functions short, simple, and readable.
- Keep module boundaries explicit and avoid clever abstractions.

## Verification Expectations

- Keep the work bounded to the allowed file scope unless the main agent expands it.
- Report any blocker or scope mismatch back to the main agent immediately.
- Do not self-approve final completion; final verification stays fresh-agent-only.

## Completion Rule

- When the bounded task is complete, the main agent must either close and replace this subagent or clear its context before same-role reuse.
`;
}

export function createAssignmentGuide(
  start: string,
  agentName: string,
  requestedSlug: string,
  requestedTitle?: string,
): AssignmentGuideResult {
  const root = resolveProjectRoot(start);
  const current = normalizeCurrentIndex(readCurrentIndex(root));

  if (current.latestApprovedPlan === null) {
    throw new Error('assign requires a current approved plan.');
  }
  if (current.latestRelevantSummary === null) {
    throw new Error('assign requires a current summary.');
  }
  if (current.currentGuide === null) {
    throw new Error('assign requires a current task guide.');
  }

  const assignmentSlug = normalizeSlug(requestedSlug);
  if (assignmentSlug.length === 0) {
    throw new Error('Assignment slug must contain at least one alphanumeric character.');
  }

  const agentSlug = normalizeSlug(agentName);
  if (agentSlug.length === 0) {
    throw new Error('Agent name must contain at least one alphanumeric character.');
  }

  const title = requestedTitle?.trim().length
    ? requestedTitle.trim()
    : humanizeSlug(assignmentSlug);
  const { dateStamp } = parseCycleDescriptor(current.latestApprovedPlan);
  const assignmentPath =
    `${STATE_ROOT_NAME}/guides/${dateStamp}-${agentSlug}-${assignmentSlug}-assignment.md`;
  const allowedFileScope = readAllowedFileScope(root, current.currentGuide);

  const writeResult = writeFileIfMissing(
    path.join(root, assignmentPath),
    buildAssignmentGuide(agentName, title, current, assignmentSlug, allowedFileScope),
  );

  const createdFiles: string[] = [];
  const keptFiles: string[] = [];
  if (writeResult === 'created') {
    createdFiles.push(assignmentPath);
  } else {
    keptFiles.push(assignmentPath);
  }

  const nextSubagents = current.activeAgents.subagents.includes(agentName)
    ? current.activeAgents.subagents
    : [...current.activeAgents.subagents, agentName];
  const nextFocusModules = current.currentFocusModules.includes(assignmentPath)
    ? current.currentFocusModules
    : [...current.currentFocusModules, assignmentPath];

  const nextCurrent = normalizeCurrentIndex({
    ...current,
    currentFocusModules: nextFocusModules,
    activeAgents: {
      ...current.activeAgents,
      subagents: nextSubagents,
    },
    assignmentGuides: {
      ...current.assignmentGuides,
      [agentName]: assignmentPath,
    },
    notes: [
      `Current work cycle: ${humanizeSlug(parseCycleDescriptor(current.latestApprovedPlan).slug)}.`,
      `Prepared assignment guide for ${agentName}: ${assignmentPath}.`,
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
    assignmentPath,
    createdFiles,
    keptFiles,
    updatedFiles,
  };
}
