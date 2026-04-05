import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

test('English README links to the Korean README for GitHub readers', () => {
  const readme = readFileSync(path.join(root, 'README.md'), 'utf8');

  assert.match(
    readme,
    /Korean README: \[README\.ko\.md\]\(https:\/\/github\.com\/SBCHOE-AI\/sb-codex-tool\/blob\/main\/README\.ko\.md\)/,
  );
});

test('Korean README exists and covers the main documentation surface', () => {
  const readmeKo = readFileSync(path.join(root, 'README.ko.md'), 'utf8');

  assert.match(readmeKo, /# sb-codex-tool/);
  assert.match(readmeKo, /영문 README: \[README\.md\]\(\.\/README\.md\)/);
  assert.match(readmeKo, /## 왜 필요한가/);
  assert.match(readmeKo, /## 빠른 시작/);
  assert.match(readmeKo, /## Agent 모델/);
  assert.match(readmeKo, /## Verification 모델/);
  assert.match(readmeKo, /Codex-first mode/);
  assert.match(readmeKo, /sb-codex-tool setup/);
  assert.match(readmeKo, /sb-codex-tool doctor/);
  assert.match(readmeKo, /sb-codex-tool status/);
  assert.match(readmeKo, /고급 수동 helper 명령/);
  assert.match(readmeKo, /prepare-verify/);
  assert.match(readmeKo, /npm run pack:check/);
  assert.match(readmeKo, /npm run release:check/);
});
