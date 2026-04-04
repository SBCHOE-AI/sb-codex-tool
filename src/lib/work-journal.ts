import path from 'node:path';

import { readTextIfPresent, writeFileIfChanged, type WriteResult } from './fs.ts';
import { STATE_ROOT_NAME } from './paths.ts';

export interface WorkJournalEntryInput {
  dateStamp: string;
  title: string;
  verdict: string;
  summaryLines: string[];
  completedLines: string[];
  reviewPath: string;
  verificationSummaryPath: string;
  changedAreas: string[];
  openIssues: string[];
  nextAction: string;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeList(items: string[], fallback: string): string[] {
  const unique = items.filter((item, index) => items.indexOf(item) === index);
  return unique.length > 0 ? unique : [fallback];
}

function renderBullet(item: string): string {
  return item
    .split('\n')
    .map((line, index) => (index === 0 ? `- ${line}` : `  ${line}`))
    .join('\n');
}

function renderBulletList(items: string[]): string {
  return normalizeList(items, 'None.').map((item) => renderBullet(item)).join('\n');
}

function buildEntry(input: WorkJournalEntryInput): string {
  return `## Entry: ${input.title}

### Date

- ${input.dateStamp}

### Summary

${renderBulletList(input.summaryLines)}

### Completed

${renderBulletList(input.completedLines)}

### Changed Areas

${renderBulletList(input.changedAreas)}

### Verification

- Fresh verification verdict: \`${input.verdict}\`
- Verification summary: \`${input.verificationSummaryPath}\`

### Open Issues

${renderBulletList(input.openIssues)}

### Next

- ${input.nextAction}
`;
}

export function getWorkJournalPath(root: string, dateStamp: string): string {
  return path.join(root, STATE_ROOT_NAME, 'logs', 'work-journal', `${dateStamp}.md`);
}

export function writeWorkJournalEntry(
  root: string,
  input: WorkJournalEntryInput,
): WriteResult {
  const journalPath = getWorkJournalPath(root, input.dateStamp);
  const current = readTextIfPresent(journalPath);
  const entry = buildEntry(input).trimEnd();

  if (current === null) {
    return writeFileIfChanged(
      journalPath,
      `# ${input.dateStamp}\n\n${entry}\n`,
    );
  }

  const marker = `## Entry: ${input.title}`;
  const pattern = new RegExp(
    `${escapeRegExp(marker)}[\\s\\S]*?(?=\\n## Entry: |$)`,
    'm',
  );

  const next = pattern.test(current)
    ? current.replace(pattern, entry)
    : `${current.trimEnd()}\n\n${entry}\n`;

  return writeFileIfChanged(journalPath, next.endsWith('\n') ? next : `${next}\n`);
}
