import { existsSync } from 'node:fs';
import path from 'node:path';

import { ensureDir, ensureLines, writeFileIfMissing } from './fs.ts';
import {
  REQUIRED_DIRECTORIES,
  resolveProjectRoot,
  statePath,
} from './paths.ts';
import {
  buildGeneratedFiles,
  buildTemplateContext,
  getGitIgnoreLines,
  getSearchIgnoreLines,
} from './templates.ts';

export interface ScaffoldSummary {
  root: string;
  createdFiles: string[];
  keptFiles: string[];
  createdDirectories: string[];
  updatedFiles: string[];
}

function ensureDirectories(root: string): string[] {
  const created: string[] = [];

  for (const relativeDir of REQUIRED_DIRECTORIES) {
    const absoluteDir = path.join(root, relativeDir);
    const existed = existsSync(absoluteDir);
    ensureDir(absoluteDir);
    if (!existed) {
      created.push(relativeDir);
    }
  }

  return created;
}

export function scaffoldProject(start = process.cwd()): ScaffoldSummary {
  const root = resolveProjectRoot(start);
  const context = buildTemplateContext(root);
  const createdDirectories = ensureDirectories(root);
  const createdFiles: string[] = [];
  const keptFiles: string[] = [];
  const updatedFiles: string[] = [];

  for (const file of buildGeneratedFiles(context)) {
    const result = writeFileIfMissing(path.join(root, file.path), file.content);
    if (result === 'created') {
      createdFiles.push(file.path);
    } else {
      keptFiles.push(file.path);
    }
  }

  const gitIgnore = ensureLines(
    path.join(root, '.gitignore'),
    getGitIgnoreLines(),
    '# Added by sb-codex-tool',
  );
  if (gitIgnore.created || gitIgnore.added.length > 0) {
    updatedFiles.push('.gitignore');
  }

  const ignore = ensureLines(
    path.join(root, '.ignore'),
    getSearchIgnoreLines(),
    '# Added by sb-codex-tool',
  );
  if (ignore.created || ignore.added.length > 0) {
    updatedFiles.push('.ignore');
  }

  const rgIgnore = ensureLines(
    path.join(root, '.rgignore'),
    getSearchIgnoreLines(),
    '# Added by sb-codex-tool',
  );
  if (rgIgnore.created || rgIgnore.added.length > 0) {
    updatedFiles.push('.rgignore');
  }

  const workflowReadme = writeFileIfMissing(
    statePath(root, 'workflows', 'README.md'),
    '# Workflows\n\nThis directory stores the canonical workflow stage assets.\n',
  );
  if (workflowReadme === 'created') {
    createdFiles.push(`${statePath('.', 'workflows', 'README.md')}`);
  }

  return {
    root,
    createdFiles,
    keptFiles,
    createdDirectories,
    updatedFiles,
  };
}
