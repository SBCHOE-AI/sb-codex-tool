import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readdirSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

function run(command: string, args: string[], cwd: string) {
  return spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
  });
}

test('packed install can run sb-codex-tool setup from node_modules', () => {
  const packDir = mkdtempSync(path.join(os.tmpdir(), 'sb-codex-tool-pack-'));
  const installDir = mkdtempSync(path.join(os.tmpdir(), 'sb-codex-tool-install-'));

  const packResult = run('npm', ['pack'], root);
  assert.equal(packResult.status, 0, packResult.stderr || packResult.stdout);

  const tarballName = (packResult.stdout ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.endsWith('.tgz'))
    .at(-1);

  assert.ok(tarballName, 'expected npm pack to output a tarball name');

  cpSync(path.join(root, tarballName!), path.join(packDir, tarballName!));

  const initResult = run('npm', ['init', '-y'], installDir);
  assert.equal(initResult.status, 0, initResult.stderr || initResult.stdout);

  const installResult = run(
    'npm',
    ['install', '--save-dev', path.join(packDir, tarballName!)],
    installDir,
  );
  assert.equal(installResult.status, 0, installResult.stderr || installResult.stdout);

  const setupResult = run('npx', ['sb-codex-tool', 'setup'], installDir);
  assert.equal(setupResult.status, 0, setupResult.stderr || setupResult.stdout);

  const scaffoldEntries = readdirSync(path.join(installDir, '.sb-codex-tool'));
  assert.ok(scaffoldEntries.includes('guides'));
  assert.ok(scaffoldEntries.includes('workflows'));

  rmSync(path.join(root, tarballName!), { force: true });
});
