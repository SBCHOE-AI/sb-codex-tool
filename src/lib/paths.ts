import { existsSync } from 'node:fs';
import path from 'node:path';

export const STATE_ROOT_NAME = '.sb-codex-tool';
export const WORKFLOW_NAMES = [
  'clarify',
  'plan',
  'execute',
  'refactor',
  'verify',
] as const;

export type WorkflowName = (typeof WORKFLOW_NAMES)[number];

export const REQUIRED_DIRECTORIES = [
  STATE_ROOT_NAME,
  `${STATE_ROOT_NAME}/plans`,
  `${STATE_ROOT_NAME}/runs`,
  `${STATE_ROOT_NAME}/summaries`,
  `${STATE_ROOT_NAME}/handoffs`,
  `${STATE_ROOT_NAME}/guides`,
  `${STATE_ROOT_NAME}/index`,
  `${STATE_ROOT_NAME}/reviews`,
  `${STATE_ROOT_NAME}/logs`,
  `${STATE_ROOT_NAME}/logs/work-journal`,
  `${STATE_ROOT_NAME}/ignore`,
  `${STATE_ROOT_NAME}/workflows`,
] as const;

export const REQUIRED_FILES = [
  `${STATE_ROOT_NAME}/project.md`,
  `${STATE_ROOT_NAME}/state.md`,
  `${STATE_ROOT_NAME}/guides/read-this-first.md`,
  `${STATE_ROOT_NAME}/guides/code-consistency.md`,
  `${STATE_ROOT_NAME}/index/current.json`,
  `${STATE_ROOT_NAME}/index/README.md`,
  `${STATE_ROOT_NAME}/plans/README.md`,
  `${STATE_ROOT_NAME}/runs/README.md`,
  `${STATE_ROOT_NAME}/summaries/README.md`,
  `${STATE_ROOT_NAME}/handoffs/README.md`,
  `${STATE_ROOT_NAME}/reviews/README.md`,
  `${STATE_ROOT_NAME}/logs/work-journal/README.md`,
  `${STATE_ROOT_NAME}/ignore/base.ignore`,
  'AGENTS.md',
  '.gitignore',
  '.ignore',
  '.rgignore',
] as const;

export const REQUIRED_WORKFLOW_FILES = WORKFLOW_NAMES.map(
  (name) => `${STATE_ROOT_NAME}/workflows/${name}.md`,
);

const ROOT_MARKERS = [
  'package.json',
  `${STATE_ROOT_NAME}/state.md`,
  'docs/menu/implementation.md',
  '.git',
] as const;

function hasRootMarker(directory: string): boolean {
  return ROOT_MARKERS.some((marker) => existsSync(path.join(directory, marker)));
}

export function resolveProjectRoot(start = process.cwd()): string {
  let current = path.resolve(start);

  while (true) {
    if (hasRootMarker(current)) {
      return current;
    }

    const parent = path.dirname(current);
    if (parent === current) {
      return path.resolve(start);
    }

    current = parent;
  }
}

export function statePath(root: string, ...segments: string[]): string {
  return path.join(root, STATE_ROOT_NAME, ...segments);
}

export function relativeFromRoot(root: string, target: string): string {
  const relative = path.relative(root, target);
  return relative.length > 0 ? relative : '.';
}
