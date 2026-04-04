import assert from 'node:assert/strict';
import test from 'node:test';

import { extractSectionLines, stripBulletPrefix } from '../src/lib/markdown-sections.ts';

test('extractSectionLines preserves wrapped bullet continuation lines', () => {
  const content = `# Example

## Scope

- Add latest lifecycle-run visibility to status and cover it with begin/close
  and git-backed tests.
- Keep parsing small and explicit.

## Other

- Ignore this section.
`;

  assert.deepEqual(extractSectionLines(content, 'Scope'), [
    '- Add latest lifecycle-run visibility to status and cover it with begin/close\n  and git-backed tests.',
    '- Keep parsing small and explicit.',
  ]);
});

test('stripBulletPrefix removes leading bullets but keeps multiline content', () => {
  assert.deepEqual(
    stripBulletPrefix([
      '- Add lifecycle-run visibility\n  without losing multiline readability.',
      '- Keep helper output compact.',
    ]),
    [
      'Add lifecycle-run visibility\nwithout losing multiline readability.',
      'Keep helper output compact.',
    ],
  );
});
