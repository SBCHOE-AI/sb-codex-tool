import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

test('top-level READMEs link to the getting-started menu', () => {
  const readme = readFileSync(path.join(root, 'README.md'), 'utf8');
  const readmeKo = readFileSync(path.join(root, 'README.ko.md'), 'utf8');

  assert.match(
    readme,
    /First-time Codex guide: \[docs\/menu\/getting-started\.md\]\(https:\/\/github\.com\/SBCHOE-AI\/sb-codex-tool\/blob\/main\/docs\/menu\/getting-started\.md\)/,
  );
  assert.match(
    readmeKo,
    /처음 사용자 가이드: \[docs\/menu\/getting-started\.md\]\(https:\/\/github\.com\/SBCHOE-AI\/sb-codex-tool\/blob\/main\/docs\/menu\/getting-started\.md\)/,
  );
});

test('getting-started menu points to the detailed beginner guide', () => {
  const menu = readFileSync(
    path.join(root, 'docs', 'menu', 'getting-started.md'),
    'utf8',
  );

  assert.match(menu, /# Getting Started/);
  assert.match(menu, /## Recommended Reading Order/);
  assert.match(menu, /\[Detailed Beginner Guide\]\(\.\.\/guides\/getting-started-ko\.md\)/);
  assert.match(menu, /## What To Read Next/);
});

test('detailed beginner guide includes ordered steps and examples', () => {
  const guide = readFileSync(
    path.join(root, 'docs', 'guides', 'getting-started-ko.md'),
    'utf8',
  );

  assert.match(guide, /# sb-codex-tool 처음 사용자 사용 설명서/);
  assert.match(guide, /## 시작 전에 준비할 것/);
  assert.match(guide, /## 처음 작업할 때 권장 순서/);
  assert.match(guide, /## 명령 순서 예시/);
  assert.match(guide, /npm exec sb-codex-tool -- setup/);
  assert.match(guide, /AGENTS\.md와 \.sb-codex-tool\/project\.md, state\.md, read-this-first\.md,/);
  assert.match(guide, /기본 모드는 `setup`, `doctor`, `status`까지만 사람이 실행하고/);
  assert.match(guide, /## 가장 간단한 end-to-end 예시/);
  assert.match(guide, /## 고급 수동 모드는 언제 쓰는가/);
  assert.match(guide, /## 자주 하는 실수/);
});
