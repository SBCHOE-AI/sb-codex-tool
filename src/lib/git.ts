import { spawnSync } from 'node:child_process';

export interface GitContext {
  available: boolean;
  branch: string | null;
  dirty: boolean;
  changedFiles: string[];
}

function runGit(root: string, args: string[]): string | null {
  const result = spawnSync('git', args, {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  });

  if (result.status !== 0) {
    return null;
  }

  return result.stdout.trim();
}

export function getGitContext(root: string): GitContext {
  const insideWorkTree = runGit(root, ['rev-parse', '--is-inside-work-tree']);
  if (insideWorkTree !== 'true') {
    return {
      available: false,
      branch: null,
      dirty: false,
      changedFiles: [],
    };
  }

  const branch = runGit(root, ['branch', '--show-current']);
  const status = runGit(root, ['status', '--porcelain']) ?? '';
  const changedFiles = status
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => line.slice(3));

  return {
    available: true,
    branch,
    dirty: changedFiles.length > 0,
    changedFiles,
  };
}
