import { spawnSync, type SpawnSyncReturns } from 'node:child_process';
import { existsSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { resolveCodexBinary } from './codex.ts';
import { ensureDir, readJsonIfPresent } from './fs.ts';
import { resolveProjectRoot, statePath } from './paths.ts';

interface LaunchIndex {
  currentStage?: string;
  hotPath?: string[];
  latestApprovedPlan?: string | null;
  latestRelevantSummary?: string | null;
  latestRun?: string | null;
}

interface LaunchMetadata {
  version: number;
  launchedAt: string;
  completedAt: string | null;
  cwd: string;
  args: string[];
  codexBinary: string | null;
  instructionSurface: string[];
  instructionSurfaceFile: string;
  currentStage: string;
  latestPlan: string | null;
  latestSummary: string | null;
  latestRun: string | null;
  preflight: {
    missingHotPath: string[];
    scaffoldPresent: boolean;
  };
  exitStatus: number | null;
  failedReason: string | null;
}

interface LaunchResult {
  root: string;
  launchFile: string;
  instructionSurface: string[];
  instructionSurfaceFile: string;
  exitStatus: number;
}

type SpawnLike = (
  command: string,
  args: string[],
  options: {
    cwd: string;
    env: NodeJS.ProcessEnv;
    stdio: 'inherit';
  },
) => SpawnSyncReturns<Buffer>;

function getInstructionSurface(hotPath: string[]): string[] {
  return ['AGENTS.md', ...hotPath].filter(
    (value, index, array) => array.indexOf(value) === index,
  );
}

function writeInstructionSurfaceFile(root: string, instructionSurface: string[]): string {
  const relativePath = '.sb-codex-tool/index/current-launch-instructions.txt';
  const absolutePath = path.join(root, relativePath);
  ensureDir(path.dirname(absolutePath));
  writeFileSync(absolutePath, instructionSurface.join('\n') + '\n', 'utf8');
  return relativePath;
}

function writeLaunchMetadata(root: string, relativePath: string, metadata: LaunchMetadata): void {
  const absolutePath = path.join(root, relativePath);
  ensureDir(path.dirname(absolutePath));
  writeFileSync(absolutePath, JSON.stringify(metadata, null, 2) + '\n', 'utf8');
}

function recordLaunchStart(
  root: string,
  args: string[],
  current: LaunchIndex | null,
  codexBinary: string | null,
  instructionSurface: string[],
  instructionSurfaceFile: string,
  missingHotPath: string[],
): { relativePath: string; metadata: LaunchMetadata } {
  const timestamp = new Date().toISOString().replace(/[:]/g, '-');
  const relativePath = `.sb-codex-tool/runs/launch-${timestamp}.json`;
  const metadata: LaunchMetadata = {
    version: 2,
    launchedAt: new Date().toISOString(),
    completedAt: null,
    cwd: root,
    args,
    codexBinary,
    instructionSurface,
    instructionSurfaceFile,
    currentStage: current?.currentStage ?? 'unknown',
    latestPlan: current?.latestApprovedPlan ?? null,
    latestSummary: current?.latestRelevantSummary ?? null,
    latestRun: current?.latestRun ?? null,
    preflight: {
      missingHotPath,
      scaffoldPresent: true,
    },
    exitStatus: null,
    failedReason: null,
  };

  writeLaunchMetadata(root, relativePath, metadata);
  return { relativePath, metadata };
}

function finalizeLaunchMetadata(
  root: string,
  relativePath: string,
  metadata: LaunchMetadata,
  exitStatus: number | null,
  failedReason: string | null,
): void {
  writeLaunchMetadata(root, relativePath, {
    ...metadata,
    completedAt: new Date().toISOString(),
    exitStatus,
    failedReason,
  });
}

export function launchCodex(
  start: string,
  args: string[],
  env: NodeJS.ProcessEnv = process.env,
  spawnImpl: SpawnLike = spawnSync,
): LaunchResult {
  const root = resolveProjectRoot(start);
  const stateRoot = statePath(root);
  if (!existsSync(stateRoot)) {
    throw new Error('Missing .sb-codex-tool scaffold. Run `sb-codex-tool setup` first.');
  }

  const current = readJsonIfPresent<LaunchIndex>(statePath(root, 'index', 'current.json'));
  const instructionSurface = getInstructionSurface(current?.hotPath ?? []);
  const missingHotPath = instructionSurface.filter((file) => !existsSync(path.join(root, file)));
  const instructionSurfaceFile = writeInstructionSurfaceFile(root, instructionSurface);
  const codexBinary = resolveCodexBinary(root, env.PATH ?? '');
  const launch = recordLaunchStart(
    root,
    args,
    current,
    codexBinary,
    instructionSurface,
    instructionSurfaceFile,
    missingHotPath,
  );

  if (missingHotPath.length > 0) {
    finalizeLaunchMetadata(
      root,
      launch.relativePath,
      launch.metadata,
      1,
      `missing hot-path files: ${missingHotPath.join(', ')}`,
    );
    throw new Error(
      `Launch preflight failed because hot-path files are missing: ${missingHotPath.join(', ')}.`,
    );
  }

  if (codexBinary === null) {
    finalizeLaunchMetadata(
      root,
      launch.relativePath,
      launch.metadata,
      1,
      'Codex binary not found in PATH or node_modules/.bin.',
    );
    throw new Error('Codex binary not found in PATH. Install or expose `codex` first.');
  }

  const result = spawnImpl(codexBinary, args, {
    cwd: root,
    env: {
      ...env,
      SB_CODEX_TOOL_PROJECT_INSTRUCTIONS: instructionSurface.join('\n'),
      SB_CODEX_TOOL_PROJECT_INSTRUCTIONS_FILE: instructionSurfaceFile,
      SB_CODEX_TOOL_CURRENT_STAGE: current?.currentStage ?? 'unknown',
      SB_CODEX_TOOL_LATEST_PLAN: current?.latestApprovedPlan ?? '',
      SB_CODEX_TOOL_LATEST_SUMMARY: current?.latestRelevantSummary ?? '',
      SB_CODEX_TOOL_LATEST_RUN: current?.latestRun ?? '',
    },
    stdio: 'inherit',
  });

  finalizeLaunchMetadata(
    root,
    launch.relativePath,
    launch.metadata,
    result.status ?? 1,
    result.error?.message ?? null,
  );

  return {
    root,
    launchFile: launch.relativePath,
    instructionSurface,
    instructionSurfaceFile,
    exitStatus: result.status ?? 1,
  };
}
