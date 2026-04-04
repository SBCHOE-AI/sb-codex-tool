import assert from 'node:assert/strict';
import {
  chmodSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { launchCodex } from '../src/lib/launch.ts';
import { scaffoldProject } from '../src/lib/scaffold.ts';

function createFakeCodex(root: string, capturePath: string): string {
  const binDir = path.join(root, 'bin-fixture');
  mkdirSync(binDir, { recursive: true });
  const scriptPath = path.join(binDir, 'codex');
  writeFileSync(
    scriptPath,
    `#!/bin/sh
{
  echo "instructions_file=$SB_CODEX_TOOL_PROJECT_INSTRUCTIONS_FILE"
  echo "current_stage=$SB_CODEX_TOOL_CURRENT_STAGE"
  echo "latest_plan=$SB_CODEX_TOOL_LATEST_PLAN"
  echo "latest_summary=$SB_CODEX_TOOL_LATEST_SUMMARY"
  echo "latest_run=$SB_CODEX_TOOL_LATEST_RUN"
  echo "args=$*"
} > "${capturePath}"
exit 0
`,
    'utf8',
  );
  chmodSync(scriptPath, 0o755);
  return binDir;
}

test('launchCodex records richer metadata and passes instruction env to codex', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'sb-codex-tool-launch-'));
  const capturePath = path.join(root, 'codex-env.txt');

  scaffoldProject(root);
  const binDir = createFakeCodex(root, capturePath);

  const result = launchCodex(root, ['--example'], {
    ...process.env,
    PATH: `${binDir}${path.delimiter}${process.env.PATH ?? ''}`,
  });

  assert.equal(result.exitStatus, 0);

  const capture = readFileSync(capturePath, 'utf8');
  assert.match(capture, /instructions_file=\.sb-codex-tool\/index\/current-launch-instructions\.txt/);
  assert.match(capture, /current_stage=clarify/);
  assert.match(capture, /args=--example/);

  const metadata = JSON.parse(readFileSync(path.join(root, result.launchFile), 'utf8'));
  assert.equal(metadata.version, 2);
  assert.equal(metadata.exitStatus, 0);
  assert.equal(metadata.failedReason, null);
  assert.equal(metadata.currentStage, 'clarify');
  assert.ok(metadata.codexBinary.endsWith('/codex'));
  assert.equal(metadata.preflight.missingHotPath.length, 0);

  const instructionSurfaceFile = readFileSync(
    path.join(root, result.instructionSurfaceFile),
    'utf8',
  );
  assert.match(instructionSurfaceFile, /AGENTS\.md/);
  assert.match(instructionSurfaceFile, /\.sb-codex-tool\/guides\/code-consistency\.md/);
});

test('launchCodex fails preflight when a hot-path file is missing', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'sb-codex-tool-launch-missing-'));
  const currentPath = path.join(root, '.sb-codex-tool/index/current.json');

  scaffoldProject(root);
  const current = JSON.parse(readFileSync(currentPath, 'utf8'));
  current.hotPath = [
    '.sb-codex-tool/project.md',
    '.sb-codex-tool/state.md',
    '.sb-codex-tool/guides/missing-guide.md',
  ];
  writeFileSync(currentPath, JSON.stringify(current, null, 2) + '\n', 'utf8');

  assert.throws(
    () => launchCodex(root, [], process.env),
    /hot-path files are missing/,
  );

  const runsDir = path.join(root, '.sb-codex-tool/runs');
  const launchFile = readFileSync(
    path.join(
      runsDir,
      readdirSync(runsDir).find((name) => name.startsWith('launch-')) ?? '',
    ),
    'utf8',
  );
  const metadata = JSON.parse(launchFile);
  assert.equal(metadata.exitStatus, 1);
  assert.match(metadata.failedReason, /missing hot-path files/);
  assert.ok(metadata.preflight.missingHotPath.includes('.sb-codex-tool/guides/missing-guide.md'));
});
