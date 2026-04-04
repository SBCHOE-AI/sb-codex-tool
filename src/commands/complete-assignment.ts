import {
  ASSIGNMENT_LIFECYCLE_ACTIONS,
  completeAssignment,
} from '../lib/assignment-lifecycle.ts';

export function runCompleteAssignment(args: string[]): number {
  const [agentName, action, third, ...rest] = args;
  if (
    agentName === undefined ||
    action === undefined ||
    !ASSIGNMENT_LIFECYCLE_ACTIONS.includes(action as (typeof ASSIGNMENT_LIFECYCLE_ACTIONS)[number])
  ) {
    console.error(
      'Usage: sb-codex-tool complete-assignment <agent-name> <close|clear|replace> [replacement-agent] [replacement-slug] [title words]',
    );
    return 1;
  }

  const replacement = action === 'replace'
    ? {
        agentName: third,
        slug: rest[0],
        title: rest.slice(1).length > 0 ? rest.slice(1).join(' ') : undefined,
      }
    : undefined;

  if (action === 'replace' && (replacement?.agentName === undefined || replacement.slug === undefined)) {
    console.error(
      'Usage: sb-codex-tool complete-assignment <agent-name> replace <replacement-agent> <replacement-slug> [title words]',
    );
    return 1;
  }

  const result = completeAssignment(process.cwd(), agentName, action as (typeof ASSIGNMENT_LIFECYCLE_ACTIONS)[number], replacement as {
    agentName: string;
    slug: string;
    title?: string;
  } | undefined);

  console.log(`Project root: ${result.root}`);
  console.log(`Completed assignment for: ${result.agentName}`);
  console.log(`Lifecycle action: ${result.action}`);
  console.log(`Lifecycle artifact: ${result.lifecyclePath}`);
  console.log(`Replacement assignment: ${result.replacementAssignmentPath ?? 'none'}`);

  console.log('');
  console.log(`Created files: ${result.createdFiles.length}`);
  for (const file of result.createdFiles) {
    console.log(`- ${file}`);
  }

  if (result.updatedFiles.length > 0) {
    console.log('');
    console.log('Updated files:');
    for (const file of result.updatedFiles) {
      console.log(`- ${file}`);
    }
  }

  return 0;
}
