import { STATE_ROOT_NAME } from '../paths.ts';
import type { TemplateContext } from './context.ts';

export function alwaysReadList(context: TemplateContext): string {
  const items = [
    '- AGENTS.md',
    `- ${STATE_ROOT_NAME}/project.md`,
    `- ${STATE_ROOT_NAME}/state.md`,
    `- ${STATE_ROOT_NAME}/guides/read-this-first.md`,
    `- ${STATE_ROOT_NAME}/guides/code-consistency.md`,
  ];

  if (context.implementationMenuPath !== null) {
    items.push(`- ${context.implementationMenuPath}`);
  }

  return items.join('\n');
}

export function dirReadmeTemplate(title: string, purpose: string): string {
  return `# ${title}

${purpose}
`;
}

export function workflowTemplate(
  name: string,
  purpose: string,
  outputs: string,
): string {
  return `# $${name}

## Purpose

${purpose}

## Required Outputs

${outputs}

## Completion Rule

- This stage is complete only when its required outputs are written clearly
  enough for a fresh agent to inspect.

## Failure Conditions

- Required outputs are missing
- The stage overlaps ambiguously with another stage
- The next agent cannot tell what happened or what to do next

## Related State Files

- ${STATE_ROOT_NAME}/state.md
- ${STATE_ROOT_NAME}/plans/
- ${STATE_ROOT_NAME}/summaries/
- ${STATE_ROOT_NAME}/guides/
`;
}
