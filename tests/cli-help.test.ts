import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import test from 'node:test';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

test('CLI help presents setup/doctor/status as the default human workflow', () => {
  const result = spawnSync(
    process.execPath,
    ['--experimental-strip-types', 'src/cli.ts', 'help'],
    {
      cwd: root,
      encoding: 'utf8',
    },
  );

  assert.equal(result.status, 0, result.stderr || result.stdout);

  const output = `${result.stdout}\n${result.stderr}`;
  assert.match(output, /Default human workflow:/);
  assert.match(output, /setup\s+Create the sb-codex-tool scaffold/);
  assert.match(output, /doctor\s+Validate the scaffold and required operational files/);
  assert.match(output, /status\s+Show current stage, next action, hot path, and git context/);
  assert.match(output, /Advanced\/manual helpers:/);
  assert.match(output, /Codex-first mode:/);
  assert.match(output, /Then ask Codex to read the hot path, clarify the task, and update the plan\/state\/summaries for you\./);
});
