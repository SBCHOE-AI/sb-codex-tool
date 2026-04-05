import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

test('package metadata is ready for npm distribution checks', () => {
  const packageJson = JSON.parse(
    readFileSync(path.join(root, 'package.json'), 'utf8'),
  ) as {
    name: string;
    private?: boolean;
    license?: string;
    publishConfig?: { access?: string };
    files?: string[];
    repository?: { type?: string; url?: string };
    homepage?: string;
    bugs?: { url?: string };
    bin?: Record<string, string>;
    scripts?: Record<string, string>;
  };

  assert.equal(packageJson.name, 'sb-codex-tool');
  assert.notEqual(packageJson.private, true);
  assert.equal(packageJson.license, 'UNLICENSED');
  assert.equal(packageJson.publishConfig?.access, 'public');
  assert.deepEqual(packageJson.files, ['bin', 'dist', 'README.md']);
  assert.equal(packageJson.repository?.type, 'git');
  assert.equal(
    packageJson.repository?.url,
    'git+https://github.com/SBCHOE-AI/sb-codex-tool.git',
  );
  assert.equal(
    packageJson.homepage,
    'https://github.com/SBCHOE-AI/sb-codex-tool#readme',
  );
  assert.equal(
    packageJson.bugs?.url,
    'https://github.com/SBCHOE-AI/sb-codex-tool/issues',
  );
  assert.equal(packageJson.bin?.['sb-codex-tool'], './bin/sb-codex-tool.js');
  assert.equal(
    packageJson.scripts?.['build'],
    'esbuild src/cli.ts --bundle --platform=node --format=esm --outfile=dist/cli.js',
  );
  assert.equal(packageJson.scripts?.['prepare'], 'npm run build');
  assert.equal(packageJson.scripts?.['prepack'], 'npm run build');
  assert.equal(packageJson.scripts?.['pack:check'], 'npm pack --dry-run');
  assert.equal(
    packageJson.scripts?.['release:check'],
    'npm run build && npm run test && npm run pack:check',
  );
});

test('README documents install, workflow, and packaging checks', () => {
  const readme = readFileSync(path.join(root, 'README.md'), 'utf8');

  assert.match(readme, /# sb-codex-tool/);
  assert.match(readme, /## Why It Exists/);
  assert.match(readme, /## Quick Start/);
  assert.match(readme, /## Agent Model/);
  assert.match(readme, /## Verification Model/);
  assert.match(readme, /npm install --save-dev sb-codex-tool/);
  assert.match(readme, /npx sb-codex-tool@latest setup/);
  assert.match(readme, /npm exec sb-codex-tool -- setup/);
  assert.match(
    readme,
    /npm install --save-dev git\+https:\/\/github\.com\/SBCHOE-AI\/sb-codex-tool\.git/,
  );
  assert.match(readme, /sb-codex-tool setup/);
  assert.match(readme, /sb-codex-tool doctor/);
  assert.match(readme, /sb-codex-tool status/);
  assert.match(readme, /prepare-verify/);
  assert.match(readme, /npm run pack:check/);
  assert.match(readme, /npm run release:check/);
});

test('npm pack dry-run stays focused on the distribution surface', () => {
  const result = spawnSync('npm', ['pack', '--dry-run'], {
    cwd: root,
    encoding: 'utf8',
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);

  const output = `${result.stdout}\n${result.stderr}`;
  assert.match(output, /README\.ko\.md/);
  assert.match(output, /README\.md/);
  assert.match(output, /bin\/sb-codex-tool\.js/);
  assert.match(output, /dist\/cli\.js/);
  assert.doesNotMatch(output, /\.sb-codex-tool\//);
  assert.doesNotMatch(output, /tests\//);
  assert.doesNotMatch(output, /docs\/codex-tooling-research\//);
});
