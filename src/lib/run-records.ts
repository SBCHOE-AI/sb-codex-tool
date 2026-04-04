import path from 'node:path';

import {
  readJsonIfPresent,
  writeFileIfChanged,
  type WriteResult,
} from './fs.ts';
import { type GitContext } from './git.ts';
import { STATE_ROOT_NAME } from './paths.ts';

export type RunPhase = 'begin' | 'prepare-verify' | 'close';
export type RunVerdict =
  | 'pending'
  | 'pass'
  | 'pass_with_concerns'
  | 'fail'
  | 'blocked';

export interface LifecycleRunPaths {
  planPath: string;
  executionSummaryPath: string;
  handoffPath: string | null;
  reviewPath: string | null;
  guidePath: string | null;
  verificationSummaryPath: string | null;
  journalPath: string | null;
}

export interface LifecycleRunRecord {
  version: number;
  cycleId: string;
  dateStamp: string;
  slug: string;
  title: string;
  phase: RunPhase;
  stage: string;
  verdict: RunVerdict;
  git: GitContext;
  paths: LifecycleRunPaths;
  startedAt: string;
  updatedAt: string;
  closedAt: string | null;
}

export interface WriteLifecycleRunRecordOptions {
  dateStamp: string;
  slug: string;
  title: string;
  phase: RunPhase;
  stage: string;
  verdict: RunVerdict;
  git: GitContext;
  paths: LifecycleRunPaths;
  now?: Date;
}

export interface LifecycleRunWriteResult {
  path: string;
  writeResult: WriteResult;
  record: LifecycleRunRecord;
}

export function readLifecycleRunRecord(
  root: string,
  relativePath: string | null,
): LifecycleRunRecord | null {
  if (relativePath === null) {
    return null;
  }

  return readJsonIfPresent<LifecycleRunRecord>(path.join(root, relativePath));
}

export function lifecycleRunPath(dateStamp: string, slug: string): string {
  return `${STATE_ROOT_NAME}/runs/${dateStamp}-${slug}-run.json`;
}

export function renderGitContextSection(
  runPath: string,
  git: GitContext,
): string {
  const lines = [
    '## Git Context',
    '',
    `- Run artifact: ${runPath}`,
    `- Git available: ${git.available ? 'yes' : 'no'}`,
    `- Branch: ${git.available ? git.branch ?? 'detached' : 'unavailable'}`,
    `- Dirty: ${git.available ? (git.dirty ? 'yes' : 'no') : 'unavailable'}`,
  ];

  if (!git.available) {
    lines.push('- Changed files: unavailable outside a Git repository');
    return `${lines.join('\n')}\n`;
  }

  if (git.changedFiles.length === 0) {
    lines.push('- Changed files: none');
    return `${lines.join('\n')}\n`;
  }

  lines.push('- Changed files:');
  for (const file of git.changedFiles) {
    lines.push(`  - ${file}`);
  }

  return `${lines.join('\n')}\n`;
}

export function writeLifecycleRunRecord(
  root: string,
  options: WriteLifecycleRunRecordOptions,
): LifecycleRunWriteResult {
  const now = (options.now ?? new Date()).toISOString();
  const relativePath = lifecycleRunPath(options.dateStamp, options.slug);
  const absolutePath = path.join(root, relativePath);
  const previous = readJsonIfPresent<LifecycleRunRecord>(absolutePath);

  const record: LifecycleRunRecord = {
    version: 1,
    cycleId: `${options.dateStamp}-${options.slug}`,
    dateStamp: options.dateStamp,
    slug: options.slug,
    title: options.title,
    phase: options.phase,
    stage: options.stage,
    verdict: options.verdict,
    git: options.git,
    paths: options.paths,
    startedAt: previous?.startedAt ?? now,
    updatedAt: now,
    closedAt:
      options.verdict === 'pass' || options.verdict === 'pass_with_concerns'
        ? now
        : previous?.closedAt ?? null,
  };

  return {
    path: relativePath,
    writeResult: writeFileIfChanged(
      absolutePath,
      JSON.stringify(record, null, 2) + '\n',
    ),
    record,
  };
}
