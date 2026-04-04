import {
  createInitialCurrentIndex,
  renderReadThisFirstMarkdown,
  renderStateMarkdown,
} from '../current-state.ts';
import { STATE_ROOT_NAME } from '../paths.ts';
import type { TemplateContext } from './context.ts';
import { dirReadmeTemplate } from './shared.ts';
import type { GeneratedFile } from './types.ts';

function stateTemplate(): string {
  return renderStateMarkdown(createInitialCurrentIndex());
}

function readThisFirstTemplate(context: TemplateContext): string {
  return renderReadThisFirstMarkdown(
    createInitialCurrentIndex(),
    context.implementationMenuPath,
  );
}

function workJournalTemplate(): string {
  return `# Work Journal

Daily human-readable logs live in this directory.

Recommended filename pattern:

- YYYY-MM-DD.md

Required sections for each entry:

- Date
- Summary
- Completed
- Changed Areas
- Verification
- Open Issues
- Next
`;
}

function indexReadmeTemplate(): string {
  return `# Index

This directory stores compact navigational artifacts and structured current
state references used by status and verification helpers.
`;
}

function currentIndexTemplate(): string {
  return JSON.stringify(createInitialCurrentIndex(), null, 2) + '\n';
}

export function buildStateDocumentFiles(
  context: TemplateContext,
): GeneratedFile[] {
  return [
    { path: `${STATE_ROOT_NAME}/state.md`, content: stateTemplate() },
    {
      path: `${STATE_ROOT_NAME}/guides/read-this-first.md`,
      content: readThisFirstTemplate(context),
    },
    {
      path: `${STATE_ROOT_NAME}/plans/README.md`,
      content: dirReadmeTemplate('Plans', 'Store draft and approved plans here.'),
    },
    {
      path: `${STATE_ROOT_NAME}/runs/README.md`,
      content: dirReadmeTemplate('Runs', 'Store launch and run metadata here.'),
    },
    {
      path: `${STATE_ROOT_NAME}/summaries/README.md`,
      content: dirReadmeTemplate(
        'Summaries',
        'Store execution, verification, and reconciliation summaries here.',
      ),
    },
    {
      path: `${STATE_ROOT_NAME}/handoffs/README.md`,
      content: dirReadmeTemplate(
        'Handoffs',
        'Store next-agent guidance and interrupted-work handoffs here.',
      ),
    },
    {
      path: `${STATE_ROOT_NAME}/reviews/README.md`,
      content: dirReadmeTemplate(
        'Reviews',
        'Store consistency, verification, and acceptance review artifacts here.',
      ),
    },
    {
      path: `${STATE_ROOT_NAME}/logs/work-journal/README.md`,
      content: workJournalTemplate(),
    },
    {
      path: `${STATE_ROOT_NAME}/index/README.md`,
      content: indexReadmeTemplate(),
    },
    {
      path: `${STATE_ROOT_NAME}/index/current.json`,
      content: currentIndexTemplate(),
    },
  ];
}
