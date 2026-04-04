import { STATE_ROOT_NAME } from '../paths.ts';

const SHARED_IGNORE_LINES = [
  'node_modules/',
  'dist/',
  'build/',
  'coverage/',
  '.DS_Store',
] as const;

export function buildBaseIgnoreTemplate(): string {
  return `# sb-codex-tool default agent-ignore patterns
${SHARED_IGNORE_LINES.join('\n')}
${STATE_ROOT_NAME}/logs/work-journal/
`;
}

export function getGitIgnoreLines(): string[] {
  return [...SHARED_IGNORE_LINES];
}

export function getSearchIgnoreLines(): string[] {
  return [
    ...SHARED_IGNORE_LINES,
    `${STATE_ROOT_NAME}/logs/work-journal/`,
  ];
}
