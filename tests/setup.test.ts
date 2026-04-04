import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { scaffoldProject } from '../src/lib/scaffold.ts';

test('scaffoldProject creates the expected sb-codex-tool layout', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'sb-codex-tool-setup-'));
  const summary = scaffoldProject(root);

  assert.equal(summary.root, root);
  assert.match(
    readFileSync(path.join(root, 'AGENTS.md'), 'utf8'),
    /fresh agent/i,
  );
  assert.match(
    readFileSync(
      path.join(root, '.sb-codex-tool/guides/code-consistency.md'),
      'utf8',
    ),
    /Module Boundary Rules/,
  );
  assert.match(
    readFileSync(path.join(root, '.ignore'), 'utf8'),
    /\.sb-codex-tool\/logs\/work-journal\//,
  );
});
